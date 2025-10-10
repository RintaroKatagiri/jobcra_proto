'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CompanyValue {
  id: string;
  name: string;
  description: string;
  display_order: number;
}

export default function CompanyValuesPage() {
  const [values, setValues] = useState<CompanyValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchValues();
  }, []);

  const fetchValues = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('company_values')
      .select('*')
      .order('display_order', { ascending: true });

    if (data) {
      setValues(data);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditForm({ name: '', description: '' });
  };

  const handleEdit = (value: CompanyValue) => {
    setEditingId(value.id);
    setEditForm({ name: value.name, description: value.description });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setEditForm({ name: '', description: '' });
  };

  const handleSave = async () => {
    if (!editForm.name.trim()) {
      alert('企業理念の名前を入力してください');
      return;
    }

    if (isAdding) {
      const maxOrder = values.length > 0 ? Math.max(...values.map(v => v.display_order)) : 0;
      const { error } = await supabase
        .from('company_values')
        .insert({
          name: editForm.name.trim(),
          description: editForm.description.trim(),
          display_order: maxOrder + 1
        });

      if (error) {
        alert('追加に失敗しました: ' + error.message);
        return;
      }
    } else if (editingId) {
      const { error } = await supabase
        .from('company_values')
        .update({
          name: editForm.name.trim(),
          description: editForm.description.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', editingId);

      if (error) {
        alert('更新に失敗しました: ' + error.message);
        return;
      }
    }

    handleCancel();
    fetchValues();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('この企業理念を削除してもよろしいですか？')) {
      return;
    }

    const { error } = await supabase
      .from('company_values')
      .delete()
      .eq('id', id);

    if (error) {
      alert('削除に失敗しました: ' + error.message);
      return;
    }

    fetchValues();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">企業理念管理</CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={() => window.location.href = '/admin'}
                  variant="outline"
                >
                  ダッシュボードに戻る
                </Button>
                {!isAdding && !editingId && (
                  <Button onClick={handleAdd}>
                    <Plus className="w-4 h-4 mr-2" />
                    新規追加
                  </Button>
                )}
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
            {isAdding && (
              <Card className="border-2 border-blue-500">
                <CardHeader>
                  <CardTitle className="text-lg">新しい企業理念を追加</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      名前 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="例: 顧客志向"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      説明
                    </label>
                    <Textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      placeholder="企業理念の説明を入力してください"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button onClick={handleCancel} variant="outline">
                      <X className="w-4 h-4 mr-2" />
                      キャンセル
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      保存
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {values.map((value) => (
                <Card key={value.id} className={editingId === value.id ? 'border-2 border-blue-500' : ''}>
                  {editingId === value.id ? (
                    <CardContent className="pt-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          名前 <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          placeholder="例: 顧客志向"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          説明
                        </label>
                        <Textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          placeholder="企業理念の説明を入力してください"
                          rows={3}
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button onClick={handleCancel} variant="outline">
                          <X className="w-4 h-4 mr-2" />
                          キャンセル
                        </Button>
                        <Button onClick={handleSave}>
                          <Save className="w-4 h-4 mr-2" />
                          保存
                        </Button>
                      </div>
                    </CardContent>
                  ) : (
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{value.name}</h3>
                          {value.description && (
                            <p className="text-sm text-gray-600">{value.description}</p>
                          )}
                        </div>
                        {!isAdding && !editingId && (
                          <div className="flex gap-2 ml-4">
                            <Button
                              onClick={() => handleEdit(value)}
                              variant="outline"
                              size="sm"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDelete(value.id)}
                              variant="outline"
                              size="sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
