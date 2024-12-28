'use client';

import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function InvoiceEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col">
      {/* トップメニューバー */}
      <div className="flex-none bg-gradient-to-r from-blue-600 to-blue-500">
        <div className="mx-auto max-w-[1920px] px-4 relative">
          <div className="flex h-16 items-center justify-center">
            {/* 戻るボタン */}
            <Link
              href="/dashboard"
              className="absolute left-4 inline-flex items-center text-white hover:text-blue-100"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              <span>戻る</span>
            </Link>
            
            {/* タイトル */}
            <h1 className="text-xl font-semibold text-white">請求書エディタ</h1>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 overflow-hidden bg-gray-50">
        {children}
      </div>
    </div>
  );
}
