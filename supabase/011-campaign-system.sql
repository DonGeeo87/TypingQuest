-- ============================================
-- Migration 011: Campaign System Tables
-- ============================================
-- Adds campaign, levels, progress tracking, and rewards system
-- Status: Ready for deployment
-- Date: 2026-03-27

-- ============================================
-- 1. CAMPAIGNS TABLE (Master campaign records)
-- ============================================

CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  total_stages INT DEFAULT 30,
  total_acts INT DEFAULT 5,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. CAMPAIGN_STAGES TABLE (Individual levels)
-- ============================================

CREATE TABLE public.campaign_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  stage_number INT NOT NULL CHECK (stage_number BETWEEN 1 AND 30),
  act_number INT NOT NULL CHECK (act_number BETWEEN 1 AND 5),
  
  -- Metadata
  title TEXT NOT NULL,
  description TEXT,
  narrative_text TEXT,
  
  -- Game parameters
  difficulty_level INT NOT NULL CHECK (difficulty_level BETWEEN 1 AND 10),
  base_wpm_threshold INT NOT NULL,
  target_duration_seconds INT DEFAULT 60,
  
  -- Requirements for objectives
  required_wpm INT DEFAULT 30,
  required_accuracy DECIMAL(5,2) DEFAULT 95.0,
  required_combo INT DEFAULT 0,
  
  -- Rewards
  base_xp_reward INT DEFAULT 100,
  star_multiplier DECIMAL(3,2) DEFAULT 1.0,
  
  -- Progression
  prerequisite_stage_id UUID REFERENCES public.campaign_stages(id),
  unlocks_next BOOLEAN DEFAULT TRUE,
  is_checkpoint BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT unique_stage_per_campaign UNIQUE(campaign_id, stage_number)
);

ALTER TABLE public.campaign_stages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. CAMPAIGN_PROGRESS TABLE (Player progress)
-- ============================================

CREATE TABLE public.campaign_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Progress tracking
  current_stage_number INT DEFAULT 1 CHECK (current_stage_number BETWEEN 1 AND 30),
  completed_stages INT[] DEFAULT ARRAY[]::INT[],
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Rewards accumulated
  total_xp INT DEFAULT 0,
  total_stars INT DEFAULT 0,
  
  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_played_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT unique_campaign_per_user UNIQUE(campaign_id, user_id),
  CONSTRAINT non_negative_xp CHECK (total_xp >= 0),
  CONSTRAINT non_negative_stars CHECK (total_stars >= 0)
);

ALTER TABLE public.campaign_progress ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. CAMPAIGN_STAGE_ATTEMPTS TABLE (Play history)
-- ============================================

CREATE TABLE public.campaign_stage_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  stage_id UUID NOT NULL REFERENCES public.campaign_stages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Attempt metadata
  attempt_number INT DEFAULT 1,
  played_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Performance metrics
  wpm INT NOT NULL CHECK (wpm >= 0),
  accuracy DECIMAL(5,2) NOT NULL CHECK (accuracy >= 0 AND accuracy <= 100),
  errors INT DEFAULT 0 CHECK (errors >= 0),
  combo_max INT DEFAULT 0 CHECK (combo_max >= 0),
  duration_seconds INT,
  
  -- Results
  stars_earned INT DEFAULT 0 CHECK (stars_earned BETWEEN 0 AND 3),
  xp_earned INT DEFAULT 0 CHECK (xp_earned >= 0),
  is_personal_best BOOLEAN DEFAULT FALSE,
  
  -- Objectives completed
  objectives_met TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.campaign_stage_attempts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. CAMPAIGN_REWARDS TABLE (Unlocks & badges)
-- ============================================

CREATE TABLE public.campaign_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  stage_id UUID REFERENCES public.campaign_stages(id) ON DELETE CASCADE,
  
  reward_type TEXT NOT NULL CHECK (reward_type IN ('xp', 'badge', 'avatar_skin', 'unlock_level')),
  reward_value JSONB NOT NULL,
  unlock_condition TEXT NOT NULL CHECK (unlock_condition IN ('completion', 'all_stars', 'leaderboard_top_10')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.campaign_rewards ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Campaigns: READ-ALL (public data)
CREATE POLICY "Anyone can view campaigns" ON public.campaigns
  FOR SELECT USING (true);

-- Campaign Stages: READ-ALL (public data)
CREATE POLICY "Anyone can view stages" ON public.campaign_stages
  FOR SELECT USING (true);

-- Campaign Progress: Users see own progress
CREATE POLICY "Users see own campaign progress" ON public.campaign_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.campaign_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.campaign_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Campaign Attempts: Users see own attempts
CREATE POLICY "Users see own stage attempts" ON public.campaign_stage_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own attempts" ON public.campaign_stage_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Campaign Rewards: READ-ALL (public data)
CREATE POLICY "Anyone can view rewards" ON public.campaign_rewards
  FOR SELECT USING (true);

-- ============================================
-- INDEXES (for performance)
-- ============================================

CREATE INDEX idx_campaign_stages_campaign_id ON public.campaign_stages(campaign_id);
CREATE INDEX idx_campaign_stages_stage_number ON public.campaign_stages(campaign_id, stage_number);
CREATE INDEX idx_campaign_progress_campaign_user ON public.campaign_progress(campaign_id, user_id);
CREATE INDEX idx_campaign_progress_user_id ON public.campaign_progress(user_id);
CREATE INDEX idx_campaign_stage_attempts_stage_id ON public.campaign_stage_attempts(stage_id);
CREATE INDEX idx_campaign_stage_attempts_user_id ON public.campaign_stage_attempts(user_id);
CREATE INDEX idx_campaign_stage_attempts_played_at ON public.campaign_stage_attempts(played_at DESC);
CREATE INDEX idx_campaign_rewards_stage_id ON public.campaign_rewards(stage_id);

-- ============================================
-- SEED DATA: Base Campaign (Optional)
-- ============================================

-- Insert main campaign
INSERT INTO public.campaigns (game_id, title, description, total_stages, total_acts, active)
VALUES (
  'typing-quest-v1',
  'The Typing Quest',
  'Embark on an epic journey through 30 levels of typing challenges. Master the keyboard and unlock the secrets of the ancient library.',
  30,
  5,
  TRUE
) ON CONFLICT (game_id) DO NOTHING;

-- Note: Individual stages (levels 1-30) will be seeded via application or separate seed script
-- to maintain narrative consistency and difficulty curve

-- ============================================
-- END MIGRATION 011
-- ============================================
