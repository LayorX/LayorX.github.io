// analyticsManager.js - 統一管理所有使用者行為分析與統計

import { getFirestore, doc, getDoc, setDoc, increment, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// ✨ NEW: 匯入設定檔
import { userStatsStructure, randomNicknames } from './game-config.js';

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
        // ✨ NEW: 為新使用者指派隨機暱稱
        const nickname = randomNicknames[Math.floor(Math.random() * randomNicknames.length)];
        const userDocRef = doc(db, 'users', userId);
        
        // 使用 Promise.all 並行處理，效率更高
        await Promise.all([
            // 建立統計文件
            setDoc(statsRef, {
                ...userStatsStructure,
                firstLogin: serverTimestamp(),
                lastLogin: serverTimestamp()
            }),
            // 建立使用者主文件並存入暱稱
            setDoc(userDocRef, { nickname: nickname })
        ]);
        
        console.log(`為新使用者 ${userId} 初始化了統計文件，並設定隨機暱稱: ${nickname}`);

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
                // 使用 increment 函數來確保原子性操作
                updatePayload[key] = increment(fieldsToIncrement[key]);
            }
        }
        await setDoc(statsRef, updatePayload, { merge: true });
    } catch (error) {
        console.error("更新統計數據時發生錯誤:", error);
    }
}
