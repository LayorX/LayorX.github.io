// uiManager.js - 負責所有 UI 初始化、事件綁定和 DOM 更新

import { styles, uiSettings, uiMessages, apiKey } from './gconfig.js';
import { getState, setState } from './state.js';
import { getTaskCount } from './dailyTaskManager.js';
import { getCardHandlers, handleImageGeneration, drawGacha, unfavoriteCurrentSlide } from './handlers.js';
import { createImageCard, showMessage, initParticles } from './gui.js';
import { sounds } from './soundManager.js'; // ✨ FIX: 直接從 soundManager 引入

// --- DOM Elements ---
const DOMElements = {
    headerTitle: document.getElementById('header-title'),
    storyModalTitle: document.getElementById('story-modal-title'),
    gachaModalTitle: document.getElementById('gacha-modal-title'),
    tabNavigation: document.getElementById('tab-navigation'),
    styleSectionsContainer: document.getElementById('style-sections'),
    generateOneBtn: document.getElementById('generate-one-btn'),
    generateFourBtn: document.getElementById('generate-four-btn'),
    gachaBtn: document.getElementById('gacha-btn'),
    gachaDrawBtn: document.getElementById('gacha-draw-btn'),
    gachaCountEl: document.getElementById('gacha-count'),
    gachaUnlockInfo: document.getElementById('gacha-unlock-info'),
    ttsBtn: document.getElementById('tts-btn'),
    ttsStopBtn: document.getElementById('tts-stop-btn'),
    ttsLimitInfo: document.getElementById('tts-limit-info'),
    ttsAudio: document.getElementById('tts-audio'),
    favoritesBtn: document.getElementById('favorites-btn'),
    favoritesBtnText: document.getElementById('favorites-btn-text'),
    slideshowModal: document.getElementById('slideshow-modal'),
    slideshowImage: document.getElementById('slideshow-image'),
    thumbnailBar: document.getElementById('thumbnail-bar'),
    slideshowContainer: document.getElementById('slideshow-container'),
    favoritesEmptyState: document.getElementById('favorites-empty-state'),
    themeSwitchBtn: document.getElementById('theme-switch-btn'),
    sunIcon: document.getElementById('sun-icon'),
    moonIcon: document.getElementById('moon-icon'),
    soundControl: document.getElementById('sound-control'),
    soundOnIcon: document.getElementById('sound-on-icon'),
    soundOffIcon: document.getElementById('sound-off-icon'),
    moreOptionsBtn: document.getElementById('more-options-btn'),
    moreOptionsMenu: document.getElementById('more-options-menu'),
    aboutBtn: document.getElementById('about-btn'),
    contactBtn: document.getElementById('contact-btn'),
    apikeyBtn: document.getElementById('apikey-btn'),
    extraGachaBtn: document.getElementById('extra-gacha-btn'),
    gachaModal: document.getElementById('gacha-modal'),
    gachaCloseBtn: document.getElementById('gacha-close-btn'),
    storyModal: document.getElementById('story-modal'),
    imageModal: document.getElementById('image-modal'),
    apikeyModal: document.getElementById('apikey-modal'),
    apikeyModalContent: document.getElementById('apikey-modal-content'),
    contactModal: document.getElementById('contact-modal'),
    contactModalContent: document.getElementById('contact-modal-content'),
    comingSoonModal: document.getElementById('coming-soon-modal'),
    comingSoonModalContent: document.getElementById('coming-soon-modal-content'),
    loadingText: document.getElementById('loading-text'),
};

function setupUIText() {
    DOMElements.loadingText.textContent = uiMessages.loading.connecting;
    DOMElements.gachaModalTitle.textContent = uiMessages.gachaModalTitle;
    DOMElements.storyModalTitle.textContent = uiMessages.storyModalTitle;
    DOMElements.generateOneBtn.textContent = uiMessages.buttons.generateOne;
    DOMElements.generateFourBtn.textContent = uiMessages.buttons.generateFour;
    if (DOMElements.favoritesBtnText) {
        DOMElements.favoritesBtnText.textContent = uiMessages.buttons.favorites;
    }
    DOMElements.gachaBtn.textContent = uiMessages.buttons.gacha;
    DOMElements.ttsBtn.textContent = uiMessages.buttons.ttsPlay;
    DOMElements.ttsStopBtn.textContent = uiMessages.buttons.ttsStop;
    DOMElements.gachaDrawBtn.textContent = uiMessages.buttons.gachaDraw;
    DOMElements.favoritesEmptyState.querySelector('p:nth-child(2)').textContent = uiMessages.favorites.emptyTitle;
    DOMElements.favoritesEmptyState.querySelector('p:nth-child(3)').textContent = uiMessages.favorites.emptySubtitle;
    document.querySelector('.gacha-placeholder p:nth-child(2)').textContent = uiMessages.gacha.placeholder;
}

// --- Initialization ---
export function initializeUI() { // ✨ FIX: 移除 sounds 參數
    DOMElements.generateOneBtn.disabled = true;
    DOMElements.generateFourBtn.disabled = true;

    setupUIText();

    styles.forEach((style, index) => {
        const tabButton = document.createElement('button');
        tabButton.className = `tab-button text-md font-medium py-2 px-4 text-gray-400 ${index === 0 ? 'active' : ''}`;
        tabButton.textContent = style.title;
        tabButton.dataset.target = `content-${style.id}`;
        tabButton.dataset.styleId = style.id;
        DOMElements.tabNavigation.appendChild(tabButton);

        const section = document.createElement('section');
        section.id = `content-${style.id}`;
        section.className = `tab-content ${index === 0 ? 'active' : ''}`;
        section.innerHTML = `
            <div class="text-center mb-8 mt-4">
                <p class="text-gray-400 mt-1">${style.description}</p>
            </div>
            <div id="${style.id}-gallery" class="card-container mb-8"></div>
        `;
        DOMElements.styleSectionsContainer.appendChild(section);
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
            isLiked: false,
            isShareable: false 
        };
        const placeholderCard = createImageCard(vipPlaceholderData, getCardHandlers());
        vipGallery.appendChild(placeholderCard);
    }
    
    addEventListeners();
}

function addEventListeners() { // ✨ FIX: 移除 sounds 參數
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            sounds.tab();
            setState({ activeStyleId: button.dataset.styleId });
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            document.getElementById(button.dataset.target).classList.add('active');
            updateGenerateButtonsState();
        });
    });

    DOMElements.imageModal.addEventListener('click', () => DOMElements.imageModal.classList.remove('show'));
    DOMElements.storyModal.addEventListener('click', (e) => { 
        if (e.target === DOMElements.storyModal) {
            DOMElements.ttsAudio.pause(); 
            DOMElements.storyModal.classList.remove('show');
        }
    });

    DOMElements.generateOneBtn.addEventListener('click', () => handleImageGeneration(1));
    DOMElements.generateFourBtn.addEventListener('click', () => handleImageGeneration(4));
    DOMElements.favoritesBtn.addEventListener('click', openSlideshow);
    DOMElements.soundControl.addEventListener('click', toggleMute);
    DOMElements.themeSwitchBtn.addEventListener('click', toggleTheme);
    
    DOMElements.moreOptionsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        DOMElements.moreOptionsMenu.classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
        if (!DOMElements.moreOptionsBtn.contains(e.target) && !DOMElements.moreOptionsMenu.contains(e.target)) {
            DOMElements.moreOptionsMenu.classList.add('hidden');
        }
    });

    DOMElements.aboutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.open('GoddeSpark.html', '_blank');
        DOMElements.moreOptionsMenu.classList.add('hidden');
    });
    DOMElements.contactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openContactModal();
        DOMElements.moreOptionsMenu.classList.add('hidden');
    });
    DOMElements.apikeyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openApiKeyModal();
        DOMElements.moreOptionsMenu.classList.add('hidden');
    });
    DOMElements.extraGachaBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openComingSoonModal();
        DOMElements.moreOptionsMenu.classList.add('hidden');
    });

    DOMElements.slideshowModal.addEventListener('click', (e) => {
        if(e.target === DOMElements.slideshowModal) DOMElements.slideshowModal.classList.remove('show');
    });
    document.getElementById('slideshow-close').addEventListener('click', () => DOMElements.slideshowModal.classList.remove('show'));
    document.getElementById('slideshow-unfavorite').addEventListener('click', unfavoriteCurrentSlide);
    document.getElementById('slideshow-next').addEventListener('click', () => navigateSlideshow(1));
    document.getElementById('slideshow-prev').addEventListener('click', () => navigateSlideshow(-1));
    
    DOMElements.gachaBtn.addEventListener('click', openGachaModal);
    DOMElements.gachaCloseBtn.addEventListener('click', () => DOMElements.gachaModal.classList.remove('show'));
    DOMElements.gachaDrawBtn.addEventListener('click', () => drawGacha());

    DOMElements.ttsStopBtn.addEventListener('click', () => {
        DOMElements.ttsAudio.pause();
        DOMElements.ttsAudio.currentTime = 0;
        resetTtsButtons();
    });
    DOMElements.ttsAudio.addEventListener('ended', resetTtsButtons);
    DOMElements.ttsAudio.addEventListener('pause', resetTtsButtons);

    document.addEventListener('keydown', handleKeydown);
    DOMElements.slideshowContainer.addEventListener('touchstart', handleTouchStart, false);
    DOMElements.slideshowContainer.addEventListener('touchmove', handleTouchMove, false);
    DOMElements.slideshowContainer.addEventListener('touchend', handleTouchEnd, false);
}

// --- UI Update Functions ---
export async function updateAllTaskUIs() {
    updateGenerateButtonsState();
    updateGachaUI();
    updateTtsUi();
}

export async function updateGenerateButtonsState() {
    const { activeStyleId, isGenerating, hasUserApiKey } = getState('activeStyleId', 'isGenerating', 'hasUserApiKey');
    const isVip = activeStyleId === 'vip-exclusive';
    
    DOMElements.generateOneBtn.disabled = isVip || isGenerating;
    DOMElements.generateFourBtn.disabled = isVip || isGenerating;
    
    if (hasUserApiKey) {
        DOMElements.generateOneBtn.textContent = uiMessages.buttons.generateOne;
        DOMElements.generateFourBtn.textContent = uiMessages.buttons.generateFour;
    } else {
        const oneCount = await getTaskCount('generateOne');
        const fourCount = await getTaskCount('generateFour');
        DOMElements.generateOneBtn.textContent = `${uiMessages.buttons.generateOne} (${oneCount})`;
        DOMElements.generateFourBtn.textContent = `${uiMessages.buttons.generateFour} (${fourCount})`;
        if (oneCount <= 0) DOMElements.generateOneBtn.disabled = true;
        if (fourCount <= 0) DOMElements.generateFourBtn.disabled = true;
    }
}

export async function updateGachaUI() {
    const { hasUserApiKey } = getState('hasUserApiKey');
    if(hasUserApiKey) {
        DOMElements.gachaDrawBtn.textContent = uiMessages.buttons.gachaDraw;
        DOMElements.gachaDrawBtn.disabled = false;
        DOMElements.gachaUnlockInfo.style.display = 'none';
        return;
    }
    const count = await getTaskCount('gacha');
    DOMElements.gachaCountEl.textContent = count;
    if (count <= 0) {
        DOMElements.gachaDrawBtn.disabled = true;
        DOMElements.gachaDrawBtn.textContent = "明日再來";
        DOMElements.gachaUnlockInfo.style.display = 'block';
    } else {
        DOMElements.gachaDrawBtn.textContent = `${uiMessages.buttons.gachaDraw} (剩餘 ${count} 次)`;
        DOMElements.gachaDrawBtn.disabled = false;
        DOMElements.gachaUnlockInfo.style.display = 'none';
    }
}

export async function updateTtsUi() {
    const { hasUserApiKey } = getState('hasUserApiKey');
    if (hasUserApiKey) {
        DOMElements.ttsBtn.disabled = false;
        DOMElements.ttsBtn.textContent = uiMessages.buttons.ttsPlay;
        DOMElements.ttsLimitInfo.style.display = 'none';
        return;
    }
    const count = await getTaskCount('tts');
    if (count <= 0) {
        DOMElements.ttsBtn.disabled = true;
        DOMElements.ttsBtn.textContent = uiMessages.buttons.ttsLimit;
        DOMElements.ttsLimitInfo.style.display = 'block';
    } else {
        DOMElements.ttsBtn.disabled = false;
        DOMElements.ttsBtn.textContent = uiMessages.buttons.ttsPlay;
        DOMElements.ttsLimitInfo.style.display = 'none';
    }
}

export function resetTtsButtons() {
    DOMElements.ttsBtn.style.display = 'inline-block';
    DOMElements.ttsStopBtn.style.display = 'none';
    updateTtsUi();
}

// --- Modal Functions ---
function openGachaModal() {
    DOMElements.gachaModal.classList.add('show');
    updateGachaUI();
}

function openApiKeyModal() {
    DOMElements.apikeyModalContent.innerHTML = `
        <button class="modal-close-btn">&times;</button>
        <h2 class="text-3xl font-bold text-center mb-4">匯入您的 Gemini API Key</h2>
        <p class="text-center mb-6">將您的 Google AI Gemini API Key 貼入下方，即可使用您自己的額度進行圖片生成，享受更自由的體驗。</p>
        <div class="space-y-4">
            <input type="password" id="api-key-input" placeholder="貼上您的 API Key" class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500">
            <div class="flex gap-4">
                <button id="restore-api-key-btn" class="w-full p-3 font-bold rounded-md bg-gray-600 text-white hover:bg-gray-700 transition-colors">恢復預設設定</button>
                <button id="save-api-key-btn" class="w-full p-3 font-bold rounded-md bg-pink-500 text-white hover:bg-pink-600 transition-colors">儲存 Key</button>
            </div>
        </div>
        <p class="text-xs text-center mt-4">本網站不會以任何形式紀錄或回傳您的 API Key，所有操作均在您的瀏覽器本機完成，請安心使用。</p>
        <a href="https://aistudio.google.com/app/apikey" target="_blank" class="block text-center mt-4 text-pink-400 hover:underline">如何取得 Gemini API Key？</a>
    `;
    DOMElements.apikeyModal.classList.add('show');
    DOMElements.apikeyModalContent.querySelector('.modal-close-btn').addEventListener('click', () => DOMElements.apikeyModal.classList.remove('show'));
    
    document.getElementById('save-api-key-btn').addEventListener('click', () => {
        const input = document.getElementById('api-key-input');
        if (input.value) {
            localStorage.setItem('userGeminiApiKey', input.value);
            setState({ userApiKey: input.value, hasUserApiKey: true });
            showMessage("API Key 已儲存！您現在擁有無限次數。");
            DOMElements.apikeyModal.classList.remove('show');
            updateAllTaskUIs();
        } else {
            showMessage("請輸入有效的 API Key", true);
        }
    });

    document.getElementById('restore-api-key-btn').addEventListener('click', () => {
        localStorage.removeItem('userGeminiApiKey');
        setState({ userApiKey: apiKey, hasUserApiKey: false });
        showMessage("已恢復預設 API 設定。");
        DOMElements.apikeyModal.classList.remove('show');
        updateAllTaskUIs();
    });
}

function openContactModal() {
    DOMElements.contactModalContent.innerHTML = `
        <button class="modal-close-btn">&times;</button>
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
    DOMElements.contactModal.classList.add('show');
    DOMElements.contactModalContent.querySelector('.modal-close-btn').addEventListener('click', () => DOMElements.contactModal.classList.remove('show'));
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


function openComingSoonModal() {
    DOMElements.comingSoonModalContent.innerHTML = `
        <button class="modal-close-btn">&times;</button>
        <div class="text-center p-8">
            <p class="text-6xl mb-4">💦</p>
            <p class="text-3xl font-bold">${uiMessages.gacha.comingSoon}</p>
        </div>
    `;
    DOMElements.comingSoonModal.classList.add('show');
    DOMElements.comingSoonModalContent.querySelector('.modal-close-btn').addEventListener('click', () => DOMElements.comingSoonModal.classList.remove('show'));
}

function toggleMute() { // ✨ FIX: 移除 sounds 參數
    Tone.Master.mute = !Tone.Master.mute;
    if (Tone.Master.mute) {
        DOMElements.soundOnIcon.style.display = 'none';
        DOMElements.soundOffIcon.style.display = 'block';
    } else {
        DOMElements.soundOnIcon.style.display = 'block';
        DOMElements.soundOffIcon.style.display = 'none';
    }
}

function toggleTheme() { // ✨ FIX: 移除 sounds 參數
    const { currentTheme } = getState('currentTheme');
    if (currentTheme === 'night') {
        sounds.toDay();
        document.body.classList.remove('theme-night');
        document.body.classList.add('theme-day');
        DOMElements.sunIcon.style.display = 'block';
        DOMElements.moonIcon.style.display = 'none';
        setState({ currentTheme: 'day' });
    } else {
        sounds.toNight();
        document.body.classList.remove('theme-day');
        document.body.classList.add('theme-night');
        DOMElements.sunIcon.style.display = 'none';
        DOMElements.moonIcon.style.display = 'block';
        setState({ currentTheme: 'night' });
    }
    initParticles(getState('currentTheme'));
}

// --- Slideshow Logic ---
function openSlideshow() { // ✨ FIX: 移除 sounds 參數
    const { favorites } = getState('favorites');
    if (favorites.length === 0) {
        showMessage(uiMessages.favorites.empty);
        DOMElements.favoritesEmptyState.style.display = 'flex';
        DOMElements.slideshowContainer.style.display = 'none'; 
        DOMElements.slideshowModal.classList.add('show');
        return;
    }

    sounds.open();
    DOMElements.favoritesEmptyState.style.display = 'none';
    DOMElements.slideshowContainer.style.display = 'flex';
    
    setState({ currentSlideshowIndex: 0 });
    renderThumbnails();
    showSlide(0); 
    DOMElements.slideshowModal.classList.add('show');
}

function navigateSlideshow(direction) {
    const { favorites, currentSlideshowIndex } = getState('favorites', 'currentSlideshowIndex');
    if (favorites.length <= 1) return;
    
    DOMElements.slideshowImage.classList.remove('visible');
    setTimeout(() => {
        const newIndex = (currentSlideshowIndex + direction + favorites.length) % favorites.length;
        setState({ currentSlideshowIndex: newIndex });
        showSlide(newIndex);
    }, uiSettings.slideshowTransitionSpeed);
}

function showSlide(index) {
    const { favorites } = getState('favorites');
    if (index < 0 || index >= favorites.length) {
        DOMElements.slideshowModal.classList.remove('show');
        return;
    }

    const slideData = favorites[index];
    if (!slideData || !slideData.imageUrl) {
        showMessage(uiMessages.errors.imageLoad, true);
        navigateSlideshow(1); 
        return;
    }
    
    DOMElements.slideshowImage.src = slideData.imageUrl; 
    
    DOMElements.slideshowImage.style.opacity = '0';
    DOMElements.slideshowImage.onload = () => {
        DOMElements.slideshowImage.style.opacity = '1';
    };
    DOMElements.slideshowImage.onerror = () => {
        showMessage('無法載入此圖片', true);
        DOMElements.slideshowImage.alt = '圖片載入失敗';
    };
    
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
    const activeThumb = document.querySelector(`.thumbnail[data-index='${index}']`);
    if(activeThumb) activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

function renderThumbnails() {
    const { favorites } = getState('favorites');
    DOMElements.thumbnailBar.innerHTML = '';
    if (favorites.length === 0) return;

    favorites.forEach((fav, index) => {
        const thumb = document.createElement('img');
        thumb.src = fav.imageUrl;
        thumb.className = 'thumbnail';
        thumb.dataset.index = index;
        thumb.onclick = () => {
            setState({ currentSlideshowIndex: index });
            showSlide(index);
        };
        DOMElements.thumbnailBar.appendChild(thumb);
    });
}

// --- Keyboard and Touch Handlers ---
function handleKeydown(e) {
    if (!DOMElements.slideshowModal.classList.contains('show')) return;
    switch (e.key) {
        case 'ArrowLeft': navigateSlideshow(-1); break;
        case 'ArrowRight': navigateSlideshow(1); break;
        case 'Escape': DOMElements.slideshowModal.classList.remove('show'); break;
    }
}

function handleTouchStart(e) { setState({ touchStartX: e.changedTouches[0].screenX }); }
function handleTouchMove(e) { setState({ touchEndX: e.changedTouches[0].screenX }); }
function handleTouchEnd() {
    const { touchStartX, touchEndX } = getState('touchStartX', 'touchEndX');
    if (touchEndX === 0) return;
    if (touchEndX < touchStartX - uiSettings.swipeThreshold) navigateSlideshow(1);
    if (touchEndX > touchStartX + uiSettings.swipeThreshold) navigateSlideshow(-1);
    setState({ touchStartX: 0, touchEndX: 0 });
}
