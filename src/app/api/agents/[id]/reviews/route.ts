import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabaseServer
    .from('agent_reviews')
    .select('*')
    .eq('agent_id', id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { reviewer_wallet, reviewer_name, rating, comment } = body;

    if (!reviewer_wallet || !rating || !comment) {
      return NextResponse.json(
        { error: 'reviewer_wallet, rating, and comment are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'rating must be 1-5' }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from('agent_reviews')
      .insert({
        agent_id: id,
        reviewer_wallet: reviewer_wallet.toLowerCase(),
        reviewer_name,
        rating,
        comment,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
