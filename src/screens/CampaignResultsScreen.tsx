// Post-game campaign results screen
// src/screens/CampaignResultsScreen.tsx

import type { ReactNode } from 'react';
import { Button } from '../components/Button';
import {
  ChevronRightIcon,
  StarIcon,
  TrophyIcon,
  ZapIcon,
} from '../components/CampaignIcons';
import type { CampaignStage } from '../types/campaign';

interface CampaignResultsScreenProps {
  stage: CampaignStage;
  starsEarned: number;
  xpEarned: number;
  totalXp: number;
  wpm: number;
  accuracy: number;
  isNewPersonalBest: boolean;
  unlockedNextStage: boolean;
  onContinue: () => void;
  onRetry: () => void;
  onBack: () => void;
}

export function CampaignResultsScreen({
  stage,
  starsEarned,
  xpEarned,
  totalXp,
  wpm,
  accuracy,
  isNewPersonalBest,
  unlockedNextStage,
  onContinue,
  onRetry,
  onBack,
}: CampaignResultsScreenProps) {
  const reachedGoal = starsEarned > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center p-4">
      {/* Celebration animation */}
      {reachedGoal && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
              }}
            >
              <StarIcon className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            </div>
          ))}
        </div>
      )}

      <div className="w-full max-w-2xl">
        {/* Result Header */}
        <div className={`
          text-center mb-8 p-6 rounded-lg
          ${reachedGoal
            ? 'bg-gradient-to-r from-green-900 to-emerald-900 border-2 border-green-500'
            : 'bg-gradient-to-r from-red-900 to-orange-900 border-2 border-red-500'
          }
        `}>
          <h1 className={`text-4xl font-bold mb-2 ${reachedGoal ? 'text-green-200' : 'text-red-200'}`}>
            {reachedGoal ? '🎉 LEVEL COMPLETE!' : '❌ LEVEL FAILED'}
          </h1>
          <p className="text-gray-300">{stage.title}</p>
        </div>

        {/* Stars Display */}
        <div className="flex justify-center gap-3 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`transition-all transform ${i <= starsEarned ? 'scale-110' : 'scale-75 opacity-40'}`}
            >
              <StarIcon
                size={48}
                className={i <= starsEarned ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500'}
              />
            </div>
          ))}
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <MetricCard label="WPM" value={wpm} target={stage.required_wpm} />
          <MetricCard label="Accuracy" value={accuracy} target={stage.required_accuracy} suffix="%" />
        </div>

        {/* XP Rewards */}
        <div className="bg-black bg-opacity-50 rounded-lg p-6 mb-8 border border-yellow-600 border-opacity-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ZapIcon className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold">Experience Points</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-400">+{xpEarned}</div>
              <div className="text-xs text-gray-400">Total: {totalXp}</div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (totalXp / 1000) * 100)}%` }}
            />
          </div>
        </div>

        {/* Special Achievements */}
        {(isNewPersonalBest || unlockedNextStage) && (
          <div className="space-y-3 mb-8">
            {isNewPersonalBest && (
              <AchievementBadge
                icon={<TrophyIcon className="w-4 h-4" />}
                title="New Personal Best!"
                description={`${wpm} WPM is your new record`}
                color="purple"
              />
            )}
            {unlockedNextStage && (
              <AchievementBadge
                icon={<ChevronRightIcon className="w-4 h-4" />}
                title="Next Level Unlocked!"
                description="Complete this stage to progress"
                color="blue"
              />
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          {!reachedGoal && (
            <Button
              onClick={onRetry}
              variant="secondary"
              className="flex-1"
            >
              🔄 Retry
            </Button>
          )}
          <Button
            onClick={reachedGoal ? onContinue : onBack}
            variant="primary"
            className="flex-1"
          >
            {reachedGoal ? 'Continue →' : 'Back'}
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-400">
          Stage {stage.stage_number} of 30 • Act {stage.act_number} of 5
        </div>
      </div>
    </div>
  );
}

// ============================================
// Sub-components
// ============================================

interface MetricCardProps {
  label: string;
  value: number;
  target: number;
  suffix?: string;
}

function MetricCard({ label, value, target, suffix = '' }: MetricCardProps) {
  const isMet = suffix === '%' ? value >= target : value >= target;

  return (
    <div className={`
      p-4 rounded-lg border-2 text-center
      ${isMet ? 'bg-green-900 bg-opacity-30 border-green-500' : 'bg-gray-900 bg-opacity-50 border-gray-600'}
    `}>
      <div className="text-sm text-gray-300 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${isMet ? 'text-green-400' : 'text-orange-400'}`}>
        {value.toFixed(1)}{suffix}
      </div>
      <div className="text-xs text-gray-400">(Target: {target}{suffix})</div>
    </div>
  );
}

interface AchievementBadgeProps {
  icon: ReactNode;
  title: string;
  description: string;
  color: 'purple' | 'blue' | 'gold';
}

function AchievementBadge({
  icon,
  title,
  description,
  color,
}: AchievementBadgeProps) {
  const colorClass: Record<string, string> = {
    purple: 'from-purple-900 to-purple-800 border-purple-500',
    blue: 'from-blue-900 to-blue-800 border-blue-500',
    gold: 'from-yellow-900 to-amber-800 border-yellow-500',
  };

  return (
    <div className={`
      p-4 rounded-lg border border-opacity-50 bg-gradient-to-r ${colorClass[color]}
      flex items-start gap-3
    `}>
      <div className="text-xl">{icon}</div>
      <div>
        <div className="font-semibold text-white">{title}</div>
        <div className="text-sm text-gray-300">{description}</div>
      </div>
    </div>
  );
}
