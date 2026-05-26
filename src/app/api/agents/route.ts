import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { transformAgent } from '@/lib/agent-transform';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const sort = searchParams.get('sort') || 'metrics_users';
  const limit = parseInt(searchParams.get('limit') || '50');
  const page = parseInt(searchParams.get('page') || '1');
  const offset = (page - 1) * limit;

  let query = supabaseServer
    .from('agents')
    .select('*', { count: 'exact' });

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }
  if (featured === 'true') {
    query = query.eq('featured', true);
  }

  const sortMap: Record<string, string> = {
    users: 'metrics_users',
    rating: 'metrics_rating',
    volume: 'metrics_volume',
    transactions: 'metrics_transactions',
  };
  const sortCol = sortMap[sort] || 'metrics_users';
  query = query.order(sortCol, { ascending: false });
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ agents: (data || []).map(transformAgent), total: count });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, category, creator_wallet, website, twitter, discord, github, token_symbol, chain, tags } = body;

    if (!name || !description || !category || !creator_wallet) {
      return NextResponse.json(
        { error: 'name, description, category, and creator_wallet are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from('agents')
      .insert({
        name,
        description,
        category,
        creator_wallet: creator_wallet.toLowerCase(),
        website,
        twitter,
        discord,
        github,
        token_symbol,
        chain: chain || 'multi',
        tags: tags || [],
        status: 'beta',
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
