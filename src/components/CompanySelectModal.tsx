import { useState, useEffect } from 'react';
import { Company } from '@/types/company';

interface CompanySelectModalProps {
  type: 'sender' | 'recipient';
  isOpen: boolean;
  onClose: () => void;
  onSelect: (company: Company) => void;
}

export default function CompanySelectModal({
  type,
  isOpen,
  onClose,
  onSelect,
}: CompanySelectModalProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!isOpen) return;
      
      try {
        const response = await fetch(`/api/companies/${type}`);
        if (!response.ok) {
          throw new Error('企業データの取得に失敗しました');
        }
        const data = await response.json();
        setCompanies(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '企業データの取得中にエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, [type, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {type === 'sender' ? '請求元企業' : '請求先企業'}を選択
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-4">読み込み中...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">企業名</th>
                  <th className="px-4 py-2 text-left">代表者名</th>
                  <th className="px-4 py-2 text-left">住所</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr
                    key={company.id}
                    onClick={() => {
                      onSelect(company);
                      onClose();
                    }}
                    className="hover:bg-gray-50 cursor-pointer border-b"
                  >
                    <td className="px-4 py-2">{company.company_name}</td>
                    <td className="px-4 py-2">{company.representative_name}</td>
                    <td className="px-4 py-2">
                      〒{company.postal_code} {company.address}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 