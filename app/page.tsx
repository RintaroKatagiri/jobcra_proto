"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SegmentedToggle from "./components/SegmentedToggle";
import ProgressBar from "./components/ProgressBar";
import Toast from "./components/Toast";
import { goal } from "./constants/goal";
import { actionsCompany } from "./constants/actionsCompany";
import { actionsPersonalDemo } from "./constants/actionsPersonalDemo";
import { calculateProgress } from "./utils/dateUtils";

type ActionMode = "company" | "personal";

export default function Home() {
  const router = useRouter();
  const [actionMode, setActionMode] = useState<ActionMode>("company");
  const [selectedActionIds, setSelectedActionIds] = useState<string[]>([]);
  const [todayLogs, setTodayLogs] = useState<{ action: any; time: string }[]>(
    []
  );
  const [toast, setToast] = useState<string | null>(null);
  const [maxDiffTop5, setMaxDiffTop5] = useState<string[] | null>(null);
  const [registeredPersonalActions, setRegisteredPersonalActions] = useState<
    any[]
  >([]);
  const [userGoal, setUserGoal] = useState<{
    title: string;
    startDate: string;
    durationDays: number;
  } | null>(null);

  const currentGoal = userGoal || goal;
  const { dayIndex, progressPct } = calculateProgress(
    currentGoal.startDate,
    currentGoal.durationDays
  );

  useEffect(() => {
    const stored = localStorage.getItem("maxdiff-top5");
    if (stored) {
      setMaxDiffTop5(JSON.parse(stored));
    }

    const storedActions = localStorage.getItem("registered-personal-actions");
    if (storedActions) {
      setRegisteredPersonalActions(JSON.parse(storedActions));
    }

    const storedGoal = localStorage.getItem("user-goal");
    if (storedGoal) {
      setUserGoal(JSON.parse(storedGoal));
    }
  }, []);

  const currentActions =
    registeredPersonalActions.length > 0
      ? registeredPersonalActions
      : actionsCompany;

  const handleToggleAction = (actionId: string) => {
    setSelectedActionIds((prev) => {
      if (prev.includes(actionId)) {
        return prev.filter((id) => id !== actionId);
      } else {
        return [...prev, actionId];
      }
    });
  };

  const handleLogActions = () => {
    if (selectedActionIds.length === 0) {
      setToast("アクションを選択してください");
      return;
    }

    const now = new Date();
    const timeStr = now.toLocaleDateString("ja-JP", {
      month: "numeric",
      day: "numeric",
    });

    const newLogs = selectedActionIds.map((actionId) => {
      const action = currentActions.find((a) => a.id === actionId);
      return { action, time: timeStr };
    });

    setTodayLogs((prev) => [...prev, ...newLogs]);
    setToast(`${selectedActionIds.length}件のアクションを登録しました`);
    setSelectedActionIds([]);
  };

  const handleReset = () => {
    if (confirm("目標とアクションをすべて削除して、再設定しますか？")) {
      localStorage.removeItem("registered-personal-actions");
      localStorage.removeItem("user-goal");
      setRegisteredPersonalActions([]);
      setUserGoal(null);
      setSelectedActionIds([]);
      setTodayLogs([]);
      setActionMode("company");
      setToast(
        "目標・アクションをリセットしました。目標・アクションページで再設定してください。"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">ホーム</h1>
            <button
              onClick={handleReset}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              目標・アクションを再設定
            </button>
          </div>

          {registeredPersonalActions.length > 0 ? (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {currentGoal.title}
              </h2>
              <p className="text-gray-600 mb-3">
                {dayIndex}日目 / 全{currentGoal.durationDays}日
              </p>
              <ProgressBar progress={progressPct} />
            </div>
          ) : (
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
              <h3 className="text-lg font-bold text-blue-900 mb-2">
                目標・アクションを設定しましょう
              </h3>
              <p className="text-sm text-blue-800 mb-3">
                まず目標・アクションページで、あなたの目標と具体的なアクションを設定してください。
              </p>
              <button
                onClick={() => router.push("/goals")}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
              >
                目標・アクションを設定する
              </button>
            </div>
          )}

          {registeredPersonalActions.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800 font-medium">
                ✓ 登録したアクション（{registeredPersonalActions.length}
                件）を使用中
              </p>
              <p className="text-xs text-green-700 mt-1">
                目標・アクションの作成ページで選択したアクションが表示されています。
              </p>
            </div>
          )}
        </div>

        {registeredPersonalActions.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">
              週次アクション振り返り
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">
                💡
                毎週金曜日に、今週実行したアクションを振り返って登録しましょう
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 block">
                  今週実行したアクションを選択してください
                </label>
                {selectedActionIds.length > 0 && (
                  <span className="text-sm text-blue-600 font-medium">
                    {selectedActionIds.length}件選択中
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {currentActions.map((action) => (
                  <div
                    key={action.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      selectedActionIds.includes(action.id)
                        ? "bg-blue-50 border-blue-300"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleToggleAction(action.id)}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedActionIds.includes(action.id)}
                        onChange={() => handleToggleAction(action.id)}
                        className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {action.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {action.description}
                        </p>
                        {action.company_value && action.personal_value && (
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              {action.company_value}
                            </span>
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              {action.personal_value}
                            </span>
                            {action.company_weight &&
                              action.personal_weight && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                  理念{action.company_weight}% / 価値観
                                  {action.personal_weight}%
                                </span>
                              )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleLogActions}
                disabled={selectedActionIds.length === 0}
                className={`w-full px-4 py-2 rounded-xl font-medium ${
                  selectedActionIds.length > 0
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {selectedActionIds.length > 0
                  ? `${selectedActionIds.length}件を登録`
                  : "登録"}
              </button>

              {todayLogs.length > 0 && (
                <div className="pt-4 border-t border-gray-200 mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    今週の登録アクション ({todayLogs.length}件)
                  </p>
                  <div className="space-y-2">
                    {todayLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {log.action.title}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">
                              {log.action.description}
                            </p>
                            {log.action.company_value &&
                              log.action.personal_value && (
                                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                    {log.action.company_value}
                                  </span>
                                  <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                    {log.action.personal_value}
                                  </span>
                                  {log.action.company_weight &&
                                    log.action.personal_weight && (
                                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                                        理念{log.action.company_weight}% /
                                        価値観{log.action.personal_weight}%
                                      </span>
                                    )}
                                </div>
                              )}
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {log.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
