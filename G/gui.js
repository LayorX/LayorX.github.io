// gui.js - 專門處理所有與 UI 畫面相關的功能

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
export function createImageCard(imageData, handlers, options = {}) {
    const { withAnimation = true, withButtons = true } = options;
    const { style, id, isLiked, isShared, isShareable = true } = imageData;

    // ✨ FIX: 決定顯示 URL 和原始 URL
    // displaySrc 優先使用縮圖，originalSrc 永遠是原圖
    const displaySrc = imageData.resizedUrl || imageData.imageUrl || imageData.src;
    const originalSrc = imageData.imageUrl || imageData.src;

    const imageCard = document.createElement('div');
    imageCard.className = 'image-card';
    imageCard.dataset.id = id;
    // 將原始 URL 存儲在 dataset 中，以便在出錯時回退
    imageCard.dataset.originalSrc = originalSrc;

    const footerHTML = withButtons ? `
        <div class="card-footer">
             <button class="story-btn">生成故事 ✨</button>
             <div class="card-actions">
                ${isShareable ? `<button class="share-btn ${isShared ? 'shared' : ''}" title="分享至公開殿堂">🌐</button>` : ''}
                <button class="like-btn ${isLiked ? 'liked' : ''}" title="收藏至私人殿堂">♥</button>
             </div>
        </div>
    ` : '';

    if (withAnimation) {
        imageCard.innerHTML = `
            <div class="flipper">
                <div class="card-face card-front"><div class="loader"></div></div>
                <div class="card-face card-back">
                    <div class="image-card-img-wrapper">
                        <img alt="${style.title} AI 生成圖片" loading="lazy">
                    </div>
                    ${footerHTML}
                </div>
            </div>
        `;
    } else {
        imageCard.style.opacity = '1';
        imageCard.style.animation = 'none';
        imageCard.style.position = 'relative';
        imageCard.innerHTML = `
            <div class="image-card-img-wrapper" style="width: 100%; height: 100%;">
                 <img alt="${style ? style.title : 'Gacha Image'}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s;">
            </div>
            ${footerHTML}
        `;
    }

    const img = imageCard.querySelector('img');

    img.onload = () => {
        if (withAnimation) {
            const flipper = imageCard.querySelector('.flipper');
            setTimeout(() => {
                flipper.classList.add('reveal');
            }, 50);
        } else {
            img.style.opacity = '1';
        }
    };

    // ✨ FIX: 實作了強大的 onerror 回退機制
    img.onerror = function() {
        const card = this.closest('.image-card');
        const originalUrlFromData = card.dataset.originalSrc;

        // 如果當前的 src 已經是原始 URL，代表連原始 URL 都載入失敗
        if (this.src === originalUrlFromData) {
            const errorMsg = "圖片載入失敗！";
            console.error(errorMsg, "Failed on both resized and original URL:", originalUrlFromData);
            card.innerHTML = `<p class="text-red-400 p-4 text-center">${errorMsg}</p>`;
        } else {
            // 這是第一次錯誤，代表縮圖載入失敗。現在回退到載入原始 URL。
            console.warn(`Resized image failed, falling back to original: ${originalUrlFromData}`);
            this.src = originalUrlFromData;
        }
    };

    if (withButtons) {
        imageCard.addEventListener('click', (e) => {
            const clickedCard = e.currentTarget;
            if (e.target.closest('.story-btn')) {
                e.stopPropagation();
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
                handlers.onImageClick(clickedCard.dataset.originalSrc);
            }
        });
    } else {
         imageCard.addEventListener('click', (e) => {
             const clickedCard = e.currentTarget;
             if (e.target.closest('.image-card-img-wrapper')) {
                handlers.onImageClick(clickedCard.dataset.originalSrc);
            }
         });
    }

    // 初始載入時，總是先嘗試 displaySrc (優先是縮圖)
    img.src = displaySrc;

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
