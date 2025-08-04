

import React, { useState } from 'react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, notes: string) => void;
}

const REPORT_REASONS = [
    '垃圾訊息或廣告',
    '仇恨言論',
    '不實資訊',
    '騷擾或霸凌',
    '其他違規事項'
];

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(reason, notes);
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-dark-surface rounded-lg shadow-xl w-full max-w-lg p-6 relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-dark-secondary-text hover:text-dark-primary-text transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <h3 className="text-xl font-bold text-stone-900 dark:text-dark-primary-text mb-4">
          舉報內容
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-dark-secondary-text mb-2">請選擇舉報原因：</label>
                <select 
                    value={reason} 
                    onChange={e => setReason(e.target.value)}
                    className="w-full p-2 bg-stone-100 dark:bg-dark-background border border-stone-300 dark:border-dark-border rounded-md"
                >
                    {REPORT_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-dark-secondary-text mb-2">補充說明 (選填)：</label>
                <textarea 
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={4}
                    placeholder="請提供更多細節..."
                    className="w-full p-2 bg-stone-100 dark:bg-dark-background border border-stone-300 dark:border-dark-border rounded-md"
                />
            </div>
            <div className="flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600">取消</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700">送出舉報</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;