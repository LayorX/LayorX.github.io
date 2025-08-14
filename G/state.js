// state.js - 定義應用程式的初始狀態結構

import { serviceKeys } from './app-config.js';
import { styles } from './game-config.js';

export function getInitialState() {
    const storedApiKey = localStorage.getItem('userGeminiApiKey');
    
    // ✨ FIX: 修正判斷邏輯。`hasUserApiKey` 應該只在使用者明確儲存了自己的 key 時才為 true。
    // 系統預設的 key 不應被視為使用者自己的 key。
    const hasUserApiKey = !!storedApiKey;

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
        // `userApiKey` 的邏輯不變：優先使用使用者的，若無則用預設的
        userApiKey: storedApiKey || serviceKeys.defaultApiKey,
        // `hasUserApiKey` 的邏輯修正：只根據使用者是否儲存過來判斷
        hasUserApiKey: hasUserApiKey,
        imageQuality: storedImageQuality || 'thumbnail', // 'thumbnail' 或 'original'
        isAppInitialized: false, // ✨ NEW: 新增 App 是否初始化完成的狀態旗標
    };
}
