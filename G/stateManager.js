
// stateManager.js - 統一管理應用程式的響應式共享狀態

// --- 私有狀態與訂閱者 ---
let _state = {}; // 應用程式的單一狀態來源
const _subscribers = {}; // 儲存所有訂閱者回呼函式

// --- 公開 API ---

/**
 * 初始化應用程式的預設狀態
 * @param {object} initialState - 應用程式的初始狀態物件
 */
export function initState(initialState) {
    _state = initialState;
    console.log("State Manager initialized with:", _state);
}

/**
 * 獲取一個或多個狀態的目前值
 * @param {...string} keys - 想要獲取的狀態 key
 * @returns {any|object} - 如果只有一個 key，回傳其值；否則回傳包含所請求狀態的物件
 */
export function getState(...keys) {
    if (keys.length === 1) {
        return _state[keys[0]];
    }
    const requestedState = {};
    for (const key of keys) {
        if (key in _state) {
            requestedState[key] = _state[key];
        } else {
            console.warn(`[State Manager] Attempted to get non-existent state key: "${key}"`);
        }
    }
    return requestedState;
}

/**
 * 更新一個或多個狀態，並通知所有相關的訂閱者
 * @param {object} newState - 包含要更新的 key-value 的物件
 */
export function setState(newState) {
    let changed = false;
    for (const key in newState) {
        if (Object.prototype.hasOwnProperty.call(newState, key)) {
            if (_state[key] !== newState[key]) {
                _state[key] = newState[key];
                changed = true;
                // 通知對應 key 的訂閱者
                if (_subscribers[key]) {
                    _subscribers[key].forEach(callback => {
                        try {
                            callback(_state[key]);
                        } catch (e) {
                            console.error(`[State Manager] Error in subscriber for key "${key}":`, e);
                        }
                    });
                }
            }
        }
    }
    if (changed) {
        // console.log("[State Manager] State changed:", newState);
    }
}

/**
 * 訂閱一個狀態的變化
 * @param {string} key - 要訂閱的狀態 key
 * @param {Function} callback - 當狀態變化時要執行的回呼函式，會接收到新的狀態值
 * @returns {Function} - 一個可以取消訂閱的函式
 */
export function subscribe(key, callback) {
    if (!_subscribers[key]) {
        _subscribers[key] = [];
    }
    _subscribers[key].push(callback);

    // 立即用目前狀態值執行一次回呼
    if (key in _state) {
        try {
            callback(_state[key]);
        } catch (e) {
            console.error(`[State Manager] Error in initial callback for key "${key}":`, e);
        }
    }

    // 回傳取消訂閱的函式
    return () => {
        _subscribers[key] = _subscribers[key].filter(cb => cb !== callback);
    };
}
