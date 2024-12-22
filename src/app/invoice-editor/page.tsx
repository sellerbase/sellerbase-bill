'use client';

import BasicInfoForm from '@/components/invoice/BasicInfoForm';
import { useState } from 'react';

export default function InvoiceEditorPage() {
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <div className="px-4 w-full">
      <div className="grid grid-cols-12 gap-6">
        {/* 左カラム: 基本情報フォーム */}
        <div className="col-span-2 bg-white rounded-lg shadow-md p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6">基本情報</h2>
          <BasicInfoForm />
        </div>

        {/* 中央カラム: 明細テーブル */}
        <div className="col-span-7 bg-white rounded-lg shadow-md p-6">
          {/* 合計金額表示エリア */}
          <div className="mb-4 bg-gray-50 rounded-lg p-3">
            <div className="mb-2">
              <h3 className="text-base font-semibold text-gray-900">合計金額</h3>
            </div>
            
            {/* 合計金額 - 3通貨表示 */}
            <div className="grid grid-cols-3 gap-3 mb-2">
              <div className="bg-white p-2 rounded-md shadow-sm">
                <div className="text-xs text-gray-600 mb-0.5">CNY（メイン）</div>
                <div className="text-lg font-bold text-gray-900">¥0.00</div>
              </div>
              <div className="bg-white p-2 rounded-md shadow-sm">
                <div className="text-xs text-gray-600 mb-0.5">USD</div>
                <div className="text-lg font-bold text-gray-900">$0.00</div>
              </div>
              <div className="bg-white p-2 rounded-md shadow-sm">
                <div className="text-xs text-gray-600 mb-0.5">JPY</div>
                <div className="text-lg font-bold text-gray-900">￥0</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
            >
              内訳
              <svg
                className={`ml-1 h-3 w-3 transform transition-transform ${showBreakdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* カテゴリ別内訳（デフォルトは非表示） */}
            {showBreakdown && (
              <div className="mt-2">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white p-2 rounded-md shadow-sm">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">商品</span>
                      <span className="font-medium text-gray-900">¥0.00</span>
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded-md shadow-sm">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">検品</span>
                      <span className="font-medium text-gray-900">¥0.00</span>
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded-md shadow-sm">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">作業</span>
                      <span className="font-medium text-gray-900">¥0.00</span>
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded-md shadow-sm">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">包装</span>
                      <span className="font-medium text-gray-900">¥0.00</span>
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded-md shadow-sm">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">運送</span>
                      <span className="font-medium text-gray-900">¥0.00</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 明細エリア（スクロール可能） */}
          <div className="max-h-[calc(100vh-24rem)] overflow-y-auto">
            {/* 明細ヘッダー */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">明細</h2>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                明細を追加
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-600">
              明細がありません。「明細を追加」ボタンをクリックして明細を追加してください。
            </div>
          </div>
        </div>

        {/* 右カラム: プレビュー */}
        <div className="col-span-3 bg-white rounded-lg shadow-md p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">プレビュー</h2>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              PDFで表示
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-600">
            プレビューは基本情報と明細を入力すると表示されます。
          </div>
        </div>
      </div>
    </div>
  );
}
