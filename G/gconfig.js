// config.js - 專門存放靜態設定資料

// 應用程式資訊
export const appInfo = {
    title: "AI 女神製造所",
    version: "1.2.0",
    icons: {
        appleTouchIcon: "gimages/icon/apple-touch-icon.png",
        favicon32: "gimages/icon/favicon-32x32.png",
        favicon16: "gimages/icon/favicon-16x16.png",
        manifest: "gimages/icon/site.webmanifest",
        shortcutIcon: "gimages/icon/favicon.ico"
    },
    // ✨ NEW: 頁尾版權資訊
    footer: {
        copyrightYear: "2025",
        authorName: "LayorX",
        authorLink: "https://layorx.github.io"
    }
};

// Firebase 設定
export const firebaseSettings = {
    apiKey: "AIzaSyDbWa8TWru1J048WK8msVBaC9JhhhtuhJw",
    authDomain: "goddess-chance.firebaseapp.com",
    projectId: "goddess-chance",
    storageBucket: "goddess-chance.firebasestorage.app", 
    messagingSenderId: "440990936442",
    appId: "1:440990936442:web:37d864cd13112f14913ac3",
    measurementId: "G-3HCCT2PFXX"
};

// 這是 Google AI 的金鑰，獨立出來
export const apiKey = "AIzaSyAZUc69ryBPqw0Ss2ZV-f4Jg5kP3VjDd0c"; 

// 遊戲與應用的核心設定
export const gameSettings = {
    dailyGachaCount: 5,
    dailyTtsCount: 3,
    gachaStreakGoal: 2,
};

// API 相關設定
export const apiSettings = {
    imageGenerationRetries: 3,
    imageGenerationDelay: 1000,
    ttsVoice: "Zubenelgenubi",
    prompts: {
        imagePrefix: "masterpiece, best quality, ultra-detailed, photorealistic, 8k, sharp focus, detailed beautiful face.",
        imageSuffix: "aspect ratio 2:3, raw style.",
        negativePrompt: "ugly, blurry, bad anatomy, disfigured, poorly drawn face, mutation, mutated, extra limb, dull eyes, bad hands, missing fingers, low quality, jpeg artifacts, text, watermark, signature, cartoon, 3d, deformed.",
        story: (title, description) => `以繁體中文，為一張風格為「${title}」的女性照片融合${description}，寫一段約150字的短篇故事或情境描述。請用充滿想像力且感性的筆觸，描述她的背景、心情或一個正在發生的瞬間。`,
        tts: (text) => `Say in a gentle and alluring female voice: ${text}`
    }
};

// UI 介面與動畫相關設定
export const uiSettings = {
    loadingScreenDuration: 5000, 
    previewImages: [
        'gimages/g/g1.jpg', 'gimages/g/g2.jpg', 'gimages/g/g3.jpg',
        'gimages/g/g4.jpg', 'gimages/g/g5.jpg', 'gimages/g/g6.jpg',
        'gimages/g/g7.png', 'gimages/g/g8.png', 'gimages/g/g9.png'
    ],
    loadingSilhouettes: [
        'gimages/g/g1.jpg', 'gimages/g/g2.jpg', 'gimages/g/g3.jpg',
        'gimages/g/g4.jpg', 'gimages/g/g5.jpg', 'gimages/g/g6.jpg',
        'gimages/g/g7.png', 'gimages/g/g8.png', 'gimages/g/g9.png'
    ],
    loadingPetalCount: 60,
    cardRevealDelay: 1,
    loadingAnimationStep: 1,
    slideshowTransitionSpeed: 250,
    swipeThreshold: 50,
    messageBoxTimeout: 3000,
};

// UI 介面文字
export const uiMessages = {
    loading: {
        connecting: "正在連接雲端...",
        summoning: "正在從雲端神殿召喚女神...",
        starting: "邂逅即將開始..."
    },
    gachaModalTitle: "命運的邂逅",
    storyModalTitle: "女神的篇章",
    buttons: {
        generateOne: "遇見一位",
        generateFour: "遇見四位",
        favorites: "女神殿堂",
        gacha: "女神扭蛋 🎰",
        gachaDraw: "召喚",
        ttsPlay: "聆聽故事",
        ttsStop: "停止播放",
        ttsLimit: "明日再來"
    },
    favorites: {
        emptyTitle: "殿堂還是空的",
        emptySubtitle: "快去收藏您心儀的女神吧！",
        empty: "您的女神殿堂還是空的喔！",
        addSuccess: "收藏成功！",
        addFailure: "收藏失敗",
        removeSuccess: "已從殿堂移除。",
        removeFailure: "取消收藏失敗",
        uploading: "正在上傳至雲端...",
        shareFirst: "請先收藏此女神才能分享！"
    },
    gacha: {
        placeholder: "點擊下方按鈕，遇見一位來自他人宇宙的女神",
        drawFailed: "召喚失敗",
        poolEmpty: "獎池是空的！快去分享一些女神吧！",
        alreadyShared: "這位女神已經在公開殿堂中了！",
        shareSuccess: "分享成功！獲得一次額外召喚機會！"
    },
    errors: {
        firebaseInit: "Firebase 初始化失敗，請檢查設定",
        cloudConnect: "無法連接雲端，部分功能將受限",
        syncFavorites: "無法同步雲端收藏",
        imageLoad: "這張圖片的資料似乎遺失了",
        ttsFailed: "語音功能暫時無法使用",
        storyFailed: "故事的靈感暫時枯竭了，請稍後再試。"
    }
};


// 音效相關設定
export const soundSettings = {
    masterVolume: -10,
};

// 女神風格設定
export const styles = [
    { id: 'vip-exclusive', title: '👑 VIP 專屬', description: '獨一無二，只能在命運的邂逅中偶遇的稀有女神', prompt: "" },
    { id: 'beach-silhouette', title: '🏖️ 沙灘剪影', description: '黃昏、唯美、充滿想像的浪漫詩篇', prompt: "A beautiful Asian model as a silhouette against a sunset on a deserted beach. She wears a light, semi-transparent white dress. The mood is romantic and beautiful." },
    { id: 'morning-lazy', title: '☀️ 晨光私房', description: '慵懶、私密、屬於你的女友感瞬間', prompt: "A sexy and curvy Asian model with a lazy aura on a messy bed. She wears an oversized men's shirt, unbuttoned, with black stockings. Morning sun streams through blinds, creating a soft, intimate, and seductive atmosphere." },
    { id: 'neon-noir', title: '💦 濕身惡女', description: '霓虹、慾望、無法抗拒的危險魅力', prompt: "A tall, wild, and seductive Asian model in a white shirt caught in a city alley downpour, against a backdrop of blurry neon lights. Her eyes are defiant and confident." },
    { id: 'cyberpunk-warrior', title: '🤖 賽博龐克戰姬', description: '未來、科技、堅毅眼神中的致命吸引力', prompt: "Cyberpunk style. A female Asian warrior in glowing mechanical armor, holding an energy sword. The background is a futuristic city with flying vehicles and towering skyscrapers." }
];

// ✨ NEW: AI 算圖用的隨機關鍵字 (區分日夜)
export const randomKeywords_day = {
    hair: [
        'long wavy brown hair', 'silver bob cut', 'messy bun', 'sleek ponytail','long flowing hair', 'braided hair', 'casual ponytail', 'a few loose strands of hair'
    ],
    outfit: [
        'in a light, semi-transparent white dress', 'wearing a simple t-shirt and jeans', 'in a summer dress','in a fitted white t-shirt', 'wearing a light sundress', 'in a crop top and shorts', 'wearing a flowy maxi skirt', 'a casual oversized hoodie', 'a delicate lace camisole', 'a denim jacket'
    ],
    setting: [
        'on a deserted beach', 'in a sun-drenched bedroom', 'inside a cozy cafe', 'in a lush green forest','at a bustling farmer\'s market', 'on a scenic hiking trail', 'in a cozy library', 'by a quiet lakeside', 'in a vintage bookstore'
    ],
    artStyle: [
        'cinematic lighting', 'soft focus', 'lens flare', 'sun-kissed and radiant','vibrant and colorful', 'natural daylight', 'golden hour'
    ],
    bodyDetails: [
        'glistening skin', 'dewy skin', 'long legs','toned arms', 'slender shoulders', 'defined collarbones', 'a curvy waistline', 'soft and delicate hands', 'a subtle tattoo', 'a hint of cleavage', 'bare feet'
    ],
    expression: [
        'a mysterious smile', 'a playful wink', 'a shy glance', 'blushing shyly','a confident smile', 'a thoughtful gaze', 'a radiant laugh', 'a peaceful expression'
    ],
    mood: [
        'romantic and beautiful', 'lazy aura', 'innocent but tempting', 'charming','carefree and happy', 'vibrant and energetic', 'calm and composed', 'playful'
    ]
};

export const randomKeywords_night = {
    hair: ['platinum blonde hair', 'short pink hair', 'fiery red braids'],
    outfit: ['in a leather jacket', 'wearing a silk gown', 'in a futuristic jumpsuit', 'wearing sheer lingerie', 'in a lace thong', 'wearing thigh-high stockings', 'in a wet see-through shirt'],
    setting: ['in a neon-lit tokyo street', 'in a baroque-style room', 'on a rooftop overlooking the city', 'in the pouring rain'],
    artStyle: ['dramatic lighting', 'vaporwave aesthetic', 'fantasy art style'],
    bodyDetails: ['plump lips', 'wet and glossy lips', 'curvaceous body', 'slender waist'],
    expression: ['seductive gaze', 'a look of longing', 'defiant and confident eyes'],
    mood: ['alluring', 'enchanting', 'sultry', 'captivating men\'s gaze']
};

// AI 算圖用的隨機關鍵字
export const randomKeywords_normal = {
    hair: ['platinum blonde hair', 'long wavy brown hair', 'short pink hair', 'silver bob cut', 'fiery red braids', 'messy bun', 'sleek ponytail'],
    outfit: ['in a leather jacket', 'wearing a silk gown', 'in a futuristic jumpsuit', 'in a traditional kimono', 'in a simple t-shirt and jeans', 'wearing sheer lingerie', 'in a lace thong', 'wearing thigh-high stockings', 'in a wet see-through shirt'],
    setting: ['in a neon-lit tokyo street', 'in a lush green forest', 'on a rooftop overlooking the city', 'inside a cozy cafe', 'in a baroque-style room', 'in a sun-drenched bedroom', 'in the pouring rain'],
    artStyle: ['cinematic lighting', 'fantasy art style', 'oil painting style', 'vaporwave aesthetic', 'dramatic lighting', 'soft focus', 'lens flare'],
    bodyDetails: ['glistening skin', 'plump lips', 'slender waist', 'long legs', 'dewy skin', 'wet and glossy lips', 'curvaceous body'],
    expression: ['blushing shyly', 'seductive gaze', 'a playful wink', 'a mysterious smile', 'a look of longing', 'a shy glance'],
    mood: ['alluring', 'charming', 'enchanting', 'sultry', 'innocent but tempting', 'sun-kissed and radiant', 'captivating men\'s gaze']
};

// AI 生成圖片的基本設定2 av封面版本
export const randomKeywords = { // av 封面風格的隨機關鍵字
  // hair: 髮型
  hair: [
    '烏黑長直髮', '金色大波浪捲髮', '俏麗短髮', '可愛的雙馬尾', '學生風的妹妹頭', 
    '剛睡醒的凌亂髮絲', '濕潤的亂髮', '高雅的盤髮', '性感的側分長髮', '挑染的時髦髮型', 
    '姬髮式公主切', '清純的黑色短髮'
  ],

  // outfit: 穿搭 (這是最關鍵的分類之一)
  outfit: [
    '合身的OL套裝', '清純的學生制服', '白色水手服', '貼身的護士服', '優雅的空姐制服', 
    '可愛的女僕裝', '緊身的啦啦隊服', '濕透的白襯衫', '寬大的男友襯衫', '性感的蕾絲內衣', 
    '誘惑的吊帶襪', '只有一條圍裙', '情趣比基尼', '日式死庫水(競賽泳衣)', '傳統和服', 
    '開高衩的旗袍', '性感的窄裙', '運動短褲與背心', '剛出浴的浴袍', '透明薄紗睡衣',
    '帥氣的女警制服', '神聖的巫女服', '貼身的瑜珈服'
  ],

  // setting: 場景
  setting: [
    '在辦公室的會議室裡', '放學後的教室', '擁擠的電車中', '純白的醫院病房', 
    '凌亂的臥室床上', '灑滿陽光的客廳沙發', '充滿霧氣的浴室', '溫泉旅館的榻榻米房',
    '無人的圖書館角落', '高級飯店的房間', '在自家廚房的流理臺前', '鄉下的田間小路',
    '夏日的游泳池畔', ' secluded 海灘', '搖晃的車內', '廢棄的工廠倉庫'
  ],

  // artStyle: 藝術風格/攝影手法
  artStyle: [
    '電影感的戲劇性光影', '柔和的自然光', '窺視感的第一人稱視角(POV)', '高對比度的黑白色調',
    '懷舊的復古色調', '油亮感的打光', '唯美的柔焦效果', '背景失焦的特寫', '透過鏡子的反射',
    '逆光下的身體輪廓', '充滿臨場感的手持鏡頭風格'
  ],

  // bodyDetails: 身體細節
  bodyDetails: [
    '汗水淋漓的肌膚', '晶瑩剔透的皮膚', '微微泛紅的臉頰', '水汪汪的無辜大眼', 
    '微張的濕潤嘴唇', '誘人的鎖骨線條', '豐滿渾圓的胸部', '纖細的柳腰', '完美的翹臀曲線',
    '修長筆直的美腿', '性感的腰窩', '青澀的身體線條', '健康的古銅色肌膚'
  ],

  // expression: 表情
  expression: [
    '害羞地別過頭', '忍耐著的表情', '天真無邪的微笑', '好奇的凝視', '挑逗的眼神',
    '委屈地快要哭出來', '陶醉地閉上眼', '滿足的微笑', '驚訝地張開嘴', '放空失神的表情',
    '帶點S氣質的冷酷表情', '懇求的眼神'
  ],

  // mood: 氛圍/情境
  mood: [
    '禁忌的背德感', '初次體驗的青澀', '友達以上的曖昧關係', '無法抗拒的誘惑',
    '清純與性感的反差', '被前輩溫柔地教導', '人妻的午後密會', '完全服從的關係',
    '純真的惡作劇', '孤獨寂寞的夜晚'
  ]

};

