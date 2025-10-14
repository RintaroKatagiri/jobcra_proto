import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadGoalsFromCSV, GoalData } from "@/app/utils/csvUtils";
import {
  generateIntegratedActions,
  IntegratedAction,
} from "@/app/constants/actionsIntegrated";
import { companyValues } from "@/app/constants/companyValues";

export const useGoalManagement = () => {
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

  // 価値観データの読み込み
  useEffect(() => {
    const stored = localStorage.getItem("maxdiff-top5");
    if (stored) {
      setPersonalValues(JSON.parse(stored));
    }
  }, []);

  // CSV目標データの読み込み
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

  return {
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
    navigateToValuesDiagnosis: () => router.push("/values/maxdiff"),
    navigateHome: () => router.push("/"),
  };
};
