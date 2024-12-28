import { useState, useCallback, useEffect } from 'react';
import { DocumentDuplicateIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

type InvoiceDraft = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  items: any[];
  template_id: string;
  sender_id?: string;
  recipient_id?: string;
  payment_method_id?: string;
  issue_date?: string;
  payment_deadline?: string;
};

interface DraftListPanelProps {
  onLoadDraft: (draft: InvoiceDraft) => void;
}

export default function DraftListPanel({ onLoadDraft }: DraftListPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMouseInPanel, setIsMouseInPanel] = useState(false);
  const [isMouseInButton, setIsMouseInButton] = useState(false);
  const [drafts, setDrafts] = useState<InvoiceDraft[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDrafts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/drafts');
      if (!response.ok) throw new Error('下書きの取得に失敗しました');
      const data = await response.json();
      setDrafts(data);
    } catch (error) {
      console.error('下書きの取得に失敗しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDraft = async (id: string) => {
    if (!window.confirm('この下書きを削除してもよろしいですか？')) {
      return;
    }

    try {
      const response = await fetch(`/api/drafts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('下書きの削除に失敗しました');
      await fetchDrafts();
    } catch (error) {
      console.error('下書きの削除に失敗しました:', error);
      alert('下書きの削除に失敗しました');
    }
  };

  const handleLoadDraft = async (id: string) => {
    try {
      const response = await fetch(`/api/drafts/${id}`);
      if (!response.ok) throw new Error('下書きの読み込みに失敗しました');
      const data = await response.json();
      onLoadDraft(data);
      setIsOpen(false);
    } catch (error) {
      console.error('下書きの読み込みに失敗しました:', error);
      alert('下書きの読み込みに失敗しました');
    }
  };

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

  useEffect(() => {
    if (isOpen) {
      fetchDrafts();
    }
  }, [isOpen]);

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
            relative flex flex-col items-center py-16 px-2
            transition-all duration-200 gap-6 group
            ${isOpen ? 'translate-x-[240px]' : 'translate-x-0'}
          `}
        >
          <div className="
            absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500
            clip-path-trapezoid shadow-lg transition-colors duration-200
            group-hover:from-indigo-500 group-hover:to-blue-400
          "></div>
          <div className="
            absolute inset-0 bg-gradient-to-r from-indigo-600/50 to-blue-500/50
            clip-path-trapezoid blur-sm transition-colors duration-200
            group-hover:from-indigo-500/50 group-hover:to-blue-400/50
          "></div>
          <DocumentDuplicateIcon className="w-5 h-5 text-white relative z-10" />
          <span className="text-sm text-white relative z-10 writing-mode-vertical font-medium tracking-wider">下書き一覧</span>
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
              {isLoading ? (
                // ローディングプレースホルダー
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg animate-pulse">
                    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                    <div className="h-3 w-1/2 bg-gray-200 rounded mt-2"></div>
                  </div>
                ))
              ) : drafts.length > 0 ? (
                drafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <button
                        onClick={() => handleLoadDraft(draft.id)}
                        className="flex-1 text-left"
                      >
                        <h3 className="font-medium text-gray-900 line-clamp-1">
                          {draft.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {format(new Date(draft.updated_at), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
                        </p>
                      </button>
                      <button
                        onClick={() => handleDeleteDraft(draft.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  下書きはありません
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: upright;
          white-space: nowrap;
          letter-spacing: 0.1em;
        }
        .clip-path-trapezoid {
          clip-path: polygon(0 0, 100% 15%, 100% 85%, 0 100%);
          border-top-right-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      `}</style>
    </>
  );
} 