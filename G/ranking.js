import { getTopUsersByStat, getTopGoddesses, getUserData } from './gfirebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// --- DOM 元素 ---
let DOMElements = {};

// --- 狀態 ---
let state = {
    currentMainTab: 'creators',
    currentCreatorSubTab: 'shares',
    currentGoddessSubTab: 'likes',
    isLoading: false,
    authReady: false,
};

// --- 初始化 ---
window.onload = () => {
    // 應用儲存的主題
    const savedTheme = localStorage.getItem('theme') || 'night';
    document.body.classList.add(savedTheme === 'day' ? 'theme-day' : 'theme-night');

    // 獲取所有需要的 DOM 元素
    DOMElements = {
        mainTabs: document.querySelectorAll('.main-tab'),
        creatorSubTabs: document.querySelectorAll('#creator-sub-tabs .sub-tab'),
        goddessSubTabs: document.querySelectorAll('#goddess-sub-tabs .sub-tab'),
        creatorContent: document.getElementById('creators-content'),
        goddessContent: document.getElementById('goddesses-content'),
        creatorList: document.getElementById('creator-list'),
        goddessList: document.getElementById('goddess-list'),
        loadingIndicator: document.getElementById('loading-indicator'),
    };

    // 監聽 Firebase 認證狀態
    onAuthStateChanged(window.auth, (user) => {
        if (user) {
            state.authReady = true;
            // 認證成功後，載入預設的排行榜
            fetchAndDisplayRankings();
        } else {
            // 如果需要，可以處理未登入的情況
            console.log("User is not signed in.");
        }
    });

    // 綁定事件監聽
    setupEventListeners();
};

// --- 事件處理 ---
function setupEventListeners() {
    DOMElements.mainTabs.forEach(tab => {
        tab.addEventListener('click', () => handleMainTabClick(tab.dataset.tab));
    });
    DOMElements.creatorSubTabs.forEach(tab => {
        tab.addEventListener('click', () => handleCreatorSubTabClick(tab.dataset.subtab));
    });
    DOMElements.goddessSubTabs.forEach(tab => {
        tab.addEventListener('click', () => handleGoddessSubTabClick(tab.dataset.subtab));
    });
}

function handleMainTabClick(tabName) {
    if (state.isLoading || state.currentMainTab === tabName) return;
    state.currentMainTab = tabName;
    updateMainTabsUI();
    fetchAndDisplayRankings();
}

function handleCreatorSubTabClick(subTabName) {
    if (state.isLoading || state.currentCreatorSubTab === subTabName) return;
    state.currentCreatorSubTab = subTabName;
    updateCreatorSubTabsUI();
    fetchAndDisplayRankings();
}

function handleGoddessSubTabClick(subTabName) {
    if (state.isLoading || state.currentGoddessSubTab === subTabName) return;
    state.currentGoddessSubTab = subTabName;
    updateGoddessSubTabsUI();
    fetchAndDisplayRankings();
}


// --- 資料獲取與渲染 ---
async function fetchAndDisplayRankings() {
    if (state.isLoading || !state.authReady) return;

    setLoading(true);

    if (state.currentMainTab === 'creators') {
        await renderCreatorRankings();
    } else {
        await renderGoddessRankings();
    }

    setLoading(false);
}

async function renderCreatorRankings() {
    const statMap = {
        shares: { field: 'shares', unit: '次分享' },
        generations: { field: 'generateOne', unit: '次製造' },
        gacha: { field: 'gachaDraws', unit: '次扭蛋' },
    };
    const currentStat = statMap[state.currentCreatorSubTab];

    try {
        const topUsersStats = await getTopUsersByStat(currentStat.field, 10);

        if (topUsersStats.length === 0) {
            DOMElements.creatorList.innerHTML = renderEmptyState("此榜單暫無英雄，快來成為第一人！");
            return;
        }

        // 並行獲取所有上榜者的暱稱
        const usersWithNicknames = await Promise.all(
            topUsersStats.map(async (userStat) => {
                const userData = await getUserData(userStat.id);
                return { ...userStat, nickname: userData?.nickname || '無名氏' };
            })
        );
        
        DOMElements.creatorList.innerHTML = usersWithNicknames.map((user, index) => 
            renderCreatorItem(user, index, currentStat.unit)
        ).join('');

    } catch (error) {
        console.error("Error fetching creator rankings:", error);
        DOMElements.creatorList.innerHTML = renderEmptyState("讀取排行榜時發生錯誤...");
    }
}

async function renderGoddessRankings() {
    const orderByField = state.currentGoddessSubTab; // 'likes' or 'dislikes'
    try {
        const topGoddesses = await getTopGoddesses(orderByField, 12);

        if (topGoddesses.length === 0) {
            DOMElements.goddessList.innerHTML = renderEmptyState("還沒有女神上榜喔！");
            return;
        }

        DOMElements.goddessList.innerHTML = topGoddesses.map((goddess, index) => 
            renderGoddessItem(goddess, index)
        ).join('');

    } catch (error) {
        console.error("Error fetching goddess rankings:", error);
        DOMElements.goddessList.innerHTML = renderEmptyState("讀取排行榜時發生錯誤...");
    }
}


// --- UI 更新與 HTML 模板 ---
function setLoading(isLoading) {
    state.isLoading = isLoading;
    DOMElements.loadingIndicator.style.display = isLoading ? 'flex' : 'none';
    if (isLoading) {
        DOMElements.creatorList.innerHTML = '';
        DOMElements.goddessList.innerHTML = '';
    }
}

function updateMainTabsUI() {
    DOMElements.mainTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === state.currentMainTab);
    });
    DOMElements.creatorContent.classList.toggle('active', state.currentMainTab === 'creators');
    DOMElements.goddessContent.classList.toggle('active', state.currentMainTab === 'goddesses');
}

function updateCreatorSubTabsUI() {
    DOMElements.creatorSubTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.subtab === state.currentCreatorSubTab);
    });
}

function updateGoddessSubTabsUI() {
    DOMElements.goddessSubTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.subtab === state.currentGoddessSubTab);
    });
}

function renderCreatorItem(user, index, unit) {
    const rank = index + 1;
    let rankDisplay;
    if (rank === 1) rankDisplay = '🥇';
    else if (rank === 2) rankDisplay = '🥈';
    else if (rank === 3) rankDisplay = '🥉';
    else rankDisplay = `#${rank}`;

    return `
        <div class="creator-item">
            <div class="creator-rank">${rankDisplay}</div>
            <div class="creator-info">
                <div class="creator-nickname">${user.nickname}</div>
                <div class="creator-id">ID: ...${user.id.slice(-6)}</div>
            </div>
            <div class="creator-stat">${user.statValue} ${unit}</div>
        </div>
    `;
}

function renderGoddessItem(goddess, index) {
    const rank = index + 1;
    return `
        <div class="goddess-card">
            <img src="${goddess.imageUrl}" alt="Ranked Goddess" loading="lazy">
            <div class="goddess-rank">TOP ${rank}</div>
            <div class="goddess-stats">
                <span class="likes">👍 ${goddess.likeCount || 0}</span>
                <span class="dislikes">👎 ${goddess.dislikeCount || 0}</span>
            </div>
        </div>
    `;
}

function renderEmptyState(message) {
    return `
        <div class="empty-state">
            <div class="empty-state-icon">🤷</div>
            <p>${message}</p>
        </div>
    `;
}
