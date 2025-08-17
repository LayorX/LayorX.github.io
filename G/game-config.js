// game-config.js - 存放遊戲性、內容、UI 等經常調整的設定
import { appInfo } from './app-config.js';
// ✨ NEW: 新增隨機暱稱列表
export const randomNicknames = [
  "D槽女神官", "波多野結冰", "吉澤明步兵", "搖桿不是這樣用的", "三上悠亞力山大",
  "單手玩輔助", "奇怪的知識增加了", "本斥但大", "天使萌新", "專業補魔師",
  "河北彩花錢", "一鍵繳械", "聖光也治不了你", "楓可憐了", "橋本有碼",
  "明日花騎兵", "全服我最婆", "顯卡在燃燒", "時間管理大師", "多人運動",
  "你老婆真好用", "相澤南波灣", "大橋未久等了", "櫻空桃太郎", "神宮寺助我",
  "這題我會", "不可以色色", "小孩子才做選擇", "人類高品質女性", "身體很誠實",
  "輸出全靠抖", "進擊的巨乳", "法杖不是那樣用", "奶量即是正義", "坐騎給妳騎",
  "敗犬女神", "異世界轉生女神", "肥宅快樂姬", "我的很大你忍一下", "絕對領域",
  "求佛不如求我", "紗倉真痛", "涼森玲夢遊", "我先繳械投降", "壞了，我裝的",
  "老司姬帶帶我", "電子雞女神", "觀音兵收容所", "女神也會芭比Q", "上上下下左右左右"
];

// ✨ MODIFIED: 升級為多頁公告系統
export const announcementSettings = {
    enabled: true, // 設為 true 來啟用公告，false 來停用
    checkLocalStorage: true, // ✨ NEW: 使用 localStorage 來記住使用者當天的選擇
    pages: [
        {
            title: "🎉 扭蛋狂歡 & 懸賞獵人計畫！ 🎉",
            message: `
                <p class="mb-4">Hey！各位神級製造師！準備好迎接一場靈魂的風暴了嗎？</p>
                <p class="mb-3"><strong>【限時扭蛋大放送！】</strong><br>每日扭蛋次數瘋狂飆升到 <strong>20 次</strong>！快來看看誰是真正的天選之人！</p>
                <p class="mb-3"><strong>【Bug 懸賞令！】</strong><br>發現任何 Bug 或鬼點子，馬上回報，至少 <strong>10 次</strong> 扭蛋機會直接入帳！</p>
                <p><strong>【女神星探計畫！】</strong><br>成功分享你的女神到各大社群？快來填寫<a href="https://forms.gle/JXdobEdAa8is2wyR6" target="_blank" class="font-bold text-amber-300 hover:underline">>>>這個神秘表單<<<</a>，證明你的貢獻，我們將用至少 <strong>30 次</strong> 扭蛋機會淹沒你！</p>
            `
        },
        {
            title: `🔧 版本 v${appInfo.version} 更新資訊 🔧`,
            message: `
                <p class="mb-3">我們很高興帶來這次的更新，主要新增了社群互動功能：</p>
                <ul class="list-disc list-inside space-y-2">
                    <li><strong>女神遇見升級：</strong>更多元化，降低敏感封鎖(使用白天風格更不容易)。</li>
                    <li><strong>全新「排行榜」頁面：</strong>現在你可以從主頁進入榮譽殿堂，查看各路好手的排名！</li>
                    <li><strong>扭蛋卡片優化：</strong>現在抽卡時會直接顯示該女神的受歡迎程度（讚/倒讚數）。</li>
                    <li><strong>暱稱系統實裝：</strong>你可以在「個人化設定」中設定你的專屬暱稱，它將會顯示在排行榜和主頁上。</li>
                    <li><strong>UI/UX 優化：</strong>修復了數個已知的 Bug，並對介面進行了微調，提升整體使用體驗。</li>
                </ul>
                <p class="mt-4">感謝您的支持，祝您遊戲愉快！</p>
            `
        }
    ]
};


// --- 遊戲數值設定 ---
export const gameSettings = {
    dailyLimits: {
        generateOne: 20,
        generateFour: 2,
        gacha: 20,//5,
        tts: 3,
    },
    gachaStreakGoal: 2,
    gachaQueryLimit: 100, // 每次從資料庫撈取多少張圖片作為扭蛋池
    dislikeMilestones: { // 特殊倒讚提示
        1: "「一道質疑的目光投來...」 (第一票)",
        3: "「人群中開始出現竊竊私語...」 (第三票)",
        10: "「女神的神性似乎產生了動搖！」 (第十票)",
    }
};

// --- 使用者分析資料結構 ---
export const userStatsStructure = {
    likes: 0,
    unlikes: 0,
    shares: 0,
    gachaDraws: 0,
    gachaDislikes: 0,
    generateOne: 0,
    generateFour: 0,
    apiImports: 0,
    storyGenerations: 0,
    ttsGenerations: 0,
    totalGenerations: 0,
};

// --- 圖片與 API 設定 ---
export const imageSettings = {
    resizedSuffix: '_200x300',
    resizedExtension: '.jpeg'
};

export const apiSettings = {
    imageGenerationRetries: 3,
    imageGenerationDelay: 1000,
    ttsVoice: "Sulafat",
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
    // --- ✨ NEW: Loading 畫面控制 ---
    // 總開關：設為 false 可完全跳過 Loading 動畫，直接進入主畫面
    enableLoadingAnimation: true, 
    // 自動結束開關：設為 true，則在連線成功後立刻結束動畫，不必等動畫播完
    hideLoadingOnConnect: false,   
    // 最短顯示時間：確保動畫至少播放這麼久（毫秒），避免一閃而過
    loadingScreenDuration: 3000, 
    previewImages: [
        'gimages/g/g1.jpg', 'gimages/g/g2.jpg', 'gimages/g/g3.jpg',
        'gimages/g/g4.jpg', 'gimages/g/g5.jpg', 'gimages/g/g6.jpg',
        'gimages/g/g7.jpg', 'gimages/g/g8.jpg', 'gimages/g/g9.jpg'
    ],
    loadingSilhouettes: [
        'gimages/g/g1.jpg', 'gimages/g/g2.jpg', 'gimages/g/g3.jpg',
        'gimages/g/g4.jpg', 'gimages/g/g5.jpg', 'gimages/g/g6.jpg',
        'gimages/g/g7.jpg', 'gimages/g/g8.jpg', 'gimages/g/g9.jpg',
        'gimages/g/g10.jpg', 'gimages/g/g11.jpg', 'gimages/g/g12.jpg'
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
    settingsModal: {
        title: "個人化設定",
        imageQualityTitle: "圖片顯示品質",
        qualityThumbnail: "縮圖優先 (預設)",
        qualityThumbnailDesc: "優先載入縮圖，點擊後顯示原圖，速度最快。",
        qualityOriginal: "原圖優先",
        qualityOriginalDesc: "所有圖片直接載入高解析度原圖，畫質最佳但較耗流量。",
        settingSaved: "設定已儲存！",
        nicknameTitle: "您的暱稱",
        nicknamePlaceholder: "請輸入您喜歡的暱稱...",
        nicknameSave: "儲存",
    },
    moreOptions: {
        ranking: "🏆 排行榜",
        settings: "⚙️ 個人化設定",
        announcement: "📢 查看公告",
        about: "關於作品",
        contact: "聯絡我 (報錯、建議)",
        apiKey: "匯入 Gemini API Key",
    },
    announcement: {
        dontShowToday: "今天不再顯示"
    },
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
    generateLimit: {
        title: "今日靈感已耗盡",
        message: "免費生成次數已用完。您可以點擊「更多選項」匯入自己的 Gemini API Key 來繼續無限暢遊！"
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
        shareSuccess: "分享成功！獲得一次額外召喚機會！",
        comingSoon: "還在「濕」工中... 敬請期待！",
        gachaZeroHint: "靈魂石用光了？分享殿堂中的女神、或回報 Bug/建議都能獲得補充，也可以等待明日重置喔！"
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
export const styles_o = [
    { id: 'vip-exclusive', title: '👑 VIP 專屬', description: '獨一無二，只能在命運的邂逅中偶遇的稀有女神', prompt: "" },
    { id: 'beach-silhouette', title: '🏖️ 沙灘剪影', description: '黃昏、唯美、充滿想像的浪漫詩篇', prompt: "A beautiful Asian model as a silhouette against a sunset on a deserted beach. She wears a light, semi-transparent white dress. The mood is romantic and beautiful." },
    { id: 'morning-lazy', title: '☀️ 晨光私房', description: '慵懶、私密、屬於你的女友感瞬間', prompt: "A sexy and curvy Asian model with a lazy aura on a messy bed. She wears an oversized men's shirt, unbuttoned, with black stockings. Morning sun streams through blinds, creating a soft, intimate, and seductive atmosphere." },
    { id: 'neon-noir', title: '💦 濕身惡女', description: '霓虹、慾望、無法抗拒的危險魅力', prompt: "A tall, wild, and seductive Asian model in a white shirt caught in a city alley downpour, against a backdrop of blurry neon lights. Her eyes are defiant and confident." },
    { id: 'cyberpunk-warrior', title: '🤖 賽博龐克戰姬', description: '未來、科技、堅毅眼神中的致命吸引力', prompt: "Cyberpunk style. A female Asian warrior in glowing mechanical armor, holding an energy sword. The background is a futuristic city with flying vehicles and towering skyscrapers." }
];

export const styles =[
    {
      "id": "vip-exclusive",
      "title": "👑 VIP 專屬",
      "description": "獨一無二，只能在命運的邂逅中偶遇的稀有女神",
      "prompt_zh": "在一次命運般的邂逅中，你遇見了那位傳說中的稀有女神，她的存在獨一無二，眼神中帶著一絲好奇，彷彿在等待著你。",
      "prompt": "A fateful encounter with a legendary, rare goddess. Her presence is utterly unique, and a hint of curiosity in her gaze suggests she was waiting just for you."
    },
    {
      "id": "beach-silhouette",
      "title": "🏖️ 夏日戀曲",
      "description": "海灘、性感，融化你心的夏日海灘戀曲",
      "prompt": "夏日豔陽海邊的沙灘，一位符合海邊辣妹的穿著(可以是比基尼、或是更吸引男人目光的海邊服裝)，對鏡頭展現熱情與互動。背景是蔚藍的海洋和金色的沙灘，陽光灑在她的身上，營造出一種熱情洋溢、充滿活力的氛圍。",
      "prompt_en": ""
    },
    {
      "id": "morning-lazy",
      "title": "☀️ 晨光私房",
      "description": "慵懶、私密、屬於你的女友感瞬間",
      "prompt": "清晨陽光隙灑在凌亂的大床上，一位身材曲線玲瓏、散發慵懶氣息的亞洲模特在床上。她僅穿著一件寬大的男友襯衫，釦子半開，眼神惺忪迷濛，翻來覆去對鏡頭撒嬌充滿私密的女友感與親密氛圍。",
      "prompt_en": ""
    },
    {
      "id": "neon-noir",
      "title": "💦 濕身魅魔",
      "description": "霓虹、慾望、無法抗拒的危險魅力",
      "prompt": "在大雨滂沱的城市巷弄中，一位高挑、狂野的亞洲惡女模特。被大雨淋濕，衣服濕透依稀可見內搭，背景是模糊閃爍的霓虹燈，倒映在濕滑的地面上。她的眼神充滿了挑釁與自信，散發著無法抗拒的危險魅力，畫面充滿不安與動感。",
      "prompt_en": ""
    },
    {
      "id": "cyberpunk-warrior",
      "title": "🤖 賽博龐克戰姬",
      "description": "未來、科技、堅毅眼神中的致命吸引力",
      "prompt": "(賽博龐克風格)在一座充滿飛行載具與參天大樓的未來城市中，一名身穿發光機械戰甲的亞洲女戰士，手持能量武器，眼神堅毅，剛打玩一場戰役或是跟怪獸廝殺完。展現出致命的吸引力，氣勢充滿英雄氣概與壓迫感。",
      "prompt_en": ""
    }];


export const randomKeywords_night= {
    "beach-silhouette": {
        hair: [
            "wet hair look", "platinum blonde long waves", "wind-swept messy hair", "high ponytail", "sunset ombre color",
            "deep brown flowing long hair", "mermaid waves", "side-swept long bangs", "beach braids", "salt-sprayed texture",
            "sun-bleached highlights", "top knot bun", "hair tied with a silk scarf", "double braids", "slick short hair",
            "damp hair ends", "halo effect on hair from sunlight", "seaweed green hair color", "coral pink highlights", "disheveled updo",
            "milkmaid braids", "side fishtail braid", "hair decorated with seashells", "strands of hair sticking to cheek", "voluminous big waves",
            "half-wet bangs", "fine sand in hair", "golden blonde hair under the sun", "jet black straight hair", "sunglasses perched on head"
        ],
        outfit: [
            "high-cut one-piece swimsuit", "pure white bikini", "cut-out design swimsuit", "wet white t-shirt", "sheer cover-up",
            "lace-trimmed bikini", "thong bikini bottom", "seashell bra top", "fishnet bodysuit", "tie-side bikini",
            "see-through silk long skirt", "denim hotpants", "topless with bikini bottom", "crochet bikini", "metal ring detailed swimsuit",
            "minimalist string bikini", "sporty swimwear", "underboob bikini", "side-tie bikini bottoms", "clear strap bikini",
            "neon colored swimsuit", "animal print bikini", "ruffled swimsuit", "waist cut-out one-piece", "front-tie top",
            "wide-brimmed sun hat", "body chain", "anklet", "shirt that becomes transparent when wet", "lightweight beach robe",
            "rash guard half-zipped", "cropped sports tank", "wrapped in a beach towel", "see-through silk sarong", "lace shorts",
            "crochet cover-up dress", "ultra-thin strap one-piece", "visible tan lines from a thong", "translucent silk pants", "covering chest with hands only",
            "metallic bikini", "sequin-embellished swimsuit", "backless one-piece swimsuit", "criss-cross front tie design", "leg garter"
        ],
        setting: [
            "golden beach at dusk", "wet black volcanic rocks", "palm grove on a deserted island", "deck of a luxury yacht", "in crystal clear shallow water"
        ],
        artStyle: [
            "cinematic lighting", "highly saturated colors", "backlit silhouette", "golden hour photography", "dynamic motion blur",
            "soft focus effect", "dramatic shadows", "ultra-wide-angle lens", "drone shot", "water surface reflection"
        ],
        bodyDetails: [
            "bronzed skin", "water droplets on skin", "glistening body oil", "toned abs", "long slender legs",
            "perky round buttocks", "deep cleavage", "sexy collarbones", "arching back curve", "sand on body",
            "moist lips", "hazy gaze", "delicate ankles", "parted lips", "hand brushing through hair",
            "water-drenched eyelashes", "tan lines", "toes buried in fine sand", "defined chest", "graceful neckline",
            "goosebumps from the sea breeze", "wet hair strands sticking to the back", "footprints sinking into wet sand", "butt-crease smile", "thigh gap",
            "vellus hair on skin highlighted by sun", "curve of the popliteal fossa (back of knee)", "outline of the elbow", "shadow of the groin", "lines of the instep",
            "red marks from tight swimwear", "a bead of sweat rolling down the spine", "lightly bitten lower lip", "a glance over the shoulder", "sun-kissed nose tip",
            "bony shoulders", "slender wrist", "toes with bright nail polish", "dimples of Venus", "gently closed eyes"
        ],
        expression: [
            "seductive smile", "eyes closed enjoying the sun", "playfully splashing water", "confident gaze", "tip of the tongue lightly touching lips",
            "affectionate gaze", "laughing heartily", "innocent expression", "playful wink", "pensive profile",
            "stretching languidly", "lightly biting a finger", "surprised glance back", "contented sigh", "inviting eyes"
        ],
        mood: [
            "romantic", "carefree", "dreamy", "passionate", "free-spirited",
            "sexy", "serene", "vibrant", "warm", "intimate",
            "adventurous", "golden", "idyllic", "sensual", "intoxicating"
        ],
        cameraAngles: [
            "low-angle shot", "underwater perspective", "bird's-eye view", "close-up on body details", "shot through palm leaves",
            "following shot", "point-of-view (POV)", "eye-level shot", "wide shot", "lens flare effect",
            "shot from the water's surface", "top-down shot while lying down", "frontal silhouette shot", "dynamic tracking", "reflection in sunglasses"
        ]
    },
    "morning-lazy": {
        hair: [
            "messy bun just woke up", "lazy low ponytail", "sleek straight long hair", "fluffy natural curls", "half-damp hair",
            "single side braid", "bangs casually clipped back", "chestnut medium-length hair", "bedhead waves", "silk scrunchie",
            "wispy tendrils framing the face", "bed-tousled ends", "airy bangs", "natural black hair", "fluffy bob",
            "hair combed through with fingers", "hair splayed on the pillow", "wrapped in a towel after a shower", "voluminous roots", "messy fringe",
            "ash blonde medium hair", "honey tea colored curls", "wearing a cute headband", "hair twirled around a finger", "long hair covering half the face",
            "morning light in hair", "rose gold hair color", "slightly flipped short hair ends", "hair brushing against collarbone", "waves from an undone braid"
        ],
        outfit: [
            "oversized boyfriend's white shirt", "silk slip nightgown", "lace lingerie set", "cotton crop top and panties", "thin knit cardigan",
            "wearing only panties", "bathrobe half-open", "over-the-knee socks", "g-string", "translucent gauze robe",
            "garter belt and stockings", "cute print lounge shorts", "off-shoulder sweater", "sexy teddy lingerie", "silk morning robe",
            "open-crotch lace panties", "sheer babydoll", "suspender belt", "fishnet stockings", "boy shorts",
            "button-front pajama top", "silk eye mask", "lace-trimmed shorts", "translucent shirt", "wearing only a bra",
            "fluffy slippers", "loose long t-shirt", "thin strap tank top", "silk pajama pants", "lace bralette",
            "whale tail", "shirt-tail hem missing", "bathrobe tie undone", "cardigan slipping off the shoulder", "faintly visible pasties",
            "high-waisted panties", "crotchless stockings", "sheer negligee", "silk kimono-style robe", "lace thong",
            "velvet thigh-high socks", "see-through chemise", "wrapped only in a duvet", "satin panties", "lace eye mask"
        ],
        setting: [
            "sun-drenched bedroom", "messy white bed", "windowsill with flowing curtains", "in front of a luxury hotel's floor-to-ceiling window", "in front of a bathroom mirror"
        ],
        artStyle: [
            "soft natural light", "warm color palette", "shallow depth of field", "intimate point of view", "candid lifestyle shot",
            "high-key overexposure effect", "airy photography", "close-up shot", "peeking through a doorway", "dreamy lens flare"
        ],
        bodyDetails: [
            "body curve while stretching", "sleepy, dazed eyes", "hickey on the collarbone", "lines of the inner thigh", "full breast outline",
            "sideboob", "butt-crease smile", "bare feet", "slender fingers", "slightly pouting lips",
            "delicate skin texture", "languid expression", "faintly visible butt crack", "rubbing eyes", "exposed shoulder",
            "crease marks from sheets on skin", "a soft yawn", "curve of the ankle", "outline of the kneecap", "soft curve of the belly",
            "light and shadow on the skin from sunlight", "sleepy eyelashes", "fingertips dragging across the sheets", "curled toes", "curve of the neck",
            "scapula (shoulder blades)", "tender skin on the inner elbow", "fleshy thighs", "sole of the foot", "a hint of a smile",
            "rise and fall of the chest with breath", "profile hidden by hair", "clean, rounded fingernails", "flushed cheeks", "natural sheen of the lips",
            "delicate skin on the inner arm", "curve of the waist", "shape of the buttocks in panties", "slightly red knees", "protruding ankle bone"
        ],
        expression: [
            "sleepy-eyed", "shy smile", "biting lip", "dazed look", "pouting playfully",
            "eyes closed in contentment", "gentle gaze", "yawning", "blushing cheeks", "thoughtful",
            "burying face in pillow", "peeking curiously", "softly murmuring", "seductive look back", "innocent expression"
        ],
        mood: [
            "intimate", "lazy", "cozy", "private", "sensual",
            "comfortable", "gentle", "serene", "sweet", "relaxed",
            "loving", "vulnerable", "authentic", "dreamy", "girlfriend-like"
        ],
        cameraAngles: [
            "top-down view on the bed", "through a gap in the sheets", "facial close-up", "boyfriend's POV", "reflection in a mirror",
            "shot from the feet upwards", "backlit silhouette", "slight shake of a handheld camera", "over-the-shoulder shot", "extreme close-up (lips, eyes)",
            "soft-focus shot through curtains", "view from the pillow", "low-angle shot", "eye-level", "peeking from outside the door"
        ]
    },
    "neon-noir": {
        hair: [
            "sleek wet slicked-back hair", "jet black bob cut", "high-gloss straight hair", "smoky purple hair color", "cornrows",
            "bold undercut", "silver-grey short hair", "electric blue highlights", "asymmetrical cut", "vintage finger waves",
            "high pompadour", "neon highlights", "shaved side with patterns", "long bangs covering one eye", "greaser hairstyle",
            "rain-drenched strands", "gel-sculpted style", "deep red long hair", "fluorescent green tips", "exaggerated updo",
            "braided dreadlocks", "water droplets in hair", "hair reflecting neon light", "smoky grey long waves", "sharp boyish short cut",
            "half-shaved long hair", "dark roots with light ends", "high-slit bangs", "braids with metal rings", "matte texture hairstyle"
        ],
        outfit: [
            "skintight patent leather dress", "transparent vinyl trench coat", "fishnet stockings with combat boots", "high-slit silk gown", "leather corset",
            "lingerie with metal chain details", "cut-out bodysuit", "black lace teddy", "soaking wet tank top", "micro leather skirt",
            "thigh-high stockings", "plunging neckline top to the navel", "wearing only a blazer", "latex catsuit", "metallic bustier",
            "ripped stockings", "sheer mesh top", "studded leather jacket", "choker collar", "vinyl leggings",
            "PVC skirt", "sequin jumpsuit", "see-through silk blouse", "leather harness", "lace gloves",
            "thigh-high heeled boots", "wet white shirt", "see-through grid top", "lace-up corset", "gown slit to the hip",
            "backless dress", "only wearing lingerie and a trench coat", "patent leather over-the-knee socks", "clothing with metal zippers", "lace-paneled leather skirt",
            "tank top with a slipped strap", "see-through panties", "sheer cheongsam", "full-body fishnet suit", "latex gloves",
            "metal chain skirt", "translucent raincoat", "tight bodysuit", "criss-cross back top", "leg harness"
        ],
        setting: [
            "rain-slicked neon street", "steamy back alley", "on the edge of a rooftop bar", "underground parking garage", "inside a vintage sports car"
        ],
        artStyle: [
            "high-contrast lighting", "neon glow", "film noir style", "mirror reflections", "intentional lens flare",
            "cool color tone", "handheld camera shake", "smoke effect", "bokeh background", "wide-angle distortion"
        ],
        bodyDetails: [
            "rainwater trickling down skin", "water droplet on red lips", "firm and seductive gaze", "taut muscle lines", "long fingers holding a cigarette",
            "imprints from fishnet stockings on legs", "sweaty neck", "sharp jawline", "desirous expression", "tattoos on body", "smudged lipstick at the corner of the mouth", "challenging stare", "wet eyelashes", "neon lights reflected in pupils", "biting lower lip",
            "fingertips grazing skin", "pulse throbbing in neck", "hardened nipples from the cold", "shadow of the groin", "clenched fist", "arch of the foot in high heels", "reflection in a puddle", "body contour visible through wet clothes", "a hint of vulnerability in the eyes", "exhaled smoke ring",
            "rings on fingers", "choker mark on the neck", "glint of an earring", "profile slick with rain", "glossy fullness of the lips", "muscle definition on thighs", "veins on the arms", "spinal groove", "water pooling in the clavicle", "focus of the gaze", "slightly teary eyes", "contour of the nose tip", "angle of the chin", "skin revealed by wind-blown clothes", "bony ankle"
        ],
        expression: [
            "indifferent gaze", "scornful smile", "hazy eyes", "defiantly raised chin", "exhaling smoke", "desperate look", "seductively licking lips", "expressionless", "disdainful look", "mocking smile", "eyes welling with tears", "determined stare", "weary expression", "dangerous smile", "intoxicated look"
        ],
        mood: [
            "decadent", "mysterious", "dangerous", "lonely", "tense", "desirous", "melancholic", "intense", "rebellious", "mesmerizing",
            "gritty", "suspenseful", "urban", "fallen", "poetic"
        ],
        cameraAngles: [
            "dutch angle", "extreme low-angle shot", "through a wet glass window", "reflection in a puddle", "extreme close-up of the eye", "tracking shot", "shot from the shadows", "high-angle under neon lights", "in-car shot", "out-of-focus foreground",
            "voyeuristic shot", "whip pan", "static long take", "shot from behind", "silhouette shot"
        ]
    },
    "cyberpunk-warrior": {
        hair: [
            "fluorescent pink sharp short hair", "futuristic braids", "metallic hair accessories", "half-shaved head style", "white high ponytail",
            "holographic gradient hair color", "LED fiber optic hair", "dreadlocks", "geometric sharp cut", "hair with data cables woven in", "circuit board pattern shave", "fiber optic braids", "spiky hair sculpted with clear gel", "liquid metal hair color", "mohawk",
            "braids with metallic threads", "UV reactive hair dye", "disconnected undercut", "virtual idol-like blue long hair", "chips embedded in hairstyle",
            "ponytail wrapped with wires", "short hair sprayed with metallic paint", "asymmetrical bangs", "hair glowing like fiber optics", "grey ombre",
            "high-tech updo", "sharp hair silhouette", "data stream effect on hair", "head-mounted display integrated with hair", "binary code pattern shave"
        ],
        outfit: [
            "tech-wear tight combat suit", "corset with metallic exoskeleton", "luminous functional jacket", "ripped tactical pants", "leather straps and buckles",
            "high-tech lingerie", "translucent energy shield material clothing", "liquid metal texture bodysuit", "tactical garter stockings", "asymmetrical armor design",
            "holographic projection fabric skirt", "tight leather pants", "futuristic trench coat", "exoskeleton armor", "functional vest", "boots with LED strips", "tactical gloves", "smart glasses", "memory metal stockings", "nanofiber bodysuit",
            "stockings with circuit board patterns", "luminous corset", "translucent tech-fabric top", "clothing with exposed data ports", "magnetic levitation accessories",
            "carbon fiber armor plates", "functional thigh rig bag", "liquid cooling tube decorations", "tactical high heels", "silk cape with holographic patterns",
            "wearing only a tactical vest and panties", "bodysuit with flowing energy lines", "lingerie made of lace and metal", "translucent tactical raincoat", "color-changing material clothing",
            "cut-out functional wear", "stockings with biosensors", "leather bodysuit with lace details", "futuristic cheongsam", "glowing garter belt",
            "optical camouflage suit flickering", "nano-silk lingerie", "tactical leg garter", "torn combat suit revealing silk lining", "high-tech eye patch"
        ],
        setting: [
            "future city full of holographic ads", "abandoned hangar with mech wreckage", "cockpit of a spaceship", "virtual space within a data stream", "gene lab filled with incubation pods"
        ],
        artStyle: [
            "cyberpunk aesthetic", "glitch art", "strong lens flare", "sharp and clear image quality", "dynamic panning shot", "wide-angle low-angle shot", "blue and purple dominant color scheme", "high-tech UI overlay", "holographic interference", "long exposure light trails"
        ],
        bodyDetails: [
            "determination and killing intent in eyes", "scars left from battle", "cybernetic limbs or body modifications", "hands gripping a weapon", "powerful muscles",
            "sweat dripping down the chin", "cold expression", "glowing circuits of body implants", "body tension during tactical movements", "a cold smirk at the corner of the mouth",
            "sharp catchlight in eyes", "strong thigh muscles", "cybernetic eye", "glowing veins under the skin", "panting after a fight",
            "taut calf muscles", "veins on arms", "data ports on skin", "glowing energy core on chest", "alert posture",
            "seam between metal limb and skin", "data stream reflected in pupils", "skin revealed under torn clothing", "imprints from tactical gloves on fingers", "chip implant on the neck",
            "muscle twitch", "defined abdominal line (V-cut)", "calluses on hands from weapons", "stains from battle", "chapped lips",
            "line of the spine", "old scars on knees", "width of the shoulders", "biomechanical tattoos on arms", "power unit at the ankle",
            "rise and fall of the chest", "tightly pressed lips", "furrowed brow", "scratch on the cheek", "cold texture of a prosthetic finger"
        ],
        expression: [
            "unwavering gaze", "cold", "contemptuous", "battle cry", "focused",
            "fearless", "defiant smile", "enduring pain", "alert", "furious",
            "weary but resolute", "determined", "dismissive glance", "victorious smirk", "calm and composed"
        ],
        mood: [
            "tense", "powerful", "dystopian", "rebellious", "high-tech", "resilient", "chaotic", "epic", "dark", "determined", "ruthless", "exhilarating", "survivalist", "lonely", "lethal"
        ],
        cameraAngles: [
            "low-angle action shot", "close-up on weapon/prosthetics", "enemy's POV", "high-angle overlooking the city", "dynamic tracking shot", "bullet time effect", "snap zoom", "over-the-shoulder view", "close-up with explosion in background", "security camera view",
            "shot through broken glass", "shaky cam", "wide-angle lens", "slow-motion close-up", "first-person view"
        ]
    }
};


/*
 * Celebrity Photoshoot Style Keywords (English Ver.)
 * Each theme is built around the styles of sexy, charming, cute, passionate, lively, and pure,
 * aiming to create vibrant, high-quality, modern photoshoot aesthetics.
 */

export const randomKeywords_day = {
    // Theme: {Beach} Sexy beach vibes, a summer love song to melt your heart
    'beach-silhouette': {
        hair: [
            "Salty long wavy blonde hair", "Fresh high ponytail black hair", "Sun-kissed ombre brown braids", "Wet look slicked-back short hair", "Pink highlighted double buns", "Linen-colored messy bun", "Aqua blue fishtail braid", "Caramel big wave curls", "Sleek straight silver hair", "Strawberry gold half-updo",
            "Deep purple waist-length hair", "Bright orange pixie cut", "Honey tea clavicle-length hair", "Misty lilac hime cut", "Natural black slightly curled medium hair", "Creamy platinum bob cut", "Peacock green dip-dyed ends", "Sunset-toned ombre hair", "Coral pink long curly hair", "Olive green wolf cut",
            "Dark brown Korean air bangs", "Wine red side-parted long hair", "Sky blue ear-loop highlights", "Milk tea colored wool curls", "Platinum blonde highlights", "Champagne gold lazy low ponytail", "Sapphire blue under-dye", "Sakura pink wavy hair", "Haze blue shoulder-length hair", "Chestnut brown retro curls"
        ],
        outfit: [
            "Pure white lace-trimmed bikini", "Tropical print one-piece swimsuit", "Neon-colored sporty bikini", "Hollow-out knit cover-up", "Denim hot pants with a crop top", "Flowy chiffon long dress", "Tie-side thong bikini bottom", "Wet white T-shirt", "Bohemian tassel cover-up", "High-cut one-piece swimsuit",
            "Sequin-embellished bikini top", "Linen beach pants", "Sheer see-through long dress", "Sporty surfing suit", "Criss-cross back-lacing swimsuit", "Ruffle-decorated bikini", "Simple classic black swimsuit", "Woven straw hat and sunglasses", "Hand-crocheted bikini", "Candy-colored three-point bikini", "Metal ring-detailed swimsuit", "Boyfriend-style oversized white shirt", "Ethnic print sarong", "Mesh see-through top", "Spaghetti strap backless beach dress",
            "Seashell-decorated bikini", "High-waisted retro bikini bottom", "Sports shorts and tank top", "One-shoulder design swimsuit", "Lace-trimmed crop top", "Sailor-style swimsuit", "Floral print sundress", "Patent leather bikini", "Waist cut-out one-piece swimsuit", "Lightweight sun protection jacket", "Silk scarf as a bikini top", "Gladiator sandals", "Jelly-colored transparent strap bikini", "Sports bra style bikini", "Mint green one-piece swimsuit",
            "Subtly visible lace lingerie", "Paper-thin silk cover-up", "White fishnet stockings with hot pants", "Low-rise beach pants with thong showing", "See-through silk scarf", "Lingerie-as-outerwear style bikini top", "Semi-transparent beach trousers", "Lace-trimmed white socks with sandals", "Silk hairband", "Lingerie-style one-piece swimsuit"
        ],
        setting: [
            "Beach at golden hour sunset", "Crystal clear shallow sea", "Secluded cove surrounded by giant rocks", "On the deck of a luxury yacht", "Beside an infinity pool"
        ],
        artStyle: [
            "Hyperrealistic high-saturation photography", "Cinematic widescreen style", "Fashion magazine cover quality", "Dynamic splashing water moment", "Fresh Japanese airy feel", "Western-style healthy skin tone", "Glossy oil painting texture", "Lively and candid shot style", "Vibrant color contrast", "Soft-focus dreamy portrait"
        ],
        bodyDetails: [
            "Glistening skin under the sun", "Healthy tan skin", "Subtle abs line", "Long and well-proportioned legs", "Skin covered in water droplets", "Delicate collarbones", "Slender ankles", "Natural muscle lines", "Dewy lips", "Sparkling manicure", "Elegant butterfly bones on the back", "Rounded shoulder line", "Vibrant body curves", "Faint bikini tan lines", "Flawless smooth back",
            "Toes with bright nail polish", "The hollow behind the knee", "The line of the thigh", "Tender skin on the inner arm", "Elegant curve of the neck", "Wind-blown hair brushing against the cheek", "Water droplets on eyelashes", "Delicate contour of the ear", "Slenderness of the wrist", "Soft curve of the waist", "Smile lines of the buttocks", "Flatness of the lower abdomen", "A light touch of the fingertips", "Arch of the foot", "Grains of sand on the skin", "Sunspots on the skin", "The curve of a smile", "The slight upturn of the nose", "The structure of the brow bone", "Fine lines at the corner of the eyes",
            "The hollow of the elbow", "The prominence of the ankle bone", "The line of the spinal groove", "The shape of the navel", "The sexiness of wet hair on the neck"
        ],
        expression: [
            "Bright sunny smile", "A smile over the shoulder", "Playful wink", "Intoxicated expression enjoying the sea breeze", "Seductive look biting the lip", "Innocent gaze", "Energetic shout", "Pensive look into the distance", "Slightly provocative smile", "Confident gaze at the camera",
            "Shy smile", "Eyes closed feeling the sun", "Slightly open mouth in surprise", "Cute look eating ice cream", "Playful tongue out"
        ],
        mood: [
            "Passionate", "Youthful and energetic", "Lazy and sexy", "Romantic and dreamy", "Carefree", "Fresh and natural", "Alluring", "Sweet and cute", "Sunny and cheerful", "Peaceful and serene", "Free-spirited", "Heart-touching", "Adventurous", "Fashionable and glamorous", "Innocent and pure"
        ],
        cameraAngles: [
            "Low-angle full-body shot", "High-angle shot showing curves", "Low angle close to the water surface", "Backlit silhouette effect", "Facial close-up", "Medium shot portrait", "Over-the-shoulder shot", "Dynamic handheld camera feel", "Tension from a wide-angle lens", "Compression from a telephoto lens", "Profile shot from the side", "Eye-level shot", "Dutch angle tilted composition", "First-person view (POV)", "Bird's-eye view"
        ]
    },
    // Theme: {Bed} Lazy, private, your girlfriend-like moments
    'morning-lazy': {
        hair: [
            "Messy long hair just woken up", "Lazy bun", "Soft brown big waves", "Casual side braid", "Slightly damp shoulder-length hair", "Fluffy air bangs", "Silky straight black hair", "Linen gold 'bedhead' style", "Chestnut low ponytail", "Short hair with a headband", "Naturally curly medium-length hair", "Long hair scattered on the pillow", "Deep grey bob cut", "Honey orange slight curls", "Champagne highlight long hair",
            "Bangs held by just a hairpin", "Half-dry frizzy texture", "Rose gold hair strands", "Deep blue long straight hair", "Creamy apricot clavicle hair", "Voluminous roots", "A few strands sticking to the cheek", "Lavender purple ends", "Chocolate brown inward curls", "Silver-white pixie cut", "Olive brown waist-length hair", "Cherry red middle part", "Misty black Korean curls", "Platinum blonde bun", "Honey-colored highlights"
        ],
        outfit: [
            "Boyfriend's oversized white shirt", "Silk spaghetti strap nightdress", "Lace lingerie set", "Soft knit sweater", "Loose cotton T-shirt", "Cute pattern pajama set", "Lightweight morning robe", "Just panties and a tank top", "Long hoodie sweatshirt", "Velvet material robe", "Hollow-out lace teddy", "Sports bra and shorts", "Pure cotton loungewear", "V-neck knit cardigan", "Garter belt and stockings",
            "Off-the-shoulder loose top", "Satin material shorts", "Semi-transparent sheer nightgown", "Fluffy home socks", "Japanese yukata-style robe", "Tie-up silk eye mask", "Tight ribbed tank top", "High-waisted cotton panties", "Oversized band T-shirt", "Cashmere blanket", "Cute animal onesie pajamas", "Puff-sleeve princess style nightdress", "Plaid cotton pajama pants", "Side-slit long robe", "Tencel material home set",
            "Embroidered silk robe", "Simple modal cotton tank top", "Ruffle-trimmed shorts", "Sexy thong", "Knit long socks", "Warm flannel pajamas", "Sheer babydoll nightgown", "Sporty style lounge shorts", "Backless silk nightdress", "Cat ear headband", "Black lace garter belt", "Seductive pure white thigh-high stockings", "Sheer mesh morning robe", "Nothing underneath a silk robe", "Crotchless panties",
            "Semi-transparent lace eye mask", "Silk-trimmed shorts set", "Silk nightgown with a slipped strap", "Body covered only by a sheet", "See-through white stockings"
        ],
        setting: [
            "Bedroom with sunlight filtering through blinds", "On a bed surrounded by white sheets and a duvet", "By the floor-to-ceiling window of a luxury hotel room", "A canopy bed", "Beside the bed on a soft carpet"
        ],
        artStyle: [
            "Soft natural light photography", "Warm-toned cinematic feel", "Intimate perspective candid shot", "Airy Japanese style", "High-resolution skin texture", "Dreamy soft-focus effect", "Minimalist composition", "Cozy home magazine style", "Oil painting-like texture", "Emphasis on light and shadow contrast"
        ],
        bodyDetails: [
            "Drowsy eyes just woken up", "Light and shadow on the collarbones", "Body curve while stretching", "Sheet marks on the skin", "Bare feet", "Slender fingers sliding over the sheets", "Slightly flushed cheeks", "Sexy shoulder and neck line", "Smooth back curve", "Subtle back dimples", "Natural body glow", "Full lips", "Long eyelashes", "Slight redness on the knees", "Elegant swan neck",
            "Vulnerability of the ankle", "Curled toes", "Translucent quality of skin in sunlight", "Ear contour beneath hair", "Soft skin of the inner elbow", "Rise and fall of the chest with breath", "Subtle movements of finger joints", "Moist sheen on lips", "Sleepiness in the corner of the eye", "Highlight on the bridge of the nose",
            "Shadow at the top of the thigh", "Graceful curve of the calf", "Curve of the hip's side", "Indentation of the spine", "Relaxed posture of the shoulders", "Veins on the inner wrist", "Natural gloss of fingernails", "Pinkish hue of the sole", "Softness of the abdomen", "Hair pressed under the body", "Shadow of eyelashes on the cheek", "Slightly parted lips", "Light and shadow in the hollow of the clavicle", "The line of the arm", "Delicate texture of the skin"
        ],
        expression: [
            "Sleepy smile", "Shyly hiding face with a blanket", "Lazy yawn", "Inviting gaze", "Content and peaceful expression", "Acting cute to the camera", "Gently biting lower lip", "Playfully hiding under the sheets", "Gentle gaze", "Lost in thought", "Confused look just after waking up", "Cute pout", "Happy smile", "A slightly teasing look", "Innocent stare"
        ],
        mood: [
            "Private", "Lazy", "Gentle", "Sexy", "Innocent", "Serene", "Intimate", "Relaxed", "Dreamy", "Comfortable", "Alluring", "Cute", "Secure", "Blissful", "Girlfriend-vibe"
        ],
        cameraAngles: [
            "Top-down shot (lying on bed)", "Eye-level shot (sitting on bed edge)", "First-person view (POV)", "Peeking through a door crack", "Extreme close-up on face", "Macro shot focusing on body details", "Backlit silhouette", "Shot using a mirror's reflection", "Full body shot from the foot of the bed", "High-angle bird's-eye view", "Low-angle shot looking up", "Soft focus with blurred background", "Over-the-shoulder view", "Handheld shaky documentary feel", "Wide-angle lens capturing the room's atmosphere"
        ]
    },
    // Theme: {City} Wet body, desire, irresistible dangerous charm
    'neon-noir': {
        hair: [
            "Soaked black long hair", "Silver short hair under neon lights", "Slicked-back neat hairstyle", "Cyberpunk style blue high ponytail", "Deep red big wave curls", "Fluorescent green dip-dyed ends", "Purple smoky ombre", "Wet strands sticking to the cheek", "Metallic textured braids", "Exaggerated afro",
            "Classic black bob cut", "Platinum blonde undercut", "Flame-toned highlights", "Dark green wolf cut", "Holographic hair", "Reflective jet-black straight hair", "Sapphire blue long curls", "Hot pink pixie cut", "Smoky grey medium-length hair", "Neon pink ear-loop highlights", "Dark aesthetic dreadlocks", "Bright red hime cut", "Braids with metal accessories", "Wet look slicked-back hair", "Split dye (half black, half white)",
            "Fluorescent yellow short hair", "Electric blue root dye", "Rainbow hidden dye", "Deep purple slicked-back hair", "Bright silver waist-length hair"
        ],
        outfit: [
            "Tight black leather suit", "Soaked white shirt", "Sequin slip dress", "Latex bodycon dress", "Ripped fishnet stockings", "High-slit evening gown", "Tank top with metal chain decoration", "Transparent PVC trench coat", "Sexy corset top", "Ultra-short leather hot pants", "Rivet-decorated biker jacket", "Snakeskin pattern leggings", "Backless silk dress", "Patent leather long boots", "Hollow-out knit sweater",
            "Sheer see-through top", "Metallic pleated skirt", "Corset", "Leopard print coat", "Reflective material jacket", "Gothic style lace long dress", "Futuristic metal armor", "Blazer paired with lingerie", "Lace-up design pants", "Feather-decorated shawl", "Diamond-embellished jumpsuit", "Techwear tactical vest", "Asymmetrical cut dress", "Leather garters", "Velvet suit",
            "See-through lace lingerie", "Metallic-colored bodysuit", "High-neck sleeveless tight top", "Tassel-decorated short skirt", "Exaggerated shoulder-padded blazer", "Glossy material trench coat", "Camouflage cargo pants", "Lace gloves", "Choker necklace", "Over-the-knee boots", "Soaked black lace lingerie showing through", "Torn black silk stockings", "Wearing only a silk shirt in the rain", "Latex catsuit", "Sheer tulle long skirt",
            "Fishnet bodysuit", "Garter belt with leather shorts", "Semi-transparent silk blouse", "Bondage-style corset", "Blazer with nothing underneath"
        ],
        setting: [
            "Slippery city streets after rain", "Alleyway flickering with neon signs", "Rooftop of a skyscraper", "Inside a futuristic bar", "Underground parking garage"
        ],
        artStyle: [
            "Strong light and shadow contrast (Chiaroscuro)", "Neon-toned cyberpunk aesthetic", "Blade Runner movie style", "Wet and reflective textures", "Dynamic motion blur street photography",
            "High-contrast black and white (with selective color)", "Dramatic distortion of a wide-angle lens", "Smoky and hazy atmosphere", "Retro Film Noir style", "Sharp and detailed fashion editorial quality"
        ],
        bodyDetails: [
            "Raindrops sliding down the cheek", "Skin outlined by neon light", "Curve of the body under wet clothes", "Desire in the eyes", "Water droplet on red lips", "Figure shrouded in smoke", "Determined jawline", "Slender fingers in leather gloves", "Ankle in high heels", "Bead of sweat on the neck", "Gaze reflecting light", "Contrast between metal accessories and skin", "Slightly parted lips", "Tense muscle lines", "Partially visible tattoo",
            "Water droplet sliding from the collarbone", "Reflection of neon lights on wet skin", "Fingers gently touching wet lips", "Wet hair stuck to forehead and neck", "A mix of blur and sharpness in the gaze",
            "Water splashing from high heels", "Contour of the leg under stockings", "Rain-soaked eyelashes", "Visible breath in the cold air", "Coldness of finger joints", "Upward tilt of the chin", "Tense lines of the shoulders", "Curve of the waist in a tight outfit", "Goosebumps on the skin", "Nipple contour visible under wet clothes", "Lips appearing more vivid under neon lights", "Dilated pupils", "Slightly furrowed brow", "Force of a clenched fist", "Skin at the edge of the boot",
            "Half of the face in shadow", "Reflection from a necklace on the neck", "Droplet on an earring", "The line of the spine", "The corner of a coat flapping in the wind"
        ],
        expression: [
            "Cold and distant gaze", "Fatal and seductive smile", "Provocative stare", "Lost in the city's daze", "Mysterious expression hidden in shadows", "A contemptuous glance", "A dangerous warning", "Deep eyes full of stories", "Fearless determination", "A sarcastic smirk", "A mix of vulnerability and strength", "Direct expression of desire", "Cold fury", "Tired but alert", "Confidence of being in control"
        ],
        mood: [
            "Dangerous", "Mysterious", "Sexy", "Distant", "Desire", "Powerful", "Decadent", "Futuristic", "Cold", "Tempting", "Rebellious", "Lonely", "Elegant", "Dramatic", "Fascinating"
        ],
        cameraAngles: [
            "Low-angle shot to emphasize presence", "Shot through a glass window", "Reflection in a puddle", "Street scene compressed by a telephoto lens", "Tracking shot following the subject",
            "Dutch angle to create unease", "Extreme close-up (on eyes or lips)", "Silhouette in the shadows", "High-angle bird's-eye view", "A voyeuristic perspective", "Perspective of a wide-angle lens", "Out-of-focus foreground", "Face partially obscured", "Shot from the back", "Eye-level confrontational feel"
        ]
    },
    // Theme: {War} Cyberpunk future, technology, fatal attraction in determined eyes
    'cyberpunk-warrior': {
        hair: [
            "Fluorescent pink sharp short hair", "Braids with LED light strips", "Metallic silver long hair", "Half-shaved punk hairstyle", "Holographic rainbow hair color", "Dreadlocks connected with data cables", "Circuit board pattern hair tattoo", "Bright blue high ponytail", "UV-reactive hair color", "Carbon fiber texture black hair",
            "Asymmetrical bob cut", "Matte texture grey hair", "Doll-like straight bangs", "Neon green wolf cut", "Geometric pattern hair dye", "Braids with metal rings", "Flame ombre short hair", "White optical fiber hair strands", "Deep purple and black split dye", "Transparent hair strands",
            "Laser-cut sharp hairlines", "Fluorescent orange buzz cut", "Dynamic hair color with data stream effect", "Bionic mechanical hair accessories", "Smoky purple long curls", "Green code pattern dye", "Titanium alloy colored straight hair", "Rose gold android hairstyle", "Electric purple undercut", "Black with fluorescent yellow highlights"
        ],
        outfit: [
            "Form-fitting nanotechnology combat suit", "Techwear jacket with glowing lines", "Tattered battle-damaged cloak", "Metal exoskeleton armor", "Leather and metal patched bodysuit",
            "Tactical vest and cargo pants", "Semi-transparent holographic fabric", "Asymmetrical armor design", "High-tech material trench coat", "Clothing with embedded LED lights",
            "Carbon fiber armor plates", "Heavy combat boots", "High-tech sniper's ghillie suit", "Gloves with holographic interface", "Tight-fitting stealth suit", "Magnetic levitation shoulder pads", "Energy shield generator device", "Bionic prosthetic limbs", "Multi-functional tactical belt", "Helmet with a visor", "Color-changing optical camouflage suit", "Anti-gravity boots", "Decorations of intertwined cables and tubes", "Bulletproof fiber leggings", "High-neck combat undershirt",
            "Military jacket with insignia", "Memory metal skirt", "Smart temperature-regulating fiber clothing", "Power-assisted exoskeleton", "Goggles or AR glasses", "Bodysuit with circuit board patterns", "Broken protective mask", "Energy core device", "Pants with pockets and straps", "Leather long gloves", "Reflective material hoodie", "Clothing with warning signs", "Modular armor plates", "Bio-fiber woven shawl", "Mask with night vision function",
            "Battle-damaged fishnet stockings", "Lace-trimmed lingerie under armor", "Semi-transparent energy shield cloak", "Tactical jacket with silk lining", "See-through nano-bodysuit",
            "Lingerie-style leather harnesses", "High-tech stockings", "Mix of armor and lace", "Techwear trench coat worn with nothing underneath", "Lingerie visible through torn combat suit"
        ],
        setting: [
            "Ruins of a destroyed futuristic city", "High-tech weapons laboratory", "Underground base under neon lights", "Cockpit of a spaceship", "Digital virtual battlefield"
        ],
        artStyle: [
            "High-contrast cool color tone", "Digital noise and Glitch Art", "Cinematic visual effects (VFX)", "Sharp and detailed texture", "Motion-blurred combat scenes",
            "First-person shooter (FPS) perspective", "Comic book paneling feel", "Dark tech style", "Industrial design aesthetic", "Effects full of lens flare"
        ],
        bodyDetails: [
            "Battle scar on the face", "Determined and unyielding eyes", "Glowing electronic circuits on the arm", "Bionic eye", "Muscle lines when gripping a weapon", "Skin mixed with sweat and dust", "A sense of exhaustion and power after battle", "Data port implanted in the skin", "Junction of metal prosthesis and flesh", "Sharp gaze",
            "Tense jaw from combat", "Barcode or ID on the neck", "Body silhouette under the power suit", "Calloused hands", "Pupils reflecting firelight", "Blood seeping from a wound", "Grease stains on the skin", "Mechanical structure under bionic skin", "Data stream in the pupils", "Rapid breathing during combat",
            "Tense back muscles", "Veins popping on the arm", "Chapped lips", "Focused, furrowed brow", "Sweat-soaked hairline", "Indentations from metal on skin", "Burn marks from energy weapons", "The body's combat stance", "Finger's position on the trigger", "Eyes scanning the environment", "Dust on the cheek", "Pulse beating in the neck", "Rise and fall of the chest", "Abdominal muscle lines", "Explosive power of leg muscles",
            "Panting after a fight", "A hint of exhaustion in the eyes", "A contemptuous smile", "A slight tremor in the body", "The texture of a scar"
        ],
        expression: [
            "Calm and composed combat expression", "A cold smile despising the enemy", "Relief after a victorious battle", "Determination to protect comrades", "Fearlessness in the face of desperation",
            "Eyes focused on the target", "Endurance hiding pain", "A moment of vulnerability", "Questioning technology", "The fire of revenge", "Alertness scanning the surroundings", "A sarcastic smile", "Sad but firm gaze", "A commanding tone", "Absolute confidence"
        ],
        mood: [
            "Resolute", "Combat", "Futuristic", "Dystopian", "Power",
            "Lonely hero", "Rebellion", "High-tech", "Cold", "Survival",
            "Epic", "Tense", "Tragic", "Hope", "Determination"
        ],
        cameraAngles: [
            "High-impact low-angle shot", "Shaky feel of a shoulder-mounted camera", "Bullet-time slow-motion close-up", "First-person view from a weapon's scope", "Grand battlefield under a wide-angle lens",
            "Heroic shot walking out of an explosion", "Facial close-up emphasizing the eyes", "Rapid push-pull zoom", "Lonely figure with back to the camera", "Bird's-eye view of the entire battlefield",
            "Tracking shot following the running protagonist", "View through a broken helmet", "Extreme high-angle shot", "Silhouette effect", "Shot from the enemy's perspective"
        ]
    }
}
