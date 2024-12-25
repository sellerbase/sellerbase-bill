'use client';

import { useState, useMemo } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { ParentProduct, ChildProduct } from './types';

type ProductListProps = {
  customerId?: string;
  searchQuery: string;
  onSelect: (items: Array<{ id: string; title: string; price: number; type: 'parent_product' | 'child_product' | 'option'; parentId?: string }>) => void;
};

export default function ProductList({ customerId, searchQuery, onSelect }: ProductListProps) {
  // TODO: 後でSupabaseから取得するように変更
  const [parentProducts] = useState<ParentProduct[]>([
    { id: 'parent1', name: '商品グループA', customerId: 'customer1' },
    { id: 'parent2', name: '商品グループB', customerId: 'customer1' },
    { id: 'parent3', name: '商品グループC' },
    { id: 'parent4', name: '商品グループD', customerId: 'customer1' },
    { id: 'parent5', name: '商品グループE' },
  ]);

  const [childProducts] = useState<ChildProduct[]>([
    { id: 'child1', parentId: 'parent1', name: '商品A-1', price: 1000 },
    { id: 'child2', parentId: 'parent1', name: '商品A-2', price: 2000 },
    { id: 'child3', parentId: 'parent2', name: '商品B-1', price: 1500 },
    { id: 'child4', parentId: 'parent3', name: '商品C-1', price: 3000 },
    { id: 'child5', parentId: 'parent3', name: '商品C-2', price: 4000 },
    { id: 'child6', parentId: 'parent4', name: '商品D-1', price: 2500 },
    { id: 'child7', parentId: 'parent4', name: '商品D-2', price: 3500 },
    { id: 'child8', parentId: 'parent5', name: '商品E-1', price: 5000 },
    { id: 'child9', parentId: 'parent5', name: '商品E-2', price: 6000 },
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

  const handleSelectParentProduct = (parent: ParentProduct) => {
    onSelect([{
      id: parent.id,
      title: parent.name,
      price: 0, // 親商品は価格を持たない
      type: 'parent_product'
    }]);
  };

  const handleSelectChildProduct = (parent: ParentProduct, child: ChildProduct) => {
    // 親商品と子商品を配列として返す
    onSelect([
      {
        id: parent.id,
        title: parent.name,
        price: 0,
        type: 'parent_product'
      },
      {
        id: child.id,
        title: child.name,
        price: child.price,
        type: 'child_product',
        parentId: parent.id
      }
    ]);
  };

  const renderProductGroup = (parent: ParentProduct) => {
    const children = childProducts.filter(child => child.parentId === parent.id);
    const isExpanded = expandedGroups.has(parent.id);

    return (
      <div key={parent.id} className="mb-2">
        <div className="flex items-center w-full px-4 py-3 bg-white hover:bg-gray-50 rounded-md border border-gray-200 transition-colors duration-200">
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">{parent.name}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectParentProduct(parent)}
                  className="px-2 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded"
                >
                  追加
                </button>
                {children.length > 0 && (
                  <button
                    type="button"
                    onClick={() => toggleGroup(parent.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {isExpanded ? (
                      <ChevronUpIcon className="h-5 w-5" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {isExpanded && children.length > 0 && (
          <div className="ml-4 mt-2 space-y-2">
            {children.map(child => (
              <div
                key={child.id}
                className="w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors duration-200"
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-900">{child.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">¥{child.price.toFixed(2)}</span>
                    <button
                      type="button"
                      onClick={() => handleSelectChildProduct(parent, child)}
                      className="px-2 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded"
                    >
                      追加
                    </button>
                  </div>
                </div>
              </div>
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
    <div className="space-y-6">
      {/* カスタマー専用商品 */}
      {filteredProducts.customerProducts.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">カスタマー専用商品</h3>
          <div className="space-y-2">
            {filteredProducts.customerProducts.map(parent => renderProductGroup(parent))}
          </div>
        </div>
      )}

      {/* 一般商品 */}
      {filteredProducts.generalProducts.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">一般商品</h3>
          <div className="space-y-2">
            {filteredProducts.generalProducts.map(parent => renderProductGroup(parent))}
          </div>
        </div>
      )}

      {/* 商品が見つからない場合 */}
      {filteredProducts.customerProducts.length === 0 && 
       filteredProducts.generalProducts.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          該当する商品が見つかりません
        </div>
      )}
    </div>
  );
} 