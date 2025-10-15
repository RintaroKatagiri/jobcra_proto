"use client";

import { useState } from "react";

interface Action {
  id: string;
  title: string;
  description: string;
  // rationale: string;
  valueMapping: {
    company: string[];
    personal: string[];
  };
}

interface ActionCardProps {
  action: Action;
  onToast: (message: string) => void;
}

export default function ActionCard({ action, onToast }: ActionCardProps) {
  const [expanded, setExpanded] = useState(false);

  const handleAction = (actionType: string) => {
    onToast(`${actionType}しました`);
  };

  const allValues = [
    ...action.valueMapping.company,
    ...action.valueMapping.personal,
  ];

  return (
    <div className="bg-white rounded-2xl shadow p-5 space-y-3">
      <h3 className="text-lg font-bold text-gray-900">{action.title}</h3>
      <p className="text-gray-700 text-sm">{action.description}</p>

      <div className="flex flex-wrap gap-2">
        {allValues.map((value, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
          >
            {value}
          </span>
        ))}
      </div>

      {expanded && (
        <div className="pt-2 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <strong>根拠：</strong>
            {/* {action.rationale} */}
          </p>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {expanded ? "詳細を閉じる" : "詳細を見る"}
        </button>
        <button
          onClick={() => handleAction("受け入れ")}
          className="ml-auto px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
        >
          受け入れ
        </button>
      </div>
    </div>
  );
}
