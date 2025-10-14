'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/app/components/Toast';
import { companyValues } from '@/app/constants/companyValues';

export default function ValuesPage() {
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  const [personalValues, setPersonalValues] = useState<string[]>([]);
  const [hasDiagnosisResult, setHasDiagnosisResult] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem('maxdiff-top5');
    if (stored) {
      const values = JSON.parse(stored);
      setPersonalValues(values);
      setHasDiagnosisResult(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">価値観</h1>
          <p className="text-gray-600">
            企業理念と価値観を確認できます。
          </p>
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

        {hasDiagnosisResult && (
          <div className="bg-white rounded-2xl shadow p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">あなたの価値観</h2>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                ✓ 診断完了
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-green-800 font-medium mb-2">
                    ✓ 価値観診断が完了しています
                  </p>
                  <p className="text-sm text-green-700">
                    以下は、診断で明らかになったあなたが最も大切にする価値観トップ5です。
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
                  onClick={() => router.push('/values/maxdiff')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
                >
                  診断をやり直す
                </button>
              </div>
            </div>
          </div>
        )}

        {!hasDiagnosisResult && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 font-medium mb-2">
              💡 価値観診断を受けましょう
            </p>
            <p className="text-sm text-blue-700 mb-3">
              48個の価値観から、あなたが最も大切にする価値観トップ5を明らかにします。
            </p>
            <p className="text-sm text-blue-700 mb-4">
              診断結果は、あなたに最適なアクションを生成する際に使用されます。
            </p>
            <button
              onClick={() => router.push('/values/maxdiff')}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              価値観診断を受ける
            </button>
          </div>
        )}

        {hasDiagnosisResult && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 この価値観診断結果は、目標・アクションページでアクションを生成する際に自動的に使用されます。
            </p>
          </div>
        )}
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
