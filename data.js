// =================================================================================
// --- 資料區 (所有可編輯內容都在這裡) ---
// =================================================================================

const profileImage = "data/images/RR頭像.jpg";

const siteContent = {
    'zh-TW': {
        nav: [
            { href: '#home', text: '首頁' }, { href: '#about', text: '關於我' },
            { href: '#portfolio', text: '作品集' }, { href: '#videos', text: '影片' },
            { href: '#journey', text: '歷程' }, { href: '#novels', text: '小說' },
            { href: '#blog', text: 'Blog' }, { href: '#contact', text: '聯繫我' }
        ],
        home: {
            welcome: '歡迎來到',
            typingTexts: [
                "一個將奇思妙想付諸實現的創造者。",
                "遊走在程式碼、影像與文字之間。",
                "從一行腳本到一部小說，熱衷於從零到一的過程。",
                "相信最好的故事，來自最大膽的實踐。"
            ]
        },
        about: {
            title: '關於我',
            p1: "你好，我是 LayorX，你也可以稱呼我RR。我是一個熱衷於『把想法變為現實』的創造者。",
            p2: "我的旅程橫跨了影片剪輯、App 開發、自動化工具到 AI 應用與小說創作。這段看似跳躍的經歷，背後是我對新事物永不滿足的好奇心，以及用各種『小聰明』解決問題的熱情。更是將技術落實於生活，打造專屬 AI 助理與自動化工具的『生活黑客』。",
            p3: "我享受從零到一打造東西的過程，無論是一段能自動交易的程式碼、一部感動人心的客製化影片，還是一個引人入勝的奇幻故事。這個網站，便是我所有奇思妙想的匯集地。歡迎你，一同探索其中的可能性。",
            p4: "一位熱愛文字的開發者。 一位沉浸程式碼的夢想家。 探索技術與故事的邊界。",
            p5: `我不只是工程師或創作者，更能提供從專案企劃、技術執行到內容呈現的全方位解決方案。無論您需要：<li>功能完善的網站</li><li>提升效率的自動化工具</li><li>打動人心的數位內容</li><li>創意幽默的想法</li><br>我都能以最智慧、多元的方式幫助您實現目標。<br><br>此外，我對「說故事」充滿熱情，這份熱情不僅體現在百萬點閱的 YouTube 影片，也反映在我的科幻小說創作中。<br>這讓我能為技術專案注入生命力與使用者體驗，使每個專案不只是完成，而是有故事、有價值。<br><br>有任何想法歡迎聯繫我，共同探索專案的可能性，將想法轉化為真正可感知的成果。`
        },
        skills: {
            title: '我的技能',
            list: [
                { name: '網頁開發 (HTML, CSS, JS)', percentage: 81 },
                { name: '創意發想與實踐', percentage: 95 },
                { name: '專案構思與企劃', percentage: 91 },
                { name: 'AI 溝通與應用', percentage: 88 },
                { name: '影片製作與剪輯', percentage: 85 },
                { name: '自動化工具開發', percentage: 83 }
            ]
        },
        portfolio: {
            title: '作品集',
            filters: { all: '全部', web: '網頁開發', writing: '寫作', design: '設計' },
            viewDetails: '查看詳情',
            visitLink: '前往連結',
            list: [
                { title: '匹克球 LINE 揪團神器', category: 'web', images: ['data/images/pickleball-social.svg', 'data/images/pickleball-schedule.svg'], desc: '一個為實體運動社群打造的專屬排程與管理工具，無縫整合 LINE 平台。', details: '<h3>專案目標</h3><p>解決實體運動社群在揪團、排程與統計上的痛點，提供一站式的 LINE 整合服務。</p><h3>技術亮點</h3><ul><li><b>前端與介面：</b> 使用 LINE LIFF 打造無縫整合的行動端體驗。</li><li><b>後端與資料庫：</b> 採用 Node.js 開發 API，並結合 Supabase 實現高效、即時的資料庫庫存取與管理。</li></ul>' },
                { title: 'OpenClaw 專屬 AI 助理', category: 'web', images: ['data/images/openclaw-core.svg', 'data/images/openclaw-automation.svg'], desc: '基於 Telegram 的全能個人 AI 助理，能自動化處理生活與開發任務。', details: '<h3>專案目標</h3><p>打造一個高度客製化的私人助理，用於處理日常繁瑣任務、資訊檢索與專案管理。</p><h3>技術亮點</h3><ul><li><b>AI 核心整合：</b> 深度整合 Gemini CLI，具備強大的自然語言理解與生成能力。</li><li><b>安全授權：</b> 實作 OAuth 驗證機制，確保私人資料的安全性。</li><li><b>多功能模組：</b> 內建手遊測試封包分析輔助、加密貨幣最新資訊抓取，以及個人專案(如匹克球工具)的進度管理功能。</li></ul>' },
                { title: '思辨宇宙 (Thinking Verse)', category: 'web', images: ['data/images/TV.jpg', 'data/images/TV2.jpg','data/images/TV3.jpg','data/images/TV4.jpg','data/images/TV5.jpg'], desc: '一個專為深度討論而生的概念性網站。', details: `<h3>專案目標</h3><p>打造一個鼓勵理性思辨、避免無效爭論的線上平台。</p><h3>它以信任與深度/貢獻的動態平衡為核心，透過「雙星太極」概念，象徵信任與探索的共生關係。此平台旨在建構高媒體識讀社群，鼓勵用戶理性思辨、包容多元觀點，共同對抗假新聞，並維護高信任度的資訊交流空間</h3><ul><li>- 正反方論點陳述</li><li>- 思維導圖視覺化</li><li>- 引用與證據連結</li></ul>`, externalLink: './TKVv0.html' },
                { title: '夢境時差：七封謎信', category: 'writing', images: ['data/images/dream-jetlag_cover.jpg','data/images/dream-jetlag_01.jpg','data/images/dream-jetlag_02.jpg','data/images/dream-jetlag_03.jpg','data/images/dream-jetlag_04.jpg','data/images/dream-jetlag_05.jpg','data/images/dream-jetlag_06.jpg','data/images/dream-jetlag_07.jpg','data/images/dream-jetlag_08.jpg'], desc: '一部科幻懸疑小說，探索夢境與現實的邊界。', details: `<h3>故事簡介</h3><p>你是否曾思考，那些歷史上的「靈光乍現」與「神來一筆」，是否真的只是偶然？如果這一切，都源自於能在夢中加速學習、甚至影響現實的「超能力」？《夢境時差：七封謎信》將帶你進入一個令人屏息的世界，探索這項名為「夢創協同」（Dreaming Co-creation）的神秘力量，以及由此引發的一場悄然展開的「意識戰爭」。</p>`, externalLink: 'https://www.kadokado.com.tw/book/54331' },
                { title: 'Kai Cenat Meets Ray In Japan不同風格', category: 'design', images: ['data/images/KaiRay01.jpg','data/images/KaiRay02.jpg','data/images/KaiRay03.jpg','data/images/KaiRay04.jpg','data/images/KaiRay05.jpg'], desc: '這是一場結合了懷舊與創意的特別企劃！', details: `<h3>設計理念</h3><p>我們將 Kai Cenat 和他的粉絲 Ray 在日本相遇的經典場景，用充滿回憶的懷舊畫風重新詮釋。從像素風的遊戲畫面到復古動漫風格，每一幀都帶你回到過去的美好時光。快來看看你最喜歡哪一種風格，並在留言區分享你對這場相遇的看法吧！</p>`, externalLink: 'https://www.youtube.com/shorts/OqpmYnVaDeY' },
                { title: '沉浸式小說閱讀器', category: 'web', images: [ 'data/images/reader_showcase_03.jpg', 'data/images/reader_showcase_01.jpg', 'data/images/reader_showcase_02.jpg' ], desc: '一個專注於提供純粹、無干擾且可完全客製化的線上閱讀體驗的平台。從介面佈局到互動設計，每一個細節都為了「純粹的閱讀」而服務。', details: `<h3>設計理念</h3><p>閱讀本身應該是一種享受。此專案的目標是掃除一切數位閱讀的障礙，創造一個讓讀者能完全沉浸在故事世界中的環境。</p><h3>使用者體驗亮點</h3><ul><li><b>無縫導覽：</b> 透過進度條、快速跳轉按鈕與章節搜尋功能且有閱讀位置記憶功能自動返回上次的進度，讓閱讀無縫接軌，在長篇故事中也能輕鬆遨遊。</li><br><li><b>前端精雕、後端自動化：</b> 堅持使用 Vanilla JS親手打造，不引進任何框架，確保了程式碼的輕量與高效能，使用 Python 撰寫腳本，自動化處理文本解析、HTML 生成與 PWA 檔案配置，實現高效的內容管理流程。</li></ul>`, externalLink: 'novel_site/index.html' },
                { title: 'PuffPaleCloudy角色設計YunBao', category: 'design', images: ['data/images/PuffPaleCloudy.jpg','data/images/YunBaoLogo.jpg', 'data/images/YunBao.jpg','data/images/YunBao2.jpg'], desc: '兒童故事PuffPaleCloudy角色設計YunBao。', details: `<h3>角色故事</h3><p>雲寶 (YunBao) 是一隻害羞但充滿好奇心的小雲龍，他能吐出各種形狀的雲朵來表達自己的心情。</p>`, externalLink: 'https://www.youtube.com/@PuffPalsCloudy' },
                { title: '女神慾見GoddeSpark', category: 'web', images: [ 'data/images/g_showcase_01.jpg', 'data/images/g_showcase_00.jpg', 'data/images/g_showcase_02.jpg', 'data/images/g_showcase_03.jpg', 'data/images/g_showcase_04.jpg' ], desc: '一個基於 Gemini API 的互動式 AI 圖像生成應用。使用者可透過直覺介面，探索並創造風格獨特的女神角色，並透過收藏、語音故事與扭蛋等遊戲化機制，享受創造的樂趣。', details: `<h3>專案目標</h3><p>旨在探索 AI 生成藝術的可能性，打造一個讓使用者能輕鬆創造、互動並分享 AI 角色的平台。專案不僅展示了前端技術的應用，更專注於透過遊戲化設計提升使用者參與度。</p><h3>核心功能</h3><ul><li><b>即時圖像生成：</b> 串接 Google Gemini API，根據使用者選擇的風格即時生成高品質圖像。</li><li><b>互動遊戲機制：</b> 包含「我的最愛」收藏系統、可生成角色故事的 TTS 語音功能，以及充滿驚喜的「趣味扭蛋機」。</li><li><b>高度個人化：</b> 使用者可自由切換介面主題、開關音效，甚至匯入自己的 API Key 以解除生成限制。</li></ul><h3>技術亮點</h3><ul><li><b>前端架構：</b> 完全使用 Vanilla JS、HTML 與 Tailwind CSS 打造，不依賴任何框架，專注於原生效能與程式碼簡潔性。</li><li><b>API 整合：</b> 穩定串接 Gemini API，並設計了完整的 API Key 管理與錯誤處理流程。</li><li><b>音效與狀態管理：</b> 整合 Tone.js 創造豐富的音效回饋，並利用 Local Storage 實現使用者偏好與進度的本地持久化。</li></ul>`, externalLink: 'https://goddespark.netlify.app/' },
                { title: '個人品牌 Logo 設計', category: 'design', images: ['data/images/RR頭像.jpg', 'data/images/RR黑暗.jpg'], desc: '為個人小說品牌 RR(亞爾)設計的視覺識別。', details: `<h3>設計理念</h3><p>標誌以陰陽圖為基礎，左半邊是代表科技與理性的電路板，右半邊是代表文學與感性的書頁。</p>` },
                { title: '德州撲克戰績追蹤器', category: 'web', images: ['data/images/poker_showcase_01.jpg', 'data/images/poker_showcase_02.jpg'], desc: '一個為德州撲克玩家設計的本地化戰績追蹤與分析工具。', details: `<h3>專案目標</h3><p>提供一個無需註冊、資料完全本地儲存的解決方案，幫助玩家記錄每一場牌局的詳細數據，並透過視覺化圖表與 AI 分析，找出個人打法的優勢與待改進之處。</p><h3>核心功能</h3><ul><li>- 多帳戶管理系統</li><li>- 即時牌局計時與數據輸入</li><li>- 累積盈虧、All-in EV、不抽水EV等多維度圖表分析</li><li>- AI 智慧教練提供客製化文字分析</li><li>- CSV 資料匯入與匯出</li></ul>`, externalLink: './poker.html' },
                { title: 'GGPoker 手牌分析儀', category: 'web', images: ['https://i.meee.com.tw/mdMapSp.png'], desc: '一個完全免費、注重隱私、專注於輕量化網頁體驗的 GGPoker 手牌分析工具，讓您隨時隨地都能覆盤。', details: `<h3>專案目標</h3><p><strong>完全免費且開源：</strong> 無任何使用成本，程式碼透明，具備高度信任感。</p><p><strong>高度隱私保護：</strong> 所有運算均在使用者本機端完成，手牌數據不經過任何伺服器，無數據外洩風險。</p><p><strong>跨平台、免安裝：</strong> 只需要瀏覽器即可運作，方便在任何裝置上使用。</p><p><strong>數據可攜與累積：</strong> 分析結果可匯出成 JSON 檔案，方便使用者自行備份，並可在下次合併分析，實現長期數據追蹤。</p><p>`, externalLink: './ggpokerAnalyzer/index.html' },

            ]
        },
        videos: {
            title: '影片作品',
            subtitle: '以下都是我獨立製作的影片',
            loading: '影片載入中...',
            list: [
                { type: 'youtube', category: 'design', src: 'IZLCpQZ1AC8', title: 'The Storm of Ages – Epic Pirate Fantasy Trailer | Laugh Tale’s Call', description: '在大航海時代的中心地帶，有一位海盜鶴立雞群。艾瑞克「影手」維恩駕船駛入命運的風暴之中－駛向最後的島嶼：拉夫德爾。' },
                { type: 'youtube', category: 'design', src: 'ZVRhgtBONg8', title: '深山X古廟X和尚X書卷', description: '傳說深山裡有個廟，廟裡有個老和尚，老和尚手上有本書，書上說著傳說深山裡有個廟，廟裡有...' },
                { type: 'local', category: 'design', src: 'data/videos/The Last Ballot.mp4', title: '電影預告:最後一投，每一票都是未來', description: '一個快速展示AI製作影片的能力:選材、視角、音效...' },
                { type: 'youtube', category: 'design', src: 'uNC50TRFUk0', title: '戰爭電影拍攝', description: '一個快速展示AI製作影片的能力:選材、視角、音效...' },
                { type: 'youtube', category: 'design', src: 'UOlZPRojndg', title: '男友視角:你的女朋友剛醒來，懶洋洋地說早安…', description: '更特別的用ai產出邊界圖片影片' },
                { type: 'local', category: 'design', src: 'data/videos/Eagle Flight.mp4', title: '自由自在地飛翔', description: '感受金雕翱翔的絕美，它像徵著無拘無束的自由，翱翔於充滿活力的紅色峽谷。這首超現實的循環樂曲將帶你進入一個擁有無邊無際天空和輕鬆優雅姿態的世界！調高音量，聆聽令人心曠神怡的自然聲音。' }
            ]
        },
        journey: {
            title: '我的歷程',
            list: [
                { date: "2026 3月", title: "匹克球揪團系統開發", description: "為了優化在地社群體驗，採用 Node.js 與 Supabase 開發結合 LINE LIFF 的自動化排程工具。", icon: "fa-table-tennis", align: "right" },
                { date: "2026 2月", title: "OpenClaw AI 助理誕生", description: "整合 Gemini CLI 與 OAuth，開發專屬的 Telegram 全能個人助理，協助管理開發進度與市場資訊。", icon: "fa-robot", align: "left" },
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
            ]
        },
        blog: {
            title: '技術與生活 Blog',
            list: [
                { date: "2026年1月15日", title: "從封包分析到邏輯漏洞：手遊內購系統的安全性探討", summary: "開發遊戲輔助的過程中，往往能看見開發者忽視的盲區。本文將分享如何透過攔截與分析遊戲封包，探討行動裝置遊戲在支付驗證流程中常見的安全性漏洞與防禦策略。", file: "data/blog/mobile-game-security.txt" },
                { date: "2025年8月4日", title: "為什麼我選擇用 Vanilla JS 打造個人網站？", summary: "在充滿框架的時代，回歸基礎或許能帶來意想不到的收穫。本文分享我從零開始，不使用任何前端框架開發這個網站的心路歷程、技術抉擇與挑戰。", file: "data/blog/why-vanilla-js.txt" },
                { date: "2025年7月20日", title: "世界觀設定：如何為你的故事建立一個可信的宇宙", summary: "一個引人入勝的故事，背後往往有一個堅實的世界觀支撐。分享我在創作《夢境時差》時，如何設定規則、文化與衝突，讓虛構的世界感覺真實。", file: "data/blog/world-building.txt" },
                { date: "2020年10月30日", title: "tmux入門教學：提升您的終端機效率，輕鬆多項管理任務！", summary: "本文教學為您詳細介紹如何快速上手tmux，這個強大的終端機多工工具。文章內容涵蓋了從基礎的安裝、建議的自訂設置，到進入 tmux 環境和其中操作中的所有常用指令。無論您是剛接觸 tmux 的新手，還是希望提升工作效率的開發者，貫穿本文指南掌握會話、視窗 and 窗格的核心概念，輕鬆管理多個終端任務，讓您的操作更熟練、更有效率。", file: "data/blog/Tmux-Guide.txt" },
                { date: "2019年8月22日", title: "從錯誤訊息到核心調試：Kernel Panic問題的實戰分析", summary: "這篇文章深入探討了Linux Kernel Panic（核心崩潰）這個常見但棘手的問題。內容從Kernel Panic的幾個常見錯誤表現入，詳細列舉了導致崩潰的各種原因，包括解決體問題、系統過熱、檔案系統錯誤，以及核心更新不當等。此外，也提供了實用的方法，例如如何設定係統在Panic後自動重新啟動、如何利用Magic SysRq鍵處理無回應的系統，以及如何穿透分析核心追蹤資訊（stack） trace）來定位問題的根源。只要你是系統管理員、嵌入式開發者，還是想深入了解 Linux 核心相容原理的技術人員，這篇文章將為您提供寶貴的診斷思路和解決方案。", file: "data/blog/kernel-panic-problem.txt" }
            ]
        },
        novels: {
            readMore: '前往小說閱讀器',
            chapters: '章節列表(看更多請前往小說閱讀器)',
            attachments: '相關附件',
            list: [
                { title: "夢境時差：七封謎信", coverImage: "data/images/dream-jetlag_cover.jpg", description: "當夢境不再是虛幻，而成為可以學習、探索甚至戰鬥的第二現實，世界的規則將被徹底改寫。一名普通的YouTuber，意外收到七封來自神秘投稿人『RR』的信件，揭開了一個名為『夢創協同』的驚天秘密……這不僅是一個故事，更是一場席捲全球的意識革命。", contentList: [ { type: 'chapter', title: "📖序章：《哇哇哇！奇人異事！》啟動！", subtitle: "#我不知道它是不是真的，但我知道——我忘不了。", file: "data/novels/dream-jetlag/chapter-0.txt" }, { type: 'chapter', title: "📖第一章：《他在夢裡學完了 MIT 四年課程》", subtitle: "#我的夢想就是...做夢來工作", file: "data/novels/dream-jetlag/chapter-1.txt" }, { type: 'chapter', title: "📖第二章：《更大的流量，更大的危險》", subtitle: "#我本來想找個奇聞，結果好像找到了國安危機", file: "data/novels/dream-jetlag/chapter-2.txt" }, { type: 'letter', title: "✉️ 第一封信", file: "data/novels/dream-jetlag/letter-1.txt" }, { type: 'letter', title: "✉️ 第二封信", file: "data/novels/dream-jetlag/letter-2.txt" } ], link:"novel_site/dream-jetlag/chapter_chapter00.html" }
            ]
        },
        contact: {
            title: '聯繫我',
            description: '如果您對我的作品感興趣，想要合作、外包，或有任何疑問...都歡迎直接傳訊息給我，我會第一時間馬上回覆！',
            form: {
                name: '您的名字',
                email: '您的電子郵件',
                message: '您的訊息...',
                submit: '發送訊息'
            },
            status: {
                success: '感謝您的訊息，我會盡快回覆！',
                fail: '糟糕！訊息發送失敗。',
                error: '糟糕！訊息發送失敗，請檢查您的網路連線。'
            },
            social: '您也可以透過以下方式聯繫我：',
        },
        footer: {
            contact: '聯絡我們'
        },
        modals: {
            loading: '載入中...',
            error: '錯誤: 無法載入內容。',
            prev: '上一篇',
            next: '下一篇',
        }
    },
    'en': {
        nav: [
            { href: '#home', text: 'Home' }, { href: '#about', text: 'About' },
            { href: '#portfolio', text: 'Portfolio' }, { href: '#videos', text: 'Videos' },
            { href: '#journey', text: 'Journey' }, { href: '#novels', text: 'Novels' },
            { href: '#blog', text: 'Blog' }, { href: '#contact', text: 'Contact' }
        ],
        home: {
            welcome: 'Welcome to',
            typingTexts: [
                "A creator who brings whimsical ideas to life.",
                "Navigating between code, video, and text.",
                "Passionate about the journey from zero to one, from a script to a novel.",
                "Believing the best stories come from the boldest practices."
            ]
        },
        about: {
            title: 'About Me',
            p1: "Hello, I'm LayorX, but you can call me RR. I am a creator passionate about turning ideas into reality.",
            p2: "My journey spans video editing, app development, automation tools, AI applications, and novel writing. This seemingly eclectic experience is driven by an insatiable curiosity for new things and a passion for solving problems with 'clever' solutions and a 'life hacker' who implements technology into daily life by building personal AI assistants and automation tools.",
            p3: "I enjoy the process of building things from scratch, whether it's a piece of code for automated trading, a moving custom video, or a captivating fantasy story. This website is a collection of all my whimsical ideas. I welcome you to explore the possibilities within.",
            p4: "A developer who loves words. A dreamer immersed in code. Exploring the boundaries of technology and stories.",
            p5: `I am more than just an engineer or creator; I provide comprehensive solutions from project planning and technical execution to content presentation. Whether you need:<li>A fully functional website</li><li>Efficiency-boosting automation tools</li><li>Heart-touching digital content</li><li>Creative and humorous ideas</li><br>I can help you achieve your goals in the most intelligent and diverse ways.<br><br>Furthermore, I am passionate about "storytelling," a passion reflected not only in my YouTube videos with millions of views but also in my science fiction novel writing.<br>This allows me to inject vitality and user experience into technical projects, making each project not just complete, but also having a story and value.<br><br>Feel free to contact me with any ideas to jointly explore the project's possibilities and transform ideas into tangible results.`
        },
        skills: {
            title: 'My Skills',
            list: [
                { name: 'Web Development (HTML, CSS, JS)', percentage: 81 },
                { name: 'Creative Ideation & Execution', percentage: 95 },
                { name: 'Project Conception & Planning', percentage: 91 },
                { name: 'AI Communication & Application', percentage: 88 },
                { name: 'Video Production & Editing', percentage: 85 },
                { name: 'Automation Tool Development', percentage: 83 }
            ]
        },
        portfolio: {
            title: 'Portfolio',
            filters: { all: 'All', web: 'Web Dev', writing: 'Writing', design: 'Design' },
            viewDetails: 'View Details',
            visitLink: 'Visit Link',
            list: [
                { title: 'Pickleball LINE Meetup Tool', category: 'web', images: ['data/images/pickleball-social.svg', 'data/images/pickleball-schedule.svg'], desc: 'A dedicated scheduling and management tool built for physical sports communities, seamlessly integrated with the LINE app.', details: '<h3>Project Goal</h3><p>To solve the pain points of organizing, scheduling, and tracking attendance for local sports groups by providing an all-in-one LINE integrated service.</p><h3>Technical Highlights</h3><ul><li><b>Frontend & UI:</b> Built with LINE LIFF for a seamless mobile experience within the messaging app.</li><li><b>Backend & Database:</b> Developed robust APIs using Node.js, combined with Supabase for efficient, real-time database management.</li></ul>' },
                { title: 'OpenClaw Personal AI Assistant', category: 'web', images: ['data/images/openclaw-core.svg', 'data/images/openclaw-automation.svg'], desc: 'A versatile personal AI assistant based on Telegram, automating daily life and development tasks.', details: '<h3>Project Goal</h3><p>To build a highly customized private assistant for handling tedious daily tasks, information retrieval, and project management.</p><h3>Technical Highlights</h3><ul><li><b>AI Core Integration:</b> Deeply integrated with Gemini CLI, featuring powerful natural language understanding and generation capabilities.</li><li><b>Secure Authorization:</b> Implemented OAuth mechanisms to ensure the security of private data.</li><li><b>Multi-function Modules:</b> Built-in modules for mobile game packet analysis assistance, cryptocurrency news scraping, and personal project (like the Pickleball tool) management.</li></ul>' },
                { title: 'Thinking Verse', category: 'web', images: ['data/images/TV.jpg', 'data/images/TV2.jpg','data/images/TV3.jpg','data/images/TV4.jpg','data/images/TV5.jpg'], desc: 'A conceptual website designed for in-depth discussions.', details: `<h3>Project Goal</h3><p>To build an online platform that encourages rational debate and avoids fruitless arguments.</p><h3>Centered on a dynamic balance of trust and depth/contribution, it uses the "Binary Taiji" concept to symbolize the symbiotic relationship between trust and exploration. This platform aims to build a community with high media literacy, encouraging users to think critically, embrace diverse viewpoints, combat fake news, and maintain a high-trust information exchange space.</h3><ul><li>- Pro and con argument statements</li><li>- Mind map visualization</li><li>- Citation and evidence linking</li></ul>`, externalLink: './TKVv0.html' },
                { title: 'Dream Jetlag: The Seven Enigmatic Letters', category: 'writing', images: ['data/images/dream-jetlag_cover.jpg','data/images/dream-jetlag_01.jpg','data/images/dream-jetlag_02.jpg','data/images/dream-jetlag_03.jpg','data/images/dream-jetlag_04.jpg','data/images/dream-jetlag_05.jpg','data/images/dream-jetlag_06.jpg','data/images/dream-jetlag_07.jpg','data/images/dream-jetlag_08.jpg'], desc: 'A sci-fi mystery novel exploring the boundaries between dreams and reality.', details: `<h3>Synopsis</h3><p>Have you ever wondered if historical "strokes of genius" and "sudden inspirations" were merely coincidences? What if they all stemmed from a "superpower" to accelerate learning and even influence reality in dreams? "Dream Jetlag: The Seven Enigmatic Letters" will take you into a breathtaking world, exploring the mysterious power of "Dreaming Co-creation" and the ensuing silent "consciousness war."</p>`, externalLink: 'https://www.kadokado.com.tw/book/54331' },
                { title: 'Kai Cenat Meets Ray In Japan (Different Styles)', category: 'design', images: ['data/images/KaiRay01.jpg','data/images/KaiRay02.jpg','data/images/KaiRay03.jpg','data/images/KaiRay04.jpg','data/images/KaiRay05.jpg'], desc: 'A special project combining nostalgia and creativity!', details: `<h3>Design Concept</h3><p>We reinterpreted the classic scene of Kai Cenat and his fan Ray meeting in Japan with a nostalgic, retro art style. From pixel art game screens to vintage anime styles, each frame takes you back to the good old days. Come see which style you like best and share your thoughts on this encounter in the comments!</p>`, externalLink: 'https://www.youtube.com/shorts/OqpmYnVaDeY' },
                { title: 'Immersive Novel Reader', category: 'web', images: [ 'data/images/reader_showcase_03.jpg', 'data/images/reader_showcase_01.jpg', 'data/images/reader_showcase_02.jpg' ], desc: 'A platform focused on providing a pure, distraction-free, and fully customizable online reading experience. Every detail, from interface layout to interaction design, serves the purpose of "pure reading".', details: `<h3>Design Philosophy</h3><p>Reading should be an enjoyment. The goal of this project is to remove all obstacles of digital reading and create an environment where readers can fully immerse themselves in the story world.</p><h3>User Experience Highlights</h3><ul><li><b>Seamless Navigation:</b> With a progress bar, quick jump buttons, and a chapter search function, plus a feature that remembers your reading position, reading is seamless. Navigate long stories with ease.</li><br><li><b>Front-end Finesse, Back-end Automation:</b> Built with Vanilla JS without any frameworks for lightweight and high performance. A Python script automates text parsing, HTML generation, and PWA file configuration for efficient content management.</li></ul>`, externalLink: 'novel_site/index.html' },
                { title: 'PuffPaleCloudy Character Design: YunBao', category: 'design', images: ['data/images/PuffPaleCloudy.jpg','data/images/YunBaoLogo.jpg', 'data/images/YunBao.jpg','data/images/YunBao2.jpg'], desc: 'Character design "YunBao" for the children\'s story PuffPaleCloudy.', details: `<h3>Character Story</h3><p>YunBao is a shy but curious little cloud dragon who can breathe out clouds of various shapes to express his feelings.</p>`, externalLink: 'https://www.youtube.com/@PuffPalsCloudy' },
                { title: 'GoddeSpark', category: 'web', images: [ 'data/images/g_showcase_01.jpg', 'data/images/g_showcase_00.jpg', 'data/images/g_showcase_02.jpg', 'data/images/g_showcase_03.jpg', 'data/images/g_showcase_04.jpg' ], desc: 'An interactive AI image generation application based on the Gemini API. Users can explore and create unique goddess characters through an intuitive interface and enjoy the fun of creation with gamified features like collections, voice stories, and a gacha machine.', details: `<h3>Project Goal</h3><p>To explore the possibilities of AI-generated art by creating a platform where users can easily create, interact with, and share AI characters. The project not only showcases front-end technology but also focuses on enhancing user engagement through gamification.</p><h3>Core Features</h3><ul><li><b>Real-time Image Generation:</b> Connects to the Google Gemini API to generate high-quality images based on user-selected styles.</li><li><b>Interactive Game Mechanics:</b> Includes a "Favorites" collection system, a TTS voice feature for generating character stories, and a surprise-filled "Fun Gacha Machine."</li><li><b>High Personalization:</b> Users can switch interface themes, toggle sound effects, and even import their own API Key to bypass generation limits.</li></ul><h3>Technical Highlights</h3><ul><li><b>Front-end Architecture:</b> Built entirely with Vanilla JS, HTML, and Tailwind CSS, without relying on any frameworks, focusing on native performance and code simplicity.</li><li><b>API Integration:</b> Stably integrates with the Gemini API and includes complete API Key management and error handling.</li><li><b>Sound & State Management:</b> Integrates Tone.js for rich audio feedback and uses Local Storage for local persistence of user preferences and progress.</li></ul>`, externalLink: 'https://goddespark.netlify.app/' },
                { title: 'Personal Brand Logo Design', category: 'design', images: ['data/images/RR頭像.jpg','data/images/RR黑暗.jpg'], desc: 'Visual identity designed for the personal novel brand RR (Yar).', details: `<h3>Design Concept</h3><p>The logo is based on the yin-yang symbol. The left half is a circuit board representing technology and rationality, while the right half is a book page representing literature and sensibility.</p>` },
                { title: 'Texas Hold\'em Record Tracker', category: 'web', images: ['data/images/poker_showcase_01.jpg','data/images/poker_showcase_02.jpg'], desc: 'A localized record tracking and analysis tool for Texas Hold\'em players.', details: `<h3>Project Goal</h3><p>To provide a solution that requires no registration and stores all data locally, helping players record detailed data for each session and identify strengths and areas for improvement through visual charts and AI analysis.</p><h3>Core Features</h3><ul><li>- Multi-account management system</li><li>- Real-time session timer and data entry</li><li>- Multi-dimensional chart analysis including cumulative profit/loss, All-in EV, and non-raked EV</li><li>- AI smart coach providing customized text analysis</li><li>- CSV data import and export</li></ul>`, externalLink: './poker.html' },
                { title: 'GGPoker Hand Analyzer', category: 'web', images: ['https://i.meee.com.tw/mdMapSp.png'], desc: 'A completely free, privacy-focused, and lightweight GGPoker hand analysis tool, allowing you to review your hands anytime, anywhere.', details: `<h3>Project Goals</h3> <p><strong>Completely Free and Open Source:</strong> No usage costs, transparent code, and high level of trust.</p><p><strong>High Privacy Protection:</strong> All calculations are done locally on the user's device. Hand data does not pass through any server, eliminating the risk of data leaks.</p><p><strong>Cross-Platform and No Installation:</strong> Operates directly in the browser, making it convenient to use on any device.</p><p><strong>Portable and Accumulative Data:</strong> Analysis results can be exported as a JSON file, allowing users to back up their data and merge it for future analysis, enabling long-term data tracking.</p>`, externalLink: './ggpokerAnalyzer/index.html'},
            ]
        },
        videos: {
            title: 'Video Works',
            subtitle: 'All videos below are independently produced by me',
            loading: 'Loading video...',
            list: [
                { type: 'youtube', category: 'design', src: 'IZLCpQZ1AC8', title: 'The Storm of Ages – Epic Pirate Fantasy Trailer | Laugh Tale’s Call', description: 'In the heart of the great pirate era, one pirate stands above the rest. Eric "Shadowhand" Vane sails into the storm of destiny—towards the final island: Laugh Tale.' },
                { type: 'youtube', category: 'design', src: 'ZVRhgtBONg8', title: 'Deep Mountains X Ancient Temple X Monk X Scrolls', description: 'Legend has it there is a temple in the deep mountains, in the temple there is an old monk, the old monk has a book in his hand, and the book tells of a legend about a temple in the deep mountains, where there is...' },
                { type: 'local', category: 'design', src: 'data/videos/The Last Ballot.mp4', title: 'Movie Trailer: The Last Ballot, Every Vote is the Future', description: 'A quick demonstration of AI\'s ability to create videos: material selection, perspective, sound effects...' },
                { type: 'youtube', category: 'design', src: 'uNC50TRFUk0', title: 'War Movie Shooting', description: 'A quick demonstration of AI\'s ability to create videos: material selection, perspective, sound effects...' },
                { type: 'youtube', category: 'design', src: 'UOlZPRojndg', title: 'Boyfriend\'s POV: Your girlfriend just woke up, lazily saying good morning...', description: 'A more unique use of AI to generate videos with extended image boundaries.' },
                { type: 'local', category: 'design', src: 'data/videos/Eagle Flight.mp4', title: 'Flying Free', description: 'Experience the stunning beauty of a golden eagle in flight, a symbol of untamed freedom soaring through vibrant red canyons. This surreal loop will transport you to a world of endless skies and effortless grace! Turn up the volume and listen to the soothing sounds of nature.' }
            ]
        },
        journey: {
            title: 'My Journey',
            list: [
                { date: "March 2026", title: "Pickleball System Development", description: "Developed an automated scheduling tool combining Node.js, Supabase, and LINE LIFF to optimize the local community experience.", icon: "fa-table-tennis", align: "right" },
                { date: "February 2026", title: "Birth of OpenClaw AI Assistant", description: "Integrated Gemini CLI and OAuth to develop a versatile Telegram personal assistant for managing development progress and market info.", icon: "fa-robot", align: "left" },
                { date: "2025 - Present", title: "Launched Personal Website", description: "Learned and built this personal brand website from scratch to showcase all my whimsical ideas.", icon: "fa-code", align: "left" },
                { date: "July 2025", title: "Web Novel Writing", description: "Ventured into a new creative field, starting the sci-fi mystery novel 'Dream Jetlag: The Seven Enigmatic Letters'.", icon: "fa-feather-alt", align: "right" },
                { date: "2024", title: "AI Creation Explosion", description: "Intensively practiced and mastered AI video production, relaunching my YouTube channel in July to explore creative possibilities in the AI era.", icon: "fa-robot", align: "left" },
                { date: "2023", title: "NFC Tool Development", description: "Delved into hardware interaction, developing various NFC-related application tools.", icon: "fa-wifi", align: "right" },
                { date: "2022", title: "Automation Test Development", description: "Focused on 5G network test simulation and developed multiple automation testing tools to improve efficiency.", icon: "fa-network-wired", align: "left" },
                { date: "2021", title: "Mobile Game Bot Creation", description: "Challenged the underlying logic of games, successfully creating auxiliary bot tools for several mobile games.", icon: "fa-gamepad", align: "right" },
                { date: "2020", title: "Custom Video Production", description: "Applied editing skills commercially, taking commissions to create sentimental private memory videos for clients.", icon: "fa-video", align: "left" },
                { date: "2019", title: "Automated Trading Exploration", description: "Combined programming and finance to develop automated trading bots and create custom trading indicators.", icon: "fa-chart-line", align: "right" },
                { date: "2018", title: "VR App Development", description: "Self-taught to develop VR-related mobile practice apps, entering the field of mobile application development.", icon: "fa-vr-cardboard", align: "left" },
                { date: "2017", title: "YouTube Channel Management", description: "Made a debut by sharing explanations and edits, quickly gaining over 10,000 subscribers, with a single video hitting 2 million views in half a month and reaching #1 on trending.", icon: "fa-youtube", align: "right" }
            ]
        },
        blog: {
            title: 'Tech & Life Blog',
            list: [
                { date: "January 15, 2026", title: "From Packet Analysis to Logic Flaws: Security in Mobile Game In-App Purchases", summary: "When developing game assist tools, you often see the blind spots developers miss. This article shares how to explore common security vulnerabilities and defense strategies in the payment verification processes of mobile games through packet interception and analysis.", file: "data/blog/mobile-game-security.txt" },
                { date: "August 4, 2025", title: "Why I Chose Vanilla JS to Build My Personal Website", summary: "In an era full of frameworks, returning to the basics can bring unexpected rewards. This article shares my journey, technical choices, and challenges in developing this website from scratch without any front-end frameworks.", file: "data/blog/why-vanilla-js.txt" },
                { date: "July 20, 2025", title: "World-Building: How to Create a Believable Universe for Your Story", summary: "A compelling story is often supported by a solid world-view. I share how I set the rules, culture, and conflicts when creating 'Dream Jetlag' to make the fictional world feel real.", file: "data/blog/world-building.txt" },
                { date: "October 30, 2020", title: "tmux Beginner's Tutorial: Boost Your Terminal Efficiency and Manage Multiple Tasks with Ease!", summary: "This tutorial provides a detailed introduction to getting started quickly with tmux, the powerful terminal multiplexer. It covers everything from basic installation and recommended custom settings to entering the tmux environment and all common commands for operation. Whether you're a newcomer to tmux or a developer looking to improve your workflow, this guide will help you master the core concepts of sessions, windows, and panes to easily manage multiple terminal tasks, making your operations more proficient and efficient.", file: "data/blog/Tmux-Guide.txt" },
                { date: "August 22, 2019", title: "From Error Messages to Core Debugging: A Practical Analysis of Kernel Panic Issues", summary: "This article delves into the common but tricky issue of Linux Kernel Panic. It starts with several common error manifestations of a Kernel Panic and details various causes of crashes, including hardware issues, system overheating, file system errors, and improper kernel updates. It also provides practical methods, such as how to configure the system to automatically reboot after a panic, how to use the Magic SysRq key to handle an unresponsive system, and how to analyze the kernel stack trace to pinpoint the root cause of the problem. Whether you are a system administrator, an embedded developer, or a technician wanting to deeply understand the principles of Linux kernel stability, this article will provide you with valuable diagnostic ideas and solutions.", file: "data/blog/kernel-panic-problem.txt" }
            ]
        },
        novels: {
            readMore: 'Go to Novel Reader',
            chapters: 'Chapter List (See more in the reader)',
            attachments: 'Related Attachments',
            list: [
                { title: "Dream Jetlag: The Seven Enigmatic Letters", coverImage: "data/images/dream-jetlag_cover.jpg", description: "When dreams are no longer illusions but a second reality for learning, exploration, and even combat, the rules of the world will be completely rewritten. An ordinary YouTuber unexpectedly receives seven letters from a mysterious contributor named 'RR', uncovering a shocking secret called 'Dreaming Co-creation'... This is not just a story, but a global consciousness revolution.", contentList: [ { type: 'chapter', title: "📖 Prologue: Wow! Weird and Wonderful Things! Go!", subtitle: "#IDon'tKnowIfIt'sReal,ButIKnow—ICan'tForget.", file: "data/novels/dream-jetlag/chapter-0.txt" }, { type: 'chapter', title: "📖 Chapter 1: He Learned MIT's Four-Year Curriculum in His Dreams", subtitle: "#MyDreamIsTo...WorkInMyDreams", file: "data/novels/dream-jetlag/chapter-1.txt" }, { type: 'chapter', title: "📖 Chapter 2: More Traffic, More Danger", subtitle: "#IWasLookingForAnOddity,ButItSeemsI'veFoundANationalSecurityCrisis", file: "data/novels/dream-jetlag/chapter-2.txt" }, { type: 'letter', title: "✉️ First Letter", file: "data/novels/dream-jetlag/letter-1.txt" }, { type: 'letter', title: "✉️ Second Letter", file: "data/novels/dream-jetlag/letter-2.txt" } ], link:"novel_site/dream-jetlag/chapter_chapter00.html" }
            ]
        },
        contact: {
            title: 'Contact Me',
            description: 'If you are interested in my work, want to collaborate, outsource, or have any questions... feel free to send me a message directly, and I will reply as soon as possible!',
            form: {
                name: 'Your Name',
                email: 'Your Email',
                message: 'Your Message...',
                submit: 'Send Message'
            },
            status: {
                success: 'Thank you for your message, I will get back to you soon!',
                fail: 'Oops! The message failed to send.',
                error: 'Oops! The message failed to send, please check your internet connection.'
            },
            social: 'You can also reach me through the following channels:',
        },
        footer: {
            contact: 'Contact Us'
        },
        modals: {
            loading: 'Loading...',
            error: 'Error: Failed to load content.',
            prev: 'Previous',
            next: 'Next',
        }
    }
};
