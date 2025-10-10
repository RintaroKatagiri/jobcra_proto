'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { personalValues } from '@/app/constants/personalValues';
import Toast from '@/app/components/Toast';

const ITEMS_PER_PAGE = 8;
const TOTAL_PAGES = Math.ceil(personalValues.length / ITEMS_PER_PAGE);

export default function MaxDiffPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [bestSelection, setBestSelection] = useState<number | null>(null);
  const [worstSelection, setWorstSelection] = useState<number | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const startIdx = currentPage * ITEMS_PER_PAGE;
  const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, personalValues.length);
  const currentItems = personalValues.slice(startIdx, endIdx);

  const handleBestSelect = (localIdx: number) => {
    if (worstSelection === localIdx) {
      setToast('「最も大事」と「最もそうではない」は異なる項目を選択してください');
      return;
    }
    setBestSelection(localIdx);
  };

  const handleWorstSelect = (localIdx: number) => {
    if (bestSelection === localIdx) {
      setToast('「最も大事」と「最もそうではない」は異なる項目を選択してください');
      return;
    }
    setWorstSelection(localIdx);
  };

  const handleNext = () => {
    if (bestSelection === null || worstSelection === null) {
      setToast('両方の選択肢を選んでください');
      return;
    }

    const bestValue = currentItems[bestSelection];
    const worstValue = currentItems[worstSelection];

    const newScores = { ...scores };
    newScores[bestValue] = (newScores[bestValue] || 0) + 1;
    newScores[worstValue] = (newScores[worstValue] || 0) - 1;
    setScores(newScores);

    if (currentPage < TOTAL_PAGES - 1) {
      setCurrentPage(currentPage + 1);
      setBestSelection(null);
      setWorstSelection(null);
    } else {
      const sorted = Object.entries(newScores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([value]) => value);

      localStorage.setItem('maxdiff-top5', JSON.stringify(sorted));
      setIsComplete(true);
    }
  };

  const handleApplyToHome = () => {
    setToast('ホーム画面に反映しました（デモ表示のみ）');
    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  if (isComplete) {
    const top5 = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([value]) => value);

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-2xl shadow p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">診断完了</h1>
            <p className="text-gray-700">あなたの価値観トップ5が決定しました。</p>

            <div className="space-y-3">
              {top5.map((value, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <span className="text-2xl font-bold text-blue-600">{idx + 1}</span>
                  <span className="text-lg font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleApplyToHome}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
              >
                ホーム画面に反映する
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
              >
                戻る
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center">
            ※この画面の操作結果はデモ表示のみで、アプリのデータには反映されません。
          </p>
        </div>

        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">価値観診断（MaxDiff）</h1>
            <p className="text-sm text-gray-600 mt-2">
              ページ {currentPage + 1} / {TOTAL_PAGES}
            </p>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${((currentPage + 1) / TOTAL_PAGES) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                最も大事だと思う価値観を1つ選んでください
              </h2>
              <div className="grid gap-2">
                {currentItems.map((value, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleBestSelect(idx)}
                    className={`p-4 text-left rounded-lg border-2 transition-all ${
                      bestSelection === idx
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <span className="text-gray-900 leading-relaxed">{value}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                最もそうではない価値観を1つ選んでください
              </h2>
              <div className="grid gap-2">
                {currentItems.map((value, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleWorstSelect(idx)}
                    className={`p-4 text-left rounded-lg border-2 transition-all ${
                      worstSelection === idx
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-red-300'
                    }`}
                  >
                    <span className="text-gray-900 leading-relaxed">{value}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={bestSelection === null || worstSelection === null}
            className={`w-full py-3 font-medium rounded-lg transition-all ${
              bestSelection === null || worstSelection === null
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {currentPage < TOTAL_PAGES - 1 ? '次へ' : '結果を見る'}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          ※この画面の操作結果はデモ表示のみで、アプリのデータには反映されません。
        </p>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
