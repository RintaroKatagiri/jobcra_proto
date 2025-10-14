"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface LoadingInputProps {
  children: React.ReactNode;
}

const LoadingInput = ({ children }: LoadingInputProps) => (
  <div className="w-full h-20 border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
    <div className="flex items-center gap-2 text-gray-500">
      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      <span className="text-sm">読み込み中...</span>
    </div>
  </div>
);

interface GoalInputFormProps {
  expectedRole: string;
  goalText: string;
  goalDays: number;
  isLoadingGoals: boolean;
  isGenerating: boolean;
  canGenerate: boolean;
  onExpectedRoleChange: (value: string) => void;
  onGoalTextChange: (value: string) => void;
  onGoalDaysChange: (value: number) => void;
  onGenerateActions: () => void;
  onNavigateHome: () => void;
}

export default function GoalInputForm({
  expectedRole,
  goalText,
  goalDays,
  isLoadingGoals,
  isGenerating,
  canGenerate,
  onExpectedRoleChange,
  onGoalTextChange,
  onGoalDaysChange,
  onGenerateActions,
  onNavigateHome,
}: GoalInputFormProps) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onNavigateHome}
          className="text-gray-600 hover:text-gray-900"
        >
          ← 戻る
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          目標・アクションの作成
        </h1>
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-bold text-gray-900 mb-2">
          ステップ1: 目標を入力
        </h3>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            期待役割
          </label>
          {isLoadingGoals ? (
            <LoadingInput>期待役割を読み込み中...</LoadingInput>
          ) : (
            <Textarea
              value={expectedRole}
              onChange={(e) => onExpectedRoleChange(e.target.value)}
              rows={3}
              className="w-full"
            />
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            目標
          </label>
          {isLoadingGoals ? (
            <div className="w-full h-24 border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                <span className="text-sm">読み込み中...</span>
              </div>
            </div>
          ) : (
            <Textarea
              value={goalText}
              onChange={(e) => onGoalTextChange(e.target.value)}
              rows={4}
              className="w-full"
            />
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            目標期間（日数）
          </label>
          <input
            type="number"
            value={goalDays}
            onChange={(e) => onGoalDaysChange(Number(e.target.value))}
            min={1}
            max={365}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-center">
          <Button
            onClick={onGenerateActions}
            size="lg"
            className="px-8"
            disabled={isGenerating || !canGenerate}
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>生成中...</span>
              </div>
            ) : (
              "アクションを生成"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
