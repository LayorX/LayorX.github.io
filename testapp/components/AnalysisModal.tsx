

import React, { useRef, useEffect } from 'react';
import Loader from './Loader';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  isLoading: boolean;
}

// A simple markdown to HTML converter
const formatContent = (text: string) => {
    const html = text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-sky-800">$1</strong>')
        .replace(/\n/g, '<br />');
    return { __html: html };
};

const AnalysisModalContent: React.FC<{ content: string }> = ({ content }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = formatContent(content).__html;
    }
  }, [content]);

  return <div ref={contentRef} />;
}

const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, content, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-stone-500 hover:text-stone-800 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <h3 className="text-xl font-bold text-sky-900 mb-4 flex items-center">
          ✨ AI 論點分析
        </h3>
        <div className="space-y-4 text-stone-700 max-h-[60vh] overflow-y-auto pr-2">
          {isLoading ? (
            <Loader text="AI 分析中..." />
          ) : (
            <AnalysisModalContent content={content} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;