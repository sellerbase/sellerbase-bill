'use client';

import { useState, useMemo } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { ParentProduct, ChildProduct } from './types';

type ProductListProps = {
  customerId?: string;
  searchQuery: string;
  onSelect: (item: { id: string; title: string; price: number; type: 'product' | 'option' }) => void;
};

export default function ProductList({ customerId, searchQuery, onSelect }: ProductListProps) {
  // TODO: 後でSupabaseから取得するように変更
  const [parentProducts] = useState<ParentProduct[]>([
    { id: 'parent1', name: '商品グループA', customerId: 'customer1' },
    { id: 'parent2', name: '商品グループB', customerId: 'customer1' },
    { id: 'parent3', name: '商品グループC' },
  ]);

  const [childProducts] = useState<ChildProduct[]>([
    { id: 'child1', parentId: 'parent1', name: '商品A-1', price: 1000 },
    { id: 'child2', parentId: 'parent1', name: '商品A-2', price: 2000 },
    { id: 'child3', parentId: 'parent2', name: '商品B-1', price: 1500 },
    { id: 'child4', parentId: 'parent3', name: '商品C-1', price: 3000 },
    { id: 'child5', parentId: 'parent3', name: '商品C-2', price: 4000 },
  ]);

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // 検索とフィルタリングの処理
  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    
    // 親商品と子商品の両方で検索
    const matchingChildren = childProducts.filter(child =>
      child.name.toLowerCase().includes(query)
    );
    const matchingParentIds = new Set([
      ...parentProducts.filter(parent => parent.name.toLowerCase().includes(query)).map(p => p.id),
      ...matchingChildren.map(child => child.parentId)
    ]);

    // カスタマーフィルタリング
    const filteredParents = parentProducts.filter(parent =>
      (matchingParentIds.has(parent.id) || query === '') &&
      (!customerId || parent.customerId === customerId || !parent.customerId)
    );

    return {
      customerProducts: filteredParents.filter(p => p.customerId === customerId),
      generalProducts: filteredParents.filter(p => !p.customerId)
    };
  }, [parentProducts, childProducts, searchQuery, customerId]);

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const renderProductGroup = (parent: ParentProduct) => {
    const children = childProducts.filter(child => child.parentId === parent.id);
    const isExpanded = expandedGroups.has(parent.id);

    return (
      <div key={parent.id} className="mb-2">
        <button
          type="button"
          onClick={() => toggleGroup(parent.id)}
          className="w-full text-left px-4 py-3 bg-white hover:bg-gray-50 rounded-md border border-gray-200 transition-colors duration-200"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900">{parent.name}</span>
            {isExpanded ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </button>
        
        {isExpanded && children.length > 0 && (
          <div className="ml-4 mt-2 space-y-2">
            {children.map(child => (
              <button
                key={child.id}
                type="button"
                onClick={() => onSelect({
                  id: child.id,
                  title: child.name,
                  price: child.price,
                  type: 'product'
                })}
                className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors duration-200"
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-900">{child.name}</span>
                  <span className="text-gray-600">¥{child.price.toFixed(2)}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderProductList = (products: ParentProduct[], title: string) => (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
      <div>
        {products.map(parent => renderProductGroup(parent))}
      </div>
    </div>
  );

  return (
    <div>
      {customerId && filteredProducts.customerProducts.length > 0 && (
        renderProductList(filteredProducts.customerProducts, '顧客専用商品')
      )}
      {filteredProducts.generalProducts.length > 0 && (
        renderProductList(filteredProducts.generalProducts, '全商品')
      )}
      {filteredProducts.customerProducts.length === 0 && filteredProducts.generalProducts.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          該当する商品が見つかりません
        </div>
      )}
    </div>
  );
} 