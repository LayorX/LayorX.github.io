// main.js - 專案總指揮 (重構版)

import { appInfo, firebaseSettings, uiSettings, uiMessages } from './gconfig.js';
import { initFirebase, handleAuthentication, getCurrentUserId, getDbInstance, listenToFavorites, getRandomGoddessesFromDB } from './gfirebase.js';
import { initDailyTaskManager } from './dailyTaskManager.js';
import { setState, subscribe, initState } from './stateManager.js';
import { getInitialState } from './state.js';
import { initializeUI, updateAllTaskUIs, updateSlideshowUI } from './uiManager.js';
import { getCardHandlers } from './handlers.js';
import { showMessage, initParticles, animateParticles, resizeLoadingCanvas, animateLoading, Petal, createImageCard, updateFavoritesCountUI } from './gui.js';
import { initSounds } from './soundManager.js';

// --- 主初始化流程 ---
window.onload = () => {
    initState(getInitialState()); 

    setupAppInfo();
    window.firebaseConfig = firebaseSettings;

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

// --- 狀態訂閱 ---
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
}

/**
 * ✨ UPDATE: 此函式現在是異步的，以等待資料遷移完成
 */
async function onUserSignedIn(uid, error) {
    if (uid) {
        document.getElementById('user-info').textContent = `雲端使用者 ID: ${uid}`;
        
        // ✨ CHANGE: 使用 await 確保任務管理器在執行後續操作前已完全初始化
        await initDailyTaskManager(getDbInstance(), uid);
        
        listenToFavorites(onFavoritesUpdate);
        updateAllTaskUIs(); // 現在這個函式可以安全地執行
    } else {
        showMessage(uiMessages.errors.cloudConnect, true);
        console.error("Authentication Error:", error);
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

// --- 初始載入邏輯 ---
function startLoadingSequence() {
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingText = document.getElementById('loading-text');
    const silhouetteContainer = document.querySelector('.silhouette-container');
    const loadingCanvas = document.getElementById('loading-canvas');

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
        loadingText.textContent = uiMessages.loading.starting;
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            if (!getCurrentUserId()) {
                updateAllTaskUIs();
            }
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
    document.title = `${appInfo.title} v${appInfo.version}`;
    headerTitleEl.textContent = `${appInfo.title} v${appInfo.version}`;
    
    const { copyrightYear, authorName, authorLink } = appInfo.footer;
    appFooter.innerHTML = `
        © ${copyrightYear} <a href="${authorLink}" target="_blank" class="hover:underline">${authorName}</a>. All Rights Reserved.
        <span class="mx-2">|</span>
        <a href="#" id="contact-link" class="hover:underline">聯絡我們</a>
    `;
}
