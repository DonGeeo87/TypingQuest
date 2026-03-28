// Campaign-related types for TypingQuest v1.3.0
// Generated: 2026-03-27

export interface Campaign {
  id: string;
  game_id: string;
  title: string;
  description: string | null;
  total_stages: number;
  total_acts: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CampaignStage {
  id: string;
  campaign_id: string;
  stage_number: number; // 1-30
  act_number: number; // 1-5

  // Metadata
  title: string;
  description: string | null;
  narrative_text: string | null;

  // Game parameters
  difficulty_level: number; // 1-10
  base_wpm_threshold: number;
  target_duration_seconds: number;

  // Requirements for star system
  required_wpm: number;
  required_accuracy: number;
  required_combo: number;

  // Rewards
  base_xp_reward: number;
  star_multiplier: number;

  // Progression
  prerequisite_stage_id: string | null;
  unlocks_next: boolean;
  is_checkpoint: boolean;

  created_at: string;
  updated_at: string;
}

export interface CampaignProgress {
  id: string;
  campaign_id: string;
  user_id: string;

  // Progress tracking
  current_stage_number: number;
  completed_stages: number[];
  completed_at: string | null;

  // Rewards accumulated
  total_xp: number;
  total_stars: number;

  // Timestamps
  started_at: string;
  last_played_at: string | null;
  updated_at: string;
}

export interface CampaignStageAttempt {
  id: string;
  campaign_id: string;
  stage_id: string;
  user_id: string;

  // Attempt metadata
  attempt_number: number;
  played_at: string;

  // Performance metrics
  wpm: number;
  accuracy: number;
  errors: number;
  combo_max: number;
  duration_seconds: number | null;

  // Results
  stars_earned: number; // 0-3
  xp_earned: number;
  is_personal_best: boolean;

  // Objectives completed
  objectives_met: ObjectiveType[];

  created_at: string;
}

export interface CampaignReward {
  id: string;
  campaign_id: string;
  stage_id: string | null;
  reward_type: 'xp' | 'badge' | 'avatar_skin' | 'unlock_level';
  reward_value: Record<string, unknown>; // JSON object
  unlock_condition: 'completion' | 'all_stars' | 'leaderboard_top_10';
  created_at: string;
}

// Enums & constants
export type ObjectiveType = 'wpm' | 'accuracy' | 'combo';

export const CAMPAIGN_CONSTANTS = {
  TOTAL_STAGES: 30,
  TOTAL_ACTS: 5,
  STAGES_PER_ACT: 6,
  MAX_STARS_PER_STAGE: 3,
  DIFFICULTY_MIN: 1,
  DIFFICULTY_MAX: 10,
  BASE_XP_REWARD: 100,
};

export const STAR_THRESHOLDS = {
  ONE_STAR: {
    wpm: 'required_wpm',
    accuracy: 'required_accuracy',
    combo: 'required_combo',
  },
  TWO_STAR: {
    combo: 10, // Maintain combo >= 10
  },
  THREE_STAR: {
    accuracy: 99, // 99%+ accuracy
  },
};

// UI State
export interface CampaignUIState {
  currentCampaign: Campaign | null;
  selectedStage: CampaignStage | null;
  playerProgress: CampaignProgress | null;
  stageAttempts: CampaignStageAttempt[];
  isLoading: boolean;
  error: string | null;
  view: 'campaign_select' | 'stage_select' | 'playing' | 'results';
}

// Combined types for service responses
export interface CampaignWithStages extends Campaign {
  stages: CampaignStage[];
}

export interface CampaignWithProgressAndStages extends Campaign {
  progress: CampaignProgress;
  stages: CampaignStage[];
  currentAttempts: CampaignStageAttempt[];
}

// Request/Response types for API
export interface SaveStageAttemptRequest {
  campaign_id: string;
  stage_id: string;
  user_id: string;
  wpm: number;
  accuracy: number;
  errors: number;
  combo_max: number;
  duration_seconds: number;
  objectives_met: ObjectiveType[];
}

export interface SaveStageAttemptResponse {
  success: boolean;
  attempt: CampaignStageAttempt;
  xp_earned: number;
  stars_earned: number;
  level_up?: boolean;
  unlocked_items?: UnlockedItem[];
}

export interface UnlockedItem {
  type: 'achievement' | 'avatar_skin' | 'next_stage' | 'badge';
  id: string;
  name: string;
  icon?: string;
}

// Helper type for level progression
export interface LevelProgression {
  stageNumber: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  stars: number; // 0-3
  bestWpm: number;
  bestAccuracy: number;
  attempts: number;
  lastPlayedAt: string | null;
}
