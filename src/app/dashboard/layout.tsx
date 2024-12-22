'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { User } from '@/types/user';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = getSupabaseBrowserClient();
      
      // セッションからユーザー情報を取得
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
        return;
      }

      // プロフィール情報を取得
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setUser(profile);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
      router.push('/auth');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

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
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  <span>{user?.email || 'ユーザーメニュー'}</span>
                  <span className="text-sm text-gray-500">({user?.role || ''})</span>
                  <svg
                    className={`h-5 w-5 transform ${isMenuOpen ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        ログアウト
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="flex">
        <aside className="w-64 bg-white shadow-lg h-screen">
          <div className="p-4">
            <nav className="space-y-2">
              <Link
                href="/dashboard"
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-100"
              >
                ダッシュボード
              </Link>
              <Link
                href="/invoice-editor"
                className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-100"
              >
                請求書エディタ
              </Link>
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
