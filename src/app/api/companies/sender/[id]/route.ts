import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
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

    const { data: company, error } = await supabase
      .from('sender_companies')
      .select('id, company_name, representative_name, postal_code, address, phone, email')
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('請求元企業の取得に失敗しました:', error);
      return NextResponse.json({ error: '請求元企業の取得に失敗しました' }, { status: 500 });
    }

    if (!company) {
      return NextResponse.json({ error: '請求元企業が見つかりません' }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('請求元企業の取得中にエラーが発生しました:', error);
    return NextResponse.json({ error: '請求元企業の取得中にエラーが発生しました' }, { status: 500 });
  }
} 