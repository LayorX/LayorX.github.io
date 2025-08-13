// state.js - 定義應用程式的初始狀態結構

import { apiKey, styles } from './gconfig.js';

/**
 * 獲取應用程式的初始狀態。
 * 這個函式會在主程式啟動時被呼叫一次。
 */
export function getInitialState() {
    const storedApiKey = localStorage.getItem('userGeminiApiKey');
    const hasUserApiKey = !!storedApiKey;

    return {
        isGenerating: false,
        activeStyleId: styles[0].id,
        isStoryGenerating: false,
        isTtsGenerating: false,
        favorites: null, // 初始為 null，表示尚未從 Firebase 載入
        ownGoddessStreak: 0,
        touchStartX: 0,
        touchEndX: 0,
        currentSlideshowIndex: 0,
        currentTheme: 'night',
        userApiKey: storedApiKey || apiKey, // 優先使用儲存的 key
        hasUserApiKey: hasUserApiKey || !!apiKey, // 如果有儲存的或預設的 key，則為 true
    };
}
