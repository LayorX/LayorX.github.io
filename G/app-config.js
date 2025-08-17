// app-config.js - 存放核心、不常變動的應用程式設定

// 應用程式資訊
export const appInfo = {
    title: "女神慾見GoddeSpark",
    version: "1.6.5", // 版本更新
    footer: {
        copyrightYear: "2025",
        authorName: "LayorX",
        authorLink: "https://layorx.github.io"
    }
};

// Firebase & 外部服務金鑰/URL
export const serviceKeys = {
    firebaseConfig: {
        apiKey: "AIzaSyDbWa8TWru1J048WK8msVBaC9JhhhtuhJw",
        authDomain: "goddess-chance.firebaseapp.com",
        projectId: "goddess-chance",
        storageBucket: "goddess-chance.firebasestorage.app",
        messagingSenderId: "440990936442",
        appId: "1:440990936442:web:37d864cd13112f14913ac3",
        measurementId: "G-3HCCT2PFXX"
    },
    defaultApiKey: "AIzaSyAZUc69ryBPqw0Ss2ZV-f4Jg5kP3VjDd0c",//"AIzaSyBJ3bxYiE4lo9i5iOPiwrm4Bmm2qErTN-A", // 測試階段不要亂偷~
    formspreeUrl: "https://formspree.io/f/xnnzgpdn"
};

// 資料庫集合名稱 (集中管理以避免拼寫錯誤)
export const dbCollectionNames = {
    users: 'users',
    publicGoddesses: 'public-goddesses',
    dailyTasks: 'dailyTasks',
    statistics: 'statistics',
    userStats: 'userStats',
    favorites: 'favorites',
    status: 'status' // 用於舊資料遷移
};
