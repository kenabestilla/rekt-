import { NextRequest, NextResponse } from 'next/server';
import { verifySocialQuest } from '@/lib/quests-store';

export async function POST(req: NextRequest) {
  try {
    const { wallet, questId } = await req.json();
    if (!wallet || !questId) {
      return NextResponse.json({ error: 'wallet and questId are required' }, { status: 400 });
    }
    const result = await verifySocialQuest(wallet, questId);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to verify' }, { status: 400 });
  }
}
