// config.js - 專門存放靜態設定資料

// AI 金鑰
export const apiKey = "AIzaSyAZUc69ryBPqw0Ss2ZV-f4Jg5kP3VjDd0c"; 

// 遊戲與應用的核心設定
export const gameSettings = {
    musicPath: "gmusic/gm1.mp3",
    dailyGachaCount: 5,
    dailyTtsCount: 3,
    gachaStreakGoal: 2,
};

// ✨ NEW: API 相關設定
export const apiSettings = {
    imageGenerationRetries: 3,      // 圖片生成失敗時的重試次數
    imageGenerationDelay: 1000,     // 每次重試的延遲時間 (毫秒)
    ttsVoice: "Zubenelgenubi",      // TTS 語音合成的聲音模型
};

// ✨ NEW: UI 介面與動畫相關設定
export const uiSettings = {
    // VIP 卡片的預覽圖庫，會從中隨機挑選一張
    previewImages: [
        'gimages/g/g1.jpg', 'gimages/g/g2.jpg', 'gimages/g/g3.jpg',
        'gimages/g/g4.jpg', 'gimages/g/g5.jpg', 'gimages/g/g6.jpg',
        'gimages/g/g7.png', 'gimages/g/g8.png', 'gimages/g/g9.png'
    ],
    // 載入畫面時輪播的剪影圖片
    loadingSilhouettes: [
        'gimages/g/g1.jpg', 'gimages/g/g2.jpg', 'gimages/g/g3.jpg',
        'gimages/g/g4.jpg', 'gimages/g/g5.jpg', 'gimages/g/g6.jpg',
        'gimages/g/g7.png', 'gimages/g/g8.png', 'gimages/g/g9.png'
    ],
    loadingPetalCount: 50, // 載入畫面時的花瓣數量
};


// 女神風格設定
export const styles = [
    { id: 'vip-exclusive', title: '👑 VIP 專屬', description: '獨一無二，只能在命運的邂逅中偶遇的稀有女神', prompt: "" },
    { id: 'beach-silhouette', title: '🏖️ 沙灘剪影', description: '黃昏、唯美、充滿想像的浪漫詩篇', prompt: "A beautiful Asian model as a silhouette against a sunset on a deserted beach. She wears a light, semi-transparent white dress. The mood is romantic and beautiful." },
    { id: 'morning-lazy', title: '☀️ 晨光私房', description: '慵懶、私密、屬於你的女友感瞬間', prompt: "A sexy and curvy Asian model with a lazy aura on a messy bed. She wears an oversized men's shirt, unbuttoned, with black stockings. Morning sun streams through blinds, creating a soft, intimate, and seductive atmosphere." },
    { id: 'neon-noir', title: '💦 濕身惡女', description: '霓虹、慾望、無法抗拒的危險魅力', prompt: "A tall, wild, and seductive Asian model in a white shirt caught in a city alley downpour, against a backdrop of blurry neon lights. Her eyes are defiant and confident." },
    { id: 'cyberpunk-warrior', title: '🤖 賽博龐克戰姬', description: '未來、科技、堅毅眼神中的致命吸引力', prompt: "Cyberpunk style. A female Asian warrior in glowing mechanical armor, holding an energy sword. The background is a futuristic city with flying vehicles and towering skyscrapers." }
];

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

