/**
 * CSV読み込みユーティリティ
 */

export interface GoalData {
  expectedRole: string;
  goal: string;
}

/**
 * goals.csvからデータを読み込む
 */
export const loadGoalsFromCSV = async (): Promise<GoalData | null> => {
  try {
    const response = await fetch("/goals.csv");

    if (!response.ok) {
      console.error("CSV読み込みエラー:", response.status, response.statusText);
      return null;
    }

    const csvText = await response.text();
    const lines = csvText.split("\n").filter((line) => line.trim() !== "");

    if (lines.length < 2) {
      console.error("CSVにデータが不足しています");
      return null;
    }

    const dataLine = lines[1]; // ヘッダーをスキップ
    const columns = dataLine.split(",");

    if (columns.length >= 2) {
      return {
        expectedRole: columns[0].trim(),
        goal: columns[1].trim(),
      };
    }

    return null;
  } catch (error) {
    console.error("goals.csvの読み込みに失敗しました:", error);
    return null;
  }
};

/**
 * action.csvからデータを読み込む（将来の拡張用）
 */
export const loadActionsFromCSV = async (): Promise<any[] | null> => {
  try {
    const response = await fetch("/action.csv");

    if (!response.ok) {
      return null;
    }

    const csvText = await response.text();
    const lines = csvText.split("\n").filter((line) => line.trim() !== "");

    // CSVパースロジックをここに実装
    // 現在はactionsIntegrated.tsで実装されているロジックを移行可能

    return [];
  } catch (error) {
    console.error("action.csvの読み込みに失敗しました:", error);
    return null;
  }
};
