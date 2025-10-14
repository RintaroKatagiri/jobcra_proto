import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const DEFAULT_PERSONAL_VALUES = [
  "人から感謝される",
  "仲間と楽しく仕事をする",
  "後輩・部下から慕われ好かれる",
  "高い専門性を持つ",
  "創造的な仕事をする",
];

export const useValuesManagement = () => {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  const [personalValues, setPersonalValues] = useState<string[]>(
    DEFAULT_PERSONAL_VALUES
  );
  const [hasDiagnosisResult, setHasDiagnosisResult] = useState<boolean>(true);

  useEffect(() => {
    const stored = localStorage.getItem("maxdiff-top5");
    if (!stored) {
      localStorage.setItem(
        "maxdiff-top5",
        JSON.stringify(DEFAULT_PERSONAL_VALUES)
      );
    } else {
      const values = JSON.parse(stored);
      setPersonalValues(values);
    }
    setHasDiagnosisResult(true);
  }, []);

  const navigateToValuesDiagnosis = () => {
    router.push("/values/maxdiff");
  };

  return {
    toast,
    personalValues,
    hasDiagnosisResult,
    setToast,
    navigateToValuesDiagnosis,
  };
};
