"use client";

import Toast from "@/app/components/Toast";
import CompanyValuesDisplay from "@/app/components/CompanyValuesDisplay";
import PersonalValuesDisplay from "@/app/components/PersonalValuesDisplay";
import { useValuesManagement } from "@/hooks/useValuesManagement";
import { companyValues } from "@/app/constants/companyValues";

export default function ValuesPage() {
  const { toast, personalValues, setToast, navigateToValuesDiagnosis } =
    useValuesManagement();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">価値観</h1>
          <p className="text-gray-600">企業理念と価値観を確認できます。</p>
        </div>

        <CompanyValuesDisplay values={companyValues} />

        <PersonalValuesDisplay
          personalValues={personalValues}
          onDiagnosisClick={navigateToValuesDiagnosis}
        />

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
