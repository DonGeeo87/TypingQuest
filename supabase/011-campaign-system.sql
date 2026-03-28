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

-- ============================================
-- SEED DATA: 30 Campaign Stages
-- ============================================

-- Get campaign ID first (assumes campaign was inserted above)
DO $$
DECLARE
  campaign_uuid UUID;
BEGIN
  -- Get the campaign ID
  SELECT id INTO campaign_uuid FROM campaigns WHERE game_id = 'typing-quest-v1';

  IF campaign_uuid IS NULL THEN
    RAISE NOTICE 'Campaign not found. Please ensure the campaign seed was inserted first.';
  ELSE
    -- ============================================
    -- ACT I: THE BEGINNING (Levels 1-6)
    -- ============================================
    INSERT INTO public.campaign_stages (campaign_id, stage_number, act_number, title, description, narrative_text, difficulty_level, base_wpm_threshold, target_duration_seconds, required_wpm, required_accuracy, required_combo, base_xp_reward, star_multiplier, unlocks_next, is_checkpoint)
    VALUES
    (campaign_uuid, 1, 1, 'First Words', 'Begin your journey', 'You discover an ancient library filled with forgotten words. Your journey begins...', 1, 10, 30, 10, 90.00, 0, 50, 1.0, TRUE, TRUE),
    (campaign_uuid, 2, 1, 'Growing Confidence', 'Build momentum', 'Each word learned strengthens your resolve. The library whispers ancient secrets...', 1, 12, 30, 12, 90.00, 5, 60, 1.0, TRUE, FALSE),
    (campaign_uuid, 3, 1, 'Rhythm of Words', 'Find your flow', 'You begin to feel a rhythm in the words. Time seems to flow differently here...', 1, 15, 30, 15, 91.00, 10, 75, 1.0, TRUE, FALSE),
    (campaign_uuid, 4, 1, 'Flowing Words', 'Smooth typing', 'Your fingers find comfort on the keys. The library begins to glow...', 2, 18, 45, 18, 92.00, 15, 90, 1.0, TRUE, FALSE),
    (campaign_uuid, 5, 1, 'Mastering Basics', 'Foundation solid', 'The foundation is strong. You feel ready for greater challenges...', 2, 20, 45, 20, 92.00, 20, 100, 1.0, TRUE, FALSE),
    (campaign_uuid, 6, 1, 'Act I Boss: The Gatekeeper', 'First challenge', 'The first guardian appears! Type with all your might to prove your worth!', 2, 25, 60, 25, 93.00, 25, 150, 1.0, TRUE, TRUE),

    -- ============================================
    -- ACT II: THE CHALLENGE (Levels 7-12)
    -- ============================================
    (campaign_uuid, 7, 2, 'New Horizons', 'Beyond the gate', 'The gate opens revealing vast new chambers of knowledge...', 2, 25, 45, 25, 93.00, 10, 100, 1.0, TRUE, TRUE),
    (campaign_uuid, 8, 2, 'Speed Building', 'Pick up the pace', 'Words fly faster now. Keep up with the flowing text...', 3, 28, 45, 28, 93.50, 15, 110, 1.0, TRUE, FALSE),
    (campaign_uuid, 9, 2, 'Accuracy Matters', 'Precision required', 'The ancient texts demand perfect precision. Every keystroke counts...', 3, 30, 60, 30, 94.00, 20, 120, 1.0, TRUE, FALSE),
    (campaign_uuid, 10, 2, 'Combo Rising', 'Build your streak', 'Chain words together to unlock hidden chambers...', 3, 32, 45, 32, 94.00, 25, 130, 1.0, TRUE, FALSE),
    (campaign_uuid, 11, 2, 'Storm of Words', 'Endure the challenge', 'A storm of letters approaches! Hold your ground!', 3, 35, 60, 35, 94.50, 30, 140, 1.0, TRUE, FALSE),
    (campaign_uuid, 12, 2, 'Act II Boss: The Scholar', 'Knowledge test', 'The great Scholar challenges your typing prowess. Show your mastery!', 3, 40, 60, 40, 95.00, 35, 200, 1.0, TRUE, TRUE),

    -- ============================================
    -- ACT III: THE CRISIS (Levels 13-18)
    -- ============================================
    (campaign_uuid, 13, 3, 'Dark Chamber', 'Into the unknown', 'Shadows fall across the library. Only your typing can light the way...', 4, 40, 60, 40, 95.00, 15, 150, 1.1, TRUE, TRUE),
    (campaign_uuid, 14, 3, 'Speed Demon', 'Embrace velocity', 'The words themselves begin to race. Can you keep up?', 4, 42, 45, 42, 95.00, 20, 160, 1.1, TRUE, FALSE),
    (campaign_uuid, 15, 3, 'Perfect Storm', 'Ultimate focus', 'Every letter matters now. Focus your mind and type with precision...', 4, 45, 60, 45, 95.50, 25, 175, 1.1, TRUE, FALSE),
    (campaign_uuid, 16, 3, 'Breaking Barriers', 'Push limits', '突破! New languages appear. Adapt and overcome!', 4, 48, 60, 48, 95.50, 30, 190, 1.1, TRUE, FALSE),
    (campaign_uuid, 17, 3, 'Chaos Theory', 'Master entropy', 'The library descends into beautiful chaos. Bring order with your keyboard!', 5, 50, 60, 50, 96.00, 35, 210, 1.1, TRUE, FALSE),
    (campaign_uuid, 18, 3, 'Act III Boss: The Phoenix', 'Rise from ashes', 'The Phoenix guardian blocks your path. Typing fire with fire!', 5, 55, 90, 55, 96.00, 40, 300, 1.1, TRUE, TRUE),

    -- ============================================
    -- ACT IV: THE RECKONING (Levels 19-24)
    -- ============================================
    (campaign_uuid, 19, 4, 'Final Stretch', 'Almost there', 'The end is near! Every word brings you closer to victory...', 5, 55, 60, 55, 96.00, 20, 200, 1.2, TRUE, TRUE),
    (campaign_uuid, 20, 4, 'Velocity', 'Speed incarnate', 'Words now flow like water. Be the river!', 5, 58, 60, 58, 96.00, 25, 220, 1.2, TRUE, FALSE),
    (campaign_uuid, 21, 4, 'Precision Master', 'Perfection achieved', '100% focus. 100% accuracy. The ultimate typing form...', 5, 60, 60, 60, 96.50, 30, 240, 1.2, TRUE, FALSE),
    (campaign_uuid, 22, 4, 'Mind Reader', 'Anticipate thoughts', 'The texts now speak before you type. Read ahead!', 5, 62, 60, 62, 96.50, 35, 260, 1.2, TRUE, FALSE),
    (campaign_uuid, 23, 4, 'Light Speed', 'Beyond fast', 'Approaching light speed typing! The finish line glows ahead!', 5, 65, 60, 65, 97.00, 40, 280, 1.2, TRUE, FALSE),
    (campaign_uuid, 24, 4, 'Act IV Boss: The Dragon', 'Final guardian', 'The legendary Dragon guards the final chamber. Conquer this beast!', 5, 70, 90, 70, 97.00, 45, 400, 1.2, TRUE, TRUE),

    -- ============================================
    -- ACT V: THE TRIUMPH (Levels 25-30)
    -- ============================================
    (campaign_uuid, 25, 5, 'Victory Lane', 'Taste triumph', 'The end is in sight! Sprint to glory!', 5, 70, 60, 70, 97.00, 25, 300, 1.3, TRUE, TRUE),
    (campaign_uuid, 26, 5, 'Legendary', 'Become legend', 'Your fingers dance across the keyboard like never before...', 5, 72, 60, 72, 97.00, 30, 320, 1.3, TRUE, FALSE),
    (campaign_uuid, 27, 5, 'God Mode', 'Typing deity', 'You have transcended mortal typing. Become one with the keyboard!', 5, 75, 60, 75, 97.50, 35, 350, 1.3, TRUE, FALSE),
    (campaign_uuid, 28, 5, 'Infinite', 'Endless mastery', 'There is no limit. Type forever!', 5, 78, 60, 78, 97.50, 40, 380, 1.3, TRUE, FALSE),
    (campaign_uuid, 29, 5, 'Ultimate', 'Peak performance', 'This is it. The ultimate typing challenge. Give everything you have!', 5, 80, 60, 80, 98.00, 45, 420, 1.3, TRUE, FALSE),
    (campaign_uuid, 30, 5, 'FINAL BOSS: The Typing Master', 'Prove your worth', 'The Typing Master awaits! Type faster than ever to claim victory!', 5, 100, 120, 100, 99.00, 50, 1000, 1.5, FALSE, TRUE)
    ON CONFLICT (campaign_id, stage_number) DO NOTHING;

    RAISE NOTICE 'Campaign stages seeded successfully!';
  END IF;
END $$;

-- ============================================
-- END MIGRATION 011
-- ============================================
