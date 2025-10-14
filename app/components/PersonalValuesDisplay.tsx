"use client";

interface PersonalValuesDisplayProps {
  personalValues: string[];
  onDiagnosisClick: () => void;
}

export default function PersonalValuesDisplay({
  personalValues,
  onDiagnosisClick,
}: PersonalValuesDisplayProps) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">あなたの価値観</h2>
        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
          ✓ 設定済み
        </span>
      </div>

      <div className="space-y-4">
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
          onClick={onDiagnosisClick}
          className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
        >
          価値観診断
        </button>
      </div>
    </div>
  );
}
