// firebase.js - 集中管理所有 Firebase 相關操作

// --- Firebase SDKs ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot, getDoc, getDocs, query, limit, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadString, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// --- Module State ---
let db, auth, storage;
let currentUserId;

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

// ✨ NEW: Export a function to get the current user ID safely
export function getCurrentUserId() {
    return currentUserId;
}

// --- Firestore & Storage Operations ---
export function listenToFavorites(callback) {
    if (!currentUserId) return () => {};
    const favoritesCol = collection(db, 'users', currentUserId, 'favorites');
    const unsubscribe = onSnapshot(favoritesCol, (snapshot) => {
        const newFavorites = snapshot.docs.map(doc => doc.data());
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
    await setDoc(favoriteRef, favoriteData);
}

export async function removeFavorite(favoriteToRemove) {
    if (!currentUserId) throw new Error("User not signed in.");
    // 1. Delete Firestore document
    const favoriteRef = doc(db, 'users', currentUserId, 'favorites', favoriteToRemove.id);
    await deleteDoc(favoriteRef);
    // 2. Delete image from Storage
    const imageRef = ref(storage, `users/${currentUserId}/images/${favoriteToRemove.id}.png`);
    try {
        await deleteObject(imageRef);
    } catch (error) {
        console.warn("Could not delete image from storage (it may not exist):", error);
    }
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
    await setDoc(publicRef, { ...publicData, sharedBy: currentUserId });
    return { alreadyExists: false };
}

// --- Gacha Operations ---
export async function loadGachaStateFromDB() {
    if (!currentUserId) throw new Error("User not signed in.");
    const gachaRef = doc(db, 'users', currentUserId, 'status', 'gacha');
    const docSnap = await getDoc(gachaRef);
    return docSnap.exists() ? docSnap.data() : null;
}

export async function saveGachaStateToDB(gachaState) {
    if (!currentUserId) throw new Error("User not signed in.");
    const gachaRef = doc(db, 'users', currentUserId, 'status', 'gacha');
    await setDoc(gachaRef, gachaState);
}

export async function getRandomGoddessFromDB() {
    const publicRef = collection(db, 'public-goddesses');
    const q = query(publicRef, limit(50));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        throw new Error("獎池是空的！快去分享一些女神吧！");
    }
    const allDocs = querySnapshot.docs;
    const randomIndex = Math.floor(Math.random() * allDocs.length);
    return allDocs[randomIndex].data();
}
