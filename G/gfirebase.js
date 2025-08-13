// firebase.js - 集中管理所有 Firebase 相關操作

// --- Firebase SDKs ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot, getDoc, getDocs, query, limit } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// --- Module State ---
let db, auth, storage;
let currentUserId;

// --- 圖片尺寸設定 ---
const RESIZED_IMAGE_SUFFIX = '_400x600' //'_200x300'; // 建議尺寸
const RESIZED_IMAGE_EXTENSION = '.jpeg'; 

// --- Initialization ---
export function initFirebase() {
    try {
        const firebaseConfig = window.firebaseConfig;
        if (!firebaseConfig) throw new Error("Firebase config not found.");
        
        const app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        storage = getStorage(app);
        console.log("Firebase initialized successfully.");
        return true;
    } catch (error) {
        console.error("Firebase initialization failed:", error);
        return false;
    }
}

// --- Authentication ---
export function handleAuthentication(onUserSignedIn) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUserId = user.uid;
            if (onUserSignedIn) onUserSignedIn(currentUserId);
        } else {
            signInAnonymously(auth).catch((error) => {
                if (onUserSignedIn) onUserSignedIn(null, error);
            });
        }
    });
}

export function getCurrentUserId() {
    return currentUserId;
}

export function getDbInstance() {
    return db;
}

// --- 獲取縮圖 URL 的輔助函式 ---
/**
 * ✨ FIX: 修正了 URL 編碼問題，確保 / 被正確轉換為 %2F
 * @param {string} originalUrl - 原始圖片的 Firebase Storage 下載 URL
 * @returns {string} - 縮圖的 URL
 */
function getResizedImageUrl(originalUrl) {
    if (!originalUrl) return '';
    try {
        // 找到路徑組件的起始位置 (在 /o/ 之後) 和查詢參數的起始位置
        const pathStartMarker = '/o/';
        const queryStartMarker = '?';

        const pathStartIndex = originalUrl.indexOf(pathStartMarker);
        const queryStartIndex = originalUrl.indexOf(queryStartMarker);

        if (pathStartIndex === -1 || queryStartIndex === -1) {
            return originalUrl; // 不是標準的 Firebase Storage URL
        }

        // 分割 URL
        const baseUrl = originalUrl.substring(0, pathStartIndex + pathStartMarker.length);
        const encodedPath = originalUrl.substring(pathStartIndex + pathStartMarker.length, queryStartIndex);
        const queryParams = originalUrl.substring(queryStartIndex);

        // 只解碼路徑部分
        const decodedPath = decodeURIComponent(encodedPath);

        // 找到最後一個點以替換副檔名
        const lastDotIndex = decodedPath.lastIndexOf('.');
        if (lastDotIndex === -1) {
            return originalUrl; // 找不到副檔名
        }

        const pathWithoutExt = decodedPath.substring(0, lastDotIndex);

        // 構建新的解碼後路徑
        const newDecodedPath = `${pathWithoutExt}${RESIZED_IMAGE_SUFFIX}${RESIZED_IMAGE_EXTENSION}`;

        // 重新編碼新的路徑並組裝最終的 URL
        // encodeURIComponent 會將 / 編碼為 %2F
        const newEncodedPath = encodeURIComponent(newDecodedPath);

        return `${baseUrl}${newEncodedPath}${queryParams}`;

    } catch (e) {
        console.error("Failed to create resized image URL:", e);
        return originalUrl; // 出錯時回退到原始 URL
    }
}


// --- Firestore & Storage Operations ---
export function listenToFavorites(callback) {
    if (!currentUserId) return () => {};
    const favoritesCol = collection(db, 'users', currentUserId, 'favorites');
    const unsubscribe = onSnapshot(favoritesCol, (snapshot) => {
        const newFavorites = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                ...data,
                resizedUrl: getResizedImageUrl(data.imageUrl)
            };
        });
        callback(newFavorites);
    }, (error) => {
        console.error("Error listening to favorites:", error);
        callback([], error);
    });
    return unsubscribe;
}

export async function saveFavorite(favoriteData) {
    if (!currentUserId) throw new Error("User not signed in.");
    const favoriteRef = doc(db, 'users', currentUserId, 'favorites', favoriteData.id);
    await setDoc(favoriteRef, {
        id: favoriteData.id,
        style: favoriteData.style,
        imageUrl: favoriteData.imageUrl
    });
}

export async function removeFavorite(favoriteToRemove) {
    if (!currentUserId) throw new Error("User not signed in.");
    const favoriteRef = doc(db, 'users', currentUserId, 'favorites', favoriteToRemove.id);
    await deleteDoc(favoriteRef);
}

export async function uploadImage(base64String, imageId) {
    if (!currentUserId) throw new Error("User not signed in.");
    const storageRef = ref(storage, `users/${currentUserId}/images/${imageId}.png`);
    const snapshot = await uploadString(storageRef, base64String, 'data_url');
    return await getDownloadURL(snapshot.ref);
}

export async function shareToPublic(publicData) {
    if (!currentUserId) throw new Error("User not signed in.");
    const publicRef = doc(db, 'public-goddesses', publicData.id);
    const docSnap = await getDoc(publicRef);
    if (docSnap.exists()) {
        return { alreadyExists: true };
    }
    await setDoc(publicRef, { 
        id: publicData.id,
        style: publicData.style,
        imageUrl: publicData.imageUrl,
        sharedBy: currentUserId 
    });
    return { alreadyExists: false };
}

// --- Gacha Operations ---
export async function getRandomGoddessFromDB() {
    const publicRef = collection(db, 'public-goddesses');
    const q = query(publicRef, limit(50));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        throw new Error("獎池是空的！快去分享一些女神吧！");
    }
    const allDocs = querySnapshot.docs;
    const randomIndex = Math.floor(Math.random() * allDocs.length);
    const data = allDocs[randomIndex].data();
    return { ...data, resizedUrl: getResizedImageUrl(data.imageUrl) };
}

export async function getRandomGoddessesFromDB(count) {
    const publicRef = collection(db, 'public-goddesses');
    const q = query(publicRef, limit(50));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return [];
    }
    const allDocs = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { ...data, resizedUrl: getResizedImageUrl(data.imageUrl) };
    });
    const shuffled = allDocs.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}
