import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const { data: paymentMethod, error } = await supabase
      .from('payment_methods')
      .select('id, name, method_type, description, instruction_file_url, is_default')
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('支払い方法の取得に失敗しました:', error);
      return NextResponse.json({ error: '支払い方法の取得に失敗しました' }, { status: 500 });
    }

    if (!paymentMethod) {
      return NextResponse.json({ error: '支払い方法が見つかりません' }, { status: 404 });
    }

    return NextResponse.json(paymentMethod);
  } catch (error) {
    console.error('支払い方法の取得中にエラーが発生しました:', error);
    return NextResponse.json({ error: '支払い方法の取得中にエラーが発生しました' }, { status: 500 });
  }
} 