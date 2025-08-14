// state.js - 定義應用程式的初始狀態結構

import { serviceKeys } from './app-config.js';
import { styles } from './game-config.js';

export function getInitialState() {
    const storedApiKey = localStorage.getItem('userGeminiApiKey');
    const hasUserApiKey = !!storedApiKey;
    const storedImageQuality = localStorage.getItem('userImageQuality');
    // ✨ NEW: 從 localStorage 讀取已儲存的暱稱
    const storedNickname = localStorage.getItem('userNickname');

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
        hasUserApiKey: hasUserApiKey,
        imageQuality: storedImageQuality || 'thumbnail',
        isAppInitialized: false,
        // ✨ NEW: 新增使用者暱稱狀態
        userNickname: storedNickname || '', 
    };
}
