'use client';

import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { Dialog } from '@headlessui/react';
import 'react-datepicker/dist/react-datepicker.css';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import CompanySelectModal from '@/components/CompanySelectModal';
import PaymentMethodSelectModal from '@/components/PaymentMethodSelectModal';
import { Company, PaymentMethod, InvoiceData } from '@/types/invoice';

interface BasicInfoFormProps {
  invoiceData: InvoiceData;
  onUpdateInvoiceData: (data: InvoiceData) => void;
}

export default function BasicInfoForm({ invoiceData, onUpdateInvoiceData }: BasicInfoFormProps) {
  const [isCompanySelectOpen, setIsCompanySelectOpen] = useState(false);
  const [isPaymentMethodSelectOpen, setIsPaymentMethodSelectOpen] = useState(false);
  const [selectingFor, setSelectingFor] = useState<'sender' | 'recipient'>('sender');

  const handleCompanySelect = (company: Company) => {
    onUpdateInvoiceData({
      ...invoiceData,
      [selectingFor]: company,
      ...(selectingFor === 'sender' ? { payment_method: null } : {}),
    });
  };

  const handlePaymentMethodSelect = (paymentMethod: PaymentMethod) => {
    onUpdateInvoiceData({
      ...invoiceData,
      payment_method: paymentMethod,
    });
  };

  const formatCompanyDisplay = (company: Company) => {
    const parts = [];
    if (company.company_name) {
      parts.push(company.company_name);
    }
    parts.push(company.representative_name);
    return parts.join(' / ');
  };

  const getPaymentMethodTypeLabel = (type: PaymentMethod['method_type']) => {
    const labels = {
      domestic_bank_transfer: '国内銀行振込',
      international_wire: '国際送金',
      paypal: 'PayPal',
      other: 'その他'
    };
    return labels[type];
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-6">
        <div>
          <label htmlFor="invoiceNumber" className="block text-base font-semibold text-gray-900 mb-1">
            請求書No.
          </label>
          <input
            type="text"
            id="invoiceNumber"
            value={invoiceData.invoiceNumber}
            onChange={(e) => onUpdateInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-800"
            placeholder="例: INV-2024001"
          />
        </div>

        {/* 請求先 */}
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

        {/* 請求元 */}
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

        {/* 支払い方法（請求元が選択されている場合のみ表示） */}
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

        {/* 請求日 */}
        <div>
          <label className="block text-base font-semibold text-gray-900 mb-1">請求日</label>
          <DatePicker
            selected={invoiceData.issue_date ? new Date(invoiceData.issue_date) : null}
            onChange={(date) => onUpdateInvoiceData({
              ...invoiceData,
              issue_date: date ? date.toISOString().split('T')[0] : null
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            dateFormat="yyyy/MM/dd"
            placeholderText="請求日を選択してください"
          />
        </div>

        {/* 支払い期限 */}
        <div>
          <label className="block text-base font-semibold text-gray-900 mb-1">支払期限</label>
          <DatePicker
            selected={invoiceData.payment_deadline ? new Date(invoiceData.payment_deadline) : null}
            onChange={(date) => onUpdateInvoiceData({
              ...invoiceData,
              payment_deadline: date ? date.toISOString().split('T')[0] : null
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            dateFormat="yyyy/MM/dd"
            placeholderText="支払い期限を選択してください"
            minDate={invoiceData.issue_date ? new Date(invoiceData.issue_date) : undefined}
          />
        </div>

        {/* Company Select Modal */}
        <CompanySelectModal
          type={selectingFor}
          isOpen={isCompanySelectOpen}
          onClose={() => setIsCompanySelectOpen(false)}
          onSelect={handleCompanySelect}
        />

        {/* Payment Method Select Modal */}
        <PaymentMethodSelectModal
          isOpen={isPaymentMethodSelectOpen}
          onClose={() => setIsPaymentMethodSelectOpen(false)}
          onSelect={handlePaymentMethodSelect}
          senderId={invoiceData.sender?.id || null}
        />
      </div>
    </div>
  );
} 