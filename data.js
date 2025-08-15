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
        title: 'Kai Cenat Meets Ray In Japan不同風格', 
        category: 'design', 
        images: ['data/images/KaiRay01.png','data/images/KaiRay02.png','data/images/KaiRay03.png','data/images/KaiRay04.png','data/images/KaiRay05.png'],
        desc: '這是一場結合了懷舊與創意的特別企劃！',
        details: `<h3>設計理念</h3><p>我們將 Kai Cenat 和他的粉絲 Ray 在日本相遇的經典場景，用充滿回憶的懷舊畫風重新詮釋。從像素風的遊戲畫面到復古動漫風格，每一幀都帶你回到過去的美好時光。快來看看你最喜歡哪一種風格，並在留言區分享你對這場相遇的看法吧！</p>`,
        externalLink: 'https://www.youtube.com/shorts/OqpmYnVaDeY'
    },
    { 
    title: '沉浸式小說閱讀器', 
    category: 'web', 
    images: [
        'data/images/reader_showcase_03.jpg', 
        'data/images/reader_showcase_01.jpg',
        'data/images/reader_showcase_02.jpg'
    ],
    desc: '一個專注於提供純粹、無干擾且可完全客製化的線上閱讀體驗的平台。從介面佈局到互動設計，每一個細節都為了「純粹的閱讀」而服務。',
    details: `<h3>設計理念</h3>
             <p>閱讀本身應該是一種享受。此專案的目標是掃除一切數位閱讀的障礙，創造一個讓讀者能完全沉浸在故事世界中的環境。</p>
             <h3>使用者體驗亮點</h3>
             <ul>
                <li><b>無縫導覽：</b> 透過進度條、快速跳轉按鈕與章節搜尋功能且有閱讀位置記憶功能自動返回上次的進度，讓閱讀無縫接軌，在長篇故事中也能輕鬆遨遊。</li>
                <br>
                <li><b>前端精雕、後端自動化：</b> 堅持使用 Vanilla JS親手打造，不引進任何框架，確保了程式碼的輕量與高效能，使用 Python 撰寫腳本，自動化處理文本解析、HTML 生成與 PWA 檔案配置，實現高效的內容管理流程。</li>
                

             </ul>`,
    externalLink: 'novel_site/index.html' 
},
    { 
        title: 'PuffPaleCloudy角色設計YunBao', 
        category: 'design', 
        images: ['data/images/PuffPaleCloudy.png','data/images/YunBaoLogo.png', 'data/images/YunBao.png','data/images/YunBao2.png'],
        desc: '兒童故事PuffPaleCloudy角色設計YunBao。',
        details: `<h3>角色故事</h3><p>雲寶 (YunBao) 是一隻害羞但充滿好奇心的小雲龍，他能吐出各種形狀的雲朵來表達自己的心情。</p>`,
        externalLink: 'https://www.youtube.com/@PuffPalsCloudy' 
    },{
    title: '女神慾見GoddeSpark',
    category: 'web',
    images: [
        'data/images/g_showcase_01.jpg',
        'data/images/g_showcase_00.jpg', // 建議使用：主要介面截圖
        'data/images/g_showcase_02.jpg', // 建議使用：生成圖片的拼貼
        'data/images/g_showcase_03.jpg', // 建議使用：收藏庫或角色故事介面
        'data/images/g_showcase_04.jpg'  // 建議使用：扭蛋或設定介面
    ],
    desc: '一個基於 Gemini API 的互動式 AI 圖像生成應用。使用者可透過直覺介面，探索並創造風格獨特的女神角色，並透過收藏、語音故事與扭蛋等遊戲化機制，享受創造的樂趣。',
    details: `<h3>專案目標</h3>
              <p>旨在探索 AI 生成藝術的可能性，打造一個讓使用者能輕鬆創造、互動並分享 AI 角色的平台。專案不僅展示了前端技術的應用，更專注於透過遊戲化設計提升使用者參與度。</p>
              <h3>核心功能</h3>
              <ul>
                  <li><b>即時圖像生成：</b> 串接 Google Gemini API，根據使用者選擇的風格即時生成高品質圖像。</li>
                  <li><b>互動遊戲機制：</b> 包含「我的最愛」收藏系統、可生成角色故事的 TTS 語音功能，以及充滿驚喜的「趣味扭蛋機」。</li>
                  <li><b>高度個人化：</b> 使用者可自由切換介面主題、開關音效，甚至匯入自己的 API Key 以解除生成限制。</li>
              </ul>
              <h3>技術亮點</h3>
              <ul>
                  <li><b>前端架構：</b> 完全使用 Vanilla JS、HTML 與 Tailwind CSS 打造，不依賴任何框架，專注於原生效能與程式碼簡潔性。</li>
                  <li><b>API 整合：</b> 穩定串接 Gemini API，並設計了完整的 API Key 管理與錯誤處理流程。</li>
                  <li><b>音效與狀態管理：</b> 整合 Tone.js 創造豐富的音效回饋，並利用 Local Storage 實現使用者偏好與進度的本地持久化。</li>
              </ul>`,
    externalLink: 'https://goddespark.netlify.app/'
},
    { 
        title: '個人品牌 Logo 設計', 
        category: 'design', 
        images: ['data/images/RR頭像.jpg','data/images/RR黑暗.png'],
        desc: '為個人小說品牌 RR(亞爾)設計的視覺識別。',
        details: `<h3>設計理念</h3><p>標誌以陰陽圖為基礎，左半邊是代表科技與理性的電路板，右半邊是代表文學與感性的書頁。</p>`
    },    {
        title: '德州撲克戰績追蹤器',
        category: 'web',
        images: ['data/images/poker_showcase_01.jpg','data/images/poker_showcase_02.jpg'],
        desc: '一個為德州撲克玩家設計的本地化戰績追蹤與分析工具。',
        details: `<h3>專案目標</h3><p>提供一個無需註冊、資料完全本地儲存的解決方案，幫助玩家記錄每一場牌局的詳細數據，並透過視覺化圖表與 AI 分析，找出個人打法的優勢與待改進之處。</p><h3>核心功能</h3><ul><li>- 多帳戶管理系統</li><li>- 即時牌局計時與數據輸入</li><li>- 累積盈虧、All-in EV、不抽水EV等多維度圖表分析</li><li>- AI 智慧教練提供客製化文字分析</li><li>- CSV 資料匯入與匯出</li></ul>`,
        externalLink: './poker.html'
    },

];

const videosData = [
    { type: 'youtube', category: 'design', src: 'IZLCpQZ1AC8', title: 'The Storm of Ages – Epic Pirate Fantasy Trailer | Laugh Tale’s Call', description: '在大航海時代的中心地帶，有一位海盜鶴立雞群。艾瑞克「影手」維恩駕船駛入命運的風暴之中－駛向最後的島嶼：拉夫德爾。' },
    { type: 'youtube', category: 'design', src: 'ZVRhgtBONg8', title: '深山X古廟X和尚X書卷', description: '傳說深山裡有個廟，廟裡有個老和尚，老和尚手上有本書，書上說著傳說深山裡有個廟，廟裡有...' },
    { type: 'local', category: 'design', src: 'data/videos/The Last Ballot.mp4', title: '電影預告:最後一投，每一票都是未來', description: '一個快速展示AI製作影片的能力:選材、視角、音效...' },
    { type: 'youtube', category: 'design', src: 'uNC50TRFUk0', title: '戰爭電影拍攝', description: '一個快速展示AI製作影片的能力:選材、視角、音效...' },
    { type: 'youtube', category: 'design', src: 'UOlZPRojndg', title: '男友視角:你的女朋友剛醒來，懶洋洋地說早安…', description: '更特別的用ai產出邊界圖片影片' },
    { type: 'local', category: 'design', src: 'data/videos/Eagle Flight.mp4', title: '自由自在地飛翔', description: '感受金雕翱翔的絕美，它像徵著無拘無束的自由，翱翔於充滿活力的紅色峽谷。這首超現實的循環樂曲將帶你進入一個擁有無邊無際天空和輕鬆優雅姿態的世界！調高音量，聆聽令人心曠神怡的自然聲音。' }
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
    },
    { 
        date: "2020年10月30日", 
        title: "tmux入門教學：提升您的終端機效率，輕鬆多項管理任務！", 
        summary: "本文教學為您詳細介紹如何快速上手tmux，這個強大的終端機多工工具。文章內容涵蓋了從基礎的安裝、建議的自訂設置，到進入 tmux 環境和其中操作中的所有常用指令。無論您是剛接觸 tmux 的新手，還是希望提升工作效率的開發者，貫穿本文指南掌握會話、視窗和窗格的核心概念，輕鬆管理多個終端任務，讓您的操作更熟練、更有效率。", 
        file: "data/blog/Tmux-Guide.txt"
    },
    { 
        date: "2019年8月22日", 
        title: "從錯誤訊息到核心調試：Kernel Panic問題的實戰分析", 
        summary: "這篇文章深入探討了Linux Kernel Panic（核心崩潰）這個常見但棘手的問題。內容從Kernel Panic的幾個常見錯誤表現入，詳細列舉了導致崩潰的各種原因，包括解決體問題、系統過熱、檔案系統錯誤，以及核心更新不當等。此外，也提供了實用的方法，例如如何設定係統在Panic後自動重新啟動、如何利用Magic SysRq鍵處理無回應的系統，以及如何穿透分析核心追蹤資訊（stack） trace）來定位問題的根源。只要你是系統管理員、嵌入式開發者，還是想深入了解 Linux 核心相容原理的技術人員，這篇文章將為您提供寶貴的診斷思路和解決方案。", 
        file: "data/blog/kernel-panic-problem.txt"
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
        ],
        link:"novel_site/dream-jetlag/chapter_chapter00.html"
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
