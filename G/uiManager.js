import { serviceKeys } from './app-config.js';
import { styles, uiMessages, uiSettings } from './game-config.js';
import { getState, setState, subscribe } from './stateManager.js';
import { getTaskCount } from './dailyTaskManager.js';
import { getCardHandlers, handleImageGeneration, drawGacha, unfavoriteCurrentSlide } from './handlers.js';
import { incrementStat } from './analyticsManager.js';
import { getCurrentUserId } from './gfirebase.js';
import { createImageCard, showMessage, initParticles, updateFavoritesCountUI } from './gui.js';
import { sounds } from './soundManager.js';

let DOMElements = {};

export function initializeUI() {
    DOMElements = {
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
    };

    setupUIText();
    createTabsAndSections();
    addEventListeners();
    setupSubscriptions();
}

function setupUIText() {
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

function createTabsAndSections() {
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
        const vipPlaceholderData = {
            id: 'vip-placeholder',
            style: vipStyle,
            src: 'gimages/g/g1.jpg',
            imageUrl: 'gimages/g/g1.jpg',
            isLiked: false,
            isShareable: false 
        };
        const placeholderCard = createImageCard(vipPlaceholderData, getCardHandlers());
        vipGallery.appendChild(placeholderCard);
    }
}

function addEventListeners() {
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            sounds.tab();
            setState({ activeStyleId: button.dataset.styleId });
        });
    });
    
    DOMElements.generateOneBtn.addEventListener('click', () => handleImageGeneration(1));
    DOMElements.generateFourBtn.addEventListener('click', () => handleImageGeneration(4));
    DOMElements.favoritesBtn.addEventListener('click', openSlideshow);
    DOMElements.soundControl.addEventListener('click', toggleMute);
    DOMElements.themeSwitchBtn.addEventListener('click', toggleTheme);
    DOMElements.gachaBtn.addEventListener('click', openGachaModal);
    DOMElements.gachaCloseBtn.addEventListener('click', () => DOMElements.gachaModal.classList.remove('show'));
    DOMElements.gachaDrawBtn.addEventListener('click', () => drawGacha());
    
    DOMElements.imageModal.addEventListener('click', () => DOMElements.imageModal.classList.remove('show'));
    DOMElements.storyModal.addEventListener('click', (e) => { 
        if (e.target === DOMElements.storyModal) {
            DOMElements.ttsAudio.pause(); 
            DOMElements.storyModal.classList.remove('show');
        }
    });

    DOMElements.moreOptionsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        DOMElements.moreOptionsMenu.classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
        if (!DOMElements.moreOptionsBtn.contains(e.target) && !DOMElements.moreOptionsMenu.contains(e.target)) {
            DOMElements.moreOptionsMenu.classList.add('hidden');
        }
    });

    DOMElements.aboutBtn.addEventListener('click', (e) => { e.preventDefault(); window.open('GoddeSpark.html', '_blank'); DOMElements.moreOptionsMenu.classList.add('hidden'); });
    DOMElements.contactBtn.addEventListener('click', (e) => { e.preventDefault(); openContactModal(); DOMElements.moreOptionsMenu.classList.add('hidden'); });
    DOMElements.apikeyBtn.addEventListener('click', (e) => { e.preventDefault(); openApiKeyModal(); DOMElements.moreOptionsMenu.classList.add('hidden'); });
    DOMElements.extraGachaBtn.addEventListener('click', (e) => { e.preventDefault(); openComingSoonModal(); DOMElements.moreOptionsMenu.classList.add('hidden'); });

    DOMElements.slideshowModal.addEventListener('click', (e) => { if(e.target === DOMElements.slideshowModal) DOMElements.slideshowModal.classList.remove('show'); });
    document.getElementById('slideshow-close').addEventListener('click', () => DOMElements.slideshowModal.classList.remove('show'));
    document.getElementById('slideshow-unfavorite').addEventListener('click', unfavoriteCurrentSlide);
    document.getElementById('slideshow-next').addEventListener('click', () => navigateSlideshow(1));
    document.getElementById('slideshow-prev').addEventListener('click', () => navigateSlideshow(-1));
    
    DOMElements.ttsStopBtn.addEventListener('click', () => { DOMElements.ttsAudio.pause(); DOMElements.ttsAudio.currentTime = 0; });
    DOMElements.ttsAudio.addEventListener('ended', () => setState({ isTtsGenerating: false }));
    DOMElements.ttsAudio.addEventListener('pause', () => setState({ isTtsGenerating: false }));

    document.addEventListener('keydown', handleKeydown);
    DOMElements.slideshowContainer.addEventListener('touchstart', handleTouchStart, false);
    DOMElements.slideshowContainer.addEventListener('touchmove', handleTouchMove, false);
    DOMElements.slideshowContainer.addEventListener('touchend', handleTouchEnd, false);
}

function setupSubscriptions() {
    subscribe('activeStyleId', (styleId) => {
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.toggle('active', btn.dataset.styleId === styleId));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.toggle('active', content.id === `content-${styleId}`));
        updateGenerateButtonsState();
    });

    subscribe('isGenerating', (isGenerating) => {
        updateGenerateButtonsState();
    });
    
    subscribe('hasUserApiKey', () => {
        updateAllTaskUIs();
    });

    subscribe('isStoryGenerating', (isGenerating) => {
        updateTtsUi();
    });

    subscribe('isTtsGenerating', (isGenerating) => {
        DOMElements.ttsBtn.style.display = isGenerating ? 'none' : 'inline-block';
        DOMElements.ttsStopBtn.style.display = isGenerating ? 'inline-block' : 'none';
        if (!isGenerating) {
            updateTtsUi();
        } else {
            DOMElements.ttsBtn.textContent = '聲音合成中...';
            DOMElements.ttsBtn.disabled = true;
        }
    });
}

export async function updateAllTaskUIs() {
    await updateGenerateButtonsState();
    await updateGachaUI();
    await updateTtsUi();
}

export async function updateGenerateButtonsState() {
    const { activeStyleId, isGenerating, hasUserApiKey } = getState('activeStyleId', 'isGenerating', 'hasUserApiKey');
    const isVip = activeStyleId === 'vip-exclusive';
    
    let oneBtnDisabled = isVip || isGenerating;
    let fourBtnDisabled = isVip || isGenerating;
    
    if (hasUserApiKey) {
        DOMElements.generateOneBtn.textContent = uiMessages.buttons.generateOne;
        DOMElements.generateFourBtn.textContent = uiMessages.buttons.generateFour;
    } else {
        const oneCount = await getTaskCount('generateOne');
        const fourCount = await getTaskCount('generateFour');
        DOMElements.generateOneBtn.textContent = `${uiMessages.buttons.generateOne} (${oneCount})`;
        DOMElements.generateFourBtn.textContent = `${uiMessages.buttons.generateFour} (${fourCount})`;
        if (oneCount <= 0) oneBtnDisabled = true;
        if (fourCount <= 0) fourBtnDisabled = true;
    }
    
    DOMElements.generateOneBtn.disabled = oneBtnDisabled;
    DOMElements.generateFourBtn.disabled = fourBtnDisabled;
}

export async function updateGachaUI() {
    const hasUserApiKey = getState('hasUserApiKey');
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
    const { hasUserApiKey, isStoryGenerating } = getState('hasUserApiKey', 'isStoryGenerating');
    
    if (isStoryGenerating) {
        DOMElements.ttsBtn.disabled = true;
        DOMElements.ttsLimitInfo.style.display = 'none';
        return;
    }

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
        DOMElements.ttsLimitInfo.style.display = 'block';
        DOMElements.ttsLimitInfo.textContent = `今日剩餘 ${count} 次`;
    }
}

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
            incrementStat({ apiImports: 1 });
            showMessage("API Key 已儲存！您現在擁有無限次數。");
            DOMElements.apikeyModal.classList.remove('show');
        } else {
            showMessage("請輸入有效的 API Key", true);
        }
    });

    document.getElementById('restore-api-key-btn').addEventListener('click', () => {
        localStorage.removeItem('userGeminiApiKey');
        setState({ userApiKey: serviceKeys.defaultApiKey, hasUserApiKey: !!serviceKeys.defaultApiKey });
        showMessage("已恢復預設 API 設定。");
        DOMElements.apikeyModal.classList.remove('show');
    });
}

function openContactModal() {
    DOMElements.contactModalContent.innerHTML = `
        <button class="modal-close-btn">&times;</button>
        <h2 class="text-4xl font-bold text-center mb-2">發現臭蟲？有好點子？</h2>
        <p class="text-lg text-center mb-6 max-w-2xl mx-auto">這裡是「女神製造所」的許願池！不管是抓到程式的 Bug，還是想到能讓這裡更有趣的鬼點子，都歡迎告訴我！</p>
        
        <div class="text-center bg-amber-900/50 border border-amber-500 text-amber-300 p-4 rounded-lg mb-6">
            <p class="font-bold text-lg">✨ 懸賞任務 ✨</p>
            <p class="mt-1 text-sm">只要您的建議或回報被證實有效，我就會不定期空投 <span class="font-bold text-white">5 ~ 20 次</span> 的額外扭蛋機會到您的帳戶作為謝禮！</p>
        </div>

        <form id="contact-form" action="${serviceKeys.formspreeUrl}" method="POST" class="max-w-xl mx-auto space-y-4 text-left">
            <textarea name="message" placeholder="請在此詳細描述您的發現或建議..." rows="5" required class="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"></textarea>
            <input type="text" name="userId" value="您的雲端ID: ${getCurrentUserId() || '尚未登入'}" readonly class="w-full p-3 border rounded-md bg-gray-700/50 cursor-not-allowed">
            <p class="text-xs text-center text-gray-400 -mt-2">（請務必保留此 ID 以便發放獎勵！）</p>
            <button type="submit" class="w-full p-3 font-bold rounded-md hover:opacity-90 transition-opacity">發送許願</button>
        </form>
        <div id="form-status" class="mt-4 text-center"></div>
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

function toggleMute() {
    Tone.Master.mute = !Tone.Master.mute;
    if (Tone.Master.mute) {
        DOMElements.soundOnIcon.style.display = 'none';
        DOMElements.soundOffIcon.style.display = 'block';
    } else {
        DOMElements.soundOnIcon.style.display = 'block';
        DOMElements.soundOffIcon.style.display = 'none';
    }
}

function toggleTheme() {
    const currentTheme = getState('currentTheme');
    const newTheme = currentTheme === 'night' ? 'day' : 'night';
    
    if (newTheme === 'day') {
        sounds.toDay();
        document.body.classList.remove('theme-night');
        document.body.classList.add('theme-day');
        DOMElements.sunIcon.style.display = 'block';
        DOMElements.moonIcon.style.display = 'none';
    } else {
        sounds.toNight();
        document.body.classList.remove('theme-day');
        document.body.classList.add('theme-night');
        DOMElements.sunIcon.style.display = 'none';
        DOMElements.moonIcon.style.display = 'block';
    }
    setState({ currentTheme: newTheme });
    initParticles(newTheme);
}

function openSlideshow() {
    const favorites = getState('favorites');
    if (!Array.isArray(favorites) || favorites.length === 0) {
        showMessage(uiMessages.favorites.empty);
        return;
    }
    sounds.open();
    setState({ currentSlideshowIndex: 0 });
    DOMElements.slideshowModal.classList.add('show');
}

export function updateSlideshowUI(favorites) {
    const isSlideshowOpen = DOMElements.slideshowModal.classList.contains('show');

    if (!Array.isArray(favorites) || favorites.length === 0) {
        if (isSlideshowOpen) {
            DOMElements.favoritesEmptyState.style.display = 'flex';
            DOMElements.slideshowContainer.style.display = 'none';
        }
        return;
    }

    if (isSlideshowOpen) {
        DOMElements.favoritesEmptyState.style.display = 'none';
        DOMElements.slideshowContainer.style.display = 'flex';
        renderThumbnails();
        const currentIndex = getState('currentSlideshowIndex');
        const newIndex = Math.min(currentIndex, favorites.length - 1);
        if (currentIndex !== newIndex) {
            setState({ currentSlideshowIndex: newIndex });
        }
        showSlide(newIndex);
    }
}

function navigateSlideshow(direction) {
    const { favorites, currentSlideshowIndex } = getState('favorites', 'currentSlideshowIndex');
    if (favorites.length <= 1) return;
    
    const newIndex = (currentSlideshowIndex + direction + favorites.length) % favorites.length;
    setState({ currentSlideshowIndex: newIndex });
    showSlide(newIndex);
}

function showSlide(index) {
    const favorites = getState('favorites');
    if (index < 0 || index >= favorites.length) {
        DOMElements.slideshowModal.classList.remove('show');
        return;
    }

    const slideData = favorites[index];
    DOMElements.slideshowImage.src = slideData.imageUrl;
    
    DOMElements.slideshowImage.style.opacity = '0';
    DOMElements.slideshowImage.onload = () => { DOMElements.slideshowImage.style.opacity = '1'; };
    DOMElements.slideshowImage.onerror = () => { showMessage('無法載入此圖片', true); };
    
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => thumb.classList.toggle('active', i === index));
    const activeThumb = document.querySelector(`.thumbnail[data-index='${index}']`);
    if(activeThumb) activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

function renderThumbnails() {
    const favorites = getState('favorites');
    DOMElements.thumbnailBar.innerHTML = '';
    if (!favorites) return;

    favorites.forEach((fav, index) => {
        const thumb = document.createElement('img');
        thumb.src = fav.resizedUrl || fav.imageUrl;
        thumb.className = 'thumbnail';
        thumb.dataset.index = index;
        thumb.onclick = () => {
            setState({ currentSlideshowIndex: index });
        };
        DOMElements.thumbnailBar.appendChild(thumb);
    });
}

function handleKeydown(e) {
    if (!DOMElements.slideshowModal.classList.contains('show')) return;
    if (e.key === 'ArrowLeft') navigateSlideshow(-1);
    if (e.key === 'ArrowRight') navigateSlideshow(1);
    if (e.key === 'Escape') DOMElements.slideshowModal.classList.remove('show');
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
