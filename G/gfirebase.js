import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot, getDoc, getDocs, query, limit, runTransaction, increment, collectionGroup, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getStorage, ref, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { serviceKeys, dbCollectionNames } from './app-config.js';
import { imageSettings, gameSettings } from './game-config.js';

let db, auth, storage;
let currentUserId;

export function initFirebase() {
    try {
        const firebaseConfig = serviceKeys.firebaseConfig;
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

export async function getUserData(uid) {
    if (!uid) return null;
    const userRef = doc(db, dbCollectionNames.users, uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        await setDoc(userRef, { nickname: '' });
        return { nickname: '' };
    }
}

export async function saveNickname(uid, nickname) {
    if (!uid) throw new Error("User not signed in.");
    const userRef = doc(db, dbCollectionNames.users, uid);
    await setDoc(userRef, { nickname: nickname }, { merge: true });
}

// --- 以下為既有函式，保持不變 ---

function getResizedImageUrl(originalUrl) {
    if (!originalUrl) return '';
    try {
        const pathStartMarker = '/o/';
        const queryStartMarker = '?';

        const pathStartIndex = originalUrl.indexOf(pathStartMarker);
        const queryStartIndex = originalUrl.indexOf(queryStartMarker);

        if (pathStartIndex === -1 || queryStartIndex === -1) {
            return originalUrl;
        }

        const baseUrl = originalUrl.substring(0, pathStartIndex + pathStartMarker.length);
        const encodedPath = originalUrl.substring(pathStartIndex + pathStartMarker.length, queryStartIndex);
        const queryParams = originalUrl.substring(queryStartIndex);

        const decodedPath = decodeURIComponent(encodedPath);

        const lastDotIndex = decodedPath.lastIndexOf('.');
        if (lastDotIndex === -1) {
            return originalUrl;
        }

        const pathWithoutExt = decodedPath.substring(0, lastDotIndex);
        const newDecodedPath = `${pathWithoutExt}${imageSettings.resizedSuffix}${imageSettings.resizedExtension}`;
        const newEncodedPath = encodeURIComponent(newDecodedPath);

        return `${baseUrl}${newEncodedPath}${queryParams}`;

    } catch (e) {
        console.error("Failed to create resized image URL:", e);
        return originalUrl;
    }
}

export function listenToFavorites(callback) {
    if (!currentUserId) return () => {};
    const favoritesCol = collection(db, dbCollectionNames.users, currentUserId, dbCollectionNames.favorites);
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
    const favoriteRef = doc(db, dbCollectionNames.users, currentUserId, dbCollectionNames.favorites, favoriteData.id);
    await setDoc(favoriteRef, {
        id: favoriteData.id,
        style: favoriteData.style,
        imageUrl: favoriteData.imageUrl
    });
}

export async function removeFavorite(favoriteToRemove) {
    if (!currentUserId) throw new Error("User not signed in.");
    const favoriteRef = doc(db, dbCollectionNames.users, currentUserId, dbCollectionNames.favorites, favoriteToRemove.id);
    await deleteDoc(favoriteRef);
}

export async function uploadImage(base64String, imageId) {
    if (!currentUserId) throw new Error("User not signed in.");
    const storageRef = ref(storage, `${dbCollectionNames.users}/${currentUserId}/images/${imageId}.png`);
    const snapshot = await uploadString(storageRef, base64String, 'data_url');
    return await getDownloadURL(snapshot.ref);
}

export async function shareToPublic(publicData) {
    if (!currentUserId) throw new Error("User not signed in.");
    const publicRef = doc(db, dbCollectionNames.publicGoddesses, publicData.id);
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

export async function updatePublicGoddessVote(goddessId, voterId, action) {
    if (!db) throw new Error("Firestore is not initialized.");
    const goddessRef = doc(db, dbCollectionNames.publicGoddesses, goddessId);

    try {
        await runTransaction(db, async (transaction) => {
            const goddessDoc = await transaction.get(goddessRef);
            if (!goddessDoc.exists()) {
                return; 
            }

            const data = goddessDoc.data();
            const likedBy = data.likedBy || [];
            const hasLiked = likedBy.includes(voterId);

            if (action === 'like' && !hasLiked) {
                transaction.update(goddessRef, {
                    likedBy: [...likedBy, voterId],
                    likeCount: increment(1)
                });
            } else if (action === 'unlike' && hasLiked) {
                transaction.update(goddessRef, {
                    likedBy: likedBy.filter(id => id !== voterId),
                    likeCount: increment(-1)
                });
            }
        });
    } catch (error) {
        console.error("更新公開女神喜歡數失敗:", error);
    }
}

export async function addDislikeToGoddess(goddessId, dislikerId) {
    if (!db) throw new Error("Firestore is not initialized.");
    const goddessRef = doc(db, dbCollectionNames.publicGoddesses, goddessId);

    try {
        const newCount = await runTransaction(db, async (transaction) => {
            const goddessDoc = await transaction.get(goddessRef);
            if (!goddessDoc.exists()) {
                throw new Error("這張圖片不存在或已被移除。");
            }

            const data = goddessDoc.data();
            const dislikedBy = data.dislikedBy || [];

            if (dislikedBy.includes(dislikerId)) {
                return -1;
            }

            const newDislikedBy = [...dislikedBy, dislikerId];
            
            transaction.update(goddessRef, {
                dislikedBy: newDislikedBy,
                dislikeCount: increment(1)
            });
            
            return (data.dislikeCount || 0) + 1;
        });

        if (newCount === -1) {
            return { success: false, message: "您已經評價過這位女神了！" };
        }

        return { success: true, message: "評價成功！", newCount: newCount };

    } catch (error) {
        console.error("倒讚操作失敗:", error);
        return { success: false, message: error.message };
    }
}

export async function getRandomGoddessFromDB() {
    const publicRef = collection(db, dbCollectionNames.publicGoddesses);
    const q = query(publicRef, limit(gameSettings.gachaQueryLimit));
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
    const publicRef = collection(db, dbCollectionNames.publicGoddesses);
    const q = query(publicRef, limit(gameSettings.gachaQueryLimit));
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

// --- ✨ NEW: 排行榜查詢函式 ---

/**
 * 獲取頂尖使用者排名
 * @param {string} statField - 要排序的統計欄位 (例如 'shares', 'generateOne')
 * @param {number} count - 要獲取的數量
 * @returns {Array} - 包含使用者 ID 和統計數值的陣列
 */
export async function getTopUsersByStat(statField, count) {
    const statsCollection = collectionGroup(db, dbCollectionNames.userStats);
    const q = query(statsCollection, orderBy(statField, 'desc'), limit(count));
    
    const querySnapshot = await getDocs(q);
    const topUsers = [];
    querySnapshot.forEach(doc => {
        // user ID 在父文件的路徑中
        const userId = doc.ref.parent.parent.id;
        topUsers.push({
            id: userId,
            statValue: doc.data()[statField] || 0
        });
    });
    return topUsers;
}

/**
 * 獲取頂尖女神排名
 * @param {string} orderByField - 'likes' 或 'dislikes'
 * @param {number} count - 要獲取的數量
 * @returns {Array} - 包含女神完整資料的陣列
 */
export async function getTopGoddesses(orderByField, count) {
    const goddessesCollection = collection(db, dbCollectionNames.publicGoddesses);
    const field = orderByField === 'likes' ? 'likeCount' : 'dislikeCount';
    const q = query(goddessesCollection, orderBy(field, 'desc'), limit(count));

    const querySnapshot = await getDocs(q);
    const topGoddesses = [];
    querySnapshot.forEach(doc => {
        topGoddesses.push(doc.data());
    });
    return topGoddesses;
}
