// main.js - 專案總指揮 (重構版)

import { appInfo, firebaseSettings, uiSettings, uiMessages } from './gconfig.js';
import { initFirebase, handleAuthentication, getCurrentUserId, getDbInstance, listenToFavorites, getRandomGoddessesFromDB } from './gfirebase.js';
import { initDailyTaskManager } from './dailyTaskManager.js';
import { setState, getState, initState } from './state.js'; // ✨ FIX: 引入 initState
import { initializeUI, updateAllTaskUIs } from './uiManager.js';
import { getCardHandlers } from './handlers.js';
import { showMessage, initParticles, animateParticles, resizeLoadingCanvas, animateLoading, Petal, updateFavoritesCountUI, createImageCard } from './gui.js';
import { initSounds } from './soundManager.js';

// --- 主初始化流程 ---
window.onload = () => {
    // ✨ FIX: 在所有操作之前，首先初始化應用程式狀態
    initState(); 

    setupAppInfo();
    window.firebaseConfig = firebaseSettings;

    initializeUI();
    startLoadingSequence();
    
    if (initFirebase()) {
        handleAuthentication(onUserSignedIn);
    } else {
        showMessage(uiMessages.errors.firebaseInit, true);
        document.getElementById('loading-overlay').classList.add('hidden');
    }
    
    initParticles('night');
    animateParticles();
    
    // 設置一個一次性的事件監聽器來初始化音效
    const startAudioOnce = async () => {
        await initSounds();
        document.body.removeEventListener('click', startAudioOnce);
        document.body.removeEventListener('touchend', startAudioOnce);
    };
    document.body.addEventListener('click', startAudioOnce);
    document.body.addEventListener('touchend', startAudioOnce);
};

function onUserSignedIn(uid, error) {
    if (uid) {
        document.getElementById('user-info').textContent = `雲端使用者 ID: ${uid}`;
        initDailyTaskManager(getDbInstance(), uid);
        listenToFavorites(onFavoritesUpdate);
        updateAllTaskUIs();
    } else {
        showMessage(uiMessages.errors.cloudConnect, true);
        console.error("Authentication Error:", error);
    }
}

let hasInitialImagesGenerated = false; 
function onFavoritesUpdate(newFavorites, err) {
    if (err) {
        showMessage(uiMessages.errors.syncFavorites, true);
        return;
    }
    setState({ favorites: newFavorites });
    updateFavoritesCountUI(newFavorites.length);
    
    document.querySelectorAll('.image-card').forEach(card => {
        const cardId = card.dataset.id;
        const likeBtn = card.querySelector('.like-btn');
        if (likeBtn) {
            const isLiked = newFavorites.some(fav => fav && fav.id === cardId);
            likeBtn.classList.toggle('liked', isLiked);
        }
    });

    if (!hasInitialImagesGenerated) {
        hasInitialImagesGenerated = true;
        generateInitialImages(newFavorites);
    }

    const slideshowModal = document.getElementById('slideshow-modal');
    if (slideshowModal.classList.contains('show')) {
        if (newFavorites.length === 0) {
            slideshowModal.classList.remove('show');
        } else {
            // Slideshow UI updates are now handled within uiManager
        }
    }
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
        if (!fav || !fav.style || !fav.style.id || !fav.imageUrl) continue;
        const gallery = document.getElementById(`${fav.style.id}-gallery`);
        if (gallery) {
            const imageData = { ...fav, src: fav.imageUrl, isLiked: true };
            const imageCard = createImageCard(imageData, getCardHandlers());
            gallery.appendChild(imageCard);
        }
    }

    if (favorites.length < 4) {
        try {
            const randomGoddesses = await getRandomGoddessesFromDB(4);
            for (const goddess of randomGoddesses) {
                if (document.querySelector(`.image-card[data-id="${goddess.id}"]`)) continue;
                
                const gallery = document.getElementById(`${goddess.style.id}-gallery`);
                if (gallery) {
                    const imageData = {
                        ...goddess,
                        src: goddess.imageUrl,
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
