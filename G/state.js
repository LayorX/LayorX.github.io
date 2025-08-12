// state.js - 統一管理應用程式的共享狀態

import { apiKey, styles } from './gconfig.js';

// 初始化一個預設的結構，真實數值將由 initState 函式填入
let _state = {
    isGenerating: false,
    activeStyleId: styles[0].id,
    isStoryGenerating: false,
    isTtsGenerating: false,
    favorites: [], // 確保始終是一個陣列
    ownGoddessStreak: 0,
    touchStartX: 0,
    touchEndX: 0,
    currentSlideshowIndex: 0,
    currentTheme: 'night',
    userApiKey: null, // 初始為 null
    hasUserApiKey: false,
};

/**
 * ✨ NEW: 明確的初始化函式
 * 這個函式必須在應用程式啟動時首先被呼叫
 */
export function initState() {
    const storedApiKey = localStorage.getItem('userGeminiApiKey');
    if (storedApiKey) {
        _state.userApiKey = storedApiKey;
        _state.hasUserApiKey = true;
    } else {
        _state.userApiKey = apiKey; // 從 gconfig.js 讀取預設金鑰
        // 如果預設金鑰也為空，hasUserApiKey 會是 false
        _state.hasUserApiKey = !!apiKey; 
    }
    console.log("State initialized. API key has been loaded into state.");
}

/**
 * 獲取一個或多個狀態
 * @param {string[]} keys - 想要獲取的狀態 key 陣列
 * @returns {object} - 包含所請求狀態的物件
 */
export function getState(...keys) {
    if (keys.length === 1) {
        return _state[keys[0]];
    }
    const requestedState = {};
    for (const key of keys) {
        requestedState[key] = _state[key];
    }
    return requestedState;
}

/**
 * 更新一個或多個狀態
 * @param {object} newState - 包含要更新的 key-value 的物件
 */
export function setState(newState) {
    _state = { ..._state, ...newState };
}
