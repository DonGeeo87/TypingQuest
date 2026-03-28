// Campaign Service - Supabase integration
// src/services/campaignService.ts

import { supabase } from '../lib/supabase';
import type {
  Campaign,
  CampaignProgress,
  CampaignStage,
  CampaignStageAttempt,
} from '../types/campaign';

// ============================================
// CAMPAIGN QUERIES
// ============================================

/**
 * Get a campaign by ID
 */
export async function getCampaign(campaignId: string): Promise<Campaign | null> {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw error;
    }

    return data as Campaign;
  } catch (err) {
    console.error('getCampaign error:', err);
    throw err;
  }
}

/**
 * Get default/main campaign for the game
 */
export async function getMainCampaign(): Promise<Campaign | null> {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('game_id', 'typing-quest-v1')
      .eq('active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw error;
    }

    return data as Campaign;
  } catch (err) {
    console.error('getMainCampaign error:', err);
    throw err;
  }
}

// ============================================
// CAMPAIGN STAGES QUERIES
// ============================================

/**
 * Get all stages for a campaign
 */
export async function getCampaignStages(campaignId: string): Promise<CampaignStage[]> {
  try {
    const { data, error } = await supabase
      .from('campaign_stages')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('stage_number', { ascending: true });

    if (error) throw error;

    return (data as CampaignStage[]) || [];
  } catch (err) {
    console.error('getCampaignStages error:', err);
    throw err;
  }
}

/**
 * Get a specific stage
 */
export async function getCampaignStage(stageId: string): Promise<CampaignStage | null> {
  try {
    const { data, error } = await supabase
      .from('campaign_stages')
      .select('*')
      .eq('id', stageId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data as CampaignStage;
  } catch (err) {
    console.error('getCampaignStage error:', err);
    throw err;
  }
}

/**
 * Get stages for a specific act
 */
export async function getCampaignStagesByAct(
  campaignId: string,
  actNumber: number
): Promise<CampaignStage[]> {
  try {
    const { data, error } = await supabase
      .from('campaign_stages')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('act_number', actNumber)
      .order('stage_number', { ascending: true });

    if (error) throw error;

    return (data as CampaignStage[]) || [];
  } catch (err) {
    console.error('getCampaignStagesByAct error:', err);
    throw err;
  }
}

// ============================================
// CAMPAIGN PROGRESS QUERIES
// ============================================

/**
 * Get or create campaign progress for a user
 */
export async function getCampaignProgress(
  campaignId: string,
  userId: string
): Promise<CampaignProgress | null> {
  try {
    const { data, error } = await supabase
      .from('campaign_progress')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found, needs to be created
      }
      throw error;
    }

    return data as CampaignProgress;
  } catch (err) {
    console.error('getCampaignProgress error:', err);
    throw err;
  }
}

/**
 * Create new campaign progress for a user
 */
export async function createCampaignProgress(
  campaignId: string,
  userId: string
): Promise<CampaignProgress> {
  try {
    const { data, error } = await supabase
      .from('campaign_progress')
      .insert([
        {
          campaign_id: campaignId,
          user_id: userId,
          current_stage_number: 1,
          completed_stages: [],
          total_xp: 0,
          total_stars: 0,
          started_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return data as CampaignProgress;
  } catch (err) {
    console.error('createCampaignProgress error:', err);
    throw err;
  }
}

/**
 * Update campaign progress
 */
export async function updateCampaignProgress(
  progress: CampaignProgress
): Promise<CampaignProgress> {
  try {
    const { data, error } = await supabase
      .from('campaign_progress')
      .update({
        current_stage_number: progress.current_stage_number,
        completed_stages: progress.completed_stages,
        total_xp: progress.total_xp,
        total_stars: progress.total_stars,
        last_played_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', progress.id)
      .select()
      .single();

    if (error) throw error;

    return data as CampaignProgress;
  } catch (err) {
    console.error('updateCampaignProgress error:', err);
    throw err;
  }
}

// ============================================
// CAMPAIGN STAGE ATTEMPTS (Play History)
// ============================================

/**
 * Save a campaign stage attempt (single play session)
 */
export async function saveCampaignAttempt(
  attempt: Omit<CampaignStageAttempt, 'id' | 'created_at'>
): Promise<CampaignStageAttempt> {
  try {
    const { data, error } = await supabase
      .from('campaign_stage_attempts')
      .insert([attempt])
      .select()
      .single();

    if (error) throw error;

    return data as CampaignStageAttempt;
  } catch (err) {
    console.error('saveCampaignAttempt error:', err);
    throw err;
  }
}

/**
 * Get all attempts for a specific stage
 */
export async function getStageAttempts(
  stageId: string,
  userId: string,
  limit: number = 10
): Promise<CampaignStageAttempt[]> {
  try {
    const { data, error } = await supabase
      .from('campaign_stage_attempts')
      .select('*')
      .eq('stage_id', stageId)
      .eq('user_id', userId)
      .order('played_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data as CampaignStageAttempt[]) || [];
  } catch (err) {
    console.error('getStageAttempts error:', err);
    throw err;
  }
}

/**
 * Get user's best attempt for a stage
 */
export async function getBestStageAttempt(
  stageId: string,
  userId: string
): Promise<CampaignStageAttempt | null> {
  try {
    const { data, error } = await supabase
      .from('campaign_stage_attempts')
      .select('*')
      .eq('stage_id', stageId)
      .eq('user_id', userId)
      .order('stars_earned', { ascending: false })
      .order('wpm', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data as CampaignStageAttempt;
  } catch (err) {
    console.error('getBestStageAttempt error:', err);
    throw err;
  }
}

/**
 * Get all attempts for a campaign (user stats)
 */
export async function getCampaignAttempts(
  campaignId: string,
  userId: string
): Promise<CampaignStageAttempt[]> {
  try {
    const { data, error } = await supabase
      .from('campaign_stage_attempts')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('user_id', userId)
      .order('played_at', { ascending: false });

    if (error) throw error;

    return (data as CampaignStageAttempt[]) || [];
  } catch (err) {
    console.error('getCampaignAttempts error:', err);
    throw err;
  }
}

// ============================================
// CAMPAIGN STATISTICS
// ============================================

/**
 * Get user's campaign statistics
 */
export async function getCampaignStats(
  campaignId: string,
  userId: string
): Promise<{
  totalAttempts: number;
  totalStarsEarned: number;
  totalXpEarned: number;
  averageWpm: number;
  averageAccuracy: number;
  completedStages: number;
}> {
  try {
    const attempts = await getCampaignAttempts(campaignId, userId);

    if (attempts.length === 0) {
      return {
        totalAttempts: 0,
        totalStarsEarned: 0,
        totalXpEarned: 0,
        averageWpm: 0,
        averageAccuracy: 0,
        completedStages: 0,
      };
    }

    // Best attempt per stage (dedup by stage)
    const bestPerStage = new Map<string, CampaignStageAttempt>();
    attempts.forEach((attempt) => {
      const existing = bestPerStage.get(attempt.stage_id);
      if (!existing || attempt.stars_earned > existing.stars_earned) {
        bestPerStage.set(attempt.stage_id, attempt);
      }
    });

    const bestAttempts = Array.from(bestPerStage.values());

    return {
      totalAttempts: attempts.length,
      totalStarsEarned: bestAttempts.reduce((sum, a) => sum + a.stars_earned, 0),
      totalXpEarned: bestAttempts.reduce((sum, a) => sum + a.xp_earned, 0),
      averageWpm:
        bestAttempts.reduce((sum, a) => sum + a.wpm, 0) / bestAttempts.length,
      averageAccuracy:
        bestAttempts.reduce((sum, a) => sum + a.accuracy, 0) / bestAttempts.length,
      completedStages: bestAttempts.filter((a) => a.stars_earned > 0).length,
    };
  } catch (err) {
    console.error('getCampaignStats error:', err);
    throw err;
  }
}

/**
 * Get leaderboard for a specific stage
 */
export async function getStageLeaderboard(
  stageId: string,
  limit: number = 10
): Promise<
  Array<{
    user_id: string;
    username: string;
    wpm: number;
    accuracy: number;
    stars: number;
  }>
> {
  try {
    // Note: This query assumes a profiles table with username
    // Adjust based on your actual schema
    const { data, error } = await supabase.rpc('get_stage_leaderboard', {
      p_stage_id: stageId,
      p_limit: limit,
    });

    if (error) throw error;

    return data || [];
  } catch (err) {
    console.error('getStageLeaderboard error:', err);
    // Return empty array if leaderboard RPC doesn't exist yet
    return [];
  }
}

// ============================================
// CAMPAIGN PROGRESSION HELPERS
// ============================================

/**
 * Check if user has completed all stages in an act
 */
export async function isActCompleted(
  campaignId: string,
  userId: string,
  actNumber: number
): Promise<boolean> {
  try {
    const stages = await getCampaignStagesByAct(campaignId, actNumber);
    const attempts = await getCampaignAttempts(campaignId, userId);

    // Get best attempt per stage
    const bestPerStage = new Map<string, number>();
    attempts.forEach((attempt) => {
      const existing = bestPerStage.get(attempt.stage_id);
      bestPerStage.set(
        attempt.stage_id,
        Math.max(existing || 0, attempt.stars_earned)
      );
    });

    // Check if all stages in act have at least 1 star
    return stages.every((stage) => (bestPerStage.get(stage.id) || 0) > 0);
  } catch (err) {
    console.error('isActCompleted error:', err);
    return false;
  }
}

/**
 * Check if entire campaign is completed
 */
export async function isCampaignCompleted(
  campaignId: string,
  userId: string
): Promise<boolean> {
  try {
    const stages = await getCampaignStages(campaignId);
    const attempts = await getCampaignAttempts(campaignId, userId);

    const bestPerStage = new Map<string, number>();
    attempts.forEach((attempt) => {
      const existing = bestPerStage.get(attempt.stage_id);
      bestPerStage.set(
        attempt.stage_id,
        Math.max(existing || 0, attempt.stars_earned)
      );
    });

    // Check if all 30 stages have at least 1 star
    return stages.every((stage) => (bestPerStage.get(stage.id) || 0) > 0);
  } catch (err) {
    console.error('isCampaignCompleted error:', err);
    return false;
  }
}

/**
 * Get the next unlocked stage for a user
 */
export async function getNextUnlockedStage(
  campaignId: string,
  userId: string
): Promise<CampaignStage | null> {
  try {
    const progress = await getCampaignProgress(campaignId, userId);
    if (!progress) return null;

    const stages = await getCampaignStages(campaignId);
    const nextStage = stages.find(
      (s) => s.stage_number === progress.current_stage_number
    );

    return nextStage || null;
  } catch (err) {
    console.error('getNextUnlockedStage error:', err);
    return null;
  }
}
