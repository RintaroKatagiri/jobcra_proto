"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/app/components/Toast";
import { companyValues } from "@/app/constants/companyValues";

// デフォルトの価値観トップ5
const DEFAULT_PERSONAL_VALUES = [
  "人から感謝される",
  "仲間と楽しく仕事をする",
  "後輩・部下から慕われ好かれる",
  "高い専門性を持つ",
  "創造的な仕事をする",
];

export default function ValuesPage() {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  const [personalValues, setPersonalValues] = useState<string[]>(
    DEFAULT_PERSONAL_VALUES
  );
  const [hasDiagnosisResult, setHasDiagnosisResult] = useState<boolean>(true); // デフォルトで診断完了状態

  useEffect(() => {
    // デフォルト値をlocalStorageに保存（まだ設定されていない場合のみ）
    const stored = localStorage.getItem("maxdiff-top5");
    if (!stored) {
      localStorage.setItem(
        "maxdiff-top5",
        JSON.stringify(DEFAULT_PERSONAL_VALUES)
      );
    } else {
      // 既存の値がある場合はそれを使用
      const values = JSON.parse(stored);
      setPersonalValues(values);
    }
    setHasDiagnosisResult(true);
  }, []);

  const handleDiagnosisClick = () => {
    router.push("/values/maxdiff");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">価値観</h1>
          <p className="text-gray-600">企業理念と価値観を確認できます。</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">企業理念</h2>
          <p className="text-sm text-gray-600">
            組織が大切にしている価値観です。
          </p>
          <div className="flex flex-wrap gap-3">
            {companyValues.map((value, idx) => (
              <div
                key={idx}
                className="px-4 py-2 bg-blue-50 text-blue-800 font-medium rounded-lg border border-blue-200"
              >
                {value}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">あなたの価値観</h2>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              ✓ 設定済み
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-800 font-medium mb-2">
                  ✓ 価値観が設定されています
                </p>
                <p className="text-sm text-green-700">
                  以下は、あなたが最も大切にする価値観トップ5です。
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mb-4">
                {personalValues.map((value, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md"
                  >
                    {idx + 1}. {value}
                  </div>
                ))}
              </div>
              <button
                onClick={handleDiagnosisClick}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
              >
                価値観診断
              </button>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡
            この価値観設定は、目標・アクションページでアクションを生成する際に自動的に使用されます。
          </p>
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
