import React from 'react';

const Loader = ({ text = "載入中..." }: { text?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-8 h-8 border-4 border-stone-200 border-t-sky-600 rounded-full animate-spin"></div>
      {text && <span className="mt-3 text-sm text-stone-600">{text}</span>}
    </div>
  );
};

export default Loader;
