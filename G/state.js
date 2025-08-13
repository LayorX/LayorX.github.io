import { serviceKeys } from './app-config.js';
import { styles } from './game-config.js';

export function getInitialState() {
    const storedApiKey = localStorage.getItem('userGeminiApiKey');
    const hasUserApiKey = !!storedApiKey;

    return {
        isGenerating: false,
        activeStyleId: styles[0].id,
        isStoryGenerating: false,
        isTtsGenerating: false,
        favorites: null,
        ownGoddessStreak: 0,
        touchStartX: 0,
        touchEndX: 0,
        currentSlideshowIndex: 0,
        currentTheme: 'night',
        userApiKey: storedApiKey || serviceKeys.defaultApiKey,
        hasUserApiKey: hasUserApiKey || !!serviceKeys.defaultApiKey,
    };
}
