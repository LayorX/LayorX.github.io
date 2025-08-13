// analyticsManager.js - 統一管理所有使用者行為分析與統計

import { getFirestore, doc, getDoc, setDoc, increment, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { userStatsStructure } from './game-config.js';

let db;
let userId;
let statsRef;

/**
 * 初始化分析管理器
 * @param {Firestore} firestoreInstance - Firestore 實例
 * @param {string} uid - 使用者 ID
 */
export async function initAnalyticsManager(firestoreInstance, uid) {
    db = firestoreInstance;
    userId = uid;
    statsRef = doc(db, 'users', userId, 'statistics', 'userStats');

    // 檢查統計文件是否存在，如果不存在則為使用者建立一個全新的
    const docSnap = await getDoc(statsRef);
    if (!docSnap.exists()) {
        await setDoc(statsRef, {
            ...userStatsStructure,
            firstLogin: serverTimestamp(),
            lastLogin: serverTimestamp()
        });
        console.log(`為新使用者 ${userId} 初始化了統計文件。`);
    } else {
        // 如果文件存在，只更新最後登入時間
        await setDoc(statsRef, { lastLogin: serverTimestamp() }, { merge: true });
    }
}

/**
 * 增加一個或多個統計欄位的數值
 * @param {object} fieldsToIncrement - 一個包含要增加的欄位和數值的物件，例如 { likes: 1, gachaDraws: 5 }
 */
export async function incrementStat(fieldsToIncrement) {
    if (!statsRef) {
        console.warn("Analytics Manager 尚未初始化，無法追蹤統計。");
        return;
    }
    try {
        // Firestore 的 increment 方法非常高效，它會以原子方式增加伺服器上的數值
        const updatePayload = {};
        for (const key in fieldsToIncrement) {
            if (Object.hasOwnProperty.call(fieldsToIncrement, key)) {
                updatePayload[key] = increment(fieldsToIncrement[key]);
            }
        }
        await setDoc(statsRef, updatePayload, { merge: true });
    } catch (error) {
        console.error("更新統計數據時發生錯誤:", error);
    }
}
