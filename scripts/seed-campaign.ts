#!/usr/bin/env node
/**
 * Campaign Seeder Script
 * Generates and inserts 30 campaign levels into Supabase
 * 
 * Usage: npx ts-node scripts/seed-campaign.ts
 * 
 * This script:
 * 1. Gets the main campaign (typing-quest-v1)
 * 2. Deletes existing stages (if any)
 * 3. Inserts 30 new stages with progressive difficulty
 * 4. Sets up 5 acts with 6 levels each
 */

import { createClient } from '@supabase/supabase-js';
import type { CampaignStage } from '../src/types/campaign';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

interface StageDefinition {
  act: number;
  stageInAct: number; // 1-6
  title: string;
  narrative: string;
  difficulty: number;
  wpmThreshold: number;
  requiredWpm: number;
  requiredAccuracy: number;
  requiredCombo: number;
  baseXpReward: number;
  isCheckpoint: boolean;
}

const CAMPAIGN_STAGES: StageDefinition[] = [
  // ============================================
  // ACT I: THE BEGINNING (Levels 1-6)
  // Difficulty: 1-2, WPM: 10-20
  // ============================================
  {
    act: 1,
    stageInAct: 1,
    title: 'Act I - The Beginning: First Words',
    narrative: 'You discover an ancient library filled with forgotten words. Your journey begins...',
    difficulty: 1,
    wpmThreshold: 10,
    requiredWpm: 10,
    requiredAccuracy: 90,
    requiredCombo: 0,
    baseXpReward: 50,
    isCheckpoint: true,
  },
  {
    act: 1,
    stageInAct: 2,
    title: 'Act I - Stage 2: Growing Confidence',
    narrative: 'Each word learned strengthens your resolve. The library whispers ancient secrets...',
    difficulty: 1,
    wpmThreshold: 12,
    requiredWpm: 12,
    requiredAccuracy: 90,
    requiredCombo: 5,
    baseXpReward: 60,
    isCheckpoint: false,
  },
  {
    act: 1,
    stageInAct: 3,
    title: 'Act I - Stage 3: Rhythm of Words',
    narrative: 'You begin to feel a rhythm in the words. Time seems to flow differently here...',
    difficulty: 1,
    wpmThreshold: 15,
    requiredWpm: 15,
    requiredAccuracy: 91,
    requiredCombo: 10,
    baseXpReward: 75,
    isCheckpoint: false,
  },
  {
    act: 1,
    stageInAct: 4,
    title: 'Act I - Stage 4: Flowing Words',
    narrative: 'Your fingers find comfort on the keys. The library begins to glow...',
    difficulty: 2,
    wpmThreshold: 18,
    requiredWpm: 18,
    requiredAccuracy: 92,
    requiredCombo: 15,
    baseXpReward: 90,
    isCheckpoint: false,
  },
  {
    act: 1,
    stageInAct: 5,
    title: 'Act I - Stage 5: Mastering Basics',
    narrative: 'The foundation is strong. You feel ready for greater challenges...',
    difficulty: 2,
    wpmThreshold: 20,
    requiredWpm: 20,
    requiredAccuracy: 93,
    requiredCombo: 20,
    baseXpReward: 110,
    isCheckpoint: false,
  },
  {
    act: 1,
    stageInAct: 6,
    title: 'Act I - Stage 6: The First Gate',
    narrative: 'A magnificent gate appears before you. To pass, you must prove yourself worthy...',
    difficulty: 2,
    wpmThreshold: 22,
    requiredWpm: 22,
    requiredAccuracy: 94,
    requiredCombo: 25,
    baseXpReward: 130,
    isCheckpoint: true,
  },

  // ============================================
  // ACT II: THE CHALLENGE (Levels 7-12)
  // Difficulty: 3-4, WPM: 25-35
  // ============================================
  {
    act: 2,
    stageInAct: 1,
    title: 'Act II - The Challenge: New Trials',
    narrative: 'Beyond the gate lies a vast chamber. The words grow harder, the story deepens...',
    difficulty: 3,
    wpmThreshold: 25,
    requiredWpm: 25,
    requiredAccuracy: 93,
    requiredCombo: 10,
    baseXpReward: 150,
    isCheckpoint: false,
  },
  {
    act: 2,
    stageInAct: 2,
    title: 'Act II - Stage 2: Rising Difficulty',
    narrative: 'Your skills are tested. The pressure intensifies but you persevere...',
    difficulty: 3,
    wpmThreshold: 28,
    requiredWpm: 28,
    requiredAccuracy: 94,
    requiredCombo: 15,
    baseXpReward: 170,
    isCheckpoint: false,
  },
  {
    act: 2,
    stageInAct: 3,
    title: 'Act II - Stage 3: Precision Required',
    narrative: 'Accuracy becomes as important as speed. The library demands perfection...',
    difficulty: 3,
    wpmThreshold: 30,
    requiredWpm: 30,
    requiredAccuracy: 95,
    requiredCombo: 20,
    baseXpReward: 190,
    isCheckpoint: false,
  },
  {
    act: 2,
    stageInAct: 4,
    title: 'Act II - Stage 4: Stamina Test',
    narrative: 'Your endurance is tested. Can you maintain your pace under pressure?',
    difficulty: 4,
    wpmThreshold: 33,
    requiredWpm: 33,
    requiredAccuracy: 94,
    requiredCombo: 25,
    baseXpReward: 220,
    isCheckpoint: false,
  },
  {
    act: 2,
    stageInAct: 5,
    title: 'Act II - Stage 5: Master of Words',
    narrative: 'You are becoming a true master of typing. The library seems to recognize your skill...',
    difficulty: 4,
    wpmThreshold: 35,
    requiredWpm: 35,
    requiredAccuracy: 95,
    requiredCombo: 30,
    baseXpReward: 250,
    isCheckpoint: false,
  },
  {
    act: 2,
    stageInAct: 6,
    title: 'Act II - Stage 6: The Second Gate',
    narrative: 'Another gate materializes. Prove yourself once more to advance...',
    difficulty: 4,
    wpmThreshold: 38,
    requiredWpm: 38,
    requiredAccuracy: 96,
    requiredCombo: 35,
    baseXpReward: 280,
    isCheckpoint: true,
  },

  // ============================================
  // ACT III: THE CRISIS (Levels 13-18)
  // Difficulty: 5-6, WPM: 40-50
  // ============================================
  {
    act: 3,
    stageInAct: 1,
    title: 'Act III - The Crisis: Chaos Unleashed',
    narrative: 'Beyond the second gate, chaos erupts. Forces rise against you. Stay focused...',
    difficulty: 5,
    wpmThreshold: 40,
    requiredWpm: 40,
    requiredAccuracy: 94,
    requiredCombo: 15,
    baseXpReward: 300,
    isCheckpoint: false,
  },
  {
    act: 3,
    stageInAct: 2,
    title: 'Act III - Stage 2: Breaking Through',
    narrative: 'You push forward. Each keystroke is a victory against the encroaching darkness...',
    difficulty: 5,
    wpmThreshold: 43,
    requiredWpm: 43,
    requiredAccuracy: 95,
    requiredCombo: 20,
    baseXpReward: 330,
    isCheckpoint: false,
  },
  {
    act: 3,
    stageInAct: 3,
    title: 'Act III - Stage 3: The Eye of the Storm',
    narrative: 'At the crisis point, everything becomes clear. You are strong enough...',
    difficulty: 5,
    wpmThreshold: 45,
    requiredWpm: 45,
    requiredAccuracy: 96,
    requiredCombo: 25,
    baseXpReward: 360,
    isCheckpoint: false,
  },
  {
    act: 3,
    stageInAct: 4,
    title: 'Act III - Stage 4: Unwavering Focus',
    narrative: 'The chaos subsides. Your determination proves unshakeable...',
    difficulty: 6,
    wpmThreshold: 48,
    requiredWpm: 48,
    requiredAccuracy: 95,
    requiredCombo: 30,
    baseXpReward: 390,
    isCheckpoint: false,
  },
  {
    act: 3,
    stageInAct: 5,
    title: 'Act III - Stage 5: From Chaos to Order',
    narrative: 'You emerge from the crisis stronger. The library stabilizes around you...',
    difficulty: 6,
    wpmThreshold: 50,
    requiredWpm: 50,
    requiredAccuracy: 96,
    requiredCombo: 35,
    baseXpReward: 420,
    isCheckpoint: false,
  },
  {
    act: 3,
    stageInAct: 6,
    title: 'Act III - Stage 6: The Third Gate',
    narrative: 'Standing before the third gate, you know you belong here. Enter with confidence...',
    difficulty: 6,
    wpmThreshold: 52,
    requiredWpm: 52,
    requiredAccuracy: 97,
    requiredCombo: 40,
    baseXpReward: 450,
    isCheckpoint: true,
  },

  // ============================================
  // ACT IV: THE RECKONING (Levels 19-24)
  // Difficulty: 7-8, WPM: 55-65
  // ============================================
  {
    act: 4,
    stageInAct: 1,
    title: 'Act IV - The Reckoning: Final Test Begins',
    narrative: 'The final test approaches. Your skills have been honed to perfection...',
    difficulty: 7,
    wpmThreshold: 55,
    requiredWpm: 55,
    requiredAccuracy: 95,
    requiredCombo: 20,
    baseXpReward: 480,
    isCheckpoint: false,
  },
  {
    act: 4,
    stageInAct: 2,
    title: 'Act IV - Stage 2: Relentless Assault',
    narrative: 'The words come faster than ever. Your speed and accuracy must be flawless...',
    difficulty: 7,
    wpmThreshold: 58,
    requiredWpm: 58,
    requiredAccuracy: 96,
    requiredCombo: 25,
    baseXpReward: 510,
    isCheckpoint: false,
  },
  {
    act: 4,
    stageInAct: 3,
    title: 'Act IV - Stage 3: Ultimate Challenge',
    narrative: 'This is it. The moment that will define your legacy...',
    difficulty: 7,
    wpmThreshold: 60,
    requiredWpm: 60,
    requiredAccuracy: 97,
    requiredCombo: 30,
    baseXpReward: 540,
    isCheckpoint: false,
  },
  {
    act: 4,
    stageInAct: 4,
    title: 'Act IV - Stage 4: The Ascension',
    narrative: 'You rise above all limits. Your spirit becomes one with the words...',
    difficulty: 8,
    wpmThreshold: 63,
    requiredWpm: 63,
    requiredAccuracy: 96,
    requiredCombo: 35,
    baseXpReward: 570,
    isCheckpoint: false,
  },
  {
    act: 4,
    stageInAct: 5,
    title: 'Act IV - Stage 5: Mastery Achieved',
    narrative: 'Few mortals reach this level. You stand among the elite typists...',
    difficulty: 8,
    wpmThreshold: 65,
    requiredWpm: 65,
    requiredAccuracy: 97,
    requiredCombo: 40,
    baseXpReward: 600,
    isCheckpoint: false,
  },
  {
    act: 4,
    stageInAct: 6,
    title: 'Act IV - Stage 6: The Fourth Gate',
    narrative: 'One gate remains. Beyond it lies your destiny...',
    difficulty: 8,
    wpmThreshold: 68,
    requiredWpm: 68,
    requiredAccuracy: 98,
    requiredCombo: 45,
    baseXpReward: 630,
    isCheckpoint: true,
  },

  // ============================================
  // ACT V: THE TRIUMPH (Levels 25-30)
  // Difficulty: 9-10, WPM: 70-90+
  // ============================================
  {
    act: 5,
    stageInAct: 1,
    title: 'Act V - The Triumph: New Heights',
    narrative: 'Victory awaits the worthy. You have earned the right to reach for the stars...',
    difficulty: 9,
    wpmThreshold: 70,
    requiredWpm: 70,
    requiredAccuracy: 96,
    requiredCombo: 25,
    baseXpReward: 660,
    isCheckpoint: false,
  },
  {
    act: 5,
    stageInAct: 2,
    title: 'Act V - Stage 2: Transcendence',
    narrative: 'You transcend normal limitations. Barriers crumble before your fingers...',
    difficulty: 9,
    wpmThreshold: 75,
    requiredWpm: 75,
    requiredAccuracy: 97,
    requiredCombo: 30,
    baseXpReward: 690,
    isCheckpoint: false,
  },
  {
    act: 5,
    stageInAct: 3,
    title: 'Act V - Stage 3: Champion Crowned',
    narrative: 'The library trembles with recognition. You are a true champion...',
    difficulty: 9,
    wpmThreshold: 80,
    requiredWpm: 80,
    requiredAccuracy: 98,
    requiredCombo: 35,
    baseXpReward: 720,
    isCheckpoint: false,
  },
  {
    act: 5,
    stageInAct: 4,
    title: 'Act V - Stage 4: Legend in the Making',
    narrative: 'Your name is etched into the very stones of this place...',
    difficulty: 10,
    wpmThreshold: 85,
    requiredWpm: 85,
    requiredAccuracy: 97,
    requiredCombo: 40,
    baseXpReward: 750,
    isCheckpoint: false,
  },
  {
    act: 5,
    stageInAct: 5,
    title: 'Act V - Stage 5: Master of All',
    narrative: 'You have conquered every challenge. Few reach this pinnacle...',
    difficulty: 10,
    wpmThreshold: 90,
    requiredWpm: 90,
    requiredAccuracy: 98,
    requiredCombo: 50,
    baseXpReward: 780,
    isCheckpoint: false,
  },
  {
    act: 5,
    stageInAct: 6,
    title: 'Act V - Stage 6 (FINALE): The Typing Quest Complete',
    narrative:
      'This is the pinnacle. Prove you are the ultimate typist. Complete The Typing Quest and claim your place among legends.',
    difficulty: 10,
    wpmThreshold: 95,
    requiredWpm: 95,
    requiredAccuracy: 99,
    requiredCombo: 60,
    baseXpReward: 1000,
    isCheckpoint: true,
  },
];

async function seedCampaign() {
  try {
    console.log('🎮 Starting Campaign Seeder...\n');

    // Step 1: Get or create main campaign
    console.log('📋 Step 1: Getting main campaign...');
    let { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('game_id', 'typing-quest-v1')
      .single();

    if (campaignError && campaignError.code !== 'PGRST116') {
      throw campaignError;
    }

    if (!campaign) {
      console.log('  Creating new campaign...');
      const { data: newCampaign, error: createError } = await supabase
        .from('campaigns')
        .insert([
          {
            game_id: 'typing-quest-v1',
            title: 'The Typing Quest',
            description:
              'Embark on an epic journey through 30 levels of typing challenges. Master the keyboard and unlock the secrets of the ancient library.',
            total_stages: 30,
            total_acts: 5,
            active: true,
          },
        ])
        .select()
        .single();

      if (createError) throw createError;
      campaign = newCampaign as any;
    }

    console.log(`  ✅ Campaign loaded: ${campaign.title} (ID: ${campaign.id})\n`);

    // Step 2: Delete existing stages (optional, for re-seeding)
    console.log('🗑️  Step 2: Cleaning up existing stages...');
    const { error: deleteError } = await supabase
      .from('campaign_stages')
      .delete()
      .eq('campaign_id', campaign.id);

    if (deleteError && deleteError.code !== 'PGRST116') {
      throw deleteError;
    }
    console.log('  ✅ Existing stages deleted\n');

    // Step 3: Insert 30 new stages
    console.log('📝 Step 3: Inserting 30 campaign stages...');

    const stagesToInsert = CAMPAIGN_STAGES.map((stage) => ({
      campaign_id: campaign.id,
      stage_number: (stage.act - 1) * 6 + stage.stageInAct,
      act_number: stage.act,
      title: stage.title,
      description: `Stage ${stage.stageInAct} of Act ${stage.act}`,
      narrative_text: stage.narrative,
      difficulty_level: stage.difficulty,
      base_wpm_threshold: stage.wpmThreshold,
      target_duration_seconds: 60,
      required_wpm: stage.requiredWpm,
      required_accuracy: stage.requiredAccuracy,
      required_combo: stage.requiredCombo,
      base_xp_reward: stage.baseXpReward,
      star_multiplier: 1.0 + (stage.difficulty * 0.1), // Higher difficulty = more reward
      is_checkpoint: stage.isCheckpoint,
      unlocks_next: true,
    }));

    const { data: insertedStages, error: insertError } = await supabase
      .from('campaign_stages')
      .insert(stagesToInsert)
      .select();

    if (insertError) throw insertError;

    console.log(`  ✅ Inserted ${insertedStages?.length || 0} stages\n`);

    // Step 4: Display summary
    console.log('📊 Campaign Structure:');
    console.log('  ┌─ Act I: The Beginning (Levels 1-6, Difficulty 1-2)');
    console.log('  ├─ Act II: The Challenge (Levels 7-12, Difficulty 3-4)');
    console.log('  ├─ Act III: The Crisis (Levels 13-18, Difficulty 5-6)');
    console.log('  ├─ Act IV: The Reckoning (Levels 19-24, Difficulty 7-8)');
    console.log('  └─ Act V: The Triumph (Levels 25-30, Difficulty 9-10)\n');

    console.log('✨ Campaign seeding complete!\n');
    console.log('🎯 Next steps:');
    console.log('  1. Run the app: npm run dev');
    console.log('  2. Navigate to Campaign Mode');
    console.log('  3. Start from Level 1\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding campaign:', error);
    process.exit(1);
  }
}

// Run the seeder
seedCampaign();
