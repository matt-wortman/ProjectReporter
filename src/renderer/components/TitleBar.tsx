import React from 'react';

export const TitleBar: React.FC = () => {
  const handleMinimize = () => window.electronAPI.window.minimize();
  const handleMaximize = () => window.electronAPI.window.maximize();
  const handleClose = () => window.electronAPI.window.close();

  return (
    <div className="h-8 flex items-center justify-between px-3 drag-region bg-black/20">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-400 to-red-500" />
        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
          Projects
        </span>
      </div>

      <div className="flex items-center gap-0.5 no-drag">
        <button
          onClick={handleMinimize}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
          aria-label="Minimize"
        >
          <svg className="w-3 h-3 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <button
          onClick={handleMaximize}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
          aria-label="Maximize"
        >
          <svg className="w-3 h-3 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h16v4M4 16v4h16v-4" />
          </svg>
        </button>
        <button
          onClick={handleClose}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-500/50 transition-colors"
          aria-label="Close"
        >
          <svg className="w-3 h-3 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};
