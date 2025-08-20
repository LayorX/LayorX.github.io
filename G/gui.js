// gui.js - 專門處理所有與 UI 畫面相關的功能

import { uiMessages } from './game-config.js';
import { getState } from './stateManager.js';

const favoritesCountEl = document.getElementById('favorites-count');
const messageBox = document.getElementById('message-box');

// ✨ NEW: 特效支援偵測
// 建立一個立即執行的函式來檢查瀏覽器是否支援必要的 3D transform 特性
const supports3D = (() => {
    const el = document.createElement('p');
    document.body.appendChild(el);
    el.style.transformStyle = 'preserve-3d';
    const result = window.getComputedStyle(el).transformStyle === 'preserve-3d';
    document.body.removeChild(el);
    console.log(`Browser 3D transform support: ${result}`);
    return result;
})();


export function showMessage(text, isError = false) {
    messageBox.textContent = text;
    messageBox.style.backgroundColor = isError ? '#E11D48' : '#EC4899';
    messageBox.classList.add('show');
    setTimeout(() => messageBox.classList.remove('show'), 3000);
}

export function updateFavoritesCountUI(count) {
    if (favoritesCountEl) {
        favoritesCountEl.textContent = count;
    }
}

// ✨ MODIFIED: createImageCard 現在會根據特效支援度來決定渲染方式
export function createImageCard(imageData, handlers, options = {}) {
    // 舊手機不支援 withAnimation，強制設為 false
    const { withAnimation = supports3D, withButtons = true } = options;
    
    const { 
        style, id, isLiked, isShared, isShareable = true, isGachaCard = false,
        likeCount = 0, dislikeCount = 0, userHasDisliked = false 
    } = imageData;

    const displaySrc = imageData.resizedUrl || imageData.imageUrl || imageData.src;
    const originalSrc = imageData.imageUrl || imageData.src;

    const imageCard = document.createElement('div');
    imageCard.className = 'image-card';
    imageCard.dataset.id = id;
    imageCard.dataset.originalSrc = originalSrc;

    const dislikeButtonText = userHasDisliked ? '已評價 ✅' : '我覺得不行!...👎';
    const dislikeButtonDisabled = userHasDisliked ? 'disabled' : '';

    let statsTagsHTML = '';
    if (isGachaCard && (likeCount > 0 || dislikeCount > 0)) {
        statsTagsHTML = `
            <div class="stats-tags-container">
                ${likeCount > 0 ? `<span class="stat-tag like-tag">❤️ ${likeCount}</span>` : ''}
                ${dislikeCount > 0 ? `<span class="stat-tag dislike-tag">👎 ${dislikeCount}</span>` : ''}
            </div>
        `;
    }

    const mainButtonHTML = isGachaCard
        ? `<button class="dislike-btn story-btn" ${dislikeButtonDisabled}>${dislikeButtonText}</button>`
        : `<button class="story-btn">生成故事 ✨</button>`;

    const footerHTML = withButtons ? `
        <div class="card-footer">
             ${mainButtonHTML}
             <div class="card-actions">
                ${isShareable && !isGachaCard ? `<button class="share-btn ${isShared ? 'shared' : ''}" title="分享至公開殿堂">🌐</button>` : ''}
                <button class="like-btn ${isLiked ? 'liked' : ''}" title="收藏至私人殿堂">♥</button>
             </div>
        </div>
    ` : '';

    const imageWrapperContent = `
        <img alt="${style ? style.title : 'Gacha Image'}" loading="lazy">
        ${statsTagsHTML} 
    `;

    // 根據是否支援 3D 特效來決定卡片結構
    if (withAnimation) {
        // 豪華版：給支援的瀏覽器
        imageCard.innerHTML = `
            <div class="flipper">
                <div class="card-face card-front"><div class="loader"></div></div>
                <div class="card-face card-back">
                    <div class="image-card-img-wrapper">
                        ${imageWrapperContent}
                    </div>
                    ${footerHTML}
                </div>
            </div>
        `;
    } else {
        // 簡易版：給舊手機
        imageCard.style.opacity = '1';
        imageCard.style.animation = 'none';
        imageCard.innerHTML = `
            <div class="image-card-img-wrapper">
                 ${imageWrapperContent}
            </div>
            ${footerHTML}
        `;
    }

    const img = imageCard.querySelector('img');

    img.onload = () => {
        if (withAnimation) {
            const flipper = imageCard.querySelector('.flipper');
            setTimeout(() => {
                if (flipper) flipper.classList.add('reveal');
            }, 50);
        } else {
            // 簡易版的淡入效果
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s';
            setTimeout(() => { img.style.opacity = '1'; }, 50);
        }
    };

    img.onerror = function() {
        // ... (錯誤處理邏輯不變)
    };

    if (withButtons) {
        // ... (事件綁定邏輯不變)
    }

    img.src = displaySrc;

    return imageCard;
}


// --- Background & Loading Animations ---
// ... (其餘程式碼不變)
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

export function initParticles() {
    if (!canvas) return;
    canvas.width = innerWidth;
    canvas.height = innerHeight;
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

export function animateParticles() {
    if (!canvas) return;
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    if(particlesArray) {
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
    }
}

window.addEventListener('resize', () => {
    initParticles();
});

export class Petal {
    constructor(loadingCanvas) {
        this.canvas = loadingCanvas;
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height * 2 - this.canvas.height;
        this.w = 20 + Math.random() * 15;
        this.h = 15 + Math.random() * 10;
        this.opacity = this.w / 35;
        this.xSpeed = 1 + Math.random();
        this.ySpeed = 0.5 + Math.random() * 0.5;
        this.flip = Math.random();
        this.flipSpeed = Math.random() * 0.03;
    }
    draw() {
        const loadingCtx = this.canvas.getContext('2d');
        if (this.y > this.canvas.height || this.x > this.canvas.width) {
            this.x = -this.w;
            this.y = Math.random() * this.canvas.height * 2 - this.canvas.height;
        }
        loadingCtx.globalAlpha = this.opacity;
        loadingCtx.beginPath();
        loadingCtx.moveTo(this.x, this.y);
        loadingCtx.bezierCurveTo(this.x + this.w / 2, this.y - this.h / 2, this.x + this.w, this.y, this.x + this.w / 2, this.y + this.h / 2);
        loadingCtx.closePath();
        const grad = loadingCtx.createLinearGradient(this.x, this.y, this.x + this.w, this.y + this.h);
        grad.addColorStop(0, 'rgba(255, 192, 203, 0.8)');
        grad.addColorStop(1, 'rgba(236, 72, 153, 0.5)');
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

export function resizeLoadingCanvas(loadingCanvas) {
    if (!loadingCanvas) return;
    loadingCanvas.width = window.innerWidth;
    loadingCanvas.height = window.innerHeight;
}

export function animateLoading(loadingCanvas, petals, loadingOverlay) {
    if (!loadingCanvas || !loadingOverlay) return;
    if (!loadingOverlay.classList.contains('hidden')) {
        const loadingCtx = loadingCanvas.getContext('2d');
        loadingCtx.clearRect(0, 0, loadingCanvas.width, loadingCanvas.height);
        petals.forEach(petal => petal.animate());
        requestAnimationFrame(() => animateLoading(loadingCanvas, petals, loadingOverlay));
    }
}
