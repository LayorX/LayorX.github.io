// dailyTaskManager.js - 統一管理所有每日重置的任務 (重構版)

import { getFirestore, doc, getDoc, setDoc, writeBatch } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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
        this.isInitialized = false;
    }

    async #checkAndSync() {
        if (this.isInitialized && this.state.lastUpdate === new Date().toISOString().split('T')[0]) {
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        const docSnap = await getDoc(this.docRef);

        if (docSnap.exists()) {
            const dbState = docSnap.data();
            if (dbState.lastUpdate === today) {
                this.state = dbState;
            } else {
                // 執行每日重置，但不讓次數低於預設值
                const newCount = Math.max(dbState.count, this.defaultCount);
                this.state.count = newCount;
                this.state.lastUpdate = today;
                await this.#save();
            }
        } else {
            // 該使用者首次執行此任務，或資料遷移後首次執行
            this.state.count = this.defaultCount;
            this.state.lastUpdate = today;
            await this.#save();
        }
        this.isInitialized = true;
    }

    async #save() {
        await setDoc(this.docRef, this.state);
    }

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

// --- ✨ NEW: 資料遷移邏輯 ---
/**
 * 檢查舊的 'status' 集合，並將資料遷移到新的 'dailyTasks' 集合
 * @param {Firestore} db Firestore 實例
 * @param {string} userId 使用者 ID
 */
async function migrateOldData(db, userId) {
    console.log(`開始為使用者 ${userId} 進行資料遷移...`);
    // 1. 定義舊資料的路徑
    const oldGachaRef = doc(db, 'users', userId, 'status', 'gacha');
    const oldTtsRef = doc(db, 'users', userId, 'status', 'tts');

    // 2. 一次性獲取所有舊資料
    const [gachaSnap, ttsSnap] = await Promise.all([getDoc(oldGachaRef), getDoc(oldTtsRef)]);

    // 3. 準備批次寫入，確保操作的原子性
    const batch = writeBatch(db);
    const today = new Date().toISOString().split('T')[0];

    // 4. 處理扭蛋次數 (如果舊資料存在，則使用；否則用預設值)
    const gachaCount = gachaSnap.exists() ? gachaSnap.data().count : gameSettings.dailyLimits.gacha;
    const newGachaRef = doc(db, 'users', userId, 'dailyTasks', 'gacha');
    batch.set(newGachaRef, { count: gachaCount, lastUpdate: today });

    // 5. 處理 TTS 次數
    const ttsCount = ttsSnap.exists() ? ttsSnap.data().count : gameSettings.dailyLimits.tts;
    const newTtsRef = doc(db, 'users', userId, 'dailyTasks', 'tts');
    batch.set(newTtsRef, { count: ttsCount, lastUpdate: today });

    // 6. 為其他新的每日任務設定預設值
    const newGenerateOneRef = doc(db, 'users', userId, 'dailyTasks', 'generateOne');
    batch.set(newGenerateOneRef, { count: gameSettings.dailyLimits.generateOne, lastUpdate: today });
    const newGenerateFourRef = doc(db, 'users', userId, 'dailyTasks', 'generateFour');
    batch.set(newGenerateFourRef, { count: gameSettings.dailyLimits.generateFour, lastUpdate: today });

    // 7. 提交所有變更
    await batch.commit();

    // 提示：遷移完成後，可以考慮手動或用腳本刪除舊的 'status' 集合以保持資料庫整潔
    console.log(`使用者 ${userId} 的資料已成功遷移至新的 dailyTasks 結構！`);
}

// --- 管理器模組 ---
const tasks = {};

/**
 * ✨ UPDATE: 初始化函式現在是異步的，並包含遷移檢查
 * @param {Firestore} firestoreInstance 
 * @param {string} uid 
 */
export async function initDailyTaskManager(firestoreInstance, uid) {
    if (!firestoreInstance || !uid) {
        console.error("DailyTaskManager 初始化失敗：缺少 Firestore 實例或使用者 UID。");
        return;
    }

    // 透過檢查一個新結構的文件是否存在，來判斷是否需要遷移
    const checkRef = doc(firestoreInstance, 'users', uid, 'dailyTasks', 'gacha');
    const checkSnap = await getDoc(checkRef);

    if (!checkSnap.exists()) {
        // 如果新文件不存在，代表是全新使用者或需要遷移的使用者
        await migrateOldData(firestoreInstance, uid);
    }

    // 無論是否遷移，都進行標準的初始化流程
    for (const taskName in gameSettings.dailyLimits) {
        tasks[taskName] = new DailyTask(taskName, firestoreInstance, uid);
    }
}

// --- 公開 API (保持不變) ---
export async function getTaskCount(taskName) {
    if (!tasks[taskName]) throw new Error(`每日任務 "${taskName}" 尚未定義。`);
    return tasks[taskName].getCount();
}

export async function useTask(taskName) {
    if (!tasks[taskName]) throw new Error(`每日任務 "${taskName}" 尚未定義。`);
    return tasks[taskName].use();
}

export async function addTaskCount(taskName, amount) {
    if (!tasks[taskName]) throw new Error(`每日任務 "${taskName}" 尚未定義。`);
    return tasks[taskName].add(amount);
}
