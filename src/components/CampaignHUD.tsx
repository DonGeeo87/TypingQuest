// HUD overlay during campaign gameplay
// src/components/CampaignHUD.tsx

import { Zap, Target, Flame } from 'lucide-react';
import type { CampaignStage } from '../types/campaign';

interface CampaignHUDProps {
  stage: CampaignStage;
  currentWpm: number;
  currentAccuracy: number;
  currentCombo: number;
  totalXp: number;
}

export function CampaignHUD({
  stage,
  currentWpm,
  currentAccuracy,
  currentCombo,
  totalXp,
}: CampaignHUDProps) {
  const wpmProgress = Math.min(100, (currentWpm / stage.required_wpm) * 100);
  const accuracyProgress = Math.min(100, (currentAccuracy / stage.required_accuracy) * 100);
  const comboProgress = stage.required_combo > 0 ? Math.min(100, (currentCombo / stage.required_combo) * 100) : 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-b from-black via-black to-transparent pointer-events-none">
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Stage Header */}
        <div className="mb-4">
          <div className="text-white text-center">
            <h2 className="text-2xl font-bold mb-1">{stage.title}</h2>
            <p className="text-sm text-gray-300 italic">{stage.narrative_text}</p>
          </div>
        </div>

        {/* Objectives Grid */}
        <div className="grid grid-cols-3 gap-3">
          {/* WPM Objective */}
          <ObjectiveCard
            label="WPM"
            current={currentWpm}
            target={stage.required_wpm}
            progress={wpmProgress}
            icon={<Zap className="w-4 h-4" />}
          />

          {/* Accuracy Objective */}
          <ObjectiveCard
            label="Accuracy"
            current={currentAccuracy}
            target={stage.required_accuracy}
            progress={accuracyProgress}
            icon={<Target className="w-4 h-4" />}
            suffix="%"
          />

          {/* Combo Objective */}
          {stage.required_combo > 0 && (
            <ObjectiveCard
              label="Combo"
              current={currentCombo}
              target={stage.required_combo}
              progress={comboProgress}
              icon={<Flame className="w-4 h-4" />}
            />
          )}
        </div>

        {/* XP Progress Bar */}
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-200">
          <span className="whitespace-nowrap">Total XP: {totalXp}</span>
          <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalXp / 1000) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Sub-component: ObjectiveCard
// ============================================

interface ObjectiveCardProps {
  label: string;
  current: number;
  target: number;
  progress: number;
  icon: JSX.Element;
  suffix?: string;
}

function ObjectiveCard({
  label,
  current,
  target,
  progress,
  icon,
  suffix = '',
}: ObjectiveCardProps) {
  const isComplete = progress >= 100;

  return (
    <div className={`
      bg-black bg-opacity-60 rounded-lg p-3 backdrop-blur
      border ${isComplete ? 'border-green-500' : 'border-gray-700'}
      transition-all
    `}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`${isComplete ? 'text-green-400' : 'text-blue-400'}`}>{icon}</span>
        <span className="text-sm font-semibold text-white">{label}</span>
      </div>

      <div className="flex justify-between items-baseline mb-1">
        <div className="text-xs text-gray-300">
          {current.toFixed(1)}{suffix} / {target}
          {suffix}
        </div>
        <div className={`text-xs font-bold ${isComplete ? 'text-green-400' : 'text-orange-400'}`}>
          {Math.round(progress)}%
        </div>
      </div>

      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all rounded-full ${
            isComplete
              ? 'bg-gradient-to-r from-green-400 to-green-600'
              : 'bg-gradient-to-r from-blue-400 to-blue-600'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
