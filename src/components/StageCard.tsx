// Stage card component for campaign level display
// src/components/StageCard.tsx

import { Lock, Star } from 'lucide-react';
import type { CampaignStage } from '../types/campaign';

interface StageCardProps {
  stage: CampaignStage;
  isUnlocked: boolean;
  isCompleted: boolean;
  starsEarned: number; // 0-3
  bestWpm?: number;
  onSelect: () => void;
}

export function StageCard({
  stage,
  isUnlocked,
  isCompleted,
  starsEarned,
  bestWpm,
  onSelect,
}: StageCardProps) {
  const difficultyColor: Record<number, string> = {
    1: 'from-blue-400 to-blue-600',
    2: 'from-cyan-400 to-cyan-600',
    3: 'from-green-400 to-green-600',
    4: 'from-yellow-400 to-yellow-600',
    5: 'from-orange-400 to-orange-600',
    6: 'from-red-400 to-red-600',
    7: 'from-pink-400 to-pink-600',
    8: 'from-purple-400 to-purple-600',
    9: 'from-indigo-400 to-indigo-600',
    10: 'from-violet-400 to-violet-600',
  };

  const bgClass = difficultyColor[stage.difficulty_level] || difficultyColor[5];

  return (
    <button
      onClick={onSelect}
      disabled={!isUnlocked}
      className={`
        relative group aspect-square rounded-lg overflow-hidden
        transition-all duration-300 transform hover:scale-105
        ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
        ${isCompleted ? 'ring-2 ring-yellow-400' : ''}
      `}
    >
      {/* Background gradient */}
      <div className={`
        absolute inset-0 bg-gradient-to-br ${bgClass}
        group-hover:saturate-150 transition-all
      `} />

      {/* Overlay pattern */}
      <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all" />

      {/* Lock overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <Lock className="w-6 h-6 text-white" />
        </div>
      )}

      {/* Content */}
      <div className={`
        absolute inset-0 flex flex-col items-center justify-center p-2
        text-white transition-all duration-300
        ${isUnlocked ? 'group-hover:scale-110' : ''}
      `}>
        {/* Stage number */}
        <div className="text-2xl font-bold mb-1">{stage.stage_number}</div>

        {/* Stars display */}
        {isCompleted && starsEarned > 0 && (
          <div className="flex gap-1 mb-2">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < starsEarned ? 'fill-yellow-300 text-yellow-300' : 'text-gray-300'}
                />
              ))}
          </div>
        )}

        {/* Best WPM if completed */}
        {isCompleted && bestWpm !== undefined && (
          <div className="text-xs font-semibold text-orange-200 bg-black bg-opacity-40 px-2 py-1 rounded">
            {bestWpm} WPM
          </div>
        )}

        {/* Difficulty indicator */}
        <div className="text-xs mt-2 opacity-90">D.{stage.difficulty_level}</div>
      </div>

      {/* Checkpoint badge */}
      {stage.is_checkpoint && (
        <div className="absolute top-1 right-1 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full">
          CP
        </div>
      )}
    </button>
  );
}
