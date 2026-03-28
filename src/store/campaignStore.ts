// Campaign State Management using Zustand
// src/store/campaignStore.ts

import { create } from 'zustand';
import type {
  Campaign,
  CampaignProgress,
  CampaignStage,
  CampaignStageAttempt,
  ObjectiveType,
} from '../types/campaign';
import * as campaignService from '../services/campaignService';

interface CampaignState {
  // Data
  campaign: Campaign | null;
  progress: CampaignProgress | null;
  stages: CampaignStage[];
  currentStage: CampaignStage | null;
  lastAttempt: CampaignStageAttempt | null;

  // UI State
  isLoading: boolean;
  error: string | null;
  view: 'campaign_select' | 'stage_select' | 'playing' | 'results';

  // Context for current game session
  currentGameContext: {
    campaignId: string | null;
    stageId: string | null;
    stageNumber: number | null;
    targetWpm: number | null;
    targetAccuracy: number | null;
  };

  // Actions: Load data
  loadCampaign: (campaignId: string) => Promise<void>;
  loadProgress: (campaignId: string, userId: string) => Promise<void>;
  loadStages: (campaignId: string) => Promise<void>;
  selectStage: (stageNumber: number) => void;

  // Actions: Game session
  startStage: (stageNumber: number, stageId: string) => void;
  setGameContext: (context: Partial<CampaignState['currentGameContext']>) => void;
  clearGameContext: () => void;

  // Actions: Record attempt and update progress
  recordAttempt: (
    stageId: string,
    attempt: {
      wpm: number;
      accuracy: number;
      errors: number;
      combo_max: number;
      duration_seconds: number;
    }
  ) => Promise<{ xp_earned: number; stars_earned: number }>;

  // Actions: State management
  resetCampaign: () => void;
  setError: (error: string | null) => void;
  setView: (view: CampaignState['view']) => void;

  // Computed helpers
  getCompletionPercentage: () => number;
  getNextLockedStage: () => CampaignStage | null;
  getStageStatus: (stageNumber: number) => 'locked' | 'available' | 'completed';
  isStageUnlocked: (stageNumber: number) => boolean;
}

const initialGameContext: CampaignState['currentGameContext'] = {
  campaignId: null,
  stageId: null,
  stageNumber: null,
  targetWpm: null,
  targetAccuracy: null,
};

export const useCampaignStore = create<CampaignState>((set, get) => ({
  // Initial state
  campaign: null,
  progress: null,
  stages: [],
  currentStage: null,
  lastAttempt: null,
  isLoading: false,
  error: null,
  view: 'campaign_select',
  currentGameContext: initialGameContext,

  // ============================================
  // LOAD ACTIONS
  // ============================================

  loadCampaign: async (campaignId: string) => {
    set({ isLoading: true, error: null });
    try {
      const campaign = await campaignService.getCampaign(campaignId);
      if (!campaign) {
        throw new Error('Campaign not found');
      }
      set({ campaign, isLoading: false });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load campaign';
      set({ error: errorMsg, isLoading: false });
    }
  },

  loadProgress: async (campaignId: string, userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const progress = await campaignService.getCampaignProgress(campaignId, userId);
      // If no progress exists, create new one
      if (!progress) {
        const newProgress = await campaignService.createCampaignProgress(campaignId, userId);
        set({ progress: newProgress, isLoading: false });
      } else {
        set({ progress, isLoading: false });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load progress';
      set({ error: errorMsg, isLoading: false });
    }
  },

  loadStages: async (campaignId: string) => {
    set({ isLoading: true, error: null });
    try {
      const stages = await campaignService.getCampaignStages(campaignId);
      set({ stages, isLoading: false });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load stages';
      set({ error: errorMsg, isLoading: false });
    }
  },

  selectStage: (stageNumber: number) => {
    const { stages } = get();
    const stage = stages.find((s) => s.stage_number === stageNumber);
    if (stage) {
      set({ currentStage: stage });
    }
  },

  // ============================================
  // GAME SESSION ACTIONS
  // ============================================

  startStage: (stageNumber: number, stageId: string) => {
    const { stages } = get();
    const stage = stages.find((s) => s.stage_number === stageNumber);

    if (!stage) {
      set({ error: `Stage ${stageNumber} not found` });
      return;
    }

    set({
      currentStage: stage,
      currentGameContext: {
        campaignId: stage.campaign_id,
        stageId: stageId,
        stageNumber: stageNumber,
        targetWpm: stage.required_wpm,
        targetAccuracy: stage.required_accuracy,
      },
      view: 'playing',
    });
  },

  setGameContext: (context: Partial<CampaignState['currentGameContext']>) => {
    set((state) => ({
      currentGameContext: { ...state.currentGameContext, ...context },
    }));
  },

  clearGameContext: () => {
    set({ currentGameContext: initialGameContext, view: 'stage_select' });
  },

  // ============================================
  // RECORD ATTEMPT & UPDATE PROGRESS
  // ============================================

  recordAttempt: async (
    stageId: string,
    attempt: {
      wpm: number;
      accuracy: number;
      errors: number;
      combo_max: number;
      duration_seconds: number;
    }
  ) => {
    const { campaign, progress, currentGameContext } = get();

    if (!campaign || !progress || !currentGameContext.stageNumber) {
      throw new Error('Campaign context missing');
    }

    set({ isLoading: true, error: null });

    try {
      // Get current stage for threshold validation
      const { stages } = get();
      const stage = stages.find((s) => s.id === stageId);
      if (!stage) throw new Error('Stage not found');

      // Calculate stars earned
      const starsEarned = calculateStars(attempt, stage);
      const xpEarned = calculateXP(starsEarned, stage);

      // Record attempt in database
      const attemptRecord = await campaignService.saveCampaignAttempt({
        campaign_id: campaign.id,
        stage_id: stageId,
        user_id: progress.user_id,
        attempt_number: 1, // Should query previous attempts
        wpm: attempt.wpm,
        accuracy: attempt.accuracy,
        errors: attempt.errors,
        combo_max: attempt.combo_max,
        duration_seconds: attempt.duration_seconds,
        stars_earned: starsEarned,
        xp_earned: xpEarned,
        is_personal_best: false, // Check existing PR
        objectives_met: getCompletedObjectives(attempt, stage),
      });

      // Update local progress state
      const updatedProgress: CampaignProgress = {
        ...progress,
        total_xp: progress.total_xp + xpEarned,
        total_stars: progress.total_stars + starsEarned,
        completed_stages: Array.from(
          new Set([...progress.completed_stages, currentGameContext.stageNumber])
        ),
        last_played_at: new Date().toISOString(),
      };

      // If all stars and not yet completed, mark as completed
      if (starsEarned === 3 && !progress.completed_stages.includes(currentGameContext.stageNumber)) {
        // Update current stage to next
        if (stage.unlocks_next) {
          updatedProgress.current_stage_number = Math.min(
            currentGameContext.stageNumber + 1,
            30
          );
        }
      }

      // Update progress in database
      await campaignService.updateCampaignProgress(updatedProgress);

      set({
        progress: updatedProgress,
        lastAttempt: attemptRecord,
        isLoading: false,
        view: 'results',
      });

      return { xp_earned: xpEarned, stars_earned: starsEarned };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to record attempt';
      set({ error: errorMsg, isLoading: false });
      throw err;
    }
  },

  // ============================================
  // STATE MANAGEMENT ACTIONS
  // ============================================

  resetCampaign: () => {
    set({
      campaign: null,
      progress: null,
      stages: [],
      currentStage: null,
      lastAttempt: null,
      isLoading: false,
      error: null,
      view: 'campaign_select',
      currentGameContext: initialGameContext,
    });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setView: (view: CampaignState['view']) => {
    set({ view });
  },

  // ============================================
  // COMPUTED HELPERS
  // ============================================

  getCompletionPercentage: () => {
    const { progress } = get();
    if (!progress) return 0;
    return (progress.completed_stages.length / 30) * 100;
  },

  getNextLockedStage: () => {
    const { stages, progress } = get();
    if (!progress) return null;

    const nextStageNum = progress.current_stage_number + 1;
    return stages.find((s) => s.stage_number === nextStageNum) || null;
  },

  getStageStatus: (stageNumber: number): 'locked' | 'available' | 'completed' => {
    const { progress } = get();
    if (!progress) return 'locked';

    if (progress.completed_stages.includes(stageNumber)) {
      return 'completed';
    }
    if (stageNumber <= progress.current_stage_number) {
      return 'available';
    }
    return 'locked';
  },

  isStageUnlocked: (stageNumber: number): boolean => {
    const { progress } = get();
    if (!progress) return stageNumber === 1;
    return stageNumber <= progress.current_stage_number;
  },
}));

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate stars earned based on performance
 * 0 stars: Below requirements
 * 1 star: Meets WPM + Accuracy
 * 2 stars: 1 star + Combo >= 10
 * 3 stars: 2 stars + Accuracy >= 99%
 */
function calculateStars(
  attempt: {
    wpm: number;
    accuracy: number;
    errors: number;
    combo_max: number;
    duration_seconds: number;
  },
  stage: CampaignStage
): number {
  const meetsWpm = attempt.wpm >= stage.required_wpm;
  const meetsAccuracy = attempt.accuracy >= stage.required_accuracy;

  if (!meetsWpm || !meetsAccuracy) {
    return 0;
  }

  let stars = 1;

  // 2 stars: combo requirement
  if (attempt.combo_max >= 10) {
    stars = 2;
  }

  // 3 stars: 99%+ accuracy
  if (attempt.accuracy >= 99) {
    stars = 3;
  }

  return stars;
}

/**
 * Calculate XP earned
 * Base: stage.base_xp_reward * star_multiplier
 * Bonus: Additional XP for high accuracy or combo
 */
function calculateXP(starsEarned: number, stage: CampaignStage): number {
  const baseXp = stage.base_xp_reward;
  const multiplier = starsEarned > 0 ? stage.star_multiplier * starsEarned : 0.5; // 50% XP if failed
  return Math.round(baseXp * multiplier);
}

/**
 * Determine which objectives were completed
 */
function getCompletedObjectives(
  attempt: {
    wpm: number;
    accuracy: number;
    errors: number;
    combo_max: number;
    duration_seconds: number;
  },
  stage: CampaignStage
): ObjectiveType[] {
  const objectives: ObjectiveType[] = [];

  if (attempt.wpm >= stage.required_wpm) {
    objectives.push('wpm');
  }
  if (attempt.accuracy >= stage.required_accuracy) {
    objectives.push('accuracy');
  }
  if (attempt.combo_max >= stage.required_combo) {
    objectives.push('combo');
  }

  return objectives;
}
