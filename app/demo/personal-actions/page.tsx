"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ActionCard from "@/app/components/ActionCard";
import Toast from "@/app/components/Toast";
import { actionsPersonalDemo } from "@/app/constants/actionsPersonalDemo";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const FIXED_PERSONAL_VALUES = [
  "自分が成長・発達する",
  "仕事にやりがいを感じる",
  "協調性を大切にする",
];

export default function PersonalActionsPage() {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  const [goalText, setGoalText] = useState<string>("");
  const [showActions, setShowActions] = useState<boolean>(false);

  const handleGenerateActions = () => {
    if (!goalText.trim()) {
      setToast("目標を入力してください");
      return;
    }
    setShowActions(true);
    setToast("アクションを生成しました");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              目標・アクション
            </h1>
          </div>

          <div>
            <label className="block text-lg font-bold text-gray-900 mb-3">
              目標を入力してください
            </label>
            <Textarea
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              placeholder="例: 新規顧客を10社獲得する"
              rows={4}
              className="w-full"
            />
          </div>

          <div className="flex justify-center">
            <Button onClick={handleGenerateActions} size="lg" className="px-8">
              アクションの生成
            </Button>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              価値観（固定）
            </h3>
            <div className="flex flex-wrap gap-2">
              {FIXED_PERSONAL_VALUES.map((value, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-green-100 text-green-800 text-sm font-medium rounded-full"
                >
                  {value}
                </span>
              ))}
            </div>
          </div>
        </div>

        {showActions && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              提案されたアクション
            </h2>
            {actionsPersonalDemo.map((action) => (
              <ActionCard
                key={action.id}
                action={action}
                onToast={(msg) => setToast(msg)}
              />
            ))}
          </div>
        )}
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
