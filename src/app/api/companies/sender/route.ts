import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const { data: companies, error } = await supabase
      .from('sender_companies')
      .select('id, company_name, representative_name, postal_code, address, phone, email')
      .order('company_name');

    if (error) {
      console.error('請求元企業の取得に失敗しました:', error);
      return NextResponse.json({ error: '請求元企業の取得に失敗しました' }, { status: 500 });
    }

    return NextResponse.json(companies);
  } catch (error) {
    console.error('請求元企業の取得中にエラーが発生しました:', error);
    return NextResponse.json({ error: '請求元企業の取得中にエラーが発生しました' }, { status: 500 });
  }
} 