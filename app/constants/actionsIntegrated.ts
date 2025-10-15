export interface IntegratedAction {
  id: string;
  title: string;
  description: string;
  // rationale: string;
  company_value: string;
  personal_value: string;
  company_weight: number;
  personal_weight: number;
}

// CSVデータを解析してIntegratedActionに変換する関数
const parseCSVLine = (line: string, index: number): IntegratedAction | null => {
  // CSVの行を分割（カンマ区切り）
  const columns = line.split(",").map((col) => col.trim());

  if (columns.length < 4) return null;

  const [title, description, valuesCombination, blendRatio] = columns;

  // 理念×価値観の部分を解析 (例: "誠実 × 人から感謝される")
  const valuesParts = valuesCombination.split("×").map((part) => part.trim());
  if (valuesParts.length !== 2) return null;

  const companyValue = valuesParts[0];
  const personalValue = valuesParts[1];

  // ブレンド比率を解析 (例: "理念80% / 価値観20%")
  const ratioMatch = blendRatio.match(/理念(\d+)%\s*\/\s*価値観(\d+)%/);
  const companyWeight = ratioMatch ? parseInt(ratioMatch[1]) : 50;
  const personalWeight = ratioMatch ? parseInt(ratioMatch[2]) : 50;

  return {
    id: `csv-action-${index + 1}`,
    title,
    description,
    // rationale: `${companyValue}の実践が${personalValue}につながる`,
    company_value: companyValue,
    personal_value: personalValue,
    company_weight: companyWeight,
    personal_weight: personalWeight,
  };
};

// CSVファイルからアクションを動的に読み込む関数
const loadActionsFromCSV = async (): Promise<IntegratedAction[]> => {
  try {
    // CSVファイルを読み込み
    const response = await fetch("/action.csv");
    const csvText = await response.text();

    // CSVの行に分割（ヘッダー行をスキップ）
    const lines = csvText.split("\n").filter((line) => line.trim() !== "");
    const dataLines = lines.slice(1); // ヘッダー行をスキップ

    // 各行をIntegratedActionに変換
    const actions: IntegratedAction[] = [];
    dataLines.forEach((line, index) => {
      const action = parseCSVLine(line, index);
      if (action) {
        actions.push(action);
      }
    });

    return actions;
  } catch (error) {
    console.error("CSVファイルの読み込みに失敗しました:", error);
    // フォールバック: 現在のCSVデータを使用
    return getFallbackActions();
  }
};

// フォールバック用の固定データ
const getFallbackActions = (): IntegratedAction[] => {
  return [
    {
      id: "csv-action-1",
      title: "誠実な現場対応で、トラブルを即時に可視化・対処する",
      description: "約束を守り、隠さず共有。期待を超える初動対応で信頼を得る",
      // rationale: "誠実な対応が人から感謝される行動につながる",
      company_value: "誠実",
      personal_value: "人から感謝される",
      company_weight: 80,
      personal_weight: 20,
    },
    {
      id: "csv-action-2",
      title: "協働で「1ライン1改善／週」を継続する",
      description: "全員がアイデアを出し合い、楽しく小さく早く改善",
      // rationale: "協働の実践を通じて仲間と楽しく仕事をする環境を作る",
      company_value: "協働",
      personal_value: "仲間と楽しく仕事をする",
      company_weight: 60,
      personal_weight: 40,
    },
    {
      id: "csv-action-3",
      title: 'SPCと不良マップで"勘"を脱却する',
      description: "データで傾向把握し、重点箇所に先手を打つ",
      // rationale: "データ活用の専門性を高めることで価値を提供する",
      company_value: "データ活用",
      personal_value: "高い専門性を持つ",
      company_weight: 55,
      personal_weight: 45,
    },
    {
      id: "csv-action-4",
      title: "試作・治具の小規模実験（Do）を毎月実行",
      description: "改善は創造。小さく試し、早く学ぶ",
      // rationale: "改善の実践を通じて創造的な仕事に取り組む",
      company_value: "改善",
      personal_value: "創造的な仕事をする",
      company_weight: 50,
      personal_weight: 50,
    },
    {
      id: "csv-action-5",
      title: '後輩の標準作業定着を"現場コーチング"で支援',
      description: "責めずに支え、できるまで伴走",
      // rationale: "責任を持って後輩を支援し、慕われる関係を築く",
      company_value: "責任",
      personal_value: "後輩・部下から慕われ好かれる",
      company_weight: 70,
      personal_weight: 30,
    },
    {
      id: "csv-action-6",
      title: '他部署と"工程横断のボトルネック潰し"を実施',
      description: "品質×生産×購買が一体でネック解消",
      // rationale: "協働を通じて創造的な課題解決に取り組む",
      company_value: "協働",
      personal_value: "創造的な仕事をする",
      company_weight: 40,
      personal_weight: 60,
    },
    {
      id: "csv-action-7",
      title: "顧客の声（VOC）を週次で取り込み、是正→予防へ",
      description: "感謝される改善を回す仕組み化",
      // rationale: "顧客志向の実践が人から感謝される結果につながる",
      company_value: "顧客志向",
      personal_value: "人から感謝される",
      company_weight: 70,
      personal_weight: 30,
    },
  ];
};

// アクション生成関数：CSVファイルから動的に読み込み
export const generateIntegratedActions = async (
  personalValues: string[],
  companyValues: string[] = [
    "顧客志向",
    "協働",
    "誠実",
    "データ活用",
    "改善",
    "責任",
  ]
): Promise<IntegratedAction[]> => {
  // CSVファイルからアクションを動的に読み込み
  const csvActions = await loadActionsFromCSV();

  // 個人の価値観と企業理念に合致するアクションを優先的に選択
  const matchingActions = csvActions.filter(
    (action) =>
      personalValues.includes(action.personal_value) &&
      companyValues.includes(action.company_value)
  );

  // 合致するアクションが少ない場合は、すべてのCSVアクションを返す
  if (matchingActions.length < 7) {
    return csvActions;
  }

  // 7つに制限して返す
  return matchingActions.slice(0, 7);
};

// 同期版の関数（既存コードとの互換性のため）
export const generateIntegratedActionsSync = (
  personalValues: string[],
  companyValues: string[] = [
    "顧客志向",
    "協働",
    "誠実",
    "データ活用",
    "改善",
    "責任",
  ]
): IntegratedAction[] => {
  // フォールバックデータを使用
  return getFallbackActions();
};
