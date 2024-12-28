import { useState, useCallback } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { InvoiceDraft, CreateInvoiceDraft, UpdateInvoiceDraft } from '@/types/invoice';

export const useInvoiceDraft = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 下書き一覧を取得
  const fetchDrafts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from('invoice_drafts')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as InvoiceDraft[];
    } catch (err) {
      setError('下書きの取得に失敗しました');
      console.error('下書きの取得エラー:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // 下書きを保存
  const saveDraft = useCallback(async (draft: CreateInvoiceDraft) => {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from('invoice_drafts')
        .insert([draft])
        .select()
        .single();

      if (error) throw error;
      return data as InvoiceDraft;
    } catch (err) {
      setError('下書きの保存に失敗しました');
      console.error('下書きの保存エラー:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 下書きを更新
  const updateDraft = useCallback(async (draft: UpdateInvoiceDraft) => {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from('invoice_drafts')
        .update(draft)
        .eq('id', draft.id)
        .select()
        .single();

      if (error) throw error;
      return data as InvoiceDraft;
    } catch (err) {
      setError('下書きの更新に失敗しました');
      console.error('下書きの更新エラー:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 下書きを削除
  const deleteDraft = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from('invoice_drafts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (err) {
      setError('下書きの削除に失敗しました');
      console.error('下書きの削除エラー:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // 下書きを取得
  const fetchDraft = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from('invoice_drafts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as InvoiceDraft;
    } catch (err) {
      setError('下書きの取得に失敗しました');
      console.error('下書きの取得エラー:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchDrafts,
    saveDraft,
    updateDraft,
    deleteDraft,
    fetchDraft,
  };
}; 