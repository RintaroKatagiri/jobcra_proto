"use client";

import Toast from "./components/Toast";
import ProgressBar from "./components/ProgressBar";
import WeeklyActionReview from "./components/WeeklyActionReview";
import { useHomeManagement } from "@/hooks/useHomeManagement";

export default function Home() {
  const {
    // State
    selectedActionIds,
    todayLogs,
    toast,
    registeredPersonalActions,
    currentGoal,
    dayIndex,
    progressPct,
    hasRegisteredActions,

    // Setters
    setToast,

    // Handlers
    handleToggleAction,
    handleLogActions,
    handleReset,
    navigateToGoals,
  } = useHomeManagement();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <HomeHeader onReset={handleReset} />

        <GoalStatusSection
          hasRegisteredActions={hasRegisteredActions}
          currentGoal={currentGoal}
          dayIndex={dayIndex}
          progressPct={progressPct}
          registeredActionsCount={registeredPersonalActions.length}
          onNavigateToGoals={navigateToGoals}
        />

        {hasRegisteredActions && (
          <WeeklyActionReview
            actions={registeredPersonalActions}
            selectedActionIds={selectedActionIds}
            todayLogs={todayLogs}
            onToggleAction={handleToggleAction}
            onLogActions={handleLogActions}
          />
        )}
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

interface HomeHeaderProps {
  onReset: () => void;
}

function HomeHeader({ onReset }: HomeHeaderProps) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">ホーム</h1>
        <button
          onClick={onReset}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          目標・アクションを再設定
        </button>
      </div>
    </div>
  );
}

interface GoalStatusSectionProps {
  hasRegisteredActions: boolean;
  currentGoal: {
    title: string;
    startDate: string;
    durationDays: number;
  };
  dayIndex: number;
  progressPct: number;
  registeredActionsCount: number;
  onNavigateToGoals: () => void;
}

function GoalStatusSection({
  hasRegisteredActions,
  currentGoal,
  dayIndex,
  progressPct,
  registeredActionsCount,
  onNavigateToGoals,
}: GoalStatusSectionProps) {
  if (!hasRegisteredActions) {
    return (
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
          <h3 className="text-lg font-bold text-blue-900 mb-2">
            目標・アクションを設定しましょう
          </h3>
          <p className="text-sm text-blue-800 mb-3">
            まず目標・アクションページで、あなたの目標と具体的なアクションを設定してください。
          </p>
          <button
            onClick={onNavigateToGoals}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            目標・アクションを設定する
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {currentGoal.title}
        </h2>
        <p className="text-gray-600 mb-3">
          {dayIndex}日目 / 全{currentGoal.durationDays}日
        </p>
        <ProgressBar progress={progressPct} />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <p className="text-sm text-green-800 font-medium">
          ✓ 登録したアクション（{registeredActionsCount}件）を使用中
        </p>
        <p className="text-xs text-green-700 mt-1">
          目標・アクションの作成ページで選択したアクションが表示されています。
        </p>
      </div>
    </div>
  );
}
