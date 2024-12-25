import { useState, useCallback } from 'react';
import { InvoiceTemplate } from '../types';
import { DEFAULT_TEMPLATES } from '../constants/templates';

export function useTemplateSelection() {
  const [templates, setTemplates] = useState<InvoiceTemplate[]>(DEFAULT_TEMPLATES);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(DEFAULT_TEMPLATES[0].id);

  // 現在選択中のテンプレートを取得
  const selectedTemplate = templates.find(template => template.id === selectedTemplateId);

  // テンプレートを追加
  const addTemplate = useCallback((newTemplate: InvoiceTemplate) => {
    setTemplates(prev => [...prev, newTemplate]);
  }, []);

  // テンプレートを更新
  const updateTemplate = useCallback((updatedTemplate: InvoiceTemplate) => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === updatedTemplate.id ? updatedTemplate : template
      )
    );
  }, []);

  // テンプレートを削除
  const deleteTemplate = useCallback((templateId: string) => {
    setTemplates(prev => prev.filter(template => template.id !== templateId));
    // 削除したテンプ���ートが選択中だった場合、デフォルトテンプレートに���り替え
    if (templateId === selectedTemplateId) {
      setSelectedTemplateId(DEFAULT_TEMPLATES[0].id);
    }
  }, [selectedTemplateId]);

  return {
    templates,
    selectedTemplate,
    selectedTemplateId,
    setSelectedTemplateId,
    addTemplate,
    updateTemplate,
    deleteTemplate
  };
} 