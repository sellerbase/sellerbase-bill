'use client';

import React from 'react';
import Link from 'next/link';

export default function InvoiceEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
        <div className="flex items-center h-16">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-white hover:text-blue-100 transition-colors duration-200 px-4"
          >
            <svg className="mr-1 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            戻る
          </Link>
          <div className="flex-1 flex justify-center">
            <h1 className="text-xl font-bold text-white">請求書エディタ</h1>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
