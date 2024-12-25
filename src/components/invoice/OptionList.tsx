'use client';

import { useState, useMemo } from 'react';

type Option = {
  id: string;
  name: string;
  price: number;
  category: string;
};

type OptionListProps = {
  searchQuery: string;
  onSelect: (option: Option) => void;
};

export default function OptionList({ searchQuery, onSelect }: OptionListProps) {
  // TODO: 後でSupabaseから取得するように変更
  const [options] = useState<Option[]>([
    // 検品オプション
    { id: '1', name: '通常検品', price: 500, category: '検品' },
    { id: '2', name: '厳密検品', price: 1000, category: '検品' },
    
    // 包装オプション
    { id: '3', name: 'OPP袋詰め', price: 200, category: '包装' },
    { id: '4', name: 'PE袋詰め', price: 250, category: '包装' },
    { id: '5', name: 'ギフトラッピング（シンプル）', price: 500, category: '包装' },
    { id: '6', name: 'ギフトラッピング（高級）', price: 800, category: '包装' },
    
    // 作業オプション
    { id: '7', name: 'セット組作業', price: 300, category: '作業' },
    { id: '8', name: 'アイロン作業', price: 400, category: '作業' },
    { id: '9', name: 'タグ付け作業', price: 200, category: '作業' },
    { id: '10', name: 'シール貼り作業', price: 150, category: '作業' },
    
    // 運送オプション
    { id: '11', name: '国内配送（通常）', price: 1000, category: '運送' },
    { id: '12', name: '国内配送（冷蔵）', price: 1500, category: '運送' },
    { id: '13', name: '国際配送（通常）', price: 3000, category: '運送' },
    { id: '14', name: '国際配送（冷蔵）', price: 4000, category: '運送' },
  ]);

  // 検索とグループ化の処理
  const filteredAndGroupedOptions = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const filtered = options.filter(option =>
      option.name.toLowerCase().includes(query) ||
      option.category.toLowerCase().includes(query)
    );

    // カテゴリーの表示順序を定義
    const categoryOrder = ['検品', '包装', '作業', '運送'];

    // カテゴリーでグループ化
    const grouped = filtered.reduce((acc, option) => {
      if (!acc[option.category]) {
        acc[option.category] = [];
      }
      acc[option.category].push(option);
      return acc;
    }, {} as Record<string, Option[]>);

    // カテゴリーを指定順序でソート
    return Object.fromEntries(
      categoryOrder
        .filter(category => grouped[category]?.length > 0)
        .map(category => [category, grouped[category]])
    );
  }, [options, searchQuery]);

  const handleOptionClick = (option: Option) => {
    onSelect(option);
  };

  return (
    <div className="space-y-6">
      {Object.entries(filteredAndGroupedOptions).length > 0 ? (
        Object.entries(filteredAndGroupedOptions).map(([category, options]) => (
          <div key={category}>
            <h3 className="text-sm font-medium text-gray-700 mb-2">{category}</h3>
            <div className="space-y-2">
              {options.map(option => (
                <div
                  key={option.id}
                  className="w-full px-4 py-3 bg-white hover:bg-gray-50 rounded-md border border-gray-200 transition-colors duration-200"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900">{option.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">¥{option.price.toFixed(2)}</span>
                      <button
                        type="button"
                        onClick={() => handleOptionClick(option)}
                        className="px-2 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded"
                      >
                        追加
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 py-4">
          該当するオプションが見つかりません
        </div>
      )}
    </div>
  );
} 