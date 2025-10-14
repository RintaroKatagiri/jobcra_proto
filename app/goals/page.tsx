"use client";

import Toast from "@/app/components/Toast";
import GoalInputForm from "@/app/components/GoalInputForm";
import ActionSelection from "@/app/components/ActionSelection";
import ValuesStatus from "@/app/components/ValuesStatus";
import { useGoalManagement } from "@/hooks/useGoalManagement";

export default function GoalsPage() {
  const {
    // State
    toast,
    expectedRole,
    goalText,
    goalDays,
    showActions,
    isLoading,
    isLoadingGoals,
    personalValues,
    integratedActions,
    selectedActions,
    isSaving,

    // Setters
    setToast,
    setExpectedRole,
    setGoalText,
    setGoalDays,

    // Handlers
    handleGenerateActions,
    handleToggleAction,
    handleRegisterActions,

    // Navigation
    navigateToValuesDiagnosis,
    navigateHome,
  } = useGoalManagement();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <GoalInputForm
          expectedRole={expectedRole}
          goalText={goalText}
          goalDays={goalDays}
          isLoadingGoals={isLoadingGoals}
          isGenerating={isLoading}
          canGenerate={personalValues.length > 0}
          onExpectedRoleChange={setExpectedRole}
          onGoalTextChange={setGoalText}
          onGoalDaysChange={setGoalDays}
          onGenerateActions={handleGenerateActions}
          onNavigateHome={navigateHome}
        />

        <ValuesStatus
          personalValues={personalValues}
          onNavigateToValuesDiagnosis={navigateToValuesDiagnosis}
        />

        {isLoading && (
          <div className="bg-white rounded-2xl shadow p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-gray-600 font-medium">
                アクションを生成しています...
              </p>
            </div>
          </div>
        )}

        {showActions && !isLoading && integratedActions.length > 0 && (
          <ActionSelection
            actions={integratedActions}
            selectedActions={selectedActions}
            isSaving={isSaving}
            onToggleAction={handleToggleAction}
            onRegisterActions={handleRegisterActions}
          />
        )}
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
