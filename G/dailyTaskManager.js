// dailyTaskManager.js - 統一管理所有每日重置的任務 (重構版)

import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { gameSettings } from './gconfig.js';

// --- 私有類別，用於封裝單一每日任務的邏輯 ---
class DailyTask {
    /**
     * @param {string} taskName 任務名稱 (對應 config 中的 key)
     * @param {Firestore} db Firestore 實例
     * @param {string} userId 使用者 ID
     */
    constructor(taskName, db, userId) {
        this.name = taskName;
        this.db = db;
        this.userId = userId;
        this.defaultCount = gameSettings.dailyLimits[taskName];
        this.state = {
            count: this.defaultCount,
            lastUpdate: null,
        };
        this.docRef = doc(this.db, 'users', userId, 'dailyTasks', this.name);
        this.isInitialized = false; // 標記是否已從 DB 同步過狀態
    }

    /**
     * 核心方法：檢查並可能重置計數，確保本地狀態與雲端同步
     */
    async #checkAndSync() {
        // 如果已經初始化過，並且日期是今天，則無需重複讀取 DB
        if (this.isInitialized && this.state.lastUpdate === new Date().toISOString().split('T')[0]) {
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        const docSnap = await getDoc(this.docRef);

        if (docSnap.exists()) {
            const dbState = docSnap.data();
            if (dbState.lastUpdate === today) {
                // DB 狀態是今天的，直接同步
                this.state = dbState;
            } else {
                // DB 狀態是過去的，執行每日重置邏輯
                const newCount = Math.max(dbState.count, this.defaultCount);
                this.state.count = newCount;
                this.state.lastUpdate = today;
                await this.#save(); // 將重置後的狀態存回
            }
        } else {
            // 該使用者首次執行此任務，初始化狀態並儲存
            this.state.count = this.defaultCount;
            this.state.lastUpdate = today;
            await this.#save();
        }
        this.isInitialized = true;
    }

    /**
     * 將當前狀態儲存到 Firestore
     */
    async #save() {
        await setDoc(this.docRef, this.state);
    }

    // --- 公開方法 ---

    async getCount() {
        await this.#checkAndSync();
        return this.state.count;
    }

    async use() {
        await this.#checkAndSync();
        if (this.state.count > 0) {
            this.state.count--;
            await this.#save();
            return true;
        }
        return false;
    }

    async add(amount) {
        await this.#checkAndSync();
        this.state.count += amount;
        await this.#save();
        return this.state.count;
    }
}


// --- 管理器模組 ---

/** @type {Object.<string, DailyTask>} */
const tasks = {}; // 用於存放所有 DailyTask 實例

/**
 * 初始化管理器，為 config 中定義的每個任務創建一個 DailyTask 實例
 * @param {Firestore} firestoreInstance 
 * @param {string} uid 
 */
export function initDailyTaskManager(firestoreInstance, uid) {
    if (!firestoreInstance || !uid) {
        console.error("Firestore instance or UID is missing for DailyTaskManager initialization.");
        return;
    }
    for (const taskName in gameSettings.dailyLimits) {
        tasks[taskName] = new DailyTask(taskName, firestoreInstance, uid);
    }
}

// --- 公開 API ---

/**
 * 獲取指定任務的剩餘次數
 * @param {string} taskName - The name of the task.
 * @returns {Promise<number>} - The remaining count for the task.
 */
export async function getTaskCount(taskName) {
    if (!tasks[taskName]) throw new Error(`Daily task "${taskName}" is not defined.`);
    return tasks[taskName].getCount();
}

/**
 * 嘗試使用一次指定任務的次數
 * @param {string} taskName - The name of the task.
 * @returns {Promise<boolean>} - True if the count was successfully decremented, false otherwise.
 */
export async function useTask(taskName) {
    if (!tasks[taskName]) throw new Error(`Daily task "${taskName}" is not defined.`);
    return tasks[taskName].use();
}

/**
 * 增加指定任務的次數
 * @param {string} taskName - The name of the task.
 * @param {number} amount - The amount to add.
 * @returns {Promise<number>} - The new count after adding.
 */
export async function addTaskCount(taskName, amount) {
    if (!tasks[taskName]) throw new Error(`Daily task "${taskName}" is not defined.`);
    return tasks[taskName].add(amount);
}
