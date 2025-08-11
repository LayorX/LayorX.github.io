// --- Global Scope & Constants ---
// WARNING: Do not expose your API key in client-side code in a real application.
// This should be handled by a backend server to keep it secure.
const apiKey = "AIzaSyBl2ysPjnepR6exiYgeTnjim3IBEagTY8w"; // 為了安全，請將您的 API 金鑰移至後端處理
const styles = [
    { id: 'beach-silhouette', title: '🏖️ 沙灘剪影', description: '黃昏、唯美、充滿想像的浪漫詩篇', prompt: "A beautiful Asian model as a silhouette against a sunset on a deserted beach. She wears a light, semi-transparent white dress. The mood is romantic and beautiful." },
    { id: 'morning-lazy', title: '☀️ 晨光私房', description: '慵懶、私密、屬於你的女友感瞬間', prompt: "A sexy and curvy Asian model with a lazy aura on a messy bed. She wears an oversized men's shirt, unbuttoned, with black stockings. Morning sun streams through blinds, creating a soft, intimate, and seductive atmosphere." },
    { id: 'neon-noir', title: '💦 濕身惡女', description: '霓虹、慾望、無法抗拒的危險魅力', prompt: "A tall, wild, and seductive Asian model in a white shirt caught in a city alley downpour, against a backdrop of blurry neon lights. Her eyes are defiant and confident." },
    { id: 'cyberpunk-warrior', title: '🤖 賽博龐克戰姬', description: '未來、科技、堅毅眼神中的致命吸引力', prompt: "Cyberpunk style. A female Asian warrior in glowing mechanical armor, holding an energy sword. The background is a futuristic city with flying vehicles and towering skyscrapers." }
];
const randomKeywords = {
    hair: ['platinum blonde hair', 'long wavy brown hair', 'short pink hair', 'silver bob cut', 'fiery red braids', 'messy bun', 'sleek ponytail'],
    outfit: ['in a leather jacket', 'wearing a silk gown', 'in a futuristic jumpsuit', 'in a traditional kimono', 'in a simple t-shirt and jeans', 'wearing sheer lingerie', 'in a lace thong', 'wearing thigh-high stockings', 'in a wet see-through shirt'],
    setting: ['in a neon-lit tokyo street', 'in a lush green forest', 'on a rooftop overlooking the city', 'inside a cozy cafe', 'in a baroque-style room', 'in a sun-drenched bedroom', 'in the pouring rain'],
    artStyle: ['cinematic lighting', 'fantasy art style', 'oil painting style', 'vaporwave aesthetic', 'dramatic lighting', 'soft focus', 'lens flare'],
    bodyDetails: ['glistening skin', 'plump lips', 'slender waist', 'long legs', 'dewy skin', 'wet and glossy lips', 'curvaceous body'],
    expression: ['blushing shyly', 'seductive gaze', 'a playful wink', 'a mysterious smile', 'a look of longing', 'a shy glance'],
    mood: ['alluring', 'charming', 'enchanting', 'sultry', 'innocent but tempting', 'sun-kissed and radiant', 'captivating men\'s gaze']
};

// --- DOM Elements ---
const loadingOverlay = document.getElementById('loading-overlay');
const loadingText = document.getElementById('loading-text');
const silhouetteContainer = document.querySelector('.silhouette-container');
const tabNavigation = document.getElementById('tab-navigation');
const styleSectionsContainer = document.getElementById('style-sections');
const messageBox = document.getElementById('message-box');
const imageModal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const storyModal = document.getElementById('story-modal');
const storyTextEl = document.getElementById('story-text');
const ttsBtn = document.getElementById('tts-btn');
const ttsAudio = document.getElementById('tts-audio');
const generateOneBtn = document.getElementById('generate-one-btn');
const generateFourBtn = document.getElementById('generate-four-btn');
const favoritesBtn = document.getElementById('favorites-btn');
const favoritesCountEl = document.getElementById('favorites-count');
const slideshowModal = document.getElementById('slideshow-modal');
const slideshowImage = document.getElementById('slideshow-image');
const thumbnailBar = document.getElementById('thumbnail-bar');
const musicControl = document.getElementById('music-control');
const musicOnIcon = document.getElementById('music-on-icon');
const musicOffIcon = document.getElementById('music-off-icon');

// --- State Management ---
let isGenerating = false;
let activeStyleId = styles[0].id;
let isStoryGenerating = false;
let isTtsGenerating = false;
let favorites = [];
let currentSlideshowIndex = 0;
let musicPlayer = null;
let isMusicPlaying = false;
let db; // IndexedDB database instance

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
};

// --- IndexedDB Database Logic ---
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("GoddessFactoryDB", 1);

        request.onerror = (event) => {
            console.error("IndexedDB error:", event.target.error);
            reject("Database error");
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('favorites')) {
                db.createObjectStore('favorites', { keyPath: 'id' });
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log("Database opened successfully.");
            resolve(db);
        };
    });
}

// --- Core Functions ---
function showMessage(text, isError = false) {
    messageBox.textContent = text;
    messageBox.style.backgroundColor = isError ? '#E11D48' : '#EC4899';
    messageBox.classList.add('show');
    setTimeout(() => messageBox.classList.remove('show'), 3000);
}

async function initializeUI() {
    generateOneBtn.disabled = true;
    generateFourBtn.disabled = true;
    
    try {
        await initDB();
        await loadFavorites();
    } catch (error) {
        console.error("Failed to initialize database or load favorites:", error);
        showMessage("無法載入收藏資料庫", true);
    }

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
    
    addEventListeners();
    startLoadingSequence();
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
        });
    });

    imageModal.addEventListener('click', () => imageModal.classList.remove('show'));
    storyModal.addEventListener('click', (e) => { if (e.target === storyModal) storyModal.classList.remove('show'); });
    generateOneBtn.addEventListener('click', () => handleImageGeneration(1));
    generateFourBtn.addEventListener('click', () => handleImageGeneration(4));
    favoritesBtn.addEventListener('click', openSlideshow);
    musicControl.addEventListener('click', toggleMusic);

    slideshowModal.addEventListener('click', (e) => {
        if(e.target === slideshowModal) slideshowModal.classList.remove('show');
    });
    document.getElementById('slideshow-close').addEventListener('click', () => slideshowModal.classList.remove('show'));
    document.getElementById('slideshow-unfavorite').addEventListener('click', unfavoriteCurrentSlide);
    document.getElementById('slideshow-next').addEventListener('click', () => navigateSlideshow(1));
    document.getElementById('slideshow-prev').addEventListener('click', () => navigateSlideshow(-1));
    document.addEventListener('keydown', (e) => {
        if (slideshowModal.classList.contains('show')) {
            if (e.key === 'ArrowRight') navigateSlideshow(1);
            if (e.key === 'ArrowLeft') navigateSlideshow(-1);
            if (e.key === 'Escape') slideshowModal.classList.remove('show');
        }
    });
    
    const slider = document.getElementById('slideshow-container');
    if (slider) {
        let touchstartX = 0;
        let touchendX = 0;
        slider.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        slider.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX - 50) navigateSlideshow(1);
            if (touchendX > touchstartX + 50) navigateSlideshow(-1);
        }, { passive: true });
    }
}

function startLoadingSequence() {
    // 您可以在此處自由增加或減少圖片數量
    const silhouettes = [
        'data/images/g/g1.jpg',
        'data/images/g/g2.jpg',
        'data/images/g/g3.jpg',
        'data/images/g/g4.jpg',
        'data/images/g/g5.jpg',
        'data/images/g/g6.jpg',
        'data/images/g/g7.png',
        'data/images/g/g8.png',
        'data/images/g/g9.png', 
    ];

    // 動態生成 HTML
    silhouetteContainer.innerHTML = silhouettes.map(src => `<img src="${src}" class="loading-silhouette" alt="Loading Muse">`).join('');
    
    const silhouetteElements = document.querySelectorAll('.loading-silhouette');
    if (silhouetteElements.length === 0) {
        generateInitialImages();
        return;
    }

    // --- 動態動畫邏輯 ---
    const animationStep = 3;      // 每張圖片輪播的間隔時間
    const overlapTime = 0.5;      // 新舊圖片重疊(交叉淡化)的時間
    const fadeInTime = 0.5;       // 單張圖片淡入所需時間

    const totalDuration = silhouetteElements.length * animationStep; // 計算總動畫時間

    // 根據總時長和設定，計算動畫關鍵影格的百分比
    const fadeInEndPercent = (fadeInTime / totalDuration) * 100;
    const fadeOutStartPercent = (animationStep / totalDuration) * 100;
    const fadeOutEndPercent = ((animationStep + overlapTime) / totalDuration) * 100;

    // 建立關鍵影格的 CSS 規則字串
    const keyframes = `
    @keyframes graceful-crossfade {
        0% {
            opacity: 0;
            transform: scale(0.98);
        }
        ${fadeInEndPercent}% {
            opacity: 1;
            transform: scale(1);
        }
        ${fadeOutStartPercent}% {
            opacity: 1;
            transform: scale(1);
        }
        ${fadeOutEndPercent}% {
            opacity: 0;
            transform: scale(0.98);
        }
        100% {
            opacity: 0;
            transform: scale(0.98);
        }
    }`;

    // 將動態生成的 CSS 規則注入到 <head> 中
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = keyframes;
    document.head.appendChild(styleSheet);

    // 將動畫屬性應用到每一個圖片元素上
    silhouetteElements.forEach((el, index) => {
        el.style.animationName = 'graceful-crossfade'; // 使用我們新建立的動畫
        el.style.animationDelay = `${index * animationStep}s`;
        el.style.animationDuration = `${totalDuration}s`;
    });
    
    generateInitialImages();
}

async function generateInitialImages() {
    for (let i = 0; i < styles.length; i++) {
        const style = styles[i];
        loadingText.textContent = `正在遇見第 ${i + 1} 位女神... (${style.title})`;
        try {
            const imageUrl = await generateImageWithRetry(style.prompt);
            const gallery = document.getElementById(`${style.id}-gallery`);
            const imageCard = createImageCard({ src: imageUrl, style: style, id: generateUniqueId() });
            gallery.appendChild(imageCard);
        } catch(error) {
            console.error(`初始化圖片失敗 (${style.title}):`, error);
            showMessage(`初始化 ${style.title} 失敗`, true);
        } finally {
            if (i < styles.length - 1) {
                 await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }
    
    loadingText.textContent = '邂逅即將開始...';
    setTimeout(() => {
        loadingOverlay.classList.add('hidden');
        generateOneBtn.disabled = false;
        generateFourBtn.disabled = false;
    }, 1000);
}

function createImageCard(imageData) {
    const { src, style, id } = imageData;
    const imageCard = document.createElement('div');
    imageCard.className = 'image-card';
    imageCard.dataset.id = id;

    const isLiked = favorites.some(fav => fav.id === id);

    imageCard.innerHTML = `
        <div class="flipper">
            <div class="card-face card-front">
                 <div class="loader"></div>
            </div>
            <div class="card-face card-back">
                <div class="image-card-img-wrapper">
                    <img src="${src}" alt="${style.title} AI 生成圖片" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/400x600/ff0000/ffffff?text=Load+Error';">
                </div>
                <div class="card-footer">
                     <button class="story-btn">生成故事 ✨</button>
                     <button class="like-btn ${isLiked ? 'liked' : ''}">♥</button>
                </div>
            </div>
        </div>
    `;

    const img = imageCard.querySelector('img');
    const cardFront = imageCard.querySelector('.card-front');
    
    img.onload = () => {
        cardFront.style.display = 'none';
        imageCard.classList.add('reveal');
    };
    img.onerror = () => {
         imageCard.querySelector('.flipper').innerHTML = '<p class="text-red-400 p-4 text-center">圖片載入失敗</p>';
    };

    imageCard.addEventListener('click', (e) => {
        if (e.target.closest('.story-btn')) {
            e.stopPropagation();
            handleStoryGeneration(style, e.target.closest('.image-card'));
        } else if (e.target.closest('.like-btn')) {
            e.stopPropagation();
            toggleFavorite(imageData, e.target.closest('.like-btn'));
        } else if (e.target.closest('.image-card-img-wrapper')) {
            modalImage.src = src;
            imageModal.classList.add('show');
        }
    });

    return imageCard;
}

async function handleImageGeneration(count = 1) {
    if (isGenerating) return;
    sounds.start();
    isGenerating = true;
    generateOneBtn.disabled = true;
    generateFourBtn.disabled = true;
    
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
            const imageUrl = await generateImageWithRetry(style.prompt);
            const imageData = { src: imageUrl, style: style, id: generateUniqueId() };
            const imageCard = createImageCard(imageData);
            loadingCards[i].replaceWith(imageCard);
            sounds.success();
        } catch (error) {
            console.error('圖片生成失敗:', error);
            loadingCards[i].innerHTML = `<p class="text-red-400 text-center p-4">哎呀，女神走丟了...<br>請稍後再試</p>`;
        }
        if (count > 1 && i < count - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    showMessage(`完成了 ${count} 次新的邂逅！`);

    isGenerating = false;
    generateOneBtn.disabled = false;
    generateFourBtn.disabled = false;
}

async function handleStoryGeneration(style, cardElement) {
    if (isStoryGenerating) return;
    isStoryGenerating = true;
    storyTextEl.innerHTML = '<div class="loader mx-auto"></div>';
    ttsBtn.disabled = true;
    storyModal.classList.add('show');
    
    try {
        const storyPrompt = `以繁體中文，為一張風格為「${style.title}」的女性照片，寫一段約150字的短篇故事或情境描述。請用充滿想像力且感性的筆觸，描述她的背景、心情或一個正在發生的瞬間。`;
        const story = await callTextGenerationAPI(storyPrompt);
        storyTextEl.textContent = story;
        ttsBtn.disabled = false;
    } catch (error) {
        console.error('故事生成失敗:', error);
        storyTextEl.textContent = '故事的靈感暫時枯竭了，請稍後再試。';
    } finally {
        isStoryGenerating = false;
    }

    ttsBtn.onclick = () => {
        if(storyTextEl.textContent) handleTTSGeneration(storyTextEl.textContent);
    };
}

async function handleTTSGeneration(text) {
    if (isTtsGenerating) return;
    isTtsGenerating = true;
    ttsBtn.textContent = '聲音合成中...';
    ttsBtn.disabled = true;
    
    try {
        const { audioData, sampleRate } = await callTTSAPI(text);
        const pcmData = base64ToArrayBuffer(audioData);
        const pcm16 = new Int16Array(pcmData);
        const wavBlob = pcmToWav(pcm16, sampleRate);
        const audioUrl = URL.createObjectURL(wavBlob);
        ttsAudio.src = audioUrl;
        ttsAudio.play();
    } catch (error) {
        console.error('TTS 生成失敗:', error);
        showMessage('語音功能暫時無法使用', true);
    } finally {
        isTtsGenerating = false;
        ttsBtn.textContent = '聆聽故事';
        ttsBtn.disabled = false;
    }
}

// --- Favorites & Slideshow Logic (UPGRADED to IndexedDB) ---
async function toggleFavorite(imageData, btn) {
    sounds.like();

    const index = favorites.findIndex(fav => fav.id === imageData.id);
    
    if (index > -1) {
        // --- Remove from favorites ---
        const idToRemove = favorites[index].id;
        favorites.splice(index, 1); // Optimistically update UI
        if(btn) btn.classList.remove('liked');
        updateFavoritesCount();

        const tx = db.transaction('favorites', 'readwrite');
        const store = tx.objectStore('favorites');
        store.delete(idToRemove);
        await tx.done;
        console.log(`已從 IndexedDB 移除收藏： ${idToRemove}`);

    } else {
        // --- Add to favorites ---
        favorites.push(imageData); // Optimistically update UI
        if(btn) btn.classList.add('liked');
        updateFavoritesCount();

        const tx = db.transaction('favorites', 'readwrite');
        const store = tx.objectStore('favorites');
        store.put(imageData);
        await tx.done;
        console.log(`已新增收藏至 IndexedDB： ${imageData.id}`);
    }
}

async function loadFavorites() {
    return new Promise((resolve, reject) => {
        if (!db) {
            reject("Database not initialized.");
            return;
        }
        const tx = db.transaction('favorites', 'readonly');
        const store = tx.objectStore('favorites');
        const request = store.getAll();

        request.onsuccess = () => {
            favorites = request.result;
            updateFavoritesCount();
            resolve();
        };

        request.onerror = (event) => {
            console.error("Failed to load favorites from DB:", event.target.error);
            favorites = [];
            updateFavoritesCount();
            reject(event.target.error);
        };
    });
}

function updateFavoritesCount() {
    if(favoritesCountEl) {
        console.log(`正在更新收藏計數，目前總數為：${favorites.length}`);
        favoritesCountEl.textContent = favorites.length;
    }
}

function openSlideshow() {
    if (favorites.length === 0) {
        showMessage('您的女神殿堂還是空的喔！');
        return;
    }
    sounds.open();
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
    }, 250);
}

function showSlide(index) {
    if(index < 0 || index >= favorites.length) {
        slideshowModal.classList.remove('show');
        return;
    };
    currentSlideshowIndex = index;
    slideshowImage.src = favorites[index].src;
    slideshowImage.onload = () => slideshowImage.classList.add('visible');
    
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
    const activeThumb = document.querySelector(`.thumbnail[data-index='${index}']`);
    if(activeThumb) activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

function renderThumbnails() {
    thumbnailBar.innerHTML = '';
    const emptyState = document.getElementById('favorites-empty-state');
    if (favorites.length === 0) {
        if(emptyState) emptyState.style.display = 'flex';
        return;
    }
    if(emptyState) emptyState.style.display = 'none';

    favorites.forEach((fav, index) => {
        const thumb = document.createElement('img');
        thumb.src = fav.src;
        thumb.className = 'thumbnail';
        thumb.dataset.index = index;
        thumb.onclick = () => {
            slideshowImage.classList.remove('visible');
            setTimeout(() => showSlide(index), 250);
        };
        thumbnailBar.appendChild(thumb);
    });
}

async function unfavoriteCurrentSlide() {
    if (favorites.length === 0) return;
    const currentFavorite = favorites[currentSlideshowIndex];
    
    await toggleFavorite(currentFavorite, null);

    const cardInGallery = document.querySelector(`.image-card[data-id='${currentFavorite.id}']`);
    if (cardInGallery) {
        cardInGallery.querySelector('.like-btn').classList.remove('liked');
    }
    
    if (favorites.length === 0) {
        slideshowModal.classList.remove('show');
    } else {
        // Adjust index before re-rendering
        if (currentSlideshowIndex >= favorites.length) {
            currentSlideshowIndex = favorites.length - 1;
        }
        renderThumbnails();
        showSlide(currentSlideshowIndex);
    }
}

// --- API Call Logic ---
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function getRandomItems(arr, count) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

async function generateImageWithRetry(prompt, retries = 3, delay = 1000) {
     const enhancedPrompt = `${prompt}, ${getRandomItems(randomKeywords.hair, 1)}, ${getRandomItems(randomKeywords.outfit, 2).join(', ')}, ${getRandomItems(randomKeywords.setting, 1)}, ${getRandomItems(randomKeywords.artStyle, 1)}, ${getRandomItems(randomKeywords.bodyDetails, 2).join(', ')}, ${getRandomItems(randomKeywords.expression, 1)}, ${getRandomItems(randomKeywords.mood, 1)}.`;
    const fullPrompt = `masterpiece, best quality, ultra-detailed, photorealistic, 8k, sharp focus, detailed beautiful face. ${enhancedPrompt} aspect ratio 2:3, raw style. Negative prompt: ugly, blurry, bad anatomy, disfigured, poorly drawn face, mutation, mutated, extra limb, dull eyes, bad hands, missing fingers, low quality, jpeg artifacts, text, watermark, signature, cartoon, 3d, deformed.`;

    for (let i = 0; i < retries; i++) {
        try {
            return await callImageGenerationAPI(fullPrompt);
        } catch (error) {
            if (error.message.includes("429")) {
                console.warn("觸發速率限制，延長等待時間...");
                await new Promise(res => setTimeout(res, 6000)); 
            }
            if (i === retries - 1) throw error;
            console.log(`第 ${i + 1} 次重試...`);
            await new Promise(res => setTimeout(res, delay * Math.pow(2, i)));
        }
    }
}

async function callImageGenerationAPI(userPrompt) {
    if (apiKey === "") {
        console.warn("正在使用佔位圖片。請替換 API 金鑰並實作安全的後端呼叫。");
        await new Promise(res => setTimeout(res, 1000)); // 模擬網路延遲
        return `https://placehold.co/400x600/2d3748/e2e8f0?text=${encodeURIComponent(userPrompt.slice(0,20))}`;
    }

    const selectedModel = document.getElementById('model-select').value;
    let apiUrl, payload;

    if (selectedModel === 'imagen-3') {
        apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
        const [prompt, negative_prompt] = userPrompt.split("Negative prompt:");
        payload = {
            instances: [{ prompt: prompt.trim(), negative_prompt: (negative_prompt || "").trim() }],
            parameters: { "sampleCount": 1 }
        };
    } else { 
        apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${apiKey}`;
        const cleanedPrompt = userPrompt.split("Negative prompt:")[0].trim();
        payload = {
            contents: [{ parts: [{ text: cleanedPrompt }] }],
            generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
        };
    }

    const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error(`API 請求失敗，狀態碼：${response.status}. 回應: ${await response.text()}`);
    const result = await response.json();
    if (Object.keys(result).length === 0) throw new Error('API 回應了一個空物件');
    
    let base64Data;
    if (selectedModel === 'imagen-3') base64Data = result.predictions?.[0]?.bytesBase64Encoded;
    else base64Data = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;

    if (base64Data) return `data:image/png;base64,${base64Data}`;
    else {
        console.error("API 回應中未找到圖片資料。 完整回應:", JSON.stringify(result, null, 2));
        throw new Error('API 回應中未找到有效的圖片資料。');
    }
}

async function callTextGenerationAPI(prompt) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
    const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error(`文字 API 請求失敗: ${response.status}`);
    const result = await response.json();
    if (result.candidates && result.candidates.length > 0) return result.candidates[0].content.parts[0].text;
    else throw new Error('文字 API 未返回有效的內容。');
}

async function callTTSAPI(text) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ parts: [{ text: `請用溫柔、富有磁性的年輕女性聲音朗讀以下內容：${text}` }] }],
        generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zubenelgenubi" } }
            }
        },
        model: "gemini-2.5-flash-preview-tts"
    };
    const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error(`TTS API 請求失敗: ${response.status}`);
    const result = await response.json();
    const part = result?.candidates?.[0]?.content?.parts?.[0];
    if (part?.inlineData?.data && part?.inlineData?.mimeType.startsWith("audio/")) {
        return {
            audioData: part.inlineData.data,
            sampleRate: parseInt(part.inlineData.mimeType.match(/rate=(\d+)/)[1], 10)
        };
    } else {
        throw new Error('TTS API 未返回有效的音訊資料。');
    }
}

// --- Utility & Background Animation ---
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
    const bitsPerSample = 16;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const byteRate = sampleRate * blockAlign;
    const dataSize = pcmData.length * (bitsPerSample / 8);
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);
    function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);
    for (let i = 0; i < pcmData.length; i++) {
        view.setInt16(44 + i * 2, pcmData[i], true);
    }
    return new Blob([view], { type: 'audio/wav' });
}

const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');
let particlesArray;

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size; this.color = color;
    }
    draw() {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); ctx.fillStyle = this.color; ctx.fill();
    }
    update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function initParticles() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * .4) - .2;
        let directionY = (Math.random() * .4) - .2;
        let color = 'rgba(139, 92, 246, 0.3)';
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
}

window.addEventListener('resize', () => {
    canvas.width = innerWidth; canvas.height = innerHeight; initParticles();
});

// --- Loading Petal Animation ---
const loadingCanvas = document.getElementById('loading-canvas');
const loadingCtx = loadingCanvas.getContext('2d');
let petals = [];

function resizeLoadingCanvas() {
    loadingCanvas.width = window.innerWidth;
    loadingCanvas.height = window.innerHeight;
}

class Petal {
    constructor() {
        this.x = Math.random() * loadingCanvas.width;
        this.y = Math.random() * loadingCanvas.height * 2 - loadingCanvas.height;
        this.w = 20 + Math.random() * 15;
        this.h = 15 + Math.random() * 10;
        this.opacity = this.w / 35;
        this.xSpeed = 1 + Math.random();
        this.ySpeed = 0.5 + Math.random() * 0.5;
        this.flip = Math.random();
        this.flipSpeed = Math.random() * 0.03;
    }
    draw() {
        if (this.y > loadingCanvas.height || this.x > loadingCanvas.width) {
            this.x = -this.w;
            this.y = Math.random() * loadingCanvas.height * 2 - loadingCanvas.height;
        }
        loadingCtx.globalAlpha = this.opacity;
        loadingCtx.beginPath();
        loadingCtx.moveTo(this.x, this.y);
        loadingCtx.bezierCurveTo(this.x + this.w / 2, this.y - this.h / 2, this.x + this.w, this.y, this.x + this.w / 2, this.y + this.h / 2);
        loadingCtx.closePath();
        const grad = loadingCtx.createLinearGradient(this.x, this.y, this.x + this.w, this.y + this.h);
        grad.addColorStop(0, 'rgba(255, 192, 203, 0.8)'); // Pink
        grad.addColorStop(1, 'rgba(236, 72, 153, 0.5)'); // Deeper Pink
        loadingCtx.fillStyle = grad;
        loadingCtx.fill();
    }
    animate() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        this.flip += this.flipSpeed;
        this.draw();
    }
}

function animateLoading() {
    if (!loadingOverlay.classList.contains('hidden')) {
        loadingCtx.clearRect(0, 0, loadingCanvas.width, loadingCanvas.height);
        petals.forEach(petal => petal.animate());
        requestAnimationFrame(animateLoading);
    }
}

// --- Music Player ---
function setupMusic() {
    const synth = new Tone.FMSynth({
        harmonicity: 3.01,
        modulationIndex: 14,
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 1 },
        modulation: { type: "sine" },
        modulationEnvelope: { attack: 0.01, decay: 0.5, sustain: 0, release: 0.5 }
    }).toDestination();
    const reverb = new Tone.Reverb({ decay: 8, wet: 0.4 }).toDestination();
    synth.connect(reverb);
    
    const notes = ["C4", "E4", "G4", "A4", "F4", "D4", "B3"];
    let noteIndex = 0;
    
    musicPlayer = new Tone.Loop(time => {
        let note = notes[noteIndex % notes.length];
        synth.triggerAttackRelease(note, "8n", time);
        noteIndex++;
    }, "2n").start(0);
}

function toggleMusic() {
    if (!musicPlayer) {
        setupMusic();
    }
    if (isMusicPlaying) {
        Tone.Transport.pause();
        musicOnIcon.style.display = 'none';
        musicOffIcon.style.display = 'block';
    } else {
        Tone.Transport.start();
        musicOnIcon.style.display = 'block';
        musicOffIcon.style.display = 'none';
    }
    isMusicPlaying = !isMusicPlaying;
}

// --- Initialization ---
document.body.addEventListener('click', () => { 
    Tone.start(); 
    // Automatically start music on first interaction if it's not already playing
    if (!isMusicPlaying && !musicPlayer) {
        toggleMusic();
    }
}, { once: true });

window.onload = () => {
    initializeUI();
    initParticles();
    animateParticles();

    // Start loading petal animation
    resizeLoadingCanvas();
    for(let i = 0; i < 30; i++) { petals.push(new Petal()); }
    animateLoading();
};
