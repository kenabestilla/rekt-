import { NextRequest, NextResponse } from 'next/server';
import { getPendingRewards, getRegistration, getTasksByWallet } from '@/lib/rewards-store';

export async function GET(req: NextRequest) {
  try {
    const wallet = req.nextUrl.searchParams.get('wallet');

    if (!wallet) {
      return NextResponse.json(
        { error: 'wallet query parameter is required' },
        { status: 400 }
      );
    }

    const rawReg = await getRegistration(wallet);
    const pending = await getPendingRewards(wallet);
    const tasks = await getTasksByWallet(wallet);

    // Map snake_case from Supabase to camelCase for frontend
    const registration = rawReg ? {
      ...rawReg,
      agentId: rawReg.agent_id,
      totalEarned: parseFloat(rawReg.total_earned ?? 0),
      pendingReward: parseFloat(rawReg.pending_reward ?? 0),
      tasksCompleted: rawReg.tasks_completed ?? 0,
      reputation: rawReg.reputation ?? 50,
    } : null;

    return NextResponse.json({
      registration,
      pending,
      tasks,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch pending rewards' },
      { status: 400 }
    );
  }
}
