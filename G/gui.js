// ui.js - 專門處理所有與 UI 畫面相關的功能

// --- DOM Elements ---
const favoritesCountEl = document.getElementById('favorites-count');

// --- Message Box ---
const messageBox = document.getElementById('message-box');
export function showMessage(text, isError = false) {
    messageBox.textContent = text;
    messageBox.style.backgroundColor = isError ? '#E11D48' : '#EC4899';
    messageBox.classList.add('show');
    setTimeout(() => messageBox.classList.remove('show'), 3000);
}

// --- UI Updates ---
export function updateFavoritesCountUI(count) {
    if (favoritesCountEl) {
        favoritesCountEl.textContent = count;
    }
}

// --- Image Card Factory ---
export function createImageCard(imageData, handlers) {
    const { src, style, id, imageUrl, isLiked, isShared, isShareable = true } = imageData; // ✨ NEW: Destructure isShareable, default to true
    const displaySrc = imageUrl || src; 
    const imageCard = document.createElement('div');
    imageCard.className = 'image-card';
    imageCard.dataset.id = id;

    // ✨ FIX: Conditionally render the share button
    const shareButtonHTML = isShareable 
        ? `<button class="share-btn ${isShared ? 'shared' : ''}" title="分享至公開殿堂">🌐</button>`
        : '';

    imageCard.innerHTML = `
        <div class="flipper">
            <div class="card-face card-front"><div class="loader"></div></div>
            <div class="card-face card-back">
                <div class="image-card-img-wrapper">
                    <img src="${displaySrc}" alt="${style.title} AI 生成圖片" loading="lazy">
                </div>
                <div class="card-footer">
                     <button class="story-btn">生成故事 ✨</button>
                     <div class="card-actions">
                        ${shareButtonHTML}
                        <button class="like-btn ${isLiked ? 'liked' : ''}" title="收藏至私人殿堂">♥</button>
                     </div>
                </div>
            </div>
        </div>
    `;

    const img = imageCard.querySelector('img');
    const flipper = imageCard.querySelector('.flipper');
    img.onload = () => {
        const cardFront = imageCard.querySelector('.card-front');
        if (cardFront) {
            cardFront.style.display = 'none';
        }
        flipper.classList.add('reveal');
    };
    // ✨ FIX: Added console.error for debugging gacha image issues
    img.onerror = () => {
         console.error("圖片載入失敗，請檢查此 URL 是否有效以及 Firebase Storage 權限:", displaySrc);
         flipper.innerHTML = '<p class="text-red-400 p-4 text-center">圖片載入失敗</p>';
    };

    // Attach event handlers from main.js
    imageCard.addEventListener('click', (e) => {
        if (e.target.closest('.story-btn')) {
            e.stopPropagation();
            // Disable story button for placeholder
            if (id === 'vip-placeholder') {
                showMessage('此為預覽卡片，無法生成故事喔！');
                return;
            }
            handlers.onStory(style);
        } else if (e.target.closest('.like-btn')) {
            e.stopPropagation();
            handlers.onLike(imageData, e.target.closest('.like-btn'));
        } else if (e.target.closest('.share-btn')) {
            e.stopPropagation();
            handlers.onShare(imageData, e.target.closest('.share-btn'));
        } else if (e.target.closest('.image-card-img-wrapper')) {
            handlers.onImageClick(displaySrc);
        }
    });

    return imageCard;
}


// --- Background & Loading Animations ---
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
