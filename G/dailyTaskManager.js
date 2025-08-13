import { getFirestore, doc, getDoc, setDoc, writeBatch } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { gameSettings } from './game-config.js';
import { dbCollectionNames } from './app-config.js';

class DailyTask {
    constructor(taskName, db, userId) {
        this.name = taskName;
        this.db = db;
        this.userId = userId;
        this.defaultCount = gameSettings.dailyLimits[taskName];
        this.state = {
            count: this.defaultCount,
            lastUpdate: null,
        };
        this.docRef = doc(this.db, dbCollectionNames.users, userId, dbCollectionNames.dailyTasks, this.name);
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
                const newCount = Math.max(dbState.count, this.defaultCount);
                this.state.count = newCount;
                this.state.lastUpdate = today;
                await this.#save();
            }
        } else {
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

async function migrateOldData(db, userId) {
    const oldGachaRef = doc(db, dbCollectionNames.users, userId, dbCollectionNames.status, 'gacha');
    const oldTtsRef = doc(db, dbCollectionNames.users, userId, dbCollectionNames.status, 'tts');

    const [gachaSnap, ttsSnap] = await Promise.all([getDoc(oldGachaRef), getDoc(oldTtsRef)]);

    const batch = writeBatch(db);
    const today = new Date().toISOString().split('T')[0];

    const gachaCount = gachaSnap.exists() ? gachaSnap.data().count : gameSettings.dailyLimits.gacha;
    const newGachaRef = doc(db, dbCollectionNames.users, userId, dbCollectionNames.dailyTasks, 'gacha');
    batch.set(newGachaRef, { count: gachaCount, lastUpdate: today });

    const ttsCount = ttsSnap.exists() ? ttsSnap.data().count : gameSettings.dailyLimits.tts;
    const newTtsRef = doc(db, dbCollectionNames.users, userId, dbCollectionNames.dailyTasks, 'tts');
    batch.set(newTtsRef, { count: ttsCount, lastUpdate: today });

    const newGenerateOneRef = doc(db, dbCollectionNames.users, userId, dbCollectionNames.dailyTasks, 'generateOne');
    batch.set(newGenerateOneRef, { count: gameSettings.dailyLimits.generateOne, lastUpdate: today });
    const newGenerateFourRef = doc(db, dbCollectionNames.users, userId, dbCollectionNames.dailyTasks, 'generateFour');
    batch.set(newGenerateFourRef, { count: gameSettings.dailyLimits.generateFour, lastUpdate: today });

    await batch.commit();
    console.log(`使用者 ${userId} 的資料已成功遷移至新的 dailyTasks 結構！`);
}

const tasks = {};

export async function initDailyTaskManager(firestoreInstance, uid) {
    if (!firestoreInstance || !uid) {
        console.error("DailyTaskManager 初始化失敗：缺少 Firestore 實例或使用者 UID。");
        return;
    }

    const checkRef = doc(firestoreInstance, dbCollectionNames.users, uid, dbCollectionNames.dailyTasks, 'gacha');
    const checkSnap = await getDoc(checkRef);

    if (!checkSnap.exists()) {
        await migrateOldData(firestoreInstance, uid);
    }

    for (const taskName in gameSettings.dailyLimits) {
        tasks[taskName] = new DailyTask(taskName, firestoreInstance, uid);
    }
}

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
