
import React, { useState, useEffect } from 'react';
import { Rating } from '../types';

interface RatingMenuProps {
  isOpen: boolean;
  isInteractionLocked: 'rated' | 'removed' | false;
  position: { x: number; y: number };
  onClose: () => void;
  onRate: (rating: Omit<Rating, 'byUserId'>) => void;
}

const STANCES = {
  agree: { label: '😊 認同', color: 'bg-green-500', hover: 'hover:bg-green-600' },
  doubt: { label: '😐 存疑', color: 'bg-yellow-500', hover: 'hover:bg-yellow-600' },
  disagree: { label: '😠 否認', color: 'bg-red-500', hover: 'hover:bg-red-600' },
};

const TAGS = {
  positive: ['+ 證據充足', '+ 邏輯清晰'],
  negative: ['- 訴諸情感', '- 事實錯誤'],
};

const RatingMenu: React.FC<RatingMenuProps> = ({ isOpen, isInteractionLocked, position, onClose, onRate }) => {
  const [selectedStance, setSelectedStance] = useState<keyof typeof STANCES | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const menuRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setSelectedStance(null);
        setSelectedTags([]);
      }, 200);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleStanceSelect = (stance: keyof typeof STANCES) => {
    setSelectedStance(stance);
  };
  
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (selectedStance) {
      onRate({ stance: selectedStance, tags: selectedTags });
    }
    onClose();
  };
  
  if (!isOpen && selectedStance === null) return null;

  const menuStyle: React.CSSProperties = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: 'translate(-50%, 10px)',
  };
  
  const lockedMessage = isInteractionLocked === 'rated' ? '您已評價過此內容' : '您已移除對此內容的評價，無法再次互動';

  return (
    <div
      ref={menuRef}
      style={menuStyle}
      className={`fixed z-50 w-64 bg-white dark:bg-dark-surface rounded-xl shadow-2xl p-2 transition-all duration-200 ease-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
      onClick={(e) => e.stopPropagation()}
    >
      {isInteractionLocked ? (
        <div className="text-center text-sm text-stone-500 dark:text-dark-secondary-text p-4">{lockedMessage}</div>
      ) : (
        <>
          <div className="flex justify-around">
            {(Object.keys(STANCES) as Array<keyof typeof STANCES>).map(stanceKey => (
              <button
                key={stanceKey}
                onClick={() => handleStanceSelect(stanceKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all ${
                  selectedStance === stanceKey ? `${STANCES[stanceKey].color}` : selectedStance ? 'bg-stone-300' : `${STANCES[stanceKey].color} ${STANCES[stanceKey].hover}`
                }`}
              >
                {STANCES[stanceKey].label}
              </button>
            ))}
          </div>
          
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${selectedStance ? 'max-h-60' : 'max-h-0'}`}>
            <div className="border-t my-2 border-stone-200 dark:border-dark-border"></div>
            <div className="text-xs text-stone-500 dark:text-dark-secondary-text mb-2 px-1">可選標籤:</div>
            <div className="flex flex-wrap gap-2 px-1">
                {TAGS.positive.map(tag => (
                    <button key={tag} onClick={() => handleTagToggle(tag)} className={`text-xs px-2 py-1 rounded-full border ${selectedTags.includes(tag) ? 'bg-green-100 text-green-800 border-green-300' : 'bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-600'}`}>
                        {tag}
                    </button>
                ))}
                {TAGS.negative.map(tag => (
                     <button key={tag} onClick={() => handleTagToggle(tag)} className={`text-xs px-2 py-1 rounded-full border ${selectedTags.includes(tag) ? 'bg-red-100 text-red-800 border-red-300' : 'bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-600'}`}>
                        {tag}
                    </button>
                ))}
            </div>
            <button onClick={handleSubmit} className="w-full mt-3 bg-sky-600 text-white text-sm font-semibold py-1.5 rounded-lg hover:bg-sky-700 transition">
              完成
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RatingMenu;