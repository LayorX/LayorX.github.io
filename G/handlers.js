// handlers.js - 包含所有核心的事件處理函式

import { saveFavorite, removeFavorite, uploadImage, shareToPublic, getRandomGoddessFromDB, getCurrentUserId, addDislikeToGoddess, updatePublicGoddessVote } from './gfirebase.js';
import { getState, setState } from './stateManager.js';
import { uiMessages, gameSettings, apiSettings, styles } from './game-config.js';
import { showMessage, createImageCard } from './gui.js';
import { updateAllTaskUIs } from './uiManager.js';
import { generateImageWithRetry, callTextGenerationAPI, callTTSAPI } from './api.js';
import { useTask, getTaskCount, addTaskCount } from './dailyTaskManager.js';
import { incrementStat } from './analyticsManager.js';
import { sounds } from './soundManager.js';

// --- Utility Functions ---
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

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

    view.setUint32(0, 0x52494646, false);
    view.setUint32(4, 36 + dataSize, true);
    view.setUint32(8, 0x57415645, false);
    view.setUint32(12, 0x666d7420, false);
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bytesPerSample * 8, true);
    view.setUint32(36, 0x64617461, false);
    view.setUint32(40, dataSize, true);

    const pcm16 = new Int16Array(pcmData.buffer);
    for (let i = 0; i < pcmData.length; i++) {
        view.setInt16(44 + i * 2, pcmData[i], true);
    }

    return new Blob([view], { type: 'audio/wav' });
}


// --- Core Logic Handlers ---
export async function handleImageGeneration(count = 1) {
    if (getState('isGenerating')) return;

    const taskName = count === 1 ? 'generateOne' : 'generateFour';
    const hasUserApiKey = getState('hasUserApiKey');
    
    if (!hasUserApiKey) {
        const remaining = await getTaskCount(taskName);
        if (remaining <= 0) {
            showMessage(uiMessages.generateLimit.message, true);
            return;
        }
        const used = await useTask(taskName);
        if (!used) {
             showMessage(uiMessages.generateLimit.message, true);
            return;
        }
        updateAllTaskUIs();
    }
    
    incrementStat({ [taskName]: count });

    sounds.start();
    setState({ isGenerating: true });
    
    const { activeStyleId, favorites } = getState('activeStyleId', 'favorites');
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
                isLiked: Array.isArray(favorites) && favorites.some(fav => fav.id === newId)
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
    setState({ isGenerating: false });
}

async function handleDislike(imageData, btn) {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
        showMessage("請先登入才能進行評價喔！", true);
        return;
    }

    btn.disabled = true;
    btn.textContent = "傳送評價中...";

    const result = await addDislikeToGoddess(imageData.id, currentUserId);

    if (result.success) {
        incrementStat({ gachaDislikes: 1 });
        
        const milestones = gameSettings.dislikeMilestones;
        if (milestones[result.newCount]) {
            showMessage(milestones[result.newCount]);
        } else {
            showMessage(result.message);
        }
        btn.textContent = "評價已送出 ✅";
    } else {
        showMessage(result.message, true);
        btn.textContent = "評價失敗 ❌";
    }
}

export function getCardHandlers() {
    return {
        onStory: handleStoryGeneration,
        onLike: (imageData, btn) => toggleFavorite(imageData, btn),
        onShare: shareFavoriteToPublicHandler,
        onImageClick: (cardElement) => {
            const originalSrc = cardElement.dataset.originalSrc;
            const modalImage = document.getElementById('modal-image');
            const imageModal = document.getElementById('image-modal');
            
            modalImage.src = originalSrc;
            imageModal.classList.add('show');

            modalImage.onload = () => {
                const galleryImg = cardElement.querySelector('img');
                if (galleryImg && galleryImg.src !== originalSrc) {
                    galleryImg.src = originalSrc;
                }
            };
        },
        onDislike: handleDislike
    };
}

export async function handleStoryGeneration(style) {
    if (getState('isStoryGenerating')) return;
    
    const hasUserApiKey = getState('hasUserApiKey');
    if (!hasUserApiKey) {
        const remaining = await getTaskCount('tts');
        if (remaining <= 0) {
            showMessage(uiMessages.buttons.ttsLimit, true);
            return;
        }
    }
    
    incrementStat({ storyGenerations: 1 });

    setState({ isStoryGenerating: true });
    const storyTextEl = document.getElementById('story-text');
    const storyModal = document.getElementById('story-modal');
    const ttsBtn = document.getElementById('tts-btn');

    storyTextEl.innerHTML = '<div class="loader mx-auto"></div>';
    storyModal.classList.add('show');

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
        setState({ isStoryGenerating: false });
    }
}

export async function handleTTSGeneration(text) {
    if (getState('isTtsGenerating')) return;
    
    const hasUserApiKey = getState('hasUserApiKey');
     if (!hasUserApiKey) {
        const canUse = await useTask('tts');
        if (!canUse) {
            showMessage(uiMessages.buttons.ttsLimit, true);
            updateAllTaskUIs();
            return;
        }
        updateAllTaskUIs();
    }
    
    incrementStat({ ttsGenerations: 1 });

    setState({ isTtsGenerating: true });
    const ttsAudio = document.getElementById('tts-audio');
    
    try {
        const ttsPrompt = apiSettings.prompts.tts(text);
        const { audioData, mimeType } = await callTTSAPI(ttsPrompt);

        const sampleRate = parseInt(mimeType.match(/rate=(\d+)/)[1], 10);
        const pcmData = base64ToArrayBuffer(audioData);
        const pcm16 = new Int16Array(pcmData);
        const wavBlob = pcmToWav(pcm16, sampleRate);
        const audioUrl = URL.createObjectURL(wavBlob);
        ttsAudio.src = audioUrl;
        ttsAudio.play();

    } catch (error) {
        console.error('TTS 生成失敗:', error);
        showMessage(uiMessages.errors.ttsFailed, true);
    } finally {
        setState({ isTtsGenerating: false });
    }
}

export async function toggleFavorite(imageData, btn) {
    if (imageData.id === 'vip-placeholder') {
        showMessage('此為預覽卡片，無法收藏喔！');
        return;
    }
    
    const favorites = getState('favorites');
    const currentUserIdValue = getCurrentUserId();
    
    if (favorites === null || !currentUserIdValue) {
        showMessage("雲端資料同步中或尚未登入，請稍候再試...", true);
        return;
    }

    sounds.like();
    if (btn) btn.disabled = true;

    const index = favorites.findIndex(fav => fav && fav.id === imageData.id);
    
    if (index > -1) {
        incrementStat({ unlikes: 1 });
        try {
            await removeFavorite(favorites[index]);
            await updatePublicGoddessVote(imageData.id, currentUserIdValue, 'unlike');
        } catch (error) {
            console.error("Failed to remove favorite:", error);
            showMessage(uiMessages.favorites.removeFailure, true);
        }
    } else {
        incrementStat({ likes: 1 });
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
            await updatePublicGoddessVote(imageData.id, currentUserIdValue, 'like');

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

export async function shareFavoriteToPublicHandler(imageData, btn) {
    const favorites = getState('favorites');

    if (favorites === null) {
        showMessage("雲端資料同步中，請稍候再試...", true);
        return;
    }

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
            incrementStat({ shares: 1 });
            await addTaskCount('gacha', 1);
            updateAllTaskUIs();
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

export async function unfavoriteCurrentSlide() {
    const { favorites, currentSlideshowIndex } = getState('favorites', 'currentSlideshowIndex');
    if (!Array.isArray(favorites) || favorites.length === 0) return;
    const currentFavorite = favorites[currentSlideshowIndex];
    if (!currentFavorite) return;
    
    incrementStat({ unlikes: 1 });
    try {
        await removeFavorite(currentFavorite);
        showMessage(uiMessages.favorites.removeSuccess);
    } catch (error) {
        console.error("Failed to remove favorite from DB:", error);
        showMessage(uiMessages.favorites.removeFailure, true);
    }
}

export async function drawGacha() {
    const canUse = await useTask('gacha');
    if (!canUse) {
        showMessage("今日扭蛋次數已用完！", true);
        updateAllTaskUIs();
        return;
    }
    updateAllTaskUIs();
    
    incrementStat({ gachaDraws: 1 });

    const gachaDrawBtn = document.getElementById('gacha-draw-btn');
    const gachaResultContainer = document.getElementById('gacha-result-container');
    gachaDrawBtn.disabled = true;
    gachaResultContainer.innerHTML = '<div class="loader"></div>';
    sounds.gacha();

    try {
        const randomGoddess = await getRandomGoddessFromDB();
        
        const currentUid = getCurrentUserId();
        let { ownGoddessStreak, favorites } = getState('ownGoddessStreak', 'favorites');

        if (randomGoddess.sharedBy && randomGoddess.sharedBy === currentUid) {
            ownGoddessStreak++;
            const REQUIRED_STREAK = gameSettings.gachaStreakGoal;
            if (ownGoddessStreak >= REQUIRED_STREAK) {
                await addTaskCount('gacha', 1);
                showMessage(`幸運！連續抽到自己的女神 ${ownGoddessStreak} 次，額外獲得一次召喚！`);
                ownGoddessStreak = 0;
            } else {
                showMessage(`抽到自己的女神！再來 ${REQUIRED_STREAK - ownGoddessStreak} 次可獲獎勵！`);
            }
        } else {
            ownGoddessStreak = 0;
        }
        setState({ ownGoddessStreak });

        // ✨ NEW: 檢查目前使用者是否已經倒讚過這張卡片
        const userHasDisliked = randomGoddess.dislikedBy && randomGoddess.dislikedBy.includes(currentUid);

        const imageData = {
            src: randomGoddess.imageUrl,
            imageUrl: randomGoddess.imageUrl,
            resizedUrl: randomGoddess.resizedUrl,
            style: randomGoddess.style,
            id: randomGoddess.id,
            isLiked: Array.isArray(favorites) && favorites.some(fav => fav.id === randomGoddess.id),
            isGachaCard: true,
            // ✨ NEW: 將統計數據和使用者倒讚狀態傳遞到 UI 層
            likeCount: randomGoddess.likeCount || 0,
            dislikeCount: randomGoddess.dislikeCount || 0,
            userHasDisliked: userHasDisliked
        };
        
        const gachaCard = createImageCard(imageData, getCardHandlers(), { withAnimation: false, withButtons: true });
        gachaResultContainer.innerHTML = '';
        gachaResultContainer.appendChild(gachaCard);

    } catch (error) {
        console.error("Gacha draw failed:", error);
        showMessage(`${uiMessages.gacha.drawFailed}: ${error.message}`, true);
        gachaResultContainer.innerHTML = `<div class="gacha-placeholder"><p>${uiMessages.gacha.drawFailed}...</p><p class="text-xs text-gray-400 mt-2">${error.message}</p></div>`;
    } finally {
        updateAllTaskUIs();
    }
}
