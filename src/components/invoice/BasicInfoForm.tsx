'use client';

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { Dialog } from '@headlessui/react';
import 'react-datepicker/dist/react-datepicker.css';
import { getSupabaseBrowserClient } from '@/lib/supabase';

type PaymentMethod = {
  id: string;
  method_type: 'domestic_bank_transfer' | 'international_wire' | 'paypal' | 'other';
  name: string;
  description: string | null;
  is_default: boolean;
  bank_name: string | null;
  branch_name: string | null;
  account_type: string | null;
  account_number: string | null;
  account_holder: string | null;
  swift_code: string | null;
  bank_address: string | null;
  paypal_email: string | null;
  instruction_file_url: string | null;
};

type Company = {
  id: string;
  company_name: string | null;
  representative_name: string;
  postal_code: string;
  address: string;
  phone: string;
  email: string;
};

type InvoiceData = {
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  sender: Company | null;
  recipient: Company | null;
  payment_method: PaymentMethod | null;
};

type NewCompany = Omit<Company, 'id'>;
type NewPaymentMethod = Omit<PaymentMethod, 'id'>;

export default function BasicInfoForm() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: '',
    issueDate: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    sender: null,
    recipient: null,
    payment_method: null,
  });

  const [isCompanySelectOpen, setIsCompanySelectOpen] = useState(false);
  const [isPaymentMethodSelectOpen, setIsPaymentMethodSelectOpen] = useState(false);
  const [selectingFor, setSelectingFor] = useState<'sender' | 'recipient' | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewCompanyFormOpen, setIsNewCompanyFormOpen] = useState(false);
  const [isNewPaymentMethodFormOpen, setIsNewPaymentMethodFormOpen] = useState(false);
  const [newCompany, setNewCompany] = useState<NewCompany>({
    company_name: '',
    representative_name: '',
    postal_code: '',
    address: '',
    phone: '',
    email: '',
  });
  const [newPaymentMethod, setNewPaymentMethod] = useState<NewPaymentMethod>({
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
    const fetchCompanies = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        
        // 請求元と請求先のデータを並行して取得
        const [senderResult, recipientResult] = await Promise.all([
          supabase
            .from('sender_companies')
            .select('*')
            .order('company_name', { nullsLast: true }),
          supabase
            .from('recipient_companies')
            .select('*')
            .order('company_name', { nullsLast: true })
        ]);

        if (senderResult.error) throw senderResult.error;
        if (recipientResult.error) throw recipientResult.error;

        // 選択中の種類に応じてデータを設定
        if (selectingFor === 'sender') {
          setCompanies(senderResult.data);
        } else if (selectingFor === 'recipient') {
          setCompanies(recipientResult.data);
        }
      } catch (err) {
        console.error('会社データの取得に失敗しました:', err);
        setError('会社データの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    if (isCompanySelectOpen) {
      setLoading(true);
      fetchCompanies();
    }
  }, [isCompanySelectOpen, selectingFor]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (!invoiceData.sender) return;

      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase
          .from('payment_destinations')
          .select('*')
          .eq('company_id', invoiceData.sender.id)
          .order('is_default', { ascending: false });

        if (error) throw error;

        setPaymentMethods(data);
        
        // デフォルトの支払い方法があれば自動選択
        const defaultMethod = data.find((method: PaymentMethod) => method.is_default);
        if (defaultMethod) {
          setInvoiceData(prev => ({ ...prev, payment_method: defaultMethod }));
        }
      } catch (err) {
        console.error('支払い方法の取得に失敗しました:', err);
        setError('支払い方法の取得に失敗しました。');
      }
    };

    fetchPaymentMethods();
  }, [invoiceData.sender]);

  const handleCompanySelect = (company: Company) => {
    if (selectingFor === 'sender') {
      setInvoiceData({ ...invoiceData, sender: company, payment_method: null });
    } else if (selectingFor === 'recipient') {
      setInvoiceData({ ...invoiceData, recipient: company });
    }
    setIsCompanySelectOpen(false);
    setSelectingFor(null);
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setInvoiceData({ ...invoiceData, payment_method: method });
    setIsPaymentMethodSelectOpen(false);
  };

  const formatCompanyDisplay = (company: Company) => {
    const parts = [];
    if (company.company_name) {
      parts.push(company.company_name);
    }
    parts.push(company.representative_name);
    return parts.join(' / ');
  };

  const getPaymentMethodTypeLabel = (type: 'domestic_bank_transfer' | 'international_wire' | 'paypal' | 'other') => {
    const labels = {
      domestic_bank_transfer: '国内銀行振込',
      international_wire: '国際送金',
      paypal: 'PayPal',
      other: 'その他'
    };
    return labels[type];
  };

  const handleNewCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const supabase = getSupabaseBrowserClient();
      const tableName = selectingFor === 'sender' ? 'sender_companies' : 'recipient_companies';
      
      const { data, error } = await supabase
        .from(tableName)
        .insert([newCompany])
        .select()
        .single();

      if (error) throw error;

      setCompanies([...companies, data]);
      setIsNewCompanyFormOpen(false);
      setNewCompany({
        company_name: '',
        representative_name: '',
        postal_code: '',
        address: '',
        phone: '',
        email: '',
      });

      // 新規登録した会社を選択状態にする
      handleCompanySelect(data);
    } catch (err) {
      console.error('会社の登録に失敗しました:', err);
      setError('会社の登録に失敗しました。');
    }
  };

  const handleNewPaymentMethodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceData.sender) return;

    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from('payment_destinations')
        .insert([{ ...newPaymentMethod, company_id: invoiceData.sender.id }])
        .select()
        .single();

      if (error) throw error;

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
      setError('支払い方法の登録に失敗しました。');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="invoiceNumber" className="block text-base font-semibold text-gray-900 mb-1">
          請求書No.
        </label>
        <input
          type="text"
          id="invoiceNumber"
          value={invoiceData.invoiceNumber}
          onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
          placeholder="例: INV-2024001"
        />
      </div>

      <div>
        <label className="block text-base font-semibold text-gray-900 mb-1">請求先</label>
        <button
          type="button"
          onClick={() => {
            setSelectingFor('recipient');
            setIsCompanySelectOpen(true);
          }}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {invoiceData.recipient ? formatCompanyDisplay(invoiceData.recipient) : '請求先を選択'}
        </button>
        {invoiceData.recipient && (
          <div className="mt-2 text-sm text-gray-600">
            <p>〒{invoiceData.recipient.postal_code}</p>
            <p>{invoiceData.recipient.address}</p>
            <p>TEL: {invoiceData.recipient.phone}</p>
            <p>{invoiceData.recipient.email}</p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-base font-semibold text-gray-900 mb-1">請求元</label>
        <button
          type="button"
          onClick={() => {
            setSelectingFor('sender');
            setIsCompanySelectOpen(true);
          }}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {invoiceData.sender ? formatCompanyDisplay(invoiceData.sender) : '請求元を選択'}
        </button>
        {invoiceData.sender && (
          <div className="mt-2 text-sm text-gray-600">
            <p>〒{invoiceData.sender.postal_code}</p>
            <p>{invoiceData.sender.address}</p>
            <p>TEL: {invoiceData.sender.phone}</p>
            <p>{invoiceData.sender.email}</p>
          </div>
        )}
      </div>

      {invoiceData.sender && (
        <div>
          <label className="block text-base font-semibold text-gray-900 mb-1">支払い方法</label>
          <button
            type="button"
            onClick={() => setIsPaymentMethodSelectOpen(true)}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {invoiceData.payment_method ? invoiceData.payment_method.name : '支払い方法を選択'}
          </button>
          {invoiceData.payment_method && (
            <div className="mt-2 text-sm text-gray-600">
              <p className="font-medium">{getPaymentMethodTypeLabel(invoiceData.payment_method.method_type)}</p>
              {invoiceData.payment_method.description && (
                <p className="mt-1">{invoiceData.payment_method.description}</p>
              )}
              {invoiceData.payment_method.instruction_file_url && (
                <a
                  href={invoiceData.payment_method.instruction_file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-500"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  送金手順書を表示
                </a>
              )}
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block text-base font-semibold text-gray-900 mb-1">請求日</label>
        <DatePicker
          selected={invoiceData.issueDate}
          onChange={(date: Date | null) => date && setInvoiceData({ ...invoiceData, issueDate: date })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          dateFormat="yyyy/MM/dd"
        />
      </div>

      <div>
        <label className="block text-base font-semibold text-gray-900 mb-1">支払期限</label>
        <DatePicker
          selected={invoiceData.dueDate}
          onChange={(date: Date | null) => date && setInvoiceData({ ...invoiceData, dueDate: date })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          dateFormat="yyyy/MM/dd"
        />
      </div>

      <Dialog
        open={isCompanySelectOpen}
        onClose={() => setIsCompanySelectOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6">
            <Dialog.Title className="text-xl font-bold text-gray-900 mb-4">
              {selectingFor === 'sender' ? '請求元を選択' : '請求先を選択'}
            </Dialog.Title>

            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsNewCompanyFormOpen(true)}
              className="mb-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              新規登録
            </button>

            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">読み込み中...</p>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                {companies.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => handleCompanySelect(company)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-md transition-colors duration-200"
                  >
                    <div className="font-medium text-gray-900">{formatCompanyDisplay(company)}</div>
                    <div className="text-sm text-gray-600">
                      〒{company.postal_code} {company.address}
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsCompanySelectOpen(false)}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={isNewCompanyFormOpen}
        onClose={() => setIsNewCompanyFormOpen(false)}
        className="fixed inset-0 z-20 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6">
            <Dialog.Title className="text-xl font-bold text-gray-900 mb-4">
              新規会社登録
            </Dialog.Title>

            <form onSubmit={handleNewCompanySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">会社名</label>
                <input
                  type="text"
                  value={newCompany.company_name || ''}
                  onChange={(e) => setNewCompany({ ...newCompany, company_name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                  placeholder="会社名（空白可）"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">代表者名</label>
                <input
                  type="text"
                  value={newCompany.representative_name}
                  onChange={(e) => setNewCompany({ ...newCompany, representative_name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                  required
                  placeholder="代表者名"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">郵便番号</label>
                <input
                  type="text"
                  value={newCompany.postal_code}
                  onChange={(e) => setNewCompany({ ...newCompany, postal_code: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                  required
                  placeholder="123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">住所</label>
                <input
                  type="text"
                  value={newCompany.address}
                  onChange={(e) => setNewCompany({ ...newCompany, address: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                  required
                  placeholder="住所"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">電話番号</label>
                <input
                  type="tel"
                  value={newCompany.phone}
                  onChange={(e) => setNewCompany({ ...newCompany, phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                  required
                  placeholder="03-1234-5678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
                <input
                  type="email"
                  value={newCompany.email}
                  onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
                  required
                  placeholder="example@example.com"
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsNewCompanyFormOpen(false)}
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

      <Dialog
        open={isPaymentMethodSelectOpen}
        onClose={() => setIsPaymentMethodSelectOpen(false)}
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

            <div className="mt-4 space-y-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handlePaymentMethodSelect(method)}
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

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPaymentMethodSelectOpen(false)}
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
    </div>
  );
} 