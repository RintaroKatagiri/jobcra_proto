"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { IntegratedAction } from "@/app/constants/actionsIntegrated";

interface ActionSelectionProps {
  actions: IntegratedAction[];
  selectedActions: string[];
  isSaving: boolean;
  onToggleAction: (actionId: string) => void;
  onRegisterActions: () => void;
}

export default function ActionSelection({
  actions,
  selectedActions,
  isSaving,
  onToggleAction,
  onRegisterActions,
}: ActionSelectionProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              ステップ2: 提案アクション
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              企業理念とあなたの価値観を組み合わせたアクションが生成されました。
            </p>
            <p className="text-xs text-gray-500 mt-1">
              各アクションには企業理念と個人の価値観の重み付けが設定されています。
            </p>
            <p className="text-sm font-medium text-blue-600 mt-1">
              この中から5つを選択して登録してください ({selectedActions.length}
              /5)
            </p>
          </div>
          <Button
            onClick={onRegisterActions}
            disabled={selectedActions.length !== 5 || isSaving}
            size="lg"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>登録中...</span>
              </div>
            ) : (
              "登録する"
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {actions.map((action) => (
          <ActionCard
            key={action.id}
            action={action}
            isSelected={selectedActions.includes(action.id)}
            onToggle={() => onToggleAction(action.id)}
          />
        ))}
      </div>

      <ActionSelectionInfo />
    </div>
  );
}

interface ActionCardProps {
  action: IntegratedAction;
  isSelected: boolean;
  onToggle: () => void;
}

function ActionCard({ action, isSelected, onToggle }: ActionCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl shadow p-6 space-y-3 transition-all ${
        isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-lg"
      }`}
    >
      <div className="flex items-start gap-4">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggle}
          className="mt-1"
        />
        <div className="flex-1 space-y-2">
          <h3 className="font-bold text-gray-900">{action.title}</h3>
          <p className="text-sm text-gray-700">{action.description}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
              {action.company_value}
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
              {action.personal_value}
            </span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              理念{action.company_weight}% / 価値観{action.personal_weight}%
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{action.rationale}</p>
        </div>
      </div>
    </div>
  );
}

function ActionSelectionInfo() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p className="text-sm text-blue-800 font-medium">
        💡
        企業理念とあなたの価値観を組み合わせた統合的なアクションを生成しました。
      </p>
      <p className="text-xs text-blue-700 mt-2">
        各アクションには、企業理念と個人の価値観の重み付けが設定されています。実践度に応じて、重み付けの異なるアクションを提案できます。
      </p>
      <p className="text-xs text-blue-700 mt-2">
        ※登録したアクションはホーム画面に反映され、日々の実践に活用できます。
      </p>
    </div>
  );
}
