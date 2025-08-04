
import { Metric, Rating, User } from '../types';
import { ArrowUpIcon, ArrowDownIcon, ArrowStableIcon } from '../components/icons';

const LEVELS = [
    { level: 'D', min: 0, color: 'hsl(0, 0%, 50%)' },
    { level: 'C', min: 300, color: 'hsl(30, 80%, 55%)' },
    { level: 'B', min: 500, color: 'hsl(205, 80%, 55%)' },
    { level: 'A', min: 700, color: 'hsl(260, 80%, 60%)' },
    { level: 'S', min: 850, color: 'hsl(340, 80%, 60%)' },
    { level: 'SS', min: 950, color: 'hsl(45, 100%, 50%)' },
];

const getLevelInfo = (score: number) => {
    const currentLevelInfo = LEVELS.slice().reverse().find(l => score >= l.min) || LEVELS[0];
    const currentLevelIndex = LEVELS.findIndex(l => l.level === currentLevelInfo.level);
    const nextLevelInfo = LEVELS[currentLevelIndex + 1];

    let progress = 0;
    let levelWithModifier = currentLevelInfo.level;

    if (nextLevelInfo) {
      const range = nextLevelInfo.min - currentLevelInfo.min;
      const scoreInLevel = score - currentLevelInfo.min;
      progress = Math.min(scoreInLevel / range, 1);

      if (progress > 0.66) {
        levelWithModifier += '+';
      }
    } else {
      progress = 1;
      levelWithModifier = 'SS+';
    }

    const [hue, saturation] = currentLevelInfo.color.match(/\d+/g)!.map(Number);
    const adjustedLightness = 65 - (progress * 25); // Darken as progress increases
    const finalColor = `hsl(${hue}, ${saturation}%, ${adjustedLightness}%)`;

    return {
      level: levelWithModifier,
      nextLevel: nextLevelInfo ? nextLevelInfo.level : null,
      progress: progress * 100, // as percentage
      color: finalColor,
    };
};

const getTrendInfo = (trend: Metric['trend']) => {
    switch (trend) {
      case 'up':
        return { Icon: ArrowUpIcon, color: 'text-green-500' };
      case 'down':
        return { Icon: ArrowDownIcon, color: 'text-red-500' };
      case 'stable':
      default:
        return { Icon: ArrowStableIcon, color: 'text-stone-400 dark:text-dark-secondary-text' };
    }
};

const updateTrend = (metric: Metric, change: number) => {
    if (change > 0) {
        metric.trend = 'up';
    } else if (change < 0) {
        metric.trend = 'down';
    } else {
        metric.trend = 'stable';
    }
};

const calculateMetricChanges = (rater: User, author: User, rating: Rating) => {
    const raterChanges = { contribution: 1 }; // Rater always gets a small contribution bump
    const authorChanges: { contribution: number, trust?: number, depth?: number } = { contribution: 2 }; // Author gets contribution for engagement

    // Trust changes based on tags
    let trustChange = 0;
    if (rating.tags.includes('+ 證據充足')) trustChange += 10;
    if (rating.tags.includes('+ 邏輯清晰')) trustChange += 5;
    if (rating.tags.includes('- 訴諸情感')) trustChange -= 5;
    if (rating.tags.includes('- 事實錯誤')) trustChange -= 20; // Heavy penalty
    
    // Depth changes
    let depthChange = 0;
    if (rating.stance === 'doubt') depthChange += 1; // Doubting is a sign of critical thought
    
    Object.assign(authorChanges, { trust: trustChange, depth: depthChange });
    
    const timestamp = Date.now();

    // Apply changes to rater
    rater.metrics.contribution.value += raterChanges.contribution;
    updateTrend(rater.metrics.contribution, raterChanges.contribution);
    rater.metricHistory.push({ timestamp, metric: 'contribution', change: raterChanges.contribution, newValue: rater.metrics.contribution.value, reason: '評價了一則內容' });

    // Apply changes to author
    author.metrics.contribution.value += authorChanges.contribution;
    updateTrend(author.metrics.contribution, authorChanges.contribution);
    author.metricHistory.push({ timestamp, metric: 'contribution', change: authorChanges.contribution, newValue: author.metrics.contribution.value, reason: '發布的內容收到評價' });
    if(authorChanges.trust) {
        author.metrics.trust.value += authorChanges.trust;
        updateTrend(author.metrics.trust, authorChanges.trust);
        author.metricHistory.push({ timestamp, metric: 'trust', change: authorChanges.trust, newValue: author.metrics.trust.value, reason: `收到評價 (標籤: ${rating.tags.join(', ') || '無'})` });
    }
    if(authorChanges.depth) {
        author.metrics.depth.value += authorChanges.depth;
        updateTrend(author.metrics.depth, authorChanges.depth);
        author.metricHistory.push({ timestamp, metric: 'depth', change: authorChanges.depth, newValue: author.metrics.depth.value, reason: `收到中立/存疑的評價` });
    }
};

export const metricService = {
  getLevelInfo,
  getTrendInfo,
  calculateMetricChanges,
  updateTrend,
};
