"use client";

interface CompanyValuesDisplayProps {
  values: string[];
}

export default function CompanyValuesDisplay({
  values,
}: CompanyValuesDisplayProps) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-900">企業理念</h2>
      <p className="text-sm text-gray-600">組織が大切にしている価値観です。</p>
      <div className="flex flex-wrap gap-3">
        {values.map((value, idx) => (
          <div
            key={idx}
            className="px-4 py-2 bg-blue-50 text-blue-800 font-medium rounded-lg border border-blue-200"
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  );
}
