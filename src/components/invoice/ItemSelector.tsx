'use client';

import { useState } from 'react';
import ProductList from './ProductList';
import OptionList from './OptionList';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

type ItemSelectorProps = {
  customerId?: string;
  onSelectItem: (item: { id: string; title: string; price: number; type: 'product' | 'option' }) => void;
};

export default function ItemSelector({ customerId, onSelectItem }: ItemSelectorProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'options'>('products');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      {/* タブ切り替え */}
      <div className="flex rounded-md shadow-sm mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-l-md border ${
            activeTab === 'products'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          商品一覧
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('options')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
            activeTab === 'options'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          オプション一覧
        </button>
      </div>

      {/* 検索バー */}
      <div className="relative mb-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 text-sm"
          placeholder={`${activeTab === 'products' ? '商品' : 'オプション'}を検索...`}
        />
      </div>

      {/* コンテンツ */}
      <div className="overflow-y-auto">
        {activeTab === 'products' ? (
          <ProductList
            customerId={customerId}
            searchQuery={searchQuery}
            onSelect={(product) => onSelectItem(product)}
          />
        ) : (
          <OptionList
            searchQuery={searchQuery}
            onSelect={(option) => onSelectItem({ ...option, type: 'option', title: option.name })}
          />
        )}
      </div>
    </div>
  );
} 