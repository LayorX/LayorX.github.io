import { appInfo, serviceKeys } from './app-config.js';
import { uiSettings, uiMessages } from './game-config.js';
import { initFirebase, handleAuthentication, getCurrentUserId, getDbInstance, listenToFavorites, getRandomGoddessesFromDB, getUserData } from './gfirebase.js';
import { initDailyTaskManager } from './dailyTaskManager.js';
import { initAnalyticsManager } from './analyticsManager.js';
import { setState, subscribe, initState, getState } from './stateManager.js';
import { getInitialState } from './state.js';
import { initializeUI, updateAllTaskUIs, updateSlideshowUI, openAnnouncementModal, updateUserInfo } from './uiManager.js';
import { getCardHandlers } from './handlers.js';
import { showMessage, initParticles, animateParticles, resizeLoadingCanvas, animateLoading, Petal, createImageCard, updateFavoritesCountUI } from './gui.js';
import { initSounds } from './soundManager.js';

let isLoadingOverlayHidden = false;

function hideLoadingOverlay() {
    if (isLoadingOverlayHidden) return; 
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
    if (!getCurrentUserId()) {
        updateAllTaskUIs();
    }
    openAnnouncementModal();
    isLoadingOverlayHidden = true;
}

window.onload = () => {
    initState(getInitialState()); 
    setupAppInfo();
    window.firebaseConfig = serviceKeys.firebaseConfig;
    initializeUI();
    setupStateSubscriptions();
    updateUserInfo(null, null, true);

    if (!uiSettings.enableLoadingAnimation) {
        hideLoadingOverlay();
        if (initFirebase()) {
            handleAuthentication(onUserSignedIn);
        } else {
            showMessage(uiMessages.errors.firebaseInit, true);
        }
    } else {
        startLoadingSequence();
        if (initFirebase()) {
            handleAuthentication(onUserSignedIn);
        } else {
            showMessage(uiMessages.errors.firebaseInit, true);
            hideLoadingOverlay();
        }
    }
    
    initParticles('night');
    animateParticles();
    
    const startAudioOnce = async () => {
        await initSounds();
        document.body.removeEventListener('click', startAudioOnce);
        document.body.removeEventListener('touchend', startAudioOnce);
    };
    document.body.addEventListener('click', startAudioOnce);
    document.body.addEventListener('touchend', startAudioOnce);
};

function setupStateSubscriptions() {
    subscribe('favorites', (favorites) => {
        if (favorites === null) return;
        updateFavoritesCountUI(favorites.length);
        updateSlideshowUI(favorites);

        document.querySelectorAll('.image-card').forEach(card => {
            const cardId = card.dataset.id;
            const likeBtn = card.querySelector('.like-btn');
            if (likeBtn) {
                const isLiked = favorites.some(fav => fav && fav.id === cardId);
                likeBtn.classList.toggle('liked', isLiked);
            }
        });

        // ✨ FIX: 暫時停用初始圖片生成，以降低啟動負擔
        if (!window.hasInitialImagesGenerated) {
            window.hasInitialImagesGenerated = true;
            console.log("DEBUG: Skipping initial image generation.");
            // generateInitialImages(favorites); // 停用此呼叫
        }
    });

    subscribe('userNickname', (nickname) => {
        const uid = getCurrentUserId();
        if (uid) {
            updateUserInfo(uid, nickname);
        }
    });
}

async function onUserSignedIn(uid, error) {
    if (uid) {
        const db = getDbInstance();
        
        // ✨ FIX: 暫時關閉所有登入後的初始化程序，只保留最核心的使用者資訊更新
        console.log("Authentication successful. User ID:", uid);
        console.log("DEBUG: Skipping DailyTaskManager, AnalyticsManager, and Favorites listener initialization.");

        // --- 為了測試，只執行最簡單的邏輯 ---
        const userData = await getUserData(db, uid);
        const nickname = userData?.nickname || '';
        updateUserInfo(uid, nickname);
        setState({ userNickname: nickname });
        
        // --- 暫時關閉的功能 ---
        /*
        const [_, __, userData] = await Promise.all([
            initDailyTaskManager(db, uid),
            initAnalyticsManager(db, uid),
            getUserData(db, uid)
        ]);
        const nickname = userData?.nickname || '';
        updateUserInfo(uid, nickname);
        setState({ userNickname: nickname });
        if (nickname) {
            localStorage.setItem('userNickname', nickname);
        }
        listenToFavorites(onFavoritesUpdate);
        */
        
        setState({ isAppInitialized: true });
        // updateAllTaskUIs(); // 因為依賴 TaskManager，所以也先關閉
        
        if (uiSettings.hideLoadingOnConnect) {
            hideLoadingOverlay();
        }
    } else {
        showMessage(uiMessages.errors.cloudConnect, true);
        console.error("Authentication Error:", error);
        setState({ isAppInitialized: true });
        updateUserInfo(null, null, false);
        if (uiSettings.hideLoadingOnConnect) {
            hideLoadingOverlay();
        }
    }
}

function onFavoritesUpdate(newFavorites, err) {
    if (err) {
        showMessage(uiMessages.errors.syncFavorites, true);
        setState({ favorites: [] });
        return;
    }
    setState({ favorites: newFavorites });
}

function startLoadingSequence() {
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingText = document.getElementById('loading-text');
    const silhouetteContainer = document.querySelector('.silhouette-container');
    const loadingCanvas = document.getElementById('loading-canvas');

    if(loadingText) loadingText.textContent = uiMessages.loading.connecting;

    const silhouettes = [...uiSettings.loadingSilhouettes].sort(() => Math.random() - 0.5);
    silhouetteContainer.innerHTML = silhouettes.map(src => `<img src="${src}" class="loading-silhouette" alt="Loading Muse">`).join('');
    
    const silhouetteElements = document.querySelectorAll('.loading-silhouette');
    if (silhouetteElements.length > 0) {
        const animationStep = uiSettings.loadingAnimationStep;
        const totalDuration = silhouetteElements.length * animationStep;
        silhouetteElements.forEach((el, index) => {
            el.style.animationDelay = `${index * animationStep}s`;
            el.style.animationDuration = `${totalDuration}s`;
            el.style.animationName = 'silhouette-fade';
        });
    }

    resizeLoadingCanvas(loadingCanvas);
    let petals = Array.from({ length: uiSettings.loadingPetalCount }, () => new Petal(loadingCanvas));
    animateLoading(loadingCanvas, petals, loadingOverlay);

    setTimeout(() => {
        if(loadingText) loadingText.textContent = uiMessages.loading.starting;
        setTimeout(() => {
            hideLoadingOverlay();
            if (!getCurrentUserId()) {
                updateAllTaskUIs();
            }
            openAnnouncementModal();
        }, 500);
    }, uiSettings.loadingScreenDuration);
}

async function generateInitialImages(favorites) {
    for (const fav of favorites) {
        const displayUrl = fav.resizedUrl || fav.imageUrl;
        if (!fav || !fav.style || !fav.style.id || !displayUrl) continue;
        const gallery = document.getElementById(`${fav.style.id}-gallery`);
        if (gallery) {
            const imageData = { ...fav, src: displayUrl, isLiked: true };
            const imageCard = createImageCard(imageData, getCardHandlers());
            gallery.appendChild(imageCard);
        }
    }

    if (favorites.length < 4) {
        try {
            const randomGoddesses = await getRandomGoddessesFromDB(4);
            for (const goddess of randomGoddesses) {
                if (document.querySelector(`.image-card[data-id="${goddess.id}"]`)) continue;
                const displayUrl = goddess.resizedUrl || goddess.imageUrl;
                const gallery = document.getElementById(`${goddess.style.id}-gallery`);
                if (gallery) {
                    const imageData = {
                        ...goddess,
                        src: displayUrl,
                        isLiked: favorites.some(fav => fav.id === goddess.id)
                    };
                    const imageCard = createImageCard(imageData, getCardHandlers());
                    gallery.appendChild(imageCard);
                }
            }
        } catch (error) {
            console.error("Failed to fetch initial random goddesses:", error);
            showMessage(error.message, true);
        }
    }
}

function setupAppInfo() {
    const headerTitleEl = document.getElementById('header-title');
    const appFooter = document.getElementById('app-footer');
    const rankingBtn = document.getElementById('ranking-btn');
    document.title = `${appInfo.title} v${appInfo.version}`;
    
    headerTitleEl.innerHTML = `${appInfo.title} <span class="text-base align-middle text-gray-400 font-medium">v${appInfo.version}</span>`;
    
    if (rankingBtn) {
        rankingBtn.innerHTML = uiMessages.moreOptions.ranking;
    }

    const { copyrightYear, authorName, authorLink } = appInfo.footer;
    appFooter.innerHTML = `
        © ${copyrightYear} <a href="${authorLink}" target="_blank" class="hover:underline">${authorName}</a>. All Rights Reserved.
        <span class="mx-2">|</span>
        <a href="#" id="contact-link" class="hover:underline">聯絡我們</a>
    `;
}
