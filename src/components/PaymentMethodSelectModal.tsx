import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { PaymentMethod } from '@/types/invoice';

interface PaymentMethodSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (paymentMethod: PaymentMethod) => void;
  senderId: string | null;
}

export default function PaymentMethodSelectModal({
  isOpen,
  onClose,
  onSelect,
  senderId,
}: PaymentMethodSelectModalProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewPaymentMethodFormOpen, setIsNewPaymentMethodFormOpen] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState<Omit<PaymentMethod, 'id'>>({
    method_type: 'domestic_bank_transfer',
    name: '',
    description: '',
    is_default: false,
    bank_name: '',
    branch_name: '',
    account_type: '',
    account_number: '',
    account_holder: '',
    swift_code: null,
    bank_address: null,
    paypal_email: null,
    instruction_file_url: null,
  });

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (!isOpen || !senderId) return;
      
      try {
        const response = await fetch(`/api/payment-methods?sender_id=${senderId}`);
        if (!response.ok) {
          throw new Error('支払い方法の取得に失敗しました');
        }
        const data = await response.json();
        setPaymentMethods(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '支払い方法の取得中にエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [isOpen, senderId]);

  const getPaymentMethodTypeLabel = (type: PaymentMethod['method_type']) => {
    const labels = {
      domestic_bank_transfer: '国内銀行振込',
      international_wire: '国際送金',
      paypal: 'PayPal',
      other: 'その他'
    };
    return labels[type];
  };

  const handleNewPaymentMethodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderId) return;

    try {
      const response = await fetch('/api/payment-methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newPaymentMethod,
          sender_company_id: senderId,
        }),
      });

      if (!response.ok) {
        throw new Error('支払い方法の登録に失敗しました');
      }

      const data = await response.json();
      setPaymentMethods([...paymentMethods, data]);
      setIsNewPaymentMethodFormOpen(false);
      setNewPaymentMethod({
        method_type: 'domestic_bank_transfer',
        name: '',
        description: '',
        is_default: false,
        bank_name: '',
        branch_name: '',
        account_type: '',
        account_number: '',
        account_holder: '',
        swift_code: null,
        bank_address: null,
        paypal_email: null,
        instruction_file_url: null,
      });
    } catch (err) {
      console.error('支払い方法の登録に失敗しました:', err);
      setError('支払い方法の登録に失敗しました');
    }
  };

  if (!isOpen) return null;

  if (!senderId) {
    return (
      <Dialog
        open={isOpen}
        onClose={onClose}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6">
            <Dialog.Title className="text-xl font-bold text-gray-900 mb-4">
              支払い方法を選択
            </Dialog.Title>
            <div className="text-center py-4 text-red-500">
              先に請求元企業を選択してください
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6">
            <Dialog.Title className="text-xl font-bold text-gray-900 mb-4">
              支払い方法を選択
            </Dialog.Title>

            <button
              type="button"
              onClick={() => setIsNewPaymentMethodFormOpen(true)}
              className="mb-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              新規登録
            </button>

            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">読み込み中...</p>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">{error}</div>
            ) : paymentMethods.length === 0 ? (
              <div className="text-center py-4">
                この請求元企業の支払い方法が登録されていません
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => {
                      onSelect(method);
                      onClose();
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-md transition-colors duration-200"
                  >
                    <div className="font-medium text-gray-900">
                      {method.name}
                      {method.is_default && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          デフォルト
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {getPaymentMethodTypeLabel(method.method_type)}
                    </div>
                    {method.description && (
                      <div className="mt-1 text-sm text-gray-500">{method.description}</div>
                    )}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={isNewPaymentMethodFormOpen}
        onClose={() => setIsNewPaymentMethodFormOpen(false)}
        className="fixed inset-0 z-20 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6">
            <Dialog.Title className="text-xl font-bold text-gray-900 mb-4">
              新規支払い方法登録
            </Dialog.Title>

            <form onSubmit={handleNewPaymentMethodSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">支払い方法の種類</label>
                <select
                  value={newPaymentMethod.method_type}
                  onChange={(e) => setNewPaymentMethod({
                    ...newPaymentMethod,
                    method_type: e.target.value as PaymentMethod['method_type']
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                >
                  <option value="domestic_bank_transfer">国内銀行振込</option>
                  <option value="international_wire">国際送金</option>
                  <option value="paypal">PayPal</option>
                  <option value="other">その他</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">支払い方法名</label>
                <input
                  type="text"
                  value={newPaymentMethod.name}
                  onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                  required
                  placeholder="例: 三菱UFJ銀行 渋谷支店"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">説明</label>
                <textarea
                  value={newPaymentMethod.description || ''}
                  onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                  rows={3}
                  placeholder="支払い方法に関する補足説明"
                />
              </div>

              {(newPaymentMethod.method_type === 'domestic_bank_transfer' || newPaymentMethod.method_type === 'international_wire') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">銀行名</label>
                    <input
                      type="text"
                      value={newPaymentMethod.bank_name || ''}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, bank_name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">支店名</label>
                    <input
                      type="text"
                      value={newPaymentMethod.branch_name || ''}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, branch_name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">口座種別</label>
                    <input
                      type="text"
                      value={newPaymentMethod.account_type || ''}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, account_type: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                      required
                      placeholder="普通/当座"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">口座番号</label>
                    <input
                      type="text"
                      value={newPaymentMethod.account_number || ''}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, account_number: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">口座名義</label>
                    <input
                      type="text"
                      value={newPaymentMethod.account_holder || ''}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, account_holder: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                      required
                    />
                  </div>

                  {newPaymentMethod.method_type === 'international_wire' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">SWIFT/BICコード</label>
                        <input
                          type="text"
                          value={newPaymentMethod.swift_code || ''}
                          onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, swift_code: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">銀行住所</label>
                        <input
                          type="text"
                          value={newPaymentMethod.bank_address || ''}
                          onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, bank_address: e.target.value })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                          required
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              {newPaymentMethod.method_type === 'paypal' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">PayPalメールアドレス</label>
                  <input
                    type="email"
                    value={newPaymentMethod.paypal_email || ''}
                    onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, paypal_email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                    required
                  />
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={newPaymentMethod.is_default}
                  onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, is_default: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_default" className="ml-2 block text-sm text-gray-900">
                  デフォルトの支払い方法として設定
                </label>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsNewPaymentMethodFormOpen(false)}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  登録
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </>
  );
} 