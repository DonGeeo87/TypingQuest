// Campaign game wrapper - combines GameScreen with CampaignHUD
// src/screens/CampaignGameScreen.tsx

import { useEffect, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useCampaignStore } from '../store/campaignStore';
import { CampaignHUD } from '../components/CampaignHUD';
import { GameScreen } from './GameScreen';
import { CampaignResultsScreen } from './CampaignResultsScreen';
import type { CampaignStage } from '../types/campaign';

interface CampaignGameScreenProps {
  stage: CampaignStage;
  onComplete: (starsEarned: number, xpEarned: number) => void;
  onBack: () => void;
}

export function CampaignGameScreen({
  stage,
  onComplete,
  onBack,
}: CampaignGameScreenProps) {
  const gameStore = useGameStore();
  const campaignStore = useCampaignStore();
  const { view, recordAttempt } = campaignStore;
  const { wpm, accuracy, combo, status } = gameStore;
  const hasRecordedRef = useRef(false);

  // Initialize game with campaign context
  useEffect(() => {
    // Set game parameters based on stage requirements
    gameStore.setLevel(stage.difficulty_level);
    gameStore.initializeGame(stage.target_duration_seconds || 60, 1);
  }, [stage, gameStore]);

  // Handle game end and record attempt
  const handleGameEnd = async () => {
    if (hasRecordedRef.current || status === 'idle' || view === 'results') return;

    hasRecordedRef.current = true;

    try {
      // Calculate attempt stats
      const attempt = {
        wpm: Math.round(wpm),
        accuracy: parseFloat(accuracy.toFixed(2)),
        errors: gameStore.incorrectChars || 0,
        combo_max: gameStore.maxCombo || 0,
        duration_seconds: gameStore.gameDuration,
      };

      // Record attempt (updates store and database)
      const { xp_earned, stars_earned } = await recordAttempt(stage.id, attempt);

      // Trigger result screen
      setTimeout(() => {
        onComplete(stars_earned, xp_earned);
      }, 500);
    } catch (err) {
      console.error('Error recording campaign attempt:', err);
      // If recording fails, still show results
      onComplete(0, 0);
    }
  };

  // Check if game is ending (status changed to idle)
  useEffect(() => {
    if (status === 'idle' && gameStore.timeRemaining === 0 && !hasRecordedRef.current) {
      handleGameEnd();
    }
  }, [status, gameStore.timeRemaining]);

  // Show results screen
  if (view === 'results' && campaignStore.lastAttempt) {
    const attempt = campaignStore.lastAttempt;
    return (
      <CampaignResultsScreen
        stage={stage}
        starsEarned={attempt.stars_earned}
        xpEarned={attempt.xp_earned}
        totalXp={campaignStore.progress?.total_xp || 0}
        wpm={attempt.wpm}
        accuracy={attempt.accuracy}
        isNewPersonalBest={attempt.is_personal_best}
        unlockedNextStage={
          campaignStore.progress?.current_stage_number === stage.stage_number + 1
        }
        onContinue={() => {
          hasRecordedRef.current = false;
          campaignStore.clearGameContext();
          onBack(); // Back to stage select
        }}
        onRetry={() => {
          hasRecordedRef.current = false;
          // Reset game for retry
          gameStore.resetGame();
          campaignStore.setView('playing');
        }}
        onBack={() => {
          hasRecordedRef.current = false;
          campaignStore.clearGameContext();
          onBack();
        }}
      />
    );
  }

  // Show game screen with campaign HUD
  return (
    <div className="relative w-full h-screen flex flex-col bg-black">
      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 text-gray-300 hover:text-white transition-colors p-2 rounded hover:bg-gray-800"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="text-sm">Back</span>
      </button>

      {/* Campaign HUD */}
      <CampaignHUD
        stage={stage}
        currentWpm={Math.round(wpm)}
        currentAccuracy={parseFloat(accuracy.toFixed(1))}
        currentCombo={combo}
        totalXp={campaignStore.progress?.total_xp || 0}
      />

      {/* Game Screen (with padding for HUD) */}
      <div className="flex-1 pt-32">
        <GameScreen onGameEnd={handleGameEnd} />
      </div>
    </div>
  );
}
