import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
import { transformAgent } from '@/lib/agent-transform';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabaseServer
    .from('agents')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  }

  return NextResponse.json(transformAgent(data));
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  // Map camelCase to snake_case for DB
  const dbBody: Record<string, any> = {};
  if (body.name !== undefined) dbBody.name = body.name;
  if (body.description !== undefined) dbBody.description = body.description;
  if (body.category !== undefined) dbBody.category = body.category;
  if (body.status !== undefined) dbBody.status = body.status;
  if (body.avatar !== undefined) dbBody.avatar_url = body.avatar;
  if (body.website !== undefined) dbBody.website = body.website;
  if (body.twitter !== undefined) dbBody.twitter = body.twitter;
  if (body.discord !== undefined) dbBody.discord = body.discord;
  if (body.github !== undefined) dbBody.github = body.github;
  if (body.tokenSymbol !== undefined) dbBody.token_symbol = body.tokenSymbol;
  if (body.tokenAddress !== undefined) dbBody.token_address = body.tokenAddress;
  if (body.chain !== undefined) dbBody.chain = body.chain;
  if (body.tags !== undefined) dbBody.tags = body.tags;
  if (body.featured !== undefined) dbBody.featured = body.featured;

  const { data, error } = await supabaseServer
    .from('agents')
    .update(dbBody)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(transformAgent(data));
}
