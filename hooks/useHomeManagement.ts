import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { calculateProgress } from "@/app/utils/dateUtils";

const DEFAULT_GOAL = {
  title: "目標を設定してください",
  startDate: new Date().toISOString().split("T")[0],
  durationDays: 30,
};

export const useHomeManagement = () => {
  const router = useRouter();
  const [selectedActionIds, setSelectedActionIds] = useState<string[]>([]);
  const [todayLogs, setTodayLogs] = useState<{ action: any; time: string }[]>(
    []
  );
  const [toast, setToast] = useState<string | null>(null);
  const [registeredPersonalActions, setRegisteredPersonalActions] = useState<
    any[]
  >([]);
  const [userGoal, setUserGoal] = useState<{
    title: string;
    startDate: string;
    durationDays: number;
  } | null>(null);

  const currentGoal = userGoal || DEFAULT_GOAL;
  const { dayIndex, progressPct } = calculateProgress(
    currentGoal.startDate,
    currentGoal.durationDays
  );

  useEffect(() => {
    const storedActions = localStorage.getItem("registered-personal-actions");
    if (storedActions) {
      setRegisteredPersonalActions(JSON.parse(storedActions));
    }

    const storedGoal = localStorage.getItem("user-goal");
    if (storedGoal) {
      setUserGoal(JSON.parse(storedGoal));
    }
  }, []);

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
      const action = registeredPersonalActions.find((a) => a.id === actionId);
      return { action, time: timeStr };
    });

    setTodayLogs((prev) => [...prev, ...newLogs]);
    setToast(`${selectedActionIds.length}件のアクションを登録しました`);
    setSelectedActionIds([]);
  };

  const handleReset = () => {
    if (
      confirm(
        "目標とアクション、価値観診断結果をすべて削除して、再設定しますか？"
      )
    ) {
      localStorage.removeItem("registered-personal-actions");
      localStorage.removeItem("user-goal");
      localStorage.removeItem("maxdiff-top5");
      setRegisteredPersonalActions([]);
      setUserGoal(null);
      setSelectedActionIds([]);
      setTodayLogs([]);
      setToast(
        "目標・アクション・価値観診断結果をリセットしました。価値観診断から再開してください。"
      );
    }
  };

  const navigateToGoals = () => router.push("/goals");

  return {
    // State
    selectedActionIds,
    todayLogs,
    toast,
    registeredPersonalActions,
    currentGoal,
    dayIndex,
    progressPct,

    // Setters
    setToast,

    // Handlers
    handleToggleAction,
    handleLogActions,
    handleReset,
    navigateToGoals,

    // Computed
    hasRegisteredActions: registeredPersonalActions.length > 0,
  };
};
