"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { personalValues } from "@/app/constants/personalValues";
import Toast from "@/app/components/Toast";

const ITEMS_PER_PAGE = 8;
const TOTAL_PAGES = Math.ceil(personalValues.length / ITEMS_PER_PAGE);

type SelectionType = "best" | "worst" | null;

export default function MaxDiffPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [selections, setSelections] = useState<Record<number, SelectionType>>(
    {}
  );
  const [scores, setScores] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const startIdx = currentPage * ITEMS_PER_PAGE;
  const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, personalValues.length);
  const currentItems = personalValues.slice(startIdx, endIdx);

  const handleSelection = (itemIdx: number, type: SelectionType) => {
    const newSelections = { ...selections };

    if (type === "best") {
      // 他の項目のbestを解除
      Object.keys(newSelections).forEach((key) => {
        if (newSelections[parseInt(key)] === "best") {
          newSelections[parseInt(key)] = null;
        }
      });
      newSelections[itemIdx] = type;
    } else if (type === "worst") {
      // 他の項目のworstを解除
      Object.keys(newSelections).forEach((key) => {
        if (newSelections[parseInt(key)] === "worst") {
          newSelections[parseInt(key)] = null;
        }
      });
      newSelections[itemIdx] = type;
    } else {
      newSelections[itemIdx] = null;
    }

    setSelections(newSelections);
  };

  const handleNext = () => {
    const bestIdx = Object.keys(selections).find(
      (key) => selections[parseInt(key)] === "best"
    );
    const worstIdx = Object.keys(selections).find(
      (key) => selections[parseInt(key)] === "worst"
    );

    if (!bestIdx || !worstIdx) {
      setToast("「最も大事」と「最もそうではない」を1つずつ選択してください");
      return;
    }

    const bestValue = currentItems[parseInt(bestIdx)];
    const worstValue = currentItems[parseInt(worstIdx)];

    const newScores = { ...scores };
    newScores[bestValue] = (newScores[bestValue] || 0) + 1;
    newScores[worstValue] = (newScores[worstValue] || 0) - 1;
    setScores(newScores);

    if (currentPage < TOTAL_PAGES - 1) {
      setCurrentPage(currentPage + 1);
      setSelections({});
    } else {
      const sorted = Object.entries(newScores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([value]) => value);

      localStorage.setItem("maxdiff-top5", JSON.stringify(sorted));
      setIsComplete(true);
    }
  };

  const handleApplyToHome = () => {
    setToast("ホーム画面に反映しました（デモ表示のみ）");
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  const getBestCount = () =>
    Object.values(selections).filter((s) => s === "best").length;
  const getWorstCount = () =>
    Object.values(selections).filter((s) => s === "worst").length;

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
            <p className="text-gray-700">
              あなたの価値観トップ5が決定しました。
            </p>

            <div className="space-y-3">
              {top5.map((value, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl"
                >
                  <span className="text-2xl font-bold text-blue-600">
                    {idx + 1}
                  </span>
                  <span className="text-lg font-medium text-gray-900">
                    {value}
                  </span>
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
                onClick={() => router.push("/")}
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
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              価値観診断（MaxDiff）
            </h1>
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

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-bold text-blue-900 mb-2">選択方法</h2>
            <div className="text-sm text-blue-800 space-y-1">
              <p>
                • 以下の価値観の中から、<strong>最も大事だと思うもの</strong>
                を1つ選んでください
              </p>
              <p>
                • 同時に、<strong>最もそうではないと思うもの</strong>
                を1つ選んでください
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex gap-4 text-sm">
              <span
                className={`${
                  getBestCount() === 1
                    ? "text-blue-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                最も大事: {getBestCount()}/1
              </span>
              <span
                className={`${
                  getWorstCount() === 1
                    ? "text-red-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                最もそうではない: {getWorstCount()}/1
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {currentItems.map((value, idx) => {
              const currentSelection = selections[idx] || null;
              return (
                <div key={idx} className="bg-gray-50 rounded-lg p-4">
                  <div className="mb-3">
                    <span className="text-gray-900 font-medium leading-relaxed text-sm">
                      {value}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSelection(idx, "best")}
                      className={`flex-1 py-1.5 px-2 text-xs font-medium rounded border-2 transition-all ${
                        currentSelection === "best"
                          ? "border-blue-500 bg-blue-500 text-white"
                          : "border-blue-200 text-blue-700 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      最も大事
                    </button>
                    <button
                      onClick={() => handleSelection(idx, "worst")}
                      className={`flex-1 py-1.5 px-2 text-xs font-medium rounded border-2 transition-all ${
                        currentSelection === "worst"
                          ? "border-red-500 bg-red-500 text-white"
                          : "border-red-200 text-red-700 hover:border-red-300 hover:bg-red-50"
                      }`}
                    >
                      最もそうではない
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={getBestCount() !== 1 || getWorstCount() !== 1}
            className={`w-full py-3 font-medium rounded-lg transition-all ${
              getBestCount() !== 1 || getWorstCount() !== 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {currentPage < TOTAL_PAGES - 1 ? "次のページへ" : "診断結果を見る"}
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
