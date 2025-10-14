"use client";

import { Button } from "@/components/ui/button";

interface ValuesStatusProps {
  personalValues: string[];
  onNavigateToValuesDiagnosis: () => void;
}

export default function ValuesStatus({
  personalValues,
  onNavigateToValuesDiagnosis,
}: ValuesStatusProps) {
  const hasValues = personalValues.length > 0;

  if (hasValues) {
    return (
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
    );
  }

  return (
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
            onClick={onNavigateToValuesDiagnosis}
            variant="outline"
            className="border-yellow-600 text-yellow-900 hover:bg-yellow-100"
          >
            価値観診断を受ける
          </Button>
        </div>
      </div>
    </div>
  );
}
