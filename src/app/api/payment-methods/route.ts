import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const senderId = searchParams.get('sender_id');

    if (!senderId) {
      return NextResponse.json({ error: '請求元企業IDが必要です' }, { status: 400 });
    }

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: paymentMethods, error } = await supabase
      .from('payment_destinations')
      .select(`
        id,
        method_type,
        name,
        description,
        is_default,
        bank_name,
        branch_name,
        account_type,
        account_number,
        account_holder,
        swift_code,
        bank_address,
        paypal_email,
        instruction_file_url
      `)
      .eq('company_id', senderId)
      .order('is_default', { ascending: false })
      .order('name');

    if (error) {
      return NextResponse.json({ error: '支払い方法の取得に失敗しました' }, { status: 500 });
    }

    return NextResponse.json(paymentMethods);
  } catch (error) {
    return NextResponse.json({ error: '支払い方法の取得中にエラーが発生しました' }, { status: 500 });
  }
} 