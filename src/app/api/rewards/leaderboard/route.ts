import { NextRequest, NextResponse } from 'next/server';
import { getLeaderboard } from '@/lib/rewards-store';

export async function GET(req: NextRequest) {
  try {
    const limitParam = req.nextUrl.searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 20;

    const raw = await getLeaderboard(limit);
    // Map snake_case to camelCase for frontend
    const leaderboard = (raw || []).map((entry: any) => ({
      ...entry,
      agentId: entry.agent_id,
      totalEarned: parseFloat(entry.total_earned ?? 0),
      tasksCompleted: entry.tasks_completed ?? 0,
      reputation: entry.reputation ?? 50,
    }));
    return NextResponse.json(leaderboard);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
