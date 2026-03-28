# 🎮 Campaign Mode Architecture - Sprint 1

**Issue**: #34 - [EPIC] Campaign: Story + 30 Levels  
**Story Points**: 8  
**Duration**: 1.5 weeks (Weeks 1-2)  
**Status**: 🚀 In Design Phase

---

## 📊 Overview

Campaign Mode transforms TypingQuest from a practice tool into a narrative-driven game with:
- **Story**: 5-act narrative (Tutorial → Act I → Act II → Act III → Act IV → Finale)
- **30 Levels**: Progressive difficulty from 1-10WPM to 60+ WPM
- **Progression System**: Level unlock mechanism, rewards, and checkpoints
- **Engagement**: Replayable levels with leaderboards per level

### Target Impact
- +30% session duration (longer engagement per play session)
- +25% daily active users (hook players into progression loop)
- 90/100 game completeness score

---

## 🏗️ Architecture Design

### 1. Data Layer (Supabase)

#### New Tables

```sql
-- ============================================
-- CAMPAIGN SYSTEM TABLES
-- ============================================

-- 1. campaigns table (master campaign data)
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id TEXT UNIQUE NOT NULL, -- 'typing-quest-v1'
  title TEXT NOT NULL, -- 'The Typing Quest'
  description TEXT,
  total_stages INT DEFAULT 30,
  total_acts INT DEFAULT 5,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. campaign_stages table (individual levels/challenges)
CREATE TABLE campaign_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  stage_number INT NOT NULL, -- 1-30
  act_number INT NOT NULL, -- 1-5
  
  -- Stage metadata
  title TEXT NOT NULL, -- "Act I - The Beginning"
  description TEXT,
  narrative_text TEXT, -- Story blurb for this stage
  
  -- Game parameters
  difficulty_level INT NOT NULL, -- 1-10
  base_wpm_threshold INT NOT NULL, -- Minimum WPM to 1-star
  target_duration_seconds INT DEFAULT 60,
  
  -- Requirements (can be multiple)
  required_wpm INT DEFAULT 30,
  required_accuracy DECIMAL(5,2) DEFAULT 95.0,
  required_combo INT DEFAULT 0,
  
  -- Rewards
  base_xp_reward INT DEFAULT 100,
  star_multiplier DECIMAL(3,2) DEFAULT 1.0, -- XP mult if all stars
  unlocks_achievement UUID REFERENCES achievements(id),
  
  -- Progression
  prerequisite_stage_id UUID REFERENCES campaign_stages(id),
  unlocks_next BOOLEAN DEFAULT TRUE,
  is_checkpoint BOOLEAN DEFAULT FALSE, -- Save point?
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(campaign_id, stage_number)
);

-- 3. campaign_progress table (player progress per campaign)
CREATE TABLE campaign_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Progress tracking
  current_stage_number INT DEFAULT 1,
  completed_stages INT[] DEFAULT ARRAY[]::INT[], -- Array of stage #s completed
  completed_at TIMESTAMP,
  
  -- Rewards accumulated
  total_xp INT DEFAULT 0,
  total_stars INT DEFAULT 0, -- Sum of stars from all levels
  
  -- Timestamps
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_played_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(campaign_id, user_id)
);

-- 4. campaign_stage_attempts table (detailed play history)
CREATE TABLE campaign_stage_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  stage_id UUID REFERENCES campaign_stages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Attempt metadata
  attempt_number INT DEFAULT 1,
  played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Performance metrics
  wpm INT NOT NULL,
  accuracy DECIMAL(5,2) NOT NULL,
  errors INT DEFAULT 0,
  combo_max INT DEFAULT 0,
  duration_seconds INT,
  
  -- Results
  stars_earned INT DEFAULT 0, -- 0-3 stars
  xp_earned INT DEFAULT 0,
  is_personal_best BOOLEAN DEFAULT FALSE,
  
  -- Objectives completed
  objectives_met TEXT[] DEFAULT ARRAY[]::TEXT[], -- ['wpm', 'accuracy', 'combo']
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. campaign_rewards table (unlock tracking: badges, skins, etc)
CREATE TABLE campaign_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  stage_id UUID REFERENCES campaign_stages(id),
  reward_type TEXT NOT NULL, -- 'xp', 'badge', 'avatar_skin', 'unlock_level'
  reward_value TEXT NOT NULL, -- JSON: {"xp": 100} or {"badge_id": "..."}
  unlock_condition TEXT NOT NULL, -- 'completion', 'all_stars', 'leaderboard_top_10'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RLS Policies (same pattern as existing tables)
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_stage_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_rewards ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own campaign progress
CREATE POLICY "Users see own campaign progress" ON campaign_progress
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their attempts
CREATE POLICY "Users insert own attempts" ON campaign_stage_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Similar policies for other tables...
```

#### SQL Migration File

File: `supabase/011-campaign-system.sql`

---

### 2. Type Layer (TypeScript)

#### Campaign Types

```ts
// types/campaign.ts

export interface Campaign {
  id: string;
  game_id: string;
  title: string;
  description: string;
  total_stages: number;
  total_acts: number;
  active: boolean;
  created_at: string;
}

export interface CampaignStage {
  id: string;
  campaign_id: string;
  stage_number: number; // 1-30
  act_number: number; // 1-5
  
  // Metadata
  title: string;
  description: string;
  narrative_text: string;
  
  // Game parameters
  difficulty_level: number;
  base_wpm_threshold: number;
  target_duration_seconds: number;
  
  // Requirements
  required_wpm: number;
  required_accuracy: number;
  required_combo: number;
  
  // Rewards
  base_xp_reward: number;
  star_multiplier: number;
  unlocks_achievement?: string;
  
  // Progression
  prerequisite_stage_id?: string;
  unlocks_next: boolean;
  is_checkpoint: boolean;
  
  created_at: string;
}

export interface CampaignProgress {
  id: string;
  campaign_id: string;
  user_id: string;
  
  // Progress
  current_stage_number: number;
  completed_stages: number[];
  completed_at?: string;
  
  // Rewards
  total_xp: number;
  total_stars: number;
  
  // Timestamps
  started_at: string;
  last_played_at?: string;
  updated_at: string;
}

export interface CampaignStageAttempt {
  id: string;
  campaign_id: string;
  stage_id: string;
  user_id: string;
  
  // Metadata
  attempt_number: number;
  played_at: string;
  
  // Metrics
  wpm: number;
  accuracy: number;
  errors: number;
  combo_max: number;
  duration_seconds: number;
  
  // Results
  stars_earned: number; // 0-3
  xp_earned: number;
  is_personal_best: boolean;
  objectives_met: ObjectiveType[];
  
  created_at: string;
}

export type ObjectiveType = 'wpm' | 'accuracy' | 'combo';

export interface CampaignReward {
  id: string;
  campaign_id: string;
  stage_id: string;
  reward_type: 'xp' | 'badge' | 'avatar_skin' | 'unlock_level';
  reward_value: Record<string, any>;
  unlock_condition: 'completion' | 'all_stars' | 'leaderboard_top_10';
}

// UI States
export interface CampaignUIState {
  currentCampaign: Campaign | null;
  selectedStage: CampaignStage | null;
  playerProgress: CampaignProgress | null;
  stageAttempts: CampaignStageAttempt[];
  isLoading: boolean;
  error: string | null;
}
```

---

### 3. State Management Layer (Zustand)

#### campaignStore.ts

```ts
// src/store/campaignStore.ts

import { create } from 'zustand';
import type { Campaign, CampaignProgress, CampaignStage } from '../types/campaign';

interface CampaignState {
  // Current campaign
  campaign: Campaign | null;
  progress: CampaignProgress | null;
  currentStage: CampaignStage | null;
  
  // Actions
  loadCampaign: (campaignId: string) => Promise<void>;
  loadProgress: (campaignId: string, userId: string) => Promise<void>;
  startStage: (stageNumber: number) => void;
  completeStage: (stageNumber: number, starsEarned: number, xpEarned: number) => Promise<void>;
  
  // Computed
  getCompletionPercentage: () => number;
  getNextLockedStage: () => CampaignStage | null;
  
  // Reset
  resetCampaign: () => void;
}

export const useCampaignStore = create<CampaignState>((set, get) => ({
  campaign: null,
  progress: null,
  currentStage: null,
  
  loadCampaign: async (campaignId: string) => {
    // Fetch from Supabase and set state
  },
  
  startStage: (stageNumber: number) => {
    // Set currentStage and prepare GameState
  },
  
  completeStage: async (stageNumber: number, starsEarned: number, xpEarned: number) => {
    // Update campaign_progress and campaign_stage_attempts
    // Check for unlocks and achievements
  },
  
  getCompletionPercentage: () => {
    const { progress } = get();
    if (!progress) return 0;
    return (progress.completed_stages.length / 30) * 100;
  },
  
  resetCampaign: () => {
    set({ campaign: null, progress: null, currentStage: null });
  },
}));
```

---

### 4. Service Layer

#### campaignService.ts

```ts
// src/services/campaignService.ts

import { supabase } from '../lib/supabase';
import type { Campaign, CampaignProgress, CampaignStageAttempt } from '../types/campaign';

export async function getCampaign(campaignId: string): Promise<Campaign | null> {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', campaignId)
    .single();
  
  if (error) console.error('Campaign fetch error:', error);
  return data;
}

export async function getCampaignProgress(
  campaignId: string,
  userId: string
): Promise<CampaignProgress | null> {
  const { data, error } = await supabase
    .from('campaign_progress')
    .select('*')
    .eq('campaign_id', campaignId)
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') console.error(error);
  return data || null;
}

export async function saveCampaignAttempt(
  attempt: Omit<CampaignStageAttempt, 'id' | 'created_at'>
): Promise<CampaignStageAttempt | null> {
  // Calculate stars (3-star system)
  const starsEarned = calculateStars(attempt);
  
  // Save attempt
  const { data, error } = await supabase
    .from('campaign_stage_attempts')
    .insert([{ ...attempt, stars_earned: starsEarned }])
    .select()
    .single();
  
  if (error) {
    console.error('Attempt save error:', error);
    return null;
  }
  
  // Update campaign_progress
  await updateCampaignProgress(attempt.user_id, attempt.campaign_id, starsEarned);
  
  return data;
}

function calculateStars(attempt: CampaignStageAttempt): number {
  // 0 stars: below requirements
  // 1 star: meets WPM + accuracy
  // 2 stars: meets WPM + accuracy + combo
  // 3 stars: all above with 95%+ accuracy
  return 0; // TODO
}

async function updateCampaignProgress(
  userId: string,
  campaignId: string,
  starsEarned: number
): Promise<void> {
  // Increment total XP, total stars
  // Add to completed_stages if not already there
}
```

---

### 5. UI Components

#### CampaignHUD Component

```tsx
// src/components/CampaignHUD.tsx

interface CampaignHUDProps {
  campaign: Campaign;
  progress: CampaignProgress;
  currentStage: CampaignStage;
}

export function CampaignHUD({ campaign, progress, currentStage }: CampaignHUDProps) {
  return (
    <div className="campaign-hud">
      {/* Act indicator */}
      <div className="act-header">
        Act {currentStage.act_number} - {currentStage.title}
      </div>
      
      {/* Stage objectives */}
      <div className="objectives">
        <ObjectiveCard label="WPM" target={currentStage.required_wpm} />
        <ObjectiveCard label="Accuracy" target={currentStage.required_accuracy} />
        <ObjectiveCard label="Combo" target={currentStage.required_combo} />
      </div>
      
      {/* Narrative context */}
      <div className="narrative">{currentStage.narrative_text}</div>
      
      {/* Stars progress */}
      <div className="stars">
        {Array(3).fill(0).map((_, i) => (
          <Star key={i} filled={i < progress.total_stars} />
        ))}
      </div>
      
      {/* XP progress bar */}
      <div className="xp-bar">
        <ProgressBar value={progress.total_xp} max={progress.total_xp + 500} />
      </div>
    </div>
  );
}
```

#### CampaignScreen Component

```tsx
// src/screens/CampaignScreen.tsx

interface CampaignScreenProps {
  onSelectStage: (stage: CampaignStage) => void;
  onBack: () => void;
}

export function CampaignScreen({ onSelectStage, onBack }: CampaignScreenProps) {
  const { campaign, progress } = useCampaignStore();
  const [stages, setStages] = useState<CampaignStage[]>([]);
  
  useEffect(() => {
    if (campaign?.id) {
      // Fetch all stages
      supabase
        .from('campaign_stages')
        .select('*')
        .eq('campaign_id', campaign.id)
        .order('stage_number')
        .then(({ data }) => setStages(data || []));
    }
  }, [campaign?.id]);
  
  return (
    <div className="campaign-screen">
      <header className="campaign-header">
        <h1>{campaign?.title}</h1>
        <ProgressBar 
          value={progress?.completed_stages.length || 0} 
          max={30}
          label="Progress"
        />
      </header>
      
      <div className="stages-grid">
        {stages.map((stage) => (
          <StageCard
            key={stage.id}
            stage={stage}
            isCompleted={progress?.completed_stages.includes(stage.stage_number)}
            isLocked={!isUnlocked(stage, progress)}
            onSelect={() => onSelectStage(stage)}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## 📱 Screens & Navigation Flow

```
HomeScreen
  ↓ (Click "Campaign")
  ↓
CampaignScreen (Level select grid, 30 levels)
  ├─ Act I (Levels 1-6)
  ├─ Act II (Levels 7-12)
  ├─ Act III (Levels 13-18)
  ├─ Act IV (Levels 19-24)
  └─ Act V (Levels 25-30)
  ↓ (Click level)
  ↓
CampaignGameScreen (wraps GameScreen with Campaign HUD)
  ├─ CampaignHUD (objectives, narrative, XP bar)
  ├─ GameScreen (standard typing gameplay)
  └─ StatsOverlay (post-game stars, XP, unlocks)
  ↓ (Complete)
  ↓
CampaignResultsScreen (show stars earned, XP, +next stage unlock)
  ↓
Back to CampaignScreen
```

---

## 🎯 Star System (3-Star Progression)

Each level can earn 0-3 stars based on performance:

```
⭐ 1 Star
├─ Condition: Complete level (WPM >= base_threshold, Accuracy >= required)
├─ Reward: 1x XP

⭐⭐ 2 Stars
├─ Condition: 1-star + maintain combo >= 10
├─ Reward: 1.5x XP

⭐⭐⭐ 3 Stars
├─ Condition: 2-stars + accuracy >= 99%
├─ Reward: 2x XP + badge unlock
```

---

## 🏆 Campaign Narrative Structure

```
THE TYPING QUEST: A Journey Through Words

ACT I: THE BEGINNING (Levels 1-6)
  "You discover an ancient library..."
  Difficulty: 1-2
  
ACT II: THE CHALLENGE (Levels 7-12)
  "The words grow harder, the story deepens..."
  Difficulty: 3-4
  Checkpoint: Level 6 (save/resume)
  
ACT III: THE CRISIS (Levels 13-18)
  "Forces rise against you..."
  Difficulty: 5-6
  Checkpoint: Level 12
  
ACT IV: THE RECKONING (Levels 19-24)
  "The final test approaches..."
  Difficulty: 7-8
  Checkpoint: Level 18
  
ACT V: THE TRIUMPH (Levels 25-30)
  "Victory awaits the worthy..."
  Difficulty: 9-10
  Final Boss: Level 30 (special enemy/challenge)
  Checkpoint: Level 24
```

---

## 📊 Level Difficulty Curve

```
Level   WPM Range   Accuracy   Words/sec   Duration
1-6     10-20 WPM   90%+       0.5-1.0     60s
7-12    20-30 WPM   92%+       1.0-1.5     60s
13-18   30-40 WPM   94%+       1.5-2.0     60s
19-24   40-50 WPM   95%+       2.0-2.5     60s
25-30   50-60 WPM   96%+       2.5-3.0     60s
```

---

## 👉 Implementation Checklist

### Phase A: Infrastructure (2 days)
- [ ] Create Supabase migration: `011-campaign-system.sql`
- [ ] Add types to `types/index.ts`
- [ ] Create `campaignStore.ts`
- [ ] Create `campaignService.ts`

### Phase B: Core Components (4 days)
- [ ] Create `CampaignScreen.tsx`
- [ ] Create `CampaignGameScreen.tsx`
- [ ] Create `CampaignHUD.tsx`
- [ ] Create `CampaignResultsScreen.tsx`
- [ ] Create `StageCard.tsx` component

### Phase C: Integration (2 days)
- [ ] Integrate with `GameScreen`
- [ ] Add Campaign route to `App.tsx`
- [ ] Seed 30 campaign levels to Supabase
- [ ] Connect to `HomeScreen` navigation

### Phase D: Polish & Testing (2 days)
- [ ] Create unit tests
- [ ] Create E2E tests (Vitest)
- [ ] Performance optimization
- [ ] UX/UI refinement

---

## 🔗 Dependencies

**Before Campaign Launch:**
- ✅ GameScreen (already works)
- ✅ gameStore (already works)
- ✅ Database (Supabase schema ready)
- ✅ Auth (already works)

**After Campaign (blockers for other features):**
- Achievements System (#39) - depends on Campaign objectives
- Daily Challenges (#40) - can be independent
- Friend System (#42) - depends on Campaign XP profile

---

## 📈 Success Criteria

- [ ] All 30 levels playable end-to-end
- [ ] Star system calculates correctly (0-3)
- [ ] XP accumulates per attempt
- [ ] Progress persists between sessions (Supabase)
- [ ] Narrative displays correctly for each act
- [ ] E2E tests pass (90%+ coverage)
- [ ] Load time < 2s per level
- [ ] Mobile responsive (tested on iPhone 12)

---

**Created**: 2026-03-27  
**Status**: 🚀 Ready for Implementation  
**Owner**: Dev Team  
**Next Step**: Create Supabase migration
