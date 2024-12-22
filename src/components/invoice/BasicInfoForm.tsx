'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Dialog } from '@headlessui/react';
import 'react-datepicker/dist/react-datepicker.css';

type Company = {
  id: string;
  name: string;
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
};

export default function BasicInfoForm() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: '',
    issueDate: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    sender: null,
    recipient: null,
  });

  const [isCompanySelectOpen, setIsCompanySelectOpen] = useState(false);
  const [selectingFor, setSelectingFor] = useState<'sender' | 'recipient' | null>(null);

  // ダミーの会社データ
  const dummyCompanies: Company[] = [
    {
      id: '1',
      name: '株式会社サンプル',
      address: '東京都渋谷区1-1-1',
      phone: '03-1234-5678',
      email: 'info@sample.co.jp',
    },
    {
      id: '2',
      name: '株式会社テスト',
      address: '東京都新宿区2-2-2',
      phone: '03-8765-4321',
      email: 'info@test.co.jp',
    },
  ];

  const handleCompanySelect = (company: Company) => {
    if (selectingFor === 'sender') {
      setInvoiceData({ ...invoiceData, sender: company });
    } else if (selectingFor === 'recipient') {
      setInvoiceData({ ...invoiceData, recipient: company });
    }
    setIsCompanySelectOpen(false);
    setSelectingFor(null);
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
          placeholder="例: INV-2024001"
        />
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
          {invoiceData.sender ? invoiceData.sender.name : '請求元を選択'}
        </button>
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
          {invoiceData.recipient ? invoiceData.recipient.name : '請求先を選択'}
        </button>
      </div>

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

            <div className="mt-4 space-y-2">
              {dummyCompanies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => handleCompanySelect(company)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-md transition-colors duration-200"
                >
                  <div className="font-medium text-gray-900">{company.name}</div>
                  <div className="text-sm text-gray-600">{company.address}</div>
                </button>
              ))}
            </div>

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
    </div>
  );
} 