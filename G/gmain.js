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

window.onload = () => {
    initState(getInitialState()); 

    setupAppInfo();
    window.firebaseConfig = serviceKeys.firebaseConfig;

    initializeUI();
    setupStateSubscriptions();

    startLoadingSequence();
    
    if (initFirebase()) {
        handleAuthentication(onUserSignedIn);
    } else {
        showMessage(uiMessages.errors.firebaseInit, true);
        document.getElementById('loading-overlay').classList.add('hidden');
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

        if (!window.hasInitialImagesGenerated) {
            window.hasInitialImagesGenerated = true;
            generateInitialImages(favorites);
        }
    });

    subscribe('userNickname', (nickname) => {
        updateUserInfo(getCurrentUserId(), nickname);
    });
}

async function onUserSignedIn(uid, error) {
    if (uid) {
        const userData = await getUserData(uid);
        if (userData && userData.nickname) {
            setState({ userNickname: userData.nickname });
            localStorage.setItem('userNickname', userData.nickname);
        }
        updateUserInfo(uid, getState('userNickname'));

        const db = getDbInstance();
        
        await Promise.all([
            initDailyTaskManager(db, uid),
            initAnalyticsManager(db, uid)
        ]);
        
        listenToFavorites(onFavoritesUpdate);
        
        setState({ isAppInitialized: true });
        
        updateAllTaskUIs();
    } else {
        showMessage(uiMessages.errors.cloudConnect, true);
        console.error("Authentication Error:", error);
        setState({ isAppInitialized: true });
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
            loadingOverlay.classList.add('hidden');
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
    // ✨ FIX: 獲取排行榜按鈕
    const rankingBtn = document.getElementById('ranking-btn');
    document.title = `${appInfo.title} v${appInfo.version}`;
    
    headerTitleEl.innerHTML = `${appInfo.title} <span class="text-base align-middle text-gray-400 font-medium">v${appInfo.version}</span>`;
    
    // ✨ FIX: 在此處設定排行榜按鈕的文字
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
