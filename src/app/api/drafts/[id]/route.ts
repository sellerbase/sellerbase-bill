import { NextResponse } from 'next/server';
import { getSupabaseBrowserClient } from '@/lib/supabase';

// 特定の下書きを取得
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from('invoice_drafts')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json(
        { error: '下書きが見つかりません' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('下書きの取得に失敗しました:', error);
    return NextResponse.json(
      { error: '下書きの取得に失敗しました' },
      { status: 500 }
    );
  }
}

// 下書きを削除
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase
      .from('invoice_drafts')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('下書きの削除に失敗しました:', error);
    return NextResponse.json(
      { error: '下書きの削除に失敗しました' },
      { status: 500 }
    );
  }
} 