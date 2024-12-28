import { useState, useEffect } from 'react';
import { Company } from '@/types/company';

interface CompanySelectorProps {
  type: 'sender' | 'recipient';
  selectedCompanyId?: string;
  onSelect: (company: Company) => void;
}

export default function CompanySelector({ type, selectedCompanyId, onSelect }: CompanySelectorProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
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
  }, [type]);

  const handleCompanySelect = async (companyId: string) => {
    try {
      const response = await fetch(`/api/companies/${type}/${companyId}`);
      if (!response.ok) {
        throw new Error('企業データの取得に失敗しました');
      }
      const company = await response.json();
      onSelect(company);
    } catch (err) {
      setError(err instanceof Error ? err.message : '企業データの取得中にエラーが発生しました');
    }
  };

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="w-full">
      <select
        className="w-full p-2 border border-gray-300 rounded-md"
        value={selectedCompanyId || ''}
        onChange={(e) => handleCompanySelect(e.target.value)}
      >
        <option value="">企業を選択してください</option>
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.company_name} ({company.representative_name})
          </option>
        ))}
      </select>
    </div>
  );
} 