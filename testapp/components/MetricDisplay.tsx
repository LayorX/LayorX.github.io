
import React from 'react';
import { Metric } from '../types';
import { metricService } from '../services/metricService';

interface MetricDisplayProps {
  metric: Metric;
  name: string;
  mode: 'public' | 'private';
}

const MetricDisplay: React.FC<MetricDisplayProps> = ({ metric, name, mode }) => {
  const { level, nextLevel, progress, color } = metricService.getLevelInfo(metric.value);
  const { Icon: TrendIcon, color: trendColor } = metricService.getTrendInfo(metric.trend);

  if (mode === 'public') {
    return (
      <span className="flex items-center text-xs text-stone-600">
        <span className="font-semibold">{name}:</span>
        <span className="font-bold w-6 text-center" style={{ color }}>{level}</span>
        <TrendIcon className={`w-3 h-3 ${trendColor}`} />
      </span>
    );
  }

  // Private mode
  return (
    <div className="text-sm">
        <div className="flex items-center space-x-2">
            <span className="font-semibold text-stone-700 w-8">{name}:</span>
            <span className="font-bold text-lg w-10 text-center" style={{ color: color }}>{level}</span>
            <TrendIcon className={`w-4 h-4 ${trendColor}`} />
        </div>
        <div className="w-full bg-stone-200 rounded-full h-1.5 mt-1">
            <div className="h-1.5 rounded-full" style={{ width: `${progress}%`, backgroundColor: color }}></div>
        </div>
        {nextLevel && (
            <p className="text-xs text-stone-500 mt-0.5 text-right">
                距離 {nextLevel} 級還差 {Math.round(100 - progress)}%
            </p>
        )}
    </div>
  );
};

export default MetricDisplay;
