import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold">SellerBase</span>
              </div>
            </div>
            <div className="flex items-center">
              <button className="p-2 rounded-md text-gray-600 hover:text-gray-900">
                <span>ユーザー名</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="flex">
        <aside className="w-64 bg-white shadow-lg h-screen">
          <div className="p-4">
            <nav>
              <a href="/dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-100">
                ダッシュボード
              </a>
              {/* 他のメニューアイテムはここに追加 */}
            </nav>
          </div>
        </aside>
        
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
