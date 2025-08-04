
import React from 'react';
import { MetricChange } from '../types';
import { TrustIcon, DepthIcon, ContributionIcon } from './icons';

interface MetricHistoryDisplayProps {
    history: MetricChange[];
}

const ICONS: Record<MetricChange['metric'], React.ReactNode> = {
    trust: <TrustIcon className="w-5 h-5 text-blue-500" />,
    depth: <DepthIcon className="w-5 h-5 text-purple-500" />,
    contribution: <ContributionIcon className="w-5 h-5 text-amber-500" />,
};

const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const MetricHistoryDisplay: React.FC<MetricHistoryDisplayProps> = ({ history }) => {
    const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp);

    if (sortedHistory.length === 0) {
        return <p className="text-center text-dark-secondary-text py-8">尚無數值變動紀錄。</p>
    }

    return (
        <div className="flow-root">
            <ul className="-mb-8">
                {sortedHistory.map((item, itemIdx) => (
                    <li key={item.timestamp + item.metric}>
                        <div className="relative pb-8">
                            {itemIdx !== sortedHistory.length - 1 ? (
                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-stone-200 dark:bg-dark-border" aria-hidden="true" />
                            ) : null}
                            <div className="relative flex items-start space-x-3">
                                <div>
                                    <span className="h-8 w-8 rounded-full bg-stone-100 dark:bg-dark-surface flex items-center justify-center ring-4 ring-white dark:ring-dark-surface">
                                        {ICONS[item.metric]}
                                    </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div>
                                        <p className="text-sm text-dark-secondary-text">
                                            {formatTimestamp(item.timestamp)}
                                        </p>
                                        <p className="mt-0.5 text-sm text-dark-primary-text">
                                           {item.reason}
                                        </p>
                                    </div>
                                    <div className="mt-2 flex items-center">
                                       <span className={`font-bold text-sm ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                           {item.change >= 0 ? `+${item.change}` : item.change}
                                       </span>
                                       <span className="text-xs text-dark-secondary-text ml-2">({item.metric} 新數值: {item.newValue})</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MetricHistoryDisplay;