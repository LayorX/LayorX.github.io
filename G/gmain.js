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
// ✨ NEW: 建立一個全域變數，防止重複隱藏 Loading 畫面
let isLoadingOverlayHidden = false;

// ✨ NEW: 建立一個共用的函式來隱藏 Loading 畫面
function hideLoadingOverlay() {
    // 如果已經隱藏了，就直接返回，不做任何事
    if (isLoadingOverlayHidden) return; 
    
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
    
    // 執行原本在 Loading 結束後才做的事情
    if (!getCurrentUserId()) {
        updateAllTaskUIs();
    }
    openAnnouncementModal();

    // 標記為已隱藏
    isLoadingOverlayHidden = true;
}
window.onload = () => {
    initState(getInitialState()); 

    setupAppInfo();
    window.firebaseConfig = serviceKeys.firebaseConfig;

    initializeUI();
    setupStateSubscriptions();

    updateUserInfo(null, null, true);
    // ✨ MODIFIED: 修改過的啟動流程
    // 檢查設定檔中的開關
    if (!uiSettings.enableLoadingAnimation) {
        // 如果開關是關閉的，立刻隱藏 Loading 畫面
        hideLoadingOverlay();
        // 然後才開始初始化 Firebase
        if (initFirebase()) {
            handleAuthentication(onUserSignedIn);
        } else {
            showMessage(uiMessages.errors.firebaseInit, true);
        }
    } else {
        // 如果開關是開啟的，就照常啟動 Loading 動畫
        startLoadingSequence();
        if (initFirebase()) {
            handleAuthentication(onUserSignedIn);
        } else {
            showMessage(uiMessages.errors.firebaseInit, true);
            // 如果 Firebase 初始化失敗，也要隱藏 Loading 畫面
            hideLoadingOverlay();
        }
    }
    
    // ✨ FIX: 暫時停用背景粒子動畫，這是效能消耗大戶
    // initParticles('night');
    // animateParticles();
    
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

    // 讓暱稱訂閱只在 UID 存在時才更新 UI，避免初始閃爍
    // 這個訂閱仍然有用，例如當使用者在設定中更改暱稱時，可以即時更新
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
        
        // 將 getUserData 也放入 Promise.all，讓所有初始化非同步操作並行執行
        const [_, __, userData] = await Promise.all([
            initDailyTaskManager(db, uid),
            initAnalyticsManager(db, uid),
            getUserData(db, uid) // 直接在這裡獲取使用者資料
        ]);
        const nickname = userData?.nickname || '';
        
        // --- ✨ 修正點 ✨ ---
        // 在這裡直接更新 UI，因為我們已經取得了 UID 和暱稱
        // 這確保了無論暱稱是否改變，UI 都會從「連線中」更新為正確的資訊
        updateUserInfo(uid, nickname);
        // --- 修正結束 ---

        setState({ userNickname: nickname });
        if (nickname) {
            localStorage.setItem('userNickname', nickname);
        }
        
        listenToFavorites(onFavoritesUpdate);
        
        setState({ isAppInitialized: true });
        
        updateAllTaskUIs();
        // ✨ NEW: 在使用者登入成功後，檢查是否要提早結束 Loading
        if (uiSettings.hideLoadingOnConnect) {
            hideLoadingOverlay();
        }
    } else {
        showMessage(uiMessages.errors.cloudConnect, true);
        console.error("Authentication Error:", error);
        setState({ isAppInitialized: true });
        // 登入失敗時，明確顯示未登入狀態
        updateUserInfo(null, null, false);
        // ✨ NEW: 如果登入失敗，也檢查是否要提早結束 Loading
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

    // ✨ FIX: 暫時停用複雜的載入動畫，以測試舊裝置的相容性
    console.log("相容性測試：已停用複雜的載入動畫。");
    if (silhouetteContainer) silhouetteContainer.style.display = 'none'; // 隱藏剪影容器
    if (loadingCanvas) loadingCanvas.style.display = 'none'; // 隱藏花瓣 Canvas

    /*
    // --- 原本的複雜動畫邏輯 (暫時註解掉) ---
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
    */
    
    // ✨ MODIFIED: 這個計時器現在變成一個「保險」
    // 如果連線太慢，它會確保 Loading 畫面在最長時間到達後依然會被關閉
    setTimeout(() => {
        if(loadingText) loadingText.textContent = uiMessages.loading.starting;
        // 等待一小段淡出時間
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
