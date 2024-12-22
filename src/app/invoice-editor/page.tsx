'use client';

import React from 'react';
import Link from 'next/link';

export default function InvoiceEditor() {
  return (
    <div className="min-w-[1200px]">
      <div className="flex space-x-4">
        <div className="w-[300px] bg-white shadow-lg rounded-xl border border-gray-100 p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">基本情報</h2>
          <div className="space-y-4">
            <div className="h-12 bg-gray-50 rounded-lg animate-pulse"></div>
            <div className="h-12 bg-gray-50 rounded-lg animate-pulse"></div>
            <div className="h-12 bg-gray-50 rounded-lg animate-pulse"></div>
          </div>
        </div>

        <div className="flex-1 min-w-[500px] bg-white shadow-lg rounded-xl border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <div className="h-24 bg-gray-50 rounded-lg animate-pulse"></div>
          </div>

          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">明細内容</h2>
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-gray-200 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <svg className="mr-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  プレビュー
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <svg className="mr-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                  </svg>
                  保存
                </button>
              </div>
            </div>
            <div className="h-96 bg-gray-50 rounded-lg animate-pulse"></div>
          </div>
        </div>

        <div className="w-[300px] bg-white shadow-lg rounded-xl border border-gray-100 p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4">商品/オプション一覧</h2>
          <div className="space-y-4">
            <div className="h-12 bg-gray-50 rounded-lg animate-pulse"></div>
            <div className="h-12 bg-gray-50 rounded-lg animate-pulse"></div>
            <div className="h-12 bg-gray-50 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
