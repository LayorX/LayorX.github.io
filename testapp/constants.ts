
import { User, Planet } from './types';

const trends: Array<'up' | 'stable' | 'down'> = ['up', 'stable', 'down'];

export const USERS: Record<string, User> = {
  'user-1': {
    id: 'user-1',
    name: '思辨者 A',
    avatar: 'https://picsum.photos/seed/user1/100/100',
    bio: '熱衷於從數據中尋找真相的探索者。相信理性對話是進步的基石。',
    pinnedContentId: 'arg-2-1',
    metrics: { 
      contribution: { value: 750, trend: trends[0] }, 
      trust: { value: 850, trend: trends[0] }, 
      depth: { value: 920, trend: trends[1] } 
    },
    metricHistory: [],
    ratedContent: {},
    notifications: [],
  },
  'user-2': {
    id: 'user-2',
    name: '觀察家 B',
    avatar: 'https://picsum.photos/seed/user2/100/100',
    bio: '保持中立，聆聽各方聲音。',
    metrics: { 
      contribution: { value: 600, trend: trends[2] }, 
      trust: { value: 720, trend: trends[0] }, 
      depth: { value: 650, trend: trends[1] } 
    },
    metricHistory: [],
    ratedContent: {},
    notifications: [],
  },
  'user-3': {
    id: 'user-3',
    name: '熱心網友 C',
    avatar: 'https://picsum.photos/seed/user3/100/100',
    bio: '熱愛生活，分享快樂！',
    metrics: { 
      contribution: { value: 950, trend: trends[1] }, 
      trust: { value: 680, trend: trends[2] }, 
      depth: { value: 450, trend: trends[2] } 
    },
    metricHistory: [],
    ratedContent: {},
    notifications: [],
  },
   'user-4': {
    id: 'user-4',
    name: '專家 D',
    avatar: 'https://picsum.photos/seed/user4/100/100',
    bio: '專注於科技倫理與社會影響研究。',
    metrics: { 
      contribution: { value: 880, trend: trends[0] }, 
      trust: { value: 950, trend: trends[0] }, 
      depth: { value: 800, trend: trends[1] } 
    },
    metricHistory: [],
    ratedContent: {},
    notifications: [],
  },
};

export const PLANETS: Planet[] = [
  {
    id: 'planet-1',
    title: '某科技公司發布 AI 新產品',
    category: '科技',
    categoryColor: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300',
    hotness: 85,
    isControversial: false,
    icon: '🤖',
    neutralDescription: '全球科技巨擘「FutureTech」於昨日發布其最新一代人工智能助理「Nexus-V」，宣稱在自然語言處理與多模態互動方面取得重大突破。',
    arguments: [
      {
        id: 'arg-1-1',
        authorId: 'user-4',
        type: 'pro',
        text: '此產品的創新技術將引領市場潮流，其處理速度比上一代提升50%，並採用環保材料製成，實現了技術與永續的結合。這不僅是技術的勝利，更是企業社會責任的體現。',
        evidence: '官方發表會數據連結',
        ratings: [],
      },
      {
        id: 'arg-1-2',
        authorId: 'user-2',
        type: 'con',
        text: '其隱私政策存在巨大風險，用戶數據可能被用於第三方廣告。雖然速度快，但能耗問題在官方文件中並未被詳細說明，這對環境的長期影響值得擔憂。',
        evidence: '隱私條款分析文章',
        ratings: [],
      },
    ],
    comments: [
        { id: 'com-1-1', authorId: 'user-3', text: '看起來很酷！不知道什麼時候上市？', ratings: [] }
    ]
  },
  {
    id: 'planet-2',
    title: '某政治人物訪問鄰國',
    category: '政治',
    categoryColor: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    hotness: 98,
    isControversial: true,
    icon: '🌍',
    neutralDescription: 'A國領導人於本週二抵達B國，展開為期三天的國是訪問，旨在討論雙邊貿易協定與區域安全議題。',
    arguments: [
       {
        id: 'arg-2-1',
        authorId: 'user-1',
        type: 'pro',
        text: '這次訪問有助於緩解兩國緊張關係，為未來的經濟合作鋪路，對區域穩定有正面影響。',
        evidence: '聯合聲明稿',
        ratings: [],
      },
      {
        id: 'arg-2-2',
        authorId: 'user-2',
        type: 'con',
        text: '訪問期間的數項協議過於偏向B國利益，可能損害本國特定產業，缺乏足夠的國會監督。',
        evidence: '經濟學家評論',
        ratings: [],
      },
    ],
    comments: [
      { id: 'com-2-1', authorId: 'user-4', text: '協議的細節需要更透明的公開。', ratings: [] },
    ]
  },
  {
    id: 'planet-3',
    title: '知名藝人戀情曝光',
    category: '八卦',
    categoryColor: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/50 dark:text-fuchsia-300',
    hotness: 92,
    isControversial: true,
    icon: '💖',
    neutralDescription: '知名藝人 A 與 B 被媒體拍到深夜同遊，舉止親密，引發外界對兩人戀情的猜測。雙方經紀公司均表示「藝人私事，不便回應」。',
    arguments: [],
    comments: [
      { id: 'com-3-1', authorId: 'user-3', text: '太驚訝了！他們兩個看起來好配！祝福！', ratings: [] },
      { id: 'com-3-2', authorId: 'user-2', text: '還是等官方證實吧，媒體捕風捉影也不是第一次了。', ratings: [] },
      { id: 'com-3-3', authorId: 'user-1', text: '我們應該更關注藝人的作品，而非他們的私生活。', parentId: 'com-3-2', ratings: [] },
    ]
  },
  {
    id: 'planet-4',
    title: '串流平台宣布漲價',
    category: '娛樂',
    categoryColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    hotness: 78,
    isControversial: false,
    icon: '🍿',
    neutralDescription: '全球最大的影音串流平台「StreamFlix」宣布，將於下月起調整其家庭方案的訂閱價格，漲幅約為15%。',
    arguments: [
       {
        id: 'arg-4-1',
        authorId: 'user-4',
        type: 'pro',
        text: '為了持續產出高品質的原創內容，適度的價格調整是必要的。這有助於平台維持健康的商業模式，最終受益的還是用戶。',
        evidence: '平台官方公告',
        ratings: [],
      },
      {
        id: 'arg-4-2',
        authorId: 'user-2',
        type: 'con',
        text: '漲價過於頻繁，且平台內容庫並未有顯著提升，此舉可能導致用戶流失至其他競爭平台。',
        evidence: '用戶社群討論截圖',
        ratings: [],
      },
    ],
    comments: []
  },
  {
    id: 'planet-5',
    title: '學術界發現古文明遺址',
    category: '學術',
    categoryColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
    hotness: 65,
    isControversial: false,
    icon: '🏛️',
    neutralDescription: '一支國際考古團隊在中美洲叢林深處，透過光達技術發現了一座前所未見的古城遺址，初步判斷屬於前古典期文明。',
    arguments: [],
    comments: [
      { id: 'com-5-1', authorId: 'user-1', text: '這簡直是本世紀最偉大的發現之一！希望能盡快看到研究論文發表。', ratings: [] },
      { id: 'com-5-2', authorId: 'user-4', text: '光達技術在考古學的應用越來越成熟了，這是一個很好的例子。', ratings: [] }
    ]
  },
    {
    id: 'planet-6',
    title: '電影《星際迷航者》續集評價兩極',
    category: '電影',
    categoryColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    hotness: 88,
    isControversial: true,
    icon: '🎬',
    neutralDescription: '備受期待的科幻大片《星際迷航者：重生》上映後，影評網站與觀眾社群出現了極端分化的評價。',
    arguments: [
      {
        id: 'arg-6-1',
        authorId: 'user-1',
        type: 'pro',
        text: '電影在視覺特效和世界觀建構上達到了新的高度，導演對人性的探討也比前作更有深度，是部值得進戲院體驗的佳作。',
        evidence: '某影評網站正面評論連結',
        ratings: [],
      },
      {
        id: 'arg-6-2',
        authorId: 'user-3',
        type: 'con',
        text: '劇情鬆散，角色動機不明，完全浪費了這麼好的設定。感覺只是為了特效而拍，故事核心很空洞。',
        evidence: '社群負評截圖',
        ratings: [],
      },
    ],
    comments: []
  },
  {
    id: 'planet-7',
    title: '在家工作是否應成為常態？',
    category: '生活',
    categoryColor: 'bg-lime-100 text-lime-800 dark:bg-lime-900/50 dark:text-lime-300',
    hotness: 70,
    isControversial: true,
    icon: '🏠',
    neutralDescription: '疫情過後，許多企業開始要求員工返回辦公室，但部分員工則希望能維持遠距工作的模式，引發了關於未來工作型態的廣泛討論。',
    arguments: [
       {
        id: 'arg-7-1',
        authorId: 'user-2',
        type: 'pro',
        text: '在家工作能節省通勤時間與成本，提升員工生活品質與滿意度。只要有良好的管理制度，生產力並不會下降。',
        evidence: '史丹佛大學研究報告',
        ratings: [],
      },
      {
        id: 'arg-7-2',
        authorId: 'user-4',
        type: 'con',
        text: '遠距工作削弱了團隊凝聚力與非正式的知識交流。許多創意的火花是在實體互動中產生的，這對企業長期創新不利。',
        evidence: '哈佛商業評論文章',
        ratings: [],
      },
    ],
    comments: [
      { id: 'com-7-1', authorId: 'user-3', text: '混合模式可能是最好的解決方案？', ratings: [] }
    ]
  }
];