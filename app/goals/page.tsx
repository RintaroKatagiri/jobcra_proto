"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ActionCard from "@/app/components/ActionCard";
import Toast from "@/app/components/Toast";
import { companyValues } from "@/app/constants/companyValues";
import {
  generateIntegratedActions,
  IntegratedAction,
} from "@/app/constants/actionsIntegrated";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

// goals.csvからデータを読み込む関数
const loadGoalsFromCSV = async (): Promise<{
  expectedRole: string;
  goal: string;
} | null> => {
  try {
    console.log('CSVファイルの読み込みを開始...');
    const response = await fetch('/goals.csv');
    
    if (!response.ok) {
      console.error('CSV読み込みエラー:', response.status, response.statusText);
      return null;
    }
    
    const csvText = await response.text();
    console.log('取得したCSVテキスト:', csvText);

    // CSVの行に分割（ヘッダー行をスキップ）
    const lines = csvText.split('\n').filter((line) => line.trim() !== '');
    console.log('分割された行:', lines);
    
    if (lines.length < 2) {
      console.error('CSVにデータが不足しています');
      return null;
    }
    
    // 最初のデータ行（ヘッダーをスキップ）
    const dataLine = lines[1];
    console.log('データ行:', dataLine);
    
    // CSVの解析（カンマで分割）
    const columns = dataLine.split(',');
    console.log('分割された列:', columns);
    
    if (columns.length >= 2) {
      const result = {
        expectedRole: columns[0].trim(),
        goal: columns[1].trim()
      };
      console.log('解析結果:', result);
      return result;
    }

    return null;
  } catch (error) {
    console.error('goals.csvの読み込みに失敗しました:', error);
    return null;
  }
};

export default function GoalsPage() {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  const [expectedRole, setExpectedRole] = useState<string>("");
  const [goalText, setGoalText] = useState<string>("");
  const [goalDays, setGoalDays] = useState<number>(30);
  const [showActions, setShowActions] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingGoals, setIsLoadingGoals] = useState<boolean>(true);
  const [personalValues, setPersonalValues] = useState<string[]>([]);
  const [integratedActions, setIntegratedActions] = useState<
    IntegratedAction[]
  >([]);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem("maxdiff-top5");
    if (stored) {
      setPersonalValues(JSON.parse(stored));
    }
  }, []);

  // goals.csvからデータを読み込み
  useEffect(() => {
    const loadGoalsData = async () => {
      setIsLoadingGoals(true);
      const goalsData = await loadGoalsFromCSV();

      if (goalsData) {
        setExpectedRole(goalsData.expectedRole);
        setGoalText(goalsData.goal);
      }

      setIsLoadingGoals(false);
    };

    loadGoalsData();
  }, []);

  const handleGenerateActions = async () => {
    if (!goalText.trim()) {
      setToast("目標を入力してください");
      return;
    }

    if (personalValues.length === 0) {
      setToast("価値観診断を先に完了してください");
      return;
    }

    setIsLoading(true);
    setShowActions(false);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // CSVファイルから動的にアクションを生成
    const generatedActions = await generateIntegratedActions(
      personalValues,
      companyValues
    );
    setIntegratedActions(generatedActions);

    setSelectedActions([]);

    setIsLoading(false);
    setShowActions(true);
    setToast("アクションを生成しました");
  };

  const handleToggleAction = (actionId: string) => {
    setSelectedActions((prev) => {
      if (prev.includes(actionId)) {
        return prev.filter((id) => id !== actionId);
      } else {
        if (prev.length >= 5) {
          setToast("最大5つまで選択できます");
          return prev;
        }
        return [...prev, actionId];
      }
    });
  };

  const handleRegisterActions = async () => {
    if (selectedActions.length !== 5) {
      setToast("5つのアクションを選択してください");
      return;
    }

    setIsSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const selectedActionsData = integratedActions.filter((a) =>
      selectedActions.includes(a.id)
    );
    localStorage.setItem(
      "registered-personal-actions",
      JSON.stringify(selectedActionsData)
    );

    // Save goal information
    const goalData = {
      expectedRole: expectedRole,
      title: goalText,
      startDate: new Date().toISOString().split("T")[0],
      durationDays: goalDays,
    };
    localStorage.setItem("user-goal", JSON.stringify(goalData));

    setIsSaving(false);
    setToast("アクションを登録しました");

    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="text-gray-600 hover:text-gray-900"
            >
              ← 戻る
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              目標・アクションの作成
            </h1>
          </div>

          <div className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-gray-900 mb-2">
                ステップ1: 目標を入力
              </h3>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  期待役割
                </label>
                {isLoadingGoals ? (
                  <div className="w-full h-20 border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                      <span className="text-sm">読み込み中...</span>
                    </div>
                  </div>
                ) : (
                  <Textarea
                    value={expectedRole}
                    onChange={(e) => setExpectedRole(e.target.value)}
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
                    onChange={(e) => setGoalText(e.target.value)}
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
                  onChange={(e) => setGoalDays(Number(e.target.value))}
                  min={1}
                  max={365}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleGenerateActions}
                size="lg"
                className="px-8"
                disabled={isLoading || personalValues.length === 0}
              >
                {isLoading ? (
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

          {personalValues.length > 0 && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-bold text-green-900 mb-3">
                ✓ あなたの価値観トップ5（診断結果）
              </h3>
              <div className="flex flex-wrap gap-2">
                {personalValues.map((value, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-full"
                  >
                    {idx + 1}. {value}
                  </span>
                ))}
              </div>
              <p className="text-sm text-green-700 mt-3">
                この価値観を基にして、あなたに最適なアクションを生成します。
              </p>
            </div>
          )}

          {personalValues.length === 0 && (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-5">
              <div className="flex items-start gap-3">
                <div className="text-2xl">⚠️</div>
                <div className="flex-1">
                  <h3 className="font-bold text-yellow-900 mb-2">
                    価値観診断が必要です
                  </h3>
                  <p className="text-sm text-yellow-800 mb-3">
                    アクションを生成する前に、まず価値観診断を受けて、あなたの大切にする価値観トップ5を明確にしてください。
                  </p>
                  <Button
                    onClick={() => router.push("/values/maxdiff")}
                    variant="outline"
                    className="border-yellow-600 text-yellow-900 hover:bg-yellow-100"
                  >
                    価値観診断を受ける
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

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
                    この中から5つを選択して登録してください (
                    {selectedActions.length}/5)
                  </p>
                </div>
                <Button
                  onClick={handleRegisterActions}
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
              {integratedActions.map((action) => (
                <div
                  key={action.id}
                  className={`bg-white rounded-2xl shadow p-6 space-y-3 transition-all ${
                    selectedActions.includes(action.id)
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : "hover:shadow-lg"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedActions.includes(action.id)}
                      onCheckedChange={() => handleToggleAction(action.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <h3 className="font-bold text-gray-900">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-700">
                        {action.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                          {action.company_value}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                          {action.personal_value}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          理念{action.company_weight}% / 価値観
                          {action.personal_weight}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {action.rationale}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showActions && integratedActions.length > 0 && (
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
        )}

        {!showActions && (
          <div></div>
        )}
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
