"use client";

interface WeeklyActionReviewProps {
  actions: any[];
  selectedActionIds: string[];
  todayLogs: { action: any; time: string }[];
  onToggleAction: (actionId: string) => void;
  onLogActions: () => void;
}

export default function WeeklyActionReview({
  actions,
  selectedActionIds,
  todayLogs,
  onToggleAction,
  onLogActions,
}: WeeklyActionReviewProps) {
  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-4">
      <h2 className="text-lg font-bold text-gray-900">
        週次アクション振り返り
      </h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <p className="text-sm text-blue-800">
          💡 毎週金曜日に、今週実行したアクションを振り返って登録しましょう
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700 block">
            今週実行したアクションを選択してください
          </label>
          {selectedActionIds.length > 0 && (
            <span className="text-sm text-blue-600 font-medium">
              {selectedActionIds.length}件選択中
            </span>
          )}
        </div>

        <ActionList
          actions={actions}
          selectedActionIds={selectedActionIds}
          onToggleAction={onToggleAction}
        />

        <button
          onClick={onLogActions}
          disabled={selectedActionIds.length === 0}
          className={`w-full px-4 py-2 rounded-xl font-medium ${
            selectedActionIds.length > 0
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {selectedActionIds.length > 0
            ? `${selectedActionIds.length}件を登録`
            : "登録"}
        </button>

        {todayLogs.length > 0 && <LoggedActionsSection logs={todayLogs} />}
      </div>
    </div>
  );
}

interface ActionListProps {
  actions: any[];
  selectedActionIds: string[];
  onToggleAction: (actionId: string) => void;
}

function ActionList({
  actions,
  selectedActionIds,
  onToggleAction,
}: ActionListProps) {
  return (
    <div className="space-y-2">
      {actions.map((action) => (
        <ActionItem
          key={action.id}
          action={action}
          isSelected={selectedActionIds.includes(action.id)}
          onToggle={() => onToggleAction(action.id)}
        />
      ))}
    </div>
  );
}

interface ActionItemProps {
  action: any;
  isSelected: boolean;
  onToggle: () => void;
}

function ActionItem({ action, isSelected, onToggle }: ActionItemProps) {
  return (
    <div
      className={`border rounded-lg p-3 cursor-pointer transition-all ${
        isSelected
          ? "bg-blue-50 border-blue-300"
          : "bg-white border-gray-200 hover:border-gray-300"
      }`}
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          className="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 text-sm">{action.title}</h4>
          <p className="text-xs text-gray-600 mt-1">{action.description}</p>
          {action.company_value && action.personal_value && (
            <ActionTags action={action} />
          )}
        </div>
      </div>
    </div>
  );
}

interface ActionTagsProps {
  action: any;
}

function ActionTags({ action }: ActionTagsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-2">
      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
        {action.company_value}
      </span>
      <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
        {action.personal_value}
      </span>
      {action.company_weight && action.personal_weight && (
        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
          理念{action.company_weight}% / 価値観{action.personal_weight}%
        </span>
      )}
    </div>
  );
}

interface LoggedActionsSectionProps {
  logs: { action: any; time: string }[];
}

function LoggedActionsSection({ logs }: LoggedActionsSectionProps) {
  return (
    <div className="pt-4 border-t border-gray-200 mt-4">
      <p className="text-sm font-medium text-gray-700 mb-3">
        今週の登録アクション ({logs.length}件)
      </p>
      <div className="space-y-2">
        {logs.map((log, idx) => (
          <div
            key={idx}
            className="bg-gray-50 rounded-lg p-3 border border-gray-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm">
                  {log.action.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  {log.action.description}
                </p>
                {log.action.company_value && log.action.personal_value && (
                  <ActionTags action={log.action} />
                )}
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {log.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
