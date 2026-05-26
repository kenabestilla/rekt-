-- REKT Platform Schema
-- Run this in Supabase SQL Editor

-- Agents registry
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('defi','trading','research','social','coding','gaming','data','other')),
  status TEXT NOT NULL DEFAULT 'beta' CHECK (status IN ('live','beta','coming-soon')),
  creator_wallet TEXT NOT NULL,
  avatar_url TEXT,
  website TEXT,
  twitter TEXT,
  discord TEXT,
  github TEXT,
  token_symbol TEXT,
  token_address TEXT,
  chain TEXT DEFAULT 'multi',
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  metrics_users INTEGER DEFAULT 0,
  metrics_transactions BIGINT DEFAULT 0,
  metrics_volume NUMERIC DEFAULT 0,
  metrics_uptime NUMERIC DEFAULT 99.9,
  metrics_rating NUMERIC DEFAULT 0,
  metrics_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agents_category ON agents(category);
CREATE INDEX IF NOT EXISTS idx_agents_featured ON agents(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_agents_creator ON agents(creator_wallet);

-- Agent registrations for reward system
CREATE TABLE IF NOT EXISTS agent_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL UNIQUE,
  wallet TEXT NOT NULL UNIQUE,
  reputation INTEGER DEFAULT 50 CHECK (reputation BETWEEN 0 AND 100),
  total_earned NUMERIC DEFAULT 0,
  pending_reward NUMERIC DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  registered_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_registrations_wallet ON agent_registrations(wallet);

-- Tasks
CREATE TABLE IF NOT EXISTS reward_tasks (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  wallet TEXT NOT NULL,
  task_type TEXT NOT NULL CHECK (task_type IN ('data_processing','api_call','computation','content_generation')),
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  reward_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','verified','rejected')),
  proof TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  verified_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_tasks_wallet ON reward_tasks(wallet);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON reward_tasks(status);

-- Reward records
CREATE TABLE IF NOT EXISTS reward_records (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  wallet TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  task_type TEXT NOT NULL,
  score INTEGER NOT NULL,
  claimed BOOLEAN DEFAULT false,
  tx_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  claimed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_rewards_wallet ON reward_records(wallet);
CREATE INDEX IF NOT EXISTS idx_rewards_unclaimed ON reward_records(wallet) WHERE claimed = false;

-- Agent reviews
CREATE TABLE IF NOT EXISTS agent_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  reviewer_wallet TEXT NOT NULL,
  reviewer_name TEXT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reviews_agent ON agent_reviews(agent_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
