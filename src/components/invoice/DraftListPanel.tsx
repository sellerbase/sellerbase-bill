import { useState, useCallback, useEffect } from 'react';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';

export default function DraftListPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMouseInPanel, setIsMouseInPanel] = useState(false);
  const [isMouseInButton, setIsMouseInButton] = useState(false);

  const handleMouseLeave = useCallback(() => {
    if (!isMouseInPanel && !isMouseInButton) {
      const timeout = setTimeout(() => {
        setIsOpen(false);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isMouseInPanel, isMouseInButton]);

  useEffect(() => {
    handleMouseLeave();
  }, [isMouseInPanel, isMouseInButton, handleMouseLeave]);

  return (
    <>
      {/* トリガーボタン */}
      <div
        className="fixed left-0 top-1/2 -translate-y-1/2 z-[9999]"
        onMouseEnter={() => {
          setIsMouseInButton(true);
          setIsOpen(true);
        }}
        onMouseLeave={() => {
          setIsMouseInButton(false);
        }}
      >
        <button
          type="button"
          className={`
            flex flex-col items-center py-4 px-1 bg-white rounded-r-lg shadow-lg
            hover:bg-gray-50 transition-all duration-200 gap-1
            ${isOpen ? 'translate-x-[240px]' : 'translate-x-0'}
          `}
        >
          <DocumentDuplicateIcon className="w-5 h-5 text-gray-600" />
          <span className="text-xs text-gray-700 writing-mode-vertical">下書き一覧</span>
        </button>
      </div>

      {/* サイドパネル */}
      <div
        onMouseEnter={() => setIsMouseInPanel(true)}
        onMouseLeave={() => {
          setIsMouseInPanel(false);
        }}
        className={`
          fixed top-[64px] left-0 w-[240px] bg-white shadow-lg z-[9999]
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          bottom-0
        `}
      >
        <div className="h-full overflow-auto">
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">下書き一覧</h2>
            <div className="space-y-2">
              {/* 下書きリストのプレースホルダー */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-1/2 bg-gray-200 rounded mt-2 animate-pulse"></div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-1/2 bg-gray-200 rounded mt-2 animate-pulse"></div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-1/2 bg-gray-200 rounded mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: upright;
          white-space: nowrap;
        }
      `}</style>
    </>
  );
} 