export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 概要カード */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900">売上概要</h2>
          <p className="mt-2 text-3xl font-bold">¥0</p>
          <p className="text-sm text-gray-500">今月の売上</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900">注文数</h2>
          <p className="mt-2 text-3xl font-bold">0</p>
          <p className="text-sm text-gray-500">今月の注文</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900">商品数</h2>
          <p className="mt-2 text-3xl font-bold">0</p>
          <p className="text-sm text-gray-500">登録商品数</p>
        </div>
      </div>
      
      {/* グラフエリア */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">売上推移</h2>
        <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
          <p className="text-gray-500">グラフは後ほど実装予定</p>
        </div>
      </div>
      
      {/* 最近の注文 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900">最近の注文</h2>
        </div>
        <div className="border-t border-gray-200">
          <div className="p-6 text-center text-gray-500">
            注文データはまだありません
          </div>
        </div>
      </div>
    </div>
  );
}
