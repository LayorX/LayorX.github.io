// main.js - 專案總指揮

// --- 模組引入 ---
import { appInfo, firebaseSettings, apiKey, styles, randomKeywords_day, randomKeywords_night, gameSettings, apiSettings, uiSettings, soundSettings, uiMessages } from './gconfig.js';
import { 
    initFirebase, handleAuthentication, getCurrentUserId,
    listenToFavorites, saveFavorite, removeFavorite, uploadImage,
    shareToPublic,
    loadGachaStateFromDB, saveGachaStateToDB, getRandomGoddessFromDB, getRandomGoddessesFromDB,
    saveTtsStateToDB, loadTtsStateFromDB
} from './gfirebase.js';
import {
    showMessage, createImageCard, initParticles, animateParticles,
    resizeLoadingCanvas, animateLoading, Petal, updateFavoritesCountUI
} from './gui.js';

// --- DOM Elements ---
const headerTitleEl = document.getElementById('header-title');
const storyModalTitleEl = document.getElementById('story-modal-title');
const gachaModalTitleEl = document.getElementById('gacha-modal-title');
const loadingOverlay = document.getElementById('loading-overlay');
const loadingText = document.getElementById('loading-text');
const silhouetteContainer = document.querySelector('.silhouette-container');
const tabNavigation = document.getElementById('tab-navigation');
const styleSectionsContainer = document.getElementById('style-sections');
const imageModal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const storyModal = document.getElementById('story-modal');
const storyTextEl = document.getElementById('story-text');
const ttsBtn = document.getElementById('tts-btn');
const ttsAudio = document.getElementById('tts-audio');
const ttsStopBtn = document.getElementById('tts-stop-btn');
const ttsLimitInfo = document.getElementById('tts-limit-info');
const generateOneBtn = document.getElementById('generate-one-btn');
const generateFourBtn = document.getElementById('generate-four-btn');
const favoritesBtn = document.getElementById('favorites-btn');
const favoritesBtnTextEl = document.getElementById('favorites-btn-text');
const slideshowModal = document.getElementById('slideshow-modal');
const slideshowImage = document.getElementById('slideshow-image');
const thumbnailBar = document.getElementById('thumbnail-bar');
const soundControl = document.getElementById('sound-control');
const soundOnIcon = document.getElementById('sound-on-icon');
const soundOffIcon = document.getElementById('sound-off-icon');
const userInfoEl = document.getElementById('user-info');
const modelSelect = document.getElementById('model-select');
const themeSwitchBtn = document.getElementById('theme-switch-btn');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');
const contactModal = document.getElementById('contact-modal');
const contactModalContent = document.getElementById('contact-modal-content');
const appFooter = document.getElementById('app-footer');
// Gacha Elements
const gachaBtn = document.getElementById('gacha-btn');
const gachaModal = document.getElementById('gacha-modal');
const gachaCloseBtn = document.getElementById('gacha-close-btn');
const gachaDrawBtn = document.getElementById('gacha-draw-btn');
const gachaCountEl = document.getElementById('gacha-count');
const gachaResultContainer = document.getElementById('gacha-result-container');
const gachaUnlockInfo = document.getElementById('gacha-unlock-info');
// Slideshow Elements
const slideshowContainer = document.getElementById('slideshow-container');
const favoritesEmptyState = document.getElementById('favorites-empty-state');


// --- State Management ---
let isGenerating = false;
let activeStyleId = styles[0].id;
let isStoryGenerating = false;
let isTtsGenerating = false;
let favorites = [];
let unsubscribeFavorites;
let gachaState = { count: gameSettings.dailyGachaCount, lastDrawDate: null };
let ttsState = { count: gameSettings.dailyTtsCount, lastListenDate: null };
let ownGoddessStreak = 0;
let touchStartX = 0;
let touchEndX = 0;
let currentSlideshowIndex = 0;
let currentTheme = 'night'; 

// --- Sound Engine ---
const sounds = {
    mainSynth: new Tone.Synth().toDestination(),
    fmSynth: new Tone.FMSynth().toDestination(),
    tabSynth: new Tone.Synth().toDestination(),
    start: () => sounds.fmSynth.triggerAttackRelease("C2", "8n"),
    success: () => {
        sounds.mainSynth.triggerAttackRelease("C5", "16n", Tone.now());
        sounds.mainSynth.triggerAttackRelease("E5", "16n", Tone.now() + 0.1);
    },
    tab: () => sounds.tabSynth.triggerAttackRelease("C4", "32n"),
    open: () => sounds.fmSynth.triggerAttackRelease("A3", "16n"),
    like: () => sounds.mainSynth.triggerAttackRelease("A5", "32n"),
    gacha: () => {
        const synth = new Tone.PolySynth(Tone.Synth).toDestination();
        const now = Tone.now();
        synth.triggerAttackRelease(["C4", "E4", "G4", "C5"], "8n", now);
        synth.triggerAttackRelease(["F4", "A4", "C5", "E5"], "8n", now + 0.2);
        synth.triggerAttackRelease(["G4", "B4", "D5", "G5"], "4n", now + 0.4);
    },
    toDay: () => new Tone.AMSynth().toDestination().triggerAttackRelease("C4", "2n"),
    toNight: () => new Tone.FMSynth().toDestination().triggerAttackRelease("G5", "8n")
};

// --- Main Initialization Flow ---
window.onload = () => {
    setupAppInfo();
    window.firebaseConfig = firebaseSettings;

    initializeUI();
    startLoadingSequence();
    
    if (initFirebase()) {
        handleAuthentication(onUserSignedIn);
    } else {
        showMessage(uiMessages.errors.firebaseInit, true);
        loadingOverlay.classList.add('hidden');
        updateGenerateButtonsState(activeStyleId);
    }
    
    initParticles(currentTheme);
    animateParticles();
    const loadingCanvas = document.getElementById('loading-canvas');
    resizeLoadingCanvas(loadingCanvas);
    let petals = [];
    for(let i = 0; i < uiSettings.loadingPetalCount; i++) { 
        petals.push(new Petal(loadingCanvas)); 
    }
    animateLoading(loadingCanvas, petals, loadingOverlay);

    setTimeout(() => {
        loadingText.textContent = uiMessages.loading.starting;
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            updateGenerateButtonsState(activeStyleId);
        }, 500);
    }, uiSettings.loadingScreenDuration);
};

function onUserSignedIn(uid, error) {
    if (uid) {
        userInfoEl.textContent = `雲端使用者 ID: ${uid}`;
        unsubscribeFavorites = listenToFavorites(onFavoritesUpdate);
        loadGachaState();
        loadTtsState();
    } else {
        showMessage(uiMessages.errors.cloudConnect, true);
        console.error("Authentication Error:", error);
        generateInitialImages();
    }
}

let hasInitialImagesGenerated = false; 
function onFavoritesUpdate(newFavorites, err) {
    if (err) {
        showMessage(uiMessages.errors.syncFavorites, true);
        return;
    }
    favorites = newFavorites;
    updateFavoritesCountUI(favorites.length);
    
    document.querySelectorAll('.image-card').forEach(card => {
        const cardId = card.dataset.id;
        const likeBtn = card.querySelector('.like-btn');
        if (likeBtn) {
            const isLiked = favorites.some(fav => fav && fav.id === cardId);
            likeBtn.classList.toggle('liked', isLiked);
        }
    });

    if (!hasInitialImagesGenerated) {
        hasInitialImagesGenerated = true;
        generateInitialImages();
    }

    if (slideshowModal.classList.contains('show')) {
        if (favorites.length === 0) {
            slideshowModal.classList.remove('show');
        } else {
            const newIndex = Math.min(currentSlideshowIndex, favorites.length - 1);
            renderThumbnails();
            showSlide(newIndex);
        }
    }
}


// --- UI Setup ---
function initializeUI() {
    generateOneBtn.disabled = true;
    generateFourBtn.disabled = true;

    Tone.Master.volume.value = soundSettings.masterVolume;
    setupUIText();

    styles.forEach((style, index) => {
        const tabButton = document.createElement('button');
        tabButton.className = `tab-button text-md font-medium py-2 px-4 text-gray-400 ${index === 0 ? 'active' : ''}`;
        tabButton.textContent = style.title;
        tabButton.dataset.target = `content-${style.id}`;
        tabButton.dataset.styleId = style.id;
        tabNavigation.appendChild(tabButton);

        const section = document.createElement('section');
        section.id = `content-${style.id}`;
        section.className = `tab-content ${index === 0 ? 'active' : ''}`;
        section.innerHTML = `
            <div class="text-center mb-8 mt-4">
                <p class="text-gray-400 mt-1">${style.description}</p>
            </div>
            <div id="${style.id}-gallery" class="card-container mb-8"></div>
        `;
        styleSectionsContainer.appendChild(section);
    });
    
    const vipGallery = document.getElementById('vip-exclusive-gallery');
    if (vipGallery) {
        const vipStyle = styles.find(s => s.id === 'vip-exclusive');
        const randomPreviewImg = uiSettings.previewImages[Math.floor(Math.random() * uiSettings.previewImages.length)];
        const vipPlaceholderData = {
            id: 'vip-placeholder',
            style: vipStyle,
            src: randomPreviewImg,
            imageUrl: randomPreviewImg,
            isLiked: favorites.some(fav => fav.id === 'vip-placeholder'),
            isShareable: false 
        };
        const placeholderCard = createImageCard(vipPlaceholderData, getCardHandlers());
        vipGallery.appendChild(placeholderCard);
    }

    updateGenerateButtonsState(activeStyleId);
    
    addEventListeners();
}

function addEventListeners() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            sounds.tab();
            activeStyleId = button.dataset.styleId;
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            document.getElementById(button.dataset.target).classList.add('active');
            
            updateGenerateButtonsState(activeStyleId);
        });
    });

    imageModal.addEventListener('click', () => imageModal.classList.remove('show'));
    storyModal.addEventListener('click', (e) => { 
        if (e.target === storyModal) {
            ttsAudio.pause(); 
            storyModal.classList.remove('show');
        }
    });
    generateOneBtn.addEventListener('click', () => handleImageGeneration(1));
    generateFourBtn.addEventListener('click', () => handleImageGeneration(4));
    favoritesBtn.addEventListener('click', openSlideshow);
    soundControl.addEventListener('click', toggleMute);
    themeSwitchBtn.addEventListener('click', toggleTheme);
    
    // ✨ FIX: 移除對 contactLink 的直接監聽，因為它是由 setupFooter 動態產生的

    slideshowModal.addEventListener('click', (e) => {
        if(e.target === slideshowModal) slideshowModal.classList.remove('show');
    });
    document.getElementById('slideshow-close').addEventListener('click', () => slideshowModal.classList.remove('show'));
    document.getElementById('slideshow-unfavorite').addEventListener('click', unfavoriteCurrentSlide);
    document.getElementById('slideshow-next').addEventListener('click', () => navigateSlideshow(1));
    document.getElementById('slideshow-prev').addEventListener('click', () => navigateSlideshow(-1));
    
    gachaBtn.addEventListener('click', openGachaModal);
    gachaCloseBtn.addEventListener('click', () => {
        gachaModal.classList.remove('show');
    });
    gachaDrawBtn.addEventListener('click', drawGacha);

    ttsStopBtn.addEventListener('click', () => {
        ttsAudio.pause();
        ttsAudio.currentTime = 0;
        resetTtsButtons();
    });
    ttsAudio.addEventListener('ended', resetTtsButtons);
    ttsAudio.addEventListener('pause', resetTtsButtons);

    const startAudio = async () => {
        try {
            await Tone.start();
            console.log("Audio context started by user gesture.");
            document.body.removeEventListener('click', startAudio);
            document.body.removeEventListener('touchend', startAudio);
        } catch (e) {
            console.error("Could not start audio context:", e);
        }
    };

    document.body.addEventListener('click', startAudio);
    document.body.addEventListener('touchend', startAudio);

    document.addEventListener('keydown', handleKeydown);
    slideshowContainer.addEventListener('touchstart', handleTouchStart, false);
    slideshowContainer.addEventListener('touchmove', handleTouchMove, false);
    slideshowContainer.addEventListener('touchend', handleTouchEnd, false);
}

function updateGenerateButtonsState(styleId) {
    const isVip = styleId === 'vip-exclusive';
    generateOneBtn.disabled = isVip || isGenerating;
    generateFourBtn.disabled = isVip || isGenerating;
}

function startLoadingSequence() {
    const silhouettes = [...uiSettings.loadingSilhouettes].sort(() => Math.random() - 0.5);

    silhouetteContainer.innerHTML = silhouettes.map(src => `<img src="${src}" class="loading-silhouette" alt="Loading Muse">`).join('');
    
    const silhouetteElements = document.querySelectorAll('.loading-silhouette');
    if (silhouetteElements.length === 0) return;

    const animationStep = uiSettings.loadingAnimationStep;
    const totalDuration = silhouetteElements.length * animationStep;

    silhouetteElements.forEach((el, index) => {
        el.style.animationDelay = `${index * animationStep}s`;
        el.style.animationDuration = `${totalDuration}s`;
        el.style.animationName = 'silhouette-fade';
    });
}

// --- Core Logic Handlers ---
async function generateInitialImages() {
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
        loadingText.textContent = uiMessages.loading.summoning;
        try {
            const randomGoddesses = await getRandomGoddessesFromDB(4);
            if (randomGoddesses.length === 0 && favorites.length === 0) {
                showMessage(uiMessages.gacha.poolEmpty, true);
            }

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

async function handleImageGeneration(count = 1) {
    if (isGenerating) return;
    sounds.start();
    isGenerating = true;
    updateGenerateButtonsState(activeStyleId);
    
    const style = styles.find(s => s.id === activeStyleId);
    const gallery = document.getElementById(`${style.id}-gallery`);
    
    const loadingCards = Array.from({ length: count }, () => {
        const card = document.createElement('div');
        card.className = 'image-card !cursor-default flex justify-center items-center';
        card.style.opacity = '1';
        card.innerHTML = `<div class="loader"></div>`;
        gallery.prepend(card);
        return card;
    });

    for(let i = 0; i < count; i++) {
        try {
            const base64Src = await generateImageWithRetry(style.prompt);
            if (!base64Src) {
                 throw new Error("API did not return an image.");
            }
            const newId = generateUniqueId();
            const imageData = { 
                src: base64Src, 
                style: style, 
                id: newId,
                isLiked: favorites.some(fav => fav.id === newId)
            };
            const imageCard = createImageCard(imageData, getCardHandlers());
            loadingCards[i].replaceWith(imageCard);
            sounds.success();
        } catch (error) {
            console.error('圖片生成失敗:', error);
            loadingCards[i].innerHTML = `<p class="text-red-400 text-center p-4">哎呀，女神走丟了...<br>${error.message}</p>`;
        }
    }
    
    showMessage(`完成了 ${count} 次新的邂逅！`);
    isGenerating = false;
    updateGenerateButtonsState(activeStyleId);
}

function getCardHandlers() {
    return {
        onStory: handleStoryGeneration,
        onLike: toggleFavorite,
        onShare: shareFavoriteToPublicHandler,
        onImageClick: (displaySrc) => {
            modalImage.src = displaySrc;
            imageModal.classList.add('show');
        }
    };
}

async function handleStoryGeneration(style) {
    if (isStoryGenerating) return;
    
    await checkTtsCount();
    
    isStoryGenerating = true;
    storyTextEl.innerHTML = '<div class="loader mx-auto"></div>';
    storyModal.classList.add('show');
    updateTtsUi();

    try {
        const storyPrompt = apiSettings.prompts.story(style.title, style.description);
        const story = await callTextGenerationAPI(storyPrompt);
        storyTextEl.textContent = story;
        ttsBtn.onclick = () => {
            if(storyTextEl.textContent) handleTTSGeneration(storyTextEl.textContent);
        };
    } catch (error) {
        console.error('故事生成失敗:', error);
        storyTextEl.textContent = uiMessages.errors.storyFailed;
        ttsBtn.disabled = true;
    } finally {
        isStoryGenerating = false;
    }
}

async function handleTTSGeneration(text) {
    if (isTtsGenerating || ttsState.count <= 0) return;
    isTtsGenerating = true;
    ttsBtn.textContent = '聲音合成中...';
    ttsBtn.disabled = true;
    
    try {
        const ttsPrompt = apiSettings.prompts.tts(text);
        const { audioData, mimeType } = await callTTSAPI(ttsPrompt);
        ttsState.count--;
        await saveTtsState();
        updateTtsUi();

        const sampleRate = parseInt(mimeType.match(/rate=(\d+)/)[1], 10);
        const pcmData = base64ToArrayBuffer(audioData);
        const pcm16 = new Int16Array(pcmData);
        const wavBlob = pcmToWav(pcm16, sampleRate);
        const audioUrl = URL.createObjectURL(wavBlob);
        ttsAudio.src = audioUrl;
        ttsAudio.play();

        ttsBtn.style.display = 'none';
        ttsStopBtn.style.display = 'inline-block';

    } catch (error) {
        console.error('TTS 生成失敗:', error);
        showMessage(uiMessages.errors.ttsFailed, true);
        resetTtsButtons();
    } finally {
        isTtsGenerating = false;
    }
}

// --- Favorites & Slideshow Logic ---
async function toggleFavorite(imageData, btn) {
    if (imageData.id === 'vip-placeholder') {
        showMessage('此為預覽卡片，無法收藏喔！');
        return;
    }

    sounds.like();
    if (btn) btn.disabled = true;

    const index = favorites.findIndex(fav => fav && fav.id === imageData.id);
    
    if (index > -1) {
        try {
            await removeFavorite(favorites[index]);
        } catch (error) {
            console.error("Failed to remove favorite:", error);
            showMessage(uiMessages.favorites.removeFailure, true);
        }
    } else {
        try {
            let favoriteData;
            if (imageData.src && imageData.src.startsWith('data:image')) {
                showMessage(uiMessages.favorites.uploading);
                const downloadURL = await uploadImage(imageData.src, imageData.id);
                favoriteData = { id: imageData.id, style: imageData.style, imageUrl: downloadURL };
            } else {
                favoriteData = { 
                    id: imageData.id, 
                    style: imageData.style, 
                    imageUrl: imageData.imageUrl
                };
            }
            
            await saveFavorite(favoriteData);
            showMessage(uiMessages.favorites.addSuccess);

            const cardExists = document.querySelector(`.image-card[data-id="${imageData.id}"]`);
            if (!cardExists && imageData.style && imageData.style.id) {
                const gallery = document.getElementById(`${imageData.style.id}-gallery`);
                if (gallery) {
                    const newCardData = { ...imageData, isLiked: true };
                    const newCard = createImageCard(newCardData, getCardHandlers());
                    gallery.appendChild(newCard);
                }
            }

        } catch (error) {
            console.error("Failed to save favorite:", error);
            showMessage(`${uiMessages.favorites.addFailure}: ${error.message}`, true);
        }
    }
    if (btn) btn.disabled = false;
}

async function shareFavoriteToPublicHandler(imageData, btn) {
    const favoriteData = favorites.find(fav => fav.id === imageData.id);

    if (!favoriteData || !favoriteData.imageUrl) {
        showMessage(uiMessages.favorites.shareFirst, true);
        return;
    }

    btn.disabled = true;
    try {
        const result = await shareToPublic(favoriteData);
        if (result.alreadyExists) {
            showMessage(uiMessages.gacha.alreadyShared);
        } else {
            gachaState.count++;
            await saveGachaStateToDB(gachaState);
            updateGachaUI();
            showMessage(uiMessages.gacha.shareSuccess);
        }
        btn.classList.add('shared');
    } catch (error) {
        console.error("Sharing failed:", error);
        showMessage("分享失敗，請稍後再試。", true);
    } finally {
        btn.disabled = false;
    }
}

function openSlideshow() {
    if (favorites.length === 0) {
        showMessage(uiMessages.favorites.empty);
        favoritesEmptyState.style.display = 'flex';
        slideshowContainer.style.display = 'none'; 
        slideshowModal.classList.add('show');
        return;
    }

    sounds.open();
    favoritesEmptyState.style.display = 'none';
    slideshowContainer.style.display = 'flex';
    
    currentSlideshowIndex = 0;
    renderThumbnails();
    showSlide(currentSlideshowIndex); 
    slideshowModal.classList.add('show');
}

function navigateSlideshow(direction) {
    if (favorites.length <= 1) return;
    slideshowImage.classList.remove('visible');
    setTimeout(() => {
        currentSlideshowIndex = (currentSlideshowIndex + direction + favorites.length) % favorites.length;
        showSlide(currentSlideshowIndex);
    }, uiSettings.slideshowTransitionSpeed);
}

function showSlide(index) {
    if (index < 0 || index >= favorites.length) {
        slideshowModal.classList.remove('show');
        return;
    }

    const slideData = favorites[index];
    if (!slideData || !slideData.imageUrl) {
        showMessage(uiMessages.errors.imageLoad, true);
        navigateSlideshow(1); 
        return;
    }
    
    currentSlideshowIndex = index;
    slideshowImage.src = slideData.imageUrl; 
    
    slideshowImage.style.opacity = '0';
    slideshowImage.onload = () => {
        slideshowImage.style.opacity = '1';
    };
    slideshowImage.onerror = () => {
        showMessage('無法載入此圖片', true);
        slideshowImage.alt = '圖片載入失敗';
    };
    
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
    const activeThumb = document.querySelector(`.thumbnail[data-index='${index}']`);
    if(activeThumb) activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

function renderThumbnails() {
    thumbnailBar.innerHTML = '';
    if (favorites.length === 0) {
        return;
    }

    favorites.forEach((fav, index) => {
        const thumb = document.createElement('img');
        thumb.src = fav.imageUrl;
        thumb.className = 'thumbnail';
        thumb.dataset.index = index;
        thumb.onclick = () => {
            showSlide(index);
        };
        thumbnailBar.appendChild(thumb);
    });
}

async function unfavoriteCurrentSlide() {
    if (favorites.length === 0) return;
    const currentFavorite = favorites[currentSlideshowIndex];
    if (!currentFavorite) return;
    
    try {
        await removeFavorite(currentFavorite);
        showMessage(uiMessages.favorites.removeSuccess);
    } catch (error) {
        console.error("Failed to remove favorite from DB:", error);
        showMessage(uiMessages.favorites.removeFailure, true);
    }
}


// --- Gacha System ---
async function openGachaModal() {
    gachaModal.classList.add('show');
    await checkGachaCount();
}

async function checkGachaCount() {
    const today = new Date().toISOString().split('T')[0];
    if (gachaState.lastDrawDate !== today) {
        gachaState.count = gameSettings.dailyGachaCount;
        gachaState.lastDrawDate = today;
        await saveGachaStateToDB(gachaState);
    }
    updateGachaUI();
}

function updateGachaUI() {
    gachaCountEl.textContent = gachaState.count;
    if (gachaState.count <= 0) {
        gachaDrawBtn.disabled = true;
        gachaDrawBtn.textContent = "明日再來";
        gachaUnlockInfo.style.display = 'block';
    } else {
        gachaDrawBtn.textContent = `${uiMessages.buttons.gachaDraw} (剩餘 ${gachaState.count} 次)`;
        gachaDrawBtn.disabled = false;
    }
}

async function drawGacha() {
    await checkGachaCount();
    if (gachaState.count <= 0) {
        showMessage("今日次數已用完！", true);
        return;
    }

    gachaDrawBtn.disabled = true;
    gachaResultContainer.innerHTML = '<div class="loader"></div>';
    sounds.gacha();

    try {
        const randomGoddess = await getRandomGoddessFromDB();
        
        const currentUid = getCurrentUserId();
        if (randomGoddess.sharedBy && randomGoddess.sharedBy === currentUid) {
            ownGoddessStreak++;
            const REQUIRED_STREAK = gameSettings.gachaStreakGoal;
            if (ownGoddessStreak >= REQUIRED_STREAK) {
                gachaState.count++; 
                showMessage(`幸運！連續抽到自己的女神 ${ownGoddessStreak} 次，額外獲得一次召喚！`);
                ownGoddessStreak = 0;
            } else {
                showMessage(`抽到自己的女神！再來 ${REQUIRED_STREAK - ownGoddessStreak} 次可獲獎勵！`);
            }
        }

        const imageData = {
            src: randomGoddess.imageUrl,
            imageUrl: randomGoddess.imageUrl,
            style: randomGoddess.style,
            id: randomGoddess.id,
            isLiked: favorites.some(fav => fav.id === randomGoddess.id)
        };
        
        const gachaCard = createImageCard(imageData, getCardHandlers(), { withAnimation: false, withButtons: true });
        gachaResultContainer.innerHTML = '';
        gachaResultContainer.appendChild(gachaCard);

        gachaState.count--;
        await saveGachaStateToDB(gachaState);
        updateGachaUI();
    } catch (error) {
        console.error("Gacha draw failed:", error);
        showMessage(`${uiMessages.gacha.drawFailed}: ${error.message}`, true);
        gachaResultContainer.innerHTML = `<div class="gacha-placeholder"><p>${uiMessages.gacha.drawFailed}...</p><p class="text-xs text-gray-400 mt-2">${error.message}</p></div>`;
    } finally {
        if (gachaState.count > 0) gachaDrawBtn.disabled = false;
    }
}

async function loadGachaState() {
    const state = await loadGachaStateFromDB();
    if (state) {
        gachaState = state;
    }
    checkGachaCount();
}

// --- TTS State Management ---
async function saveTtsState() {
    try {
        await saveTtsStateToDB(ttsState);
    } catch (error) {
        console.error("Failed to save TTS state:", error);
    }
}

async function loadTtsState() {
    try {
        const state = await loadTtsStateFromDB();
        if (state) {
            ttsState = state;
        }
        checkTtsCount();
    } catch (error) {
        console.error("Failed to load TTS state:", error);
    }
}

async function checkTtsCount() {
    const today = new Date().toISOString().split('T')[0];
    if (ttsState.lastListenDate !== today) {
        ttsState.count = gameSettings.dailyTtsCount;
        ttsState.lastListenDate = today;
        await saveTtsState();
    }
}

function updateTtsUi() {
    if (ttsState.count <= 0) {
        ttsBtn.disabled = true;
        ttsBtn.textContent = uiMessages.buttons.ttsLimit;
        ttsLimitInfo.style.display = 'block';
    } else {
        ttsBtn.disabled = false;
        ttsBtn.textContent = uiMessages.buttons.ttsPlay;
        ttsLimitInfo.style.display = 'none';
    }
}

function resetTtsButtons() {
    ttsBtn.style.display = 'inline-block';
    ttsStopBtn.style.display = 'none';
    updateTtsUi();
}


// --- API Call Logic ---
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function getRandomItems(arr, count) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

async function generateImageWithRetry(prompt) {
    const retries = apiSettings.imageGenerationRetries;
    const delay = apiSettings.imageGenerationDelay;
    
    const keywords = currentTheme === 'day' ? randomKeywords_day : randomKeywords_night;
    
    const enhancedPrompt = `${prompt}, ${getRandomItems(keywords.hair, 1)}, ${getRandomItems(keywords.outfit, 2).join(', ')}, ${getRandomItems(keywords.setting, 1)}, ${getRandomItems(keywords.artStyle, 1)}, ${getRandomItems(keywords.bodyDetails, 2).join(', ')}, ${getRandomItems(keywords.expression, 1)}, ${getRandomItems(keywords.mood, 1)}.`;
    const fullPrompt = `${apiSettings.prompts.imagePrefix} ${enhancedPrompt} ${apiSettings.prompts.imageSuffix} Negative prompt: ${apiSettings.prompts.negativePrompt}`;

    for (let i = 0; i < retries; i++) {
        try {
            const selectedModel = modelSelect.value;
            return await callImageGenerationAPI(fullPrompt, selectedModel);
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
            if (i === retries - 1) throw error; 
            await new Promise(res => setTimeout(res, delay * (i + 1)));
        }
    }
    return null;
}

async function callImageGenerationAPI(userPrompt, model) {
    const modelName = model === 'imagen-3' ? 'imagen-3.0-generate-002' : 'gemini-2.0-flash-preview-image-generation';
    const isImagen = model === 'imagen-3';
    const apiUrl = isImagen 
        ? `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:predict?key=${apiKey}`
        : `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const payload = isImagen
        ? { instances: [{ prompt: userPrompt }], parameters: { "sampleCount": 1 } }
        : {
            contents: [{ parts: [{ text: userPrompt }] }],
            generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
          };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(`API 請求失敗: ${errorData?.error?.message || response.statusText}`);
    }

    const result = await response.json();
    
    const candidate = result?.candidates?.[0];
    if (isImagen) {
        const base64Data = result.predictions?.[0]?.bytesBase64Encoded;
        if (!base64Data) {
            console.error('Unexpected Imagen API response structure:', result);
            throw new Error("Imagen API 回應中找不到圖片資料。");
        }
        return `data:image/png;base64,${base64Data}`;
    }

    if (!candidate) {
        console.error('Unexpected API response: No candidates found.', result);
        throw new Error("API 回應無效，找不到候選項目。");
    }

    if (candidate.finishReason && candidate.finishReason !== 'STOP') {
        console.error('API generation finished with reason:', candidate.finishReason, candidate);
        throw new Error(`圖片生成因安全限制被阻擋，請嘗試更換提示詞。`);
    }

    const imagePart = candidate.content?.parts?.find(p => p.inlineData);
    const base64Data = imagePart?.inlineData?.data;

    if (!base64Data) {
        console.error('Unexpected API response structure:', result);
        throw new Error("API 回應中找不到圖片資料。");
    }
    
    return `data:image/png;base64,${base64Data}`;
}


async function callTextGenerationAPI(prompt) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }]
    };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API 請求失敗: ${errorData?.error?.message || response.statusText}`);
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        throw new Error("API 回應中找不到文字資料。");
    }
    return text;
}

async function callTTSAPI(text) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ parts: [{ text: text }] }],
        generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: apiSettings.ttsVoice } 
                }
            }
        },
        model: "gemini-2.5-flash-preview-tts"
    };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`TTS API 請求失敗: ${errorData?.error?.message || response.statusText}`);
    }

    const result = await response.json();
    const part = result?.candidates?.[0]?.content?.parts?.[0];
    const audioData = part?.inlineData?.data;
    const mimeType = part?.inlineData?.mimeType;

    if (!audioData || !mimeType) {
        throw new Error("TTS API 回應中找不到音訊資料。");
    }
    return { audioData, mimeType };
}


// --- Utility Functions ---
function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

function pcmToWav(pcmData, sampleRate) {
    const numChannels = 1;
    const bytesPerSample = 2;
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = pcmData.length * bytesPerSample;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    view.setUint32(0, 0x52494646, false); // "RIFF"
    view.setUint32(4, 36 + dataSize, true);
    view.setUint32(8, 0x57415645, false); // "WAVE"
    view.setUint32(12, 0x666d7420, false); // "fmt "
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bytesPerSample * 8, true);
    view.setUint32(36, 0x64617461, false); // "data"
    view.setUint32(40, dataSize, true);

    const pcm16 = new Int16Array(pcmData.buffer);
    for (let i = 0; i < pcmData.length; i++) {
        view.setInt16(44 + i * 2, pcmData[i], true);
    }

    return new Blob([view], { type: 'audio/wav' });
}

function setupAppInfo() {
    document.title = `${appInfo.title} v${appInfo.version}`;
    headerTitleEl.textContent = `${appInfo.title} v${appInfo.version}`;
    setupIcons();
    setupFooter();
}

function setupIcons() {
    const head = document.head;
    const icons = appInfo.icons;
    
    const createLink = (rel, href, sizes, type) => {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        if (sizes) link.sizes = sizes;
        if (type) link.type = type;
        head.appendChild(link);
    };

    createLink('apple-touch-icon', icons.appleTouchIcon, '180x180');
    createLink('icon', icons.favicon32, '32x32', 'image/png');
    createLink('icon', icons.favicon16, '16x16', 'image/png');
    createLink('manifest', icons.manifest);
    createLink('shortcut icon', icons.shortcutIcon);
}

function setupUIText() {
    loadingText.textContent = uiMessages.loading.connecting;
    gachaModalTitleEl.textContent = uiMessages.gachaModalTitle;
    storyModalTitleEl.textContent = uiMessages.storyModalTitle;
    generateOneBtn.textContent = uiMessages.buttons.generateOne;
    generateFourBtn.textContent = uiMessages.buttons.generateFour;
    if (favoritesBtnTextEl) {
        favoritesBtnTextEl.textContent = uiMessages.buttons.favorites;
    }
    gachaBtn.textContent = uiMessages.buttons.gacha;
    ttsBtn.textContent = uiMessages.buttons.ttsPlay;
    ttsStopBtn.textContent = uiMessages.buttons.ttsStop;
    gachaDrawBtn.textContent = uiMessages.buttons.gachaDraw;
    favoritesEmptyState.querySelector('p:nth-child(2)').textContent = uiMessages.favorites.emptyTitle;
    favoritesEmptyState.querySelector('p:nth-child(3)').textContent = uiMessages.favorites.emptySubtitle;
    gachaResultContainer.querySelector('.gacha-placeholder p:nth-child(2)').textContent = uiMessages.gacha.placeholder;
}

// ✨ FIX: 修正頁尾設定函數
function setupFooter() {
    const { copyrightYear, authorName, authorLink } = appInfo.footer;
    appFooter.innerHTML = `
        © ${copyrightYear} <a href="${authorLink}" target="_blank" class="hover:underline">${authorName}</a>. All Rights Reserved.
        <span class="mx-2">|</span>
        <a href="#" id="contact-link" class="hover:underline">聯絡我們</a>
    `;
    document.getElementById('contact-link').addEventListener('click', openContactModal);
}


function toggleMute() {
    Tone.Master.mute = !Tone.Master.mute;
    if (Tone.Master.mute) {
        soundOnIcon.style.display = 'none';
        soundOffIcon.style.display = 'block';
    } else {
        soundOnIcon.style.display = 'block';
        soundOffIcon.style.display = 'none';
    }
}

function toggleTheme() {
    if (currentTheme === 'night') {
        sounds.toDay();
        document.body.classList.remove('theme-night');
        document.body.classList.add('theme-day');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
        currentTheme = 'day';
    } else {
        sounds.toNight();
        document.body.classList.remove('theme-day');
        document.body.classList.add('theme-night');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        currentTheme = 'night';
    }
    initParticles(currentTheme);
}


function handleKeydown(e) {
    if (!slideshowModal.classList.contains('show')) return;

    switch (e.key) {
        case 'ArrowLeft':
            navigateSlideshow(-1);
            break;
        case 'ArrowRight':
            navigateSlideshow(1);
            break;
        case 'Escape':
            slideshowModal.classList.remove('show');
            break;
    }
}

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchMove(e) {
    touchEndX = e.changedTouches[0].screenX;
}

function handleTouchEnd() {
    const swipeThreshold = uiSettings.swipeThreshold; 
    if (touchEndX === 0) return;

    if (touchEndX < touchStartX - swipeThreshold) {
        navigateSlideshow(1);
    }

    if (touchEndX > touchStartX + swipeThreshold) {
        navigateSlideshow(-1);
    }
    touchStartX = 0;
    touchEndX = 0;
}

function openContactModal(e) {
    e.preventDefault();
    contactModalContent.innerHTML = `
        <button id="contact-close-btn" class="contact-close-btn">&times;</button>
        <h2 class="text-4xl font-bold text-center mb-4">聯繫我</h2>
        <p class="text-lg text-center mb-8 max-w-2xl mx-auto">如果您對我的作品感興趣，或是有任何合作想法，歡迎隨時與我聯繫！</p>
        <form id="contact-form" action="https://formspree.io/f/xnnzgpdn" method="POST" class="max-w-xl mx-auto space-y-4 text-left">
            <div class="flex flex-col md:flex-row gap-4">
                <input type="text" name="name" placeholder="您的名字" required class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500">
                <input type="email" name="email" placeholder="您的電子郵件" required class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500">
            </div>
            <textarea name="message" placeholder="您的訊息..." rows="5" required class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"></textarea>
            <button type="submit" class="w-full p-3 font-bold rounded-md hover:opacity-90 transition-opacity">發送訊息</button>
        </form>
        <div id="form-status" class="mt-4 text-center"></div>
        <div class="mt-12 flex justify-center items-center space-x-8 text-4xl">
            <a href="mailto:yor31117@gmail.com" class="transition-colors" aria-label="Email"><i class="fas fa-envelope"></i></a>
            <a href="https://github.com/LayorX" target="_blank" rel="noopener noreferrer" class="transition-colors" aria-label="GitHub"><i class="fab fa-github"></i></a>
        </div>
    `;
    contactModal.classList.add('show');
    document.getElementById('contact-close-btn').addEventListener('click', () => contactModal.classList.remove('show'));
    document.getElementById('contact-form').addEventListener('submit', handleContactFormSubmit);
}

async function handleContactFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const status = document.getElementById('form-status');
    
    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            status.textContent = "感謝您的訊息，我會盡快回覆！";
            status.style.color = 'green';
            form.reset();
        } else {
            const responseData = await response.json();
            if (Object.hasOwn(responseData, 'errors')) {
                status.textContent = responseData["errors"].map(error => error["message"]).join(", ");
            } else {
                status.textContent = "哎呀！發送失敗，請稍後再試。";
            }
            status.style.color = 'red';
        }
    } catch (error) {
        status.textContent = "哎呀！發送失敗，請稍後再試。";
        status.style.color = 'red';
    }
}
