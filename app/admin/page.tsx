'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Settings } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface User {
  id: string;
  name: string;
  email: string;
}

interface Goal {
  id: string;
  title: string;
  start_date: string;
  duration_days: number;
}

interface Action {
  id: string;
  title: string;
  company_value: string | null;
  personal_value: string | null;
}

interface ActionLog {
  id: string;
  logged_at: string;
  action: Action;
}

interface EmployeeData {
  user: User;
  goals: (Goal & { actions: (Action & { logs_count: number })[] })[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AdminPage() {
  const [selectedMonth, setSelectedMonth] = useState('2025-10');
  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  const fetchData = async () => {
    setLoading(true);

    const startDate = `${selectedMonth}-01`;
    const endDate = new Date(selectedMonth + '-01');
    endDate.setMonth(endDate.getMonth() + 1);
    const endDateStr = endDate.toISOString().split('T')[0];

    const { data: users } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'employee');

    if (!users) {
      setLoading(false);
      return;
    }

    const employeeDataPromises = users.map(async (user) => {
      const { data: goals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .gte('start_date', startDate)
        .lt('start_date', endDateStr);

      if (!goals || goals.length === 0) {
        return { user, goals: [] };
      }

      const goalsWithActions = await Promise.all(
        goals.map(async (goal) => {
          const { data: actions } = await supabase
            .from('actions')
            .select('*')
            .eq('goal_id', goal.id);

          if (!actions) {
            return { ...goal, actions: [] };
          }

          const actionsWithLogs = await Promise.all(
            actions.map(async (action) => {
              const { data: logs } = await supabase
                .from('action_logs')
                .select('*')
                .eq('action_id', action.id)
                .gte('logged_at', startDate)
                .lt('logged_at', endDateStr);

              return { ...action, logs_count: logs?.length || 0 };
            })
          );

          return { ...goal, actions: actionsWithLogs };
        })
      );

      return { user, goals: goalsWithActions };
    });

    const data = await Promise.all(employeeDataPromises);
    setEmployeeData(data);
    setLoading(false);
  };

  const getCompanyValueStats = () => {
    const valueCounts: { [key: string]: number } = {};

    employeeData.forEach((emp) => {
      emp.goals.forEach((goal) => {
        goal.actions.forEach((action) => {
          if (action.logs_count > 0 && action.company_value) {
            valueCounts[action.company_value] = (valueCounts[action.company_value] || 0) + action.logs_count;
          }
        });
      });
    });

    return Object.entries(valueCounts).map(([name, value]) => ({ name, value }));
  };

  const getPersonalValueStats = () => {
    const valueCounts: { [key: string]: number } = {};

    employeeData.forEach((emp) => {
      emp.goals.forEach((goal) => {
        goal.actions.forEach((action) => {
          if (action.logs_count > 0 && action.personal_value) {
            valueCounts[action.personal_value] = (valueCounts[action.personal_value] || 0) + action.logs_count;
          }
        });
      });
    });

    return Object.entries(valueCounts).map(([name, value]) => ({ name, value }));
  };

  const companyValueData = getCompanyValueStats();
  const personalValueData = getPersonalValueStats();

  const generateInsights = () => {
    const totalCompanyActions = companyValueData.reduce((sum, item) => sum + item.value, 0);
    const totalPersonalActions = personalValueData.reduce((sum, item) => sum + item.value, 0);

    const insights = [];

    // 企業理念に関するコメント
    if (companyValueData.length === 0) {
      insights.push({
        type: 'warning',
        title: '企業理念アクションの実行なし',
        message: '企業理念に基づくアクションが実行されていません。従業員に企業理念の重要性を伝え、具体的なアクションを推奨しましょう。'
      });
    } else {
      const topCompanyValue = companyValueData.reduce((max, item) =>
        item.value > max.value ? item : max, companyValueData[0]
      );
      const lowestCompanyValue = companyValueData.reduce((min, item) =>
        item.value < min.value ? item : min, companyValueData[0]
      );

      if (companyValueData.length > 1 && topCompanyValue.value > lowestCompanyValue.value * 3) {
        insights.push({
          type: 'info',
          title: '企業理念の偏りを検出',
          message: `「${topCompanyValue.name}」の実行回数が突出しています（${topCompanyValue.value}回）。一方、「${lowestCompanyValue.name}」は${lowestCompanyValue.value}回です。バランスの取れた実践を促すことで、企業理念の全体的な浸透を図りましょう。`
        });
      } else {
        insights.push({
          type: 'success',
          title: '企業理念のバランスが良好',
          message: `企業理念に基づくアクションがバランスよく実行されています（合計${totalCompanyActions}回）。この調子で継続しましょう。`
        });
      }
    }

    // 個人価値観に関するコメント
    if (personalValueData.length === 0) {
      insights.push({
        type: 'warning',
        title: '個人価値観アクションの実行なし',
        message: '個人の価値観に基づくアクションが実行されていません。従業員の価値観診断の実施と、それに基づくアクション設定を促しましょう。'
      });
    } else {
      const topPersonalValue = personalValueData.reduce((max, item) =>
        item.value > max.value ? item : max, personalValueData[0]
      );

      insights.push({
        type: 'info',
        title: '従業員の価値観傾向',
        message: `従業員が最も重視している価値観は「${topPersonalValue.name}」です（${topPersonalValue.value}回実行）。チーム全体で合計${totalPersonalActions}回の個人価値観アクションが実行されています。`
      });
    }

    // 企業理念と個人価値観のバランス
    if (totalCompanyActions > 0 && totalPersonalActions > 0) {
      const ratio = totalCompanyActions / totalPersonalActions;
      if (ratio > 2) {
        insights.push({
          type: 'info',
          title: '企業理念重視の傾向',
          message: '企業理念に基づくアクションが個人価値観アクションの2倍以上実行されています。個人の価値観も大切にすることで、従業員のモチベーション向上につながります。'
        });
      } else if (ratio < 0.5) {
        insights.push({
          type: 'info',
          title: '個人価値観重視の傾向',
          message: '個人価値観に基づくアクションが企業理念アクションの2倍以上実行されています。企業理念の浸透を図ることで、組織としての一体感を高めましょう。'
        });
      } else {
        insights.push({
          type: 'success',
          title: '企業理念と個人価値観のバランスが最適',
          message: `企業理念（${totalCompanyActions}回）と個人価値観（${totalPersonalActions}回）のアクションがバランスよく実行されています。この状態を維持しましょう。`
        });
      }
    }

    return insights;
  };

  const insights = generateInsights();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">管理者ダッシュボード</CardTitle>
              <div className="flex gap-2 items-center">
                <Button
                  onClick={() => window.location.href = '/admin/company-values'}
                  variant="outline"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  企業理念管理
                </Button>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="2025-09">2025年9月</option>
                  <option value="2025-10">2025年10月</option>
                  <option value="2025-11">2025年11月</option>
                </select>
              </div>
            </div>
          </CardHeader>
        </Card>

        {loading ? (
          <Card>
            <CardContent className="p-8">
              <p className="text-center text-gray-600">読み込み中...</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {insights.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>分析とインサイト</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {insights.map((insight, idx) => (
                      <div
                        key={idx}
                        className={`rounded-lg p-4 ${
                          insight.type === 'success'
                            ? 'bg-green-50 border border-green-200'
                            : insight.type === 'warning'
                            ? 'bg-yellow-50 border border-yellow-200'
                            : 'bg-blue-50 border border-blue-200'
                        }`}
                      >
                        <h4
                          className={`font-semibold mb-1 ${
                            insight.type === 'success'
                              ? 'text-green-900'
                              : insight.type === 'warning'
                              ? 'text-yellow-900'
                              : 'text-blue-900'
                          }`}
                        >
                          {insight.type === 'success' ? '✓ ' : insight.type === 'warning' ? '⚠ ' : '💡 '}
                          {insight.title}
                        </h4>
                        <p
                          className={`text-sm ${
                            insight.type === 'success'
                              ? 'text-green-800'
                              : insight.type === 'warning'
                              ? 'text-yellow-800'
                              : 'text-blue-800'
                          }`}
                        >
                          {insight.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>企業理念の実行状況</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={companyValueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#3b82f6" name="実行回数" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>価値観の実行状況</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={personalValueData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {personalValueData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>従業員別の目標とアクション</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {employeeData.map((emp) => (
                    <div key={emp.user.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        {emp.user.name} ({emp.user.email})
                      </h3>

                      {emp.goals.length === 0 ? (
                        <p className="text-sm text-gray-500">この期間に設定された目標はありません</p>
                      ) : (
                        <div className="space-y-4">
                          {emp.goals.map((goal) => (
                            <div key={goal.id} className="bg-gray-50 rounded-lg p-4">
                              <h4 className="font-semibold text-gray-900 mb-2">{goal.title}</h4>
                              <p className="text-sm text-gray-600 mb-3">
                                期間: {goal.start_date} から {goal.duration_days}日間
                              </p>

                              {goal.actions.length === 0 ? (
                                <p className="text-sm text-gray-500">アクションが登録されていません</p>
                              ) : (
                                <div className="space-y-2">
                                  {goal.actions.map((action) => (
                                    <div key={action.id} className="bg-white rounded-lg p-3 border border-gray-200">
                                      <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                          <p className="font-medium text-gray-900">{action.title}</p>
                                          <div className="flex gap-2 mt-2">
                                            {action.company_value && (
                                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                                企業理念: {action.company_value}
                                              </span>
                                            )}
                                            {action.personal_value && (
                                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                                価値観: {action.personal_value}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <div className="ml-4 text-right">
                                          <p className="text-2xl font-bold text-blue-600">{action.logs_count}</p>
                                          <p className="text-xs text-gray-500">実行回数</p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
