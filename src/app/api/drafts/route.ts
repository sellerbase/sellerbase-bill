import { NextResponse } from 'next/server';
import { getSupabaseBrowserClient } from '@/lib/supabase';

// 下書き一覧の取得
export async function GET() {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from('invoice_drafts')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('下書き一覧の取得に失敗しました:', error);
    return NextResponse.json(
      { error: '下書き一覧の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// 下書きの保存
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = getSupabaseBrowserClient();
    
    const { data, error } = await supabase
      .from('invoice_drafts')
      .insert([{
        title: body.title || '無題の請求書',
        sender_id: body.sender_id,
        recipient_id: body.recipient_id,
        payment_method_id: body.payment_method_id,
        issue_date: body.issue_date,
        payment_deadline: body.payment_deadline,
        items: body.items,
        template_id: body.template_id
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('下書きの保存に失敗しました:', error);
    return NextResponse.json(
      { error: '下書きの保存に失敗しました' },
      { status: 500 }
    );
  }
} 