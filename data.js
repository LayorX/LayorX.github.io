// =================================================================================
// --- 資料區 (所有可編輯內容都在這裡) ---
// =================================================================================

const profileImage = "data/images/RR頭像.jpg";

const aboutMeData = {
    p1: "你好，我是 LayorX，你也可以稱呼我RR。我是一個熱衷於『把想法變為現實』的創造者。",
    p2: "我的旅程橫跨了影片剪輯、App 開發、自動化工具到 AI 應用與小說創作。這段看似跳躍的經歷，背後是我對新事物永不滿足的好奇心，以及用各種『小聰明』解決問題的熱情。",
    p3: "我享受從零到一打造東西的過程，無論是一段能自動交易的程式碼、一部感動人心的客製化影片，還是一個引人入勝的奇幻故事。這個網站，便是我所有奇思妙想的匯集地。歡迎你，一同探索其中的可能性。",
    p4: "一位熱愛文字的開發者。 一位沉浸程式碼的夢想家。 探索技術與故事的邊界。"
};

const skillsData = [
    { name: '網頁開發 (HTML, CSS, JS)', percentage: 81 },
    { name: '創意發想與實踐', percentage: 95 },
    { name: '專案構思與企劃', percentage: 91 },
    { name: 'AI 溝通與應用', percentage: 88 },
    { name: '影片製作與剪輯', percentage: 85 },
    { name: '自動化工具開發', percentage: 83 }
];

const portfolioData = [
    { 
        title: '思辨宇宙 (Thinking Verse)', 
        category: 'web', 
        images: ['data/images/TV.jpg', 'data/images/TV2.jpg','data/images/TV3.jpg','data/images/TV4.jpg','data/images/TV5.jpg'],
        desc: '一個專為深度討論而生的概念性網站。',
        details: `<h3>專案目標</h3><p>打造一個鼓勵理性思辨、避免無效爭論的線上平台。</p><h3>它以信任與深度/貢獻的動態平衡為核心，透過「雙星太極」概念，象徵信任與探索的共生關係。此平台旨在建構高媒體識讀社群，鼓勵用戶理性思辨、包容多元觀點，共同對抗假新聞，並維護高信任度的資訊交流空間</h3><ul><li>- 正反方論點陳述</li><li>- 思維導圖視覺化</li><li>- 引用與證據連結</li></ul>`,
        externalLink: './TKVv0.html'
    },
    { 
        title: '夢境時差：七封謎信', 
        category: 'writing', 
        images: ['data/images/dream-jetlag_cover.png','data/images/dream-jetlag_01.png','data/images/dream-jetlag_02.png','data/images/dream-jetlag_03.png','data/images/dream-jetlag_04.png','data/images/dream-jetlag_05.png','data/images/dream-jetlag_06.png','data/images/dream-jetlag_07.png','data/images/dream-jetlag_08.png'],
        desc: '一部科幻懸疑小說，探索夢境與現實的邊界。',
        details: `<h3>故事簡介</h3><p>你是否曾思考，那些歷史上的「靈光乍現」與「神來一筆」，是否真的只是偶然？如果這一切，都源自於能在夢中加速學習、甚至影響現實的「超能力」？《夢境時差：七封謎信》將帶你進入一個令人屏息的世界，探索這項名為「夢創協同」（Dreaming Co-creation）的神秘力量，以及由此引發的一場悄然展開的「意識戰爭」。</p>`,
        externalLink: 'https://www.kadokado.com.tw/book/54331'
    },
    { 
        title: '個人品牌 Logo 設計', 
        category: 'design', 
        images: ['data/images/RR頭像.jpg','data/images/RR黑暗.png'],
        desc: '為個人小說品牌 RR(亞爾)設計的視覺識別。',
        details: `<h3>設計理念</h3><p>標誌以陰陽圖為基礎，左半邊是代表科技與理性的電路板，右半邊是代表文學與感性的書頁。</p>`
    },
    { 
        title: 'PuffPaleCloudy角色設計YunBao', 
        category: 'design', 
        images: ['data/images/PuffPaleCloudy.png','data/images/YunBaoLogo.png', 'data/images/YunBao.png','data/images/YunBao2.png'],
        desc: '兒童故事PuffPaleCloudy角色設計YunBao。',
        details: `<h3>角色故事</h3><p>雲寶 (YunBao) 是一隻害羞但充滿好奇心的小雲龍，他能吐出各種形狀的雲朵來表達自己的心情。</p>`,
        externalLink: 'https://www.youtube.com/@PuffPalsCloudy' 
    },
];

const videosData = [
    { type: 'youtube', category: 'design', src: 'IZLCpQZ1AC8', title: 'The Storm of Ages – Epic Pirate Fantasy Trailer | Laugh Tale’s Call', description: '在大航海時代的中心地帶，有一位海盜鶴立雞群。艾瑞克「影手」維恩駕船駛入命運的風暴之中－駛向最後的島嶼：拉夫德爾。' },
    { type: 'youtube', category: 'design', src: 'ZVRhgtBONg8', title: '深山X古廟X和尚X書卷', description: '傳說深山裡有個廟，廟裡有個老和尚，老和尚手上有本書，書上說著傳說...' },
    { type: 'local', category: 'design', src: 'data/videos/The Last Ballot.mp4', title: '影預告:最後一投，每一票都是未來', description: '一個快速展示AI製作影片的能力' },
    { type: 'local', category: 'design', src: 'data/videos/Eagle Flight.mp4', title: '自由自在地飛翔', description: '一個快速展示AI製作影片的能力' }
];

const journeyData = [
    { date: "2025 - 至今", title: "架設個人網站", description: "從零開始學習並打造這個展示所有奇思妙想的個人品牌網站。", icon: "fa-code", align: "left" },
    { date: "2025 7月", title: "網路小說撰寫", description: "開啟新的創作領域，開始撰寫長篇科幻懸疑小說《夢境時差：七封謎信》。", icon: "fa-feather-alt", align: "right" },
    { date: "2024", title: "AI 創作爆發", description: "瘋狂練習並掌握 AI 影片製作，於 7 月重啟 YouTube 頻道，探索 AI 時代的創作可能性。", icon: "fa-robot", align: "left" },
    { date: "2023", title: "NFC 工具開發", description: "深入硬體互動領域，開發各類 NFC 相關的應用工具。", icon: "fa-wifi", align: "right" },
    { date: "2022", title: "自動化測試開發", description: "專注於 5G 網路測試模擬，並開發多種自動化測試工具以提升效率。", icon: "fa-network-wired", align: "left" },
    { date: "2021", title: "手機遊戲外掛製作", description: "挑戰遊戲底層邏輯，成功製作多款手機遊戲的輔助外掛工具。", icon: "fa-gamepad", align: "right" },
    { date: "2020", title: "客製化影片製作", description: "將剪輯技能應用於商業，接受委託，為客戶製作充滿感情的私人回憶影片。", icon: "fa-video", align: "left" },
    { date: "2019", title: "自動化交易探索", description: "結合程式與金融，開發自動化交易買賣機器人，並製作專屬的交易指標。", icon: "fa-chart-line", align: "right" },
    { date: "2018", title: "VR App 開發", description: "自學開發 VR 相關的手機練習 APP，踏入移動應用開發領域。", icon: "fa-vr-cardboard", align: "left" },
    { date: "2017", title: "YouTube 頻道經營", description: "初試啼聲，透過解說與剪輯分享，頻道迅速累積破萬訂閱，單支影片半個月內突破200萬點閱，登上熱門發燒#1。", icon: "fa-youtube", align: "right" }
];

// 優化: 將 Blog 內容改為從 .txt 檔案讀取
const blogData = [
    { 
        date: "2025年8月4日", 
        title: "為什麼我選擇用 Vanilla JS 打造個人網站？", 
        summary: "在充滿框架的時代，回歸基礎或許能帶來意想不到的收穫。本文分享我從零開始，不使用任何前端框架開發這個網站的心路歷程、技術抉擇與挑戰。", 
        file: "data/blog/why-vanilla-js.txt"
    },
    { 
        date: "2025年7月20日", 
        title: "世界觀設定：如何為你的故事建立一個可信的宇宙", 
        summary: "一個引人入勝的故事，背後往往有一個堅實的世界觀支撐。分享我在創作《夢境時差》時，如何設定規則、文化與衝突，讓虛構的世界感覺真實。", 
        file: "data/blog/world-building.txt"
    }
];

const novelsData = [
    {
        title: "夢境時差：七封謎信",
        coverImage: "data/images/dream-jetlag_cover.png",
        description: "當夢境不再是虛幻，而成為可以學習、探索甚至戰鬥的第二現實，世界的規則將被徹底改寫。一名普通的YouTuber，意外收到七封來自神秘投稿人『RR』的信件，揭開了一個名為『夢創協同』的驚天秘密……這不僅是一個故事，更是一場席捲全球的意識革命。",
        contentList: [
            { type: 'chapter', title: "📖序章：《哇哇哇！奇人異事！》啟動！", subtitle: "#我不知道它是不是真的，但我知道——我忘不了。", file: "data/novels/dream-jetlag/chapter-0.txt" },
            { type: 'chapter', title: "📖第一章：《他在夢裡學完了 MIT 四年課程》", subtitle: "#我的夢想就是...做夢來工作", file: "data/novels/dream-jetlag/chapter-1.txt" },
            { type: 'chapter', title: "📖第二章：《更大的流量，更大的危險》", subtitle: "#我本來想找個奇聞，結果好像找到了國安危機", file: "data/novels/dream-jetlag/chapter-2.txt" },
            { type: 'letter', title: "✉️ 第一封信", file: "data/novels/dream-jetlag/letter-1.txt" },
            { type: 'letter', title: "✉️ 第二封信", file: "data/novels/dream-jetlag/letter-2.txt" }
        ]
    }
];

// 確保 main.js 載入後能找到此函式
if (typeof initializePage === 'function') {
    initializePage();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        if (typeof initializePage === 'function') {
            initializePage();
        }
    });
}
