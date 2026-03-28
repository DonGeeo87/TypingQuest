// Campaign level selection screen
// src/screens/CampaignScreen.tsx

import { useEffect, useState } from 'react';
import { ChevronLeftIcon } from '../components/CampaignIcons';
import { useCampaignStore } from '../store/campaignStore';
import * as campaignService from '../services/campaignService';
import { StageCard } from '../components/StageCard';
import { Button } from '../components/Button';
import type { CampaignStage, CampaignStageAttempt } from '../types/campaign';

interface CampaignScreenProps {
  userId: string;
  onSelectStage: (stage: CampaignStage) => void;
  onBack: () => void;
}

export function CampaignScreen({ userId, onSelectStage, onBack }: CampaignScreenProps) {
  const { campaign, progress, stages, loadStages } = useCampaignStore();
  const [stageAttempts, setStageAttempts] = useState<Record<string, CampaignStageAttempt>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load stages on mount
  useEffect(() => {
    if (campaign?.id && stages.length === 0) {
      const loadData = async () => {
        setIsLoading(true);
        try {
          await loadStages(campaign.id);
        } catch (err) {
          console.error('Error loading stages:', err);
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }
  }, [campaign?.id, stages.length, loadStages]);

  // Load best attempts for each stage
  useEffect(() => {
    if (campaign?.id && userId && stages.length > 0) {
      const loadAttempts = async () => {
        try {
          const attempts = await campaignService.getCampaignAttempts(campaign.id, userId);

          // Group by stage and get best attempt per stage
          const bestPerStage: Record<string, CampaignStageAttempt> = {};
          attempts.forEach((attempt) => {
            const existing = bestPerStage[attempt.stage_id];
            if (!existing || attempt.stars_earned > existing.stars_earned) {
              bestPerStage[attempt.stage_id] = attempt;
            }
          });

          setStageAttempts(bestPerStage);
        } catch (err) {
          console.error('Error loading attempts:', err);
        }
      };
      loadAttempts();
    }
  }, [campaign?.id, userId, stages.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading campaign...</p>
        </div>
      </div>
    );
  }

  // Calculate completion percentage
  const completionPercentage = progress
    ? (progress.completed_stages.length / 30) * 100
    : 0;

  // Group stages by act
  const stagesByAct = stages.reduce(
    (acc, stage) => {
      if (!acc[stage.act_number]) {
        acc[stage.act_number] = [];
      }
      acc[stage.act_number].push(stage);
      return acc;
    },
    {} as Record<number, CampaignStage[]>
  );

  const actTitles: Record<number, string> = {
    1: '🏰 Act I: The Beginning',
    2: '⚔️ Act II: The Challenge',
    3: '💥 Act III: The Crisis',
    4: '👑 Act IV: The Reckoning',
    5: '✨ Act V: The Triumph',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gradient-to-b from-gray-900 to-gray-900 border-b border-gray-700 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition"
          >
            <ChevronLeftIcon className="w-5 h-5" />
            <span>Home</span>
          </button>

          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{campaign?.title}</h1>
            <p className="text-sm text-gray-400 mb-3">{campaign?.description}</p>

            {/* Progress bar */}
            <div className="max-w-xs mx-auto">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Progress</span>
                <span>
                  {progress?.completed_stages.length || 0} / 30
                </span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="text-right text-sm">
            <div className="text-yellow-400 font-semibold">{progress?.total_xp || 0} XP</div>
            <div className="text-gray-400">{progress?.total_stars || 0} Stars</div>
          </div>
        </div>
      </div>

      {/* Acts and Stages */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {[1, 2, 3, 4, 5].map((actNum) => (
          <div key={actNum} className="mb-12">
            {/* Act Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-1">{actTitles[actNum]}</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-600" />
            </div>

            {/* Stages Grid (6 columns) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {stagesByAct[actNum]?.map((stage) => {
                const isUnlocked = progress
                  ? stage.stage_number <= progress.current_stage_number
                  : stage.stage_number === 1;
                const isCompleted = progress?.completed_stages.includes(stage.stage_number) ?? false;
                const attempt = stageAttempts[stage.id];

                return (
                  <StageCard
                    key={stage.id}
                    stage={stage}
                    isUnlocked={isUnlocked}
                    isCompleted={isCompleted}
                    starsEarned={attempt?.stars_earned || 0}
                    bestWpm={attempt?.wpm}
                    onSelect={() => onSelectStage(stage)}
                  />
                );
              })}
            </div>

            {/* Act Separator */}
            {actNum < 5 && (
              <div className="flex items-center gap-4 my-12">
                <div className="flex-1 h-px bg-gray-700" />
                <div className="text-gray-500 text-sm">...</div>
                <div className="flex-1 h-px bg-gray-700" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Floating Info Card */}
      {progress && !progress.completed_stages.includes(30) && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 border border-blue-500 rounded-lg p-4 max-w-xs">
          <div className="text-sm text-gray-300 mb-2">
            📍 <strong>Current Stage:</strong> {progress.current_stage_number}
          </div>
          <div className="text-xs text-gray-400">
            Reach WPM {(stages.find((s) => s.stage_number === progress.current_stage_number)?.required_wpm || 0)}+ to complete
          </div>
        </div>
      )}

      {/* Victory Modal */}
      {progress?.completed_stages.includes(30) && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-purple-900 to-purple-950 rounded-lg p-8 text-center max-w-md border-2 border-yellow-400">
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold text-yellow-400 mb-2">Campaign Complete!</h2>
            <p className="text-gray-300 mb-4">
              You have conquered The Typing Quest and proven yourself a master typist!
            </p>
            <div className="text-xl font-bold text-white mb-6">
              Total XP: {progress.total_xp} | Total Stars: {progress.total_stars}
            </div>
            <Button onClick={onBack} variant="primary" className="w-full">
              Return to Home
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
