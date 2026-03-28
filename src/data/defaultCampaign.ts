import type { Campaign, CampaignStage, CampaignProgress } from '../types/campaign'

const now = new Date().toISOString()

export const defaultCampaign: Campaign = {
  id: 'local-default-campaign',
  game_id: 'typing-quest-v1',
  title: 'The Typing Quest',
  description: 'A local fallback campaign with a short tutorial stage.',
  total_stages: 1,
  total_acts: 1,
  active: true,
  created_at: now,
  updated_at: now,
}

export const defaultStages: CampaignStage[] = [
  {
    id: 'local-default-stage-1',
    campaign_id: defaultCampaign.id,
    stage_number: 1,
    act_number: 1,
    title: 'Getting Started',
    description: 'Introductory stage with instructions and story.',
    narrative_text: 'Welcome to The Typing Quest! Complete this short stage to learn the basics.',
    difficulty_level: 1,
    base_wpm_threshold: 20,
    target_duration_seconds: 60,
    required_wpm: 10,
    required_accuracy: 70,
    required_combo: 3,
    base_xp_reward: 50,
    star_multiplier: 1.2,
    prerequisite_stage_id: null,
    unlocks_next: false,
    is_checkpoint: true,
    created_at: now,
    updated_at: now,
  },
]

export const defaultProgress: CampaignProgress = {
  id: 'local-default-progress',
  campaign_id: defaultCampaign.id,
  user_id: 'local-user',
  current_stage_number: 1,
  completed_stages: [],
  completed_at: null,
  total_xp: 0,
  total_stars: 0,
  started_at: now,
  last_played_at: null,
  updated_at: now,
}

export default defaultCampaign
