
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { metricService } from '../services/metricService';

interface DevPanelProps {
  user: User;
  onUpdate: (user: User) => void;
}

const DevPanel: React.FC<DevPanelProps> = ({ user, onUpdate }) => {
  const [metrics, setMetrics] = useState({
    trust: user.metrics.trust.value,
    depth: user.metrics.depth.value,
    contribution: user.metrics.contribution.value,
  });

  useEffect(() => {
    setMetrics({
      trust: user.metrics.trust.value,
      depth: user.metrics.depth.value,
      contribution: user.metrics.contribution.value,
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetrics(prev => ({ ...prev, [name]: parseInt(value, 10) }));
  };
  
  const handleApply = () => {
      const updatedUser = authService.dev_updateUserMetrics(user.id, metrics);
      if(updatedUser) {
          metricService.updateTrend(updatedUser.metrics.trust, metrics.trust - user.metrics.trust.value);
          metricService.updateTrend(updatedUser.metrics.depth, metrics.depth - user.metrics.depth.value);
          metricService.updateTrend(updatedUser.metrics.contribution, metrics.contribution - user.metrics.contribution.value);
          onUpdate(updatedUser);
      }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-dark-surface p-4 rounded-lg shadow-2xl z-50 border border-dark-border w-80">
      <h3 className="font-bold text-lg mb-4">🔧 開發者面板</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold">信任值: {metrics.trust}</label>
          <input
            type="range"
            name="trust"
            min="0"
            max="1000"
            value={metrics.trust}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">深度值: {metrics.depth}</label>
          <input
            type="range"
            name="depth"
            min="0"
            max="1000"
            value={metrics.depth}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">貢獻值: {metrics.contribution}</label>
          <input
            type="range"
            name="contribution"
            min="0"
            max="2000"
            value={metrics.contribution}
            onChange={handleChange}
            className="w-full"
          />
        </div>
      </div>
      <button onClick={handleApply} className="w-full mt-4 bg-sky-600 text-white font-bold py-2 rounded-md hover:bg-sky-700">
        套用變更
      </button>
      <p className="text-xs text-dark-secondary-text mt-2 text-center">連按 'ddd' 關閉</p>
    </div>
  );
};

export default DevPanel;
