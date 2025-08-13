// state.js - 定義應用程式的初始狀態結構

import { serviceKeys } from './app-config.js';
import { styles } from './game-config.js';

export function getInitialState() {
    const storedApiKey = localStorage.getItem('userGeminiApiKey');
    const hasUserApiKey = !!storedApiKey;
    
    // ✨ NEW: 從 localStorage 讀取使用者的畫質設定，若無則預設為 'thumbnail'
    const storedImageQuality = localStorage.getItem('userImageQuality');

    return {
        isGenerating: false,
        activeStyleId: styles[0].id,
        isStoryGenerating: false,
        isTtsGenerating: false,
        favorites: null,
        ownGoddessStreak: 0,
        touchStartX: 0,
        touchEndX: 0,
        currentSlideshowIndex: 0,
        currentTheme: 'night',
        userApiKey: storedApiKey || serviceKeys.defaultApiKey,
        hasUserApiKey: hasUserApiKey || !!serviceKeys.defaultApiKey,
        imageQuality: storedImageQuality || 'thumbnail', // 'thumbnail' 或 'original'
    };
}
