'use client';

import React from 'react';
import Link from 'next/link';

export default function InvoiceEditor() {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        {/* 上部ツールバー */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              保存
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              プレビュー
            </button>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ダッシュボードに戻る
          </Link>
        </div>

        {/* エディタエリア（プレースホルダー） */}
        <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
          <p className="text-gray-500">
            請求書エディタは準備中です...
          </p>
        </div>
      </div>
    </div>
  );
}
