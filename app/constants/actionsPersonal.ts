export interface PersonalAction {
  id: string;
  title: string;
  description: string;
  rationale: string;
  personal_value: string;
}

export const generatePersonalActions = (selectedValues: string[]): PersonalAction[] => {
  const actionTemplates: Record<string, PersonalAction[]> = {
    '自分が成長・発達する': [
      {
        id: 'pa-growth-1',
        title: '週に1回、業界の最新トレンドを学ぶ時間を確保する',
        description: '毎週金曜日の午後30分を使って、業界ニュースや技術記事を読む習慣をつける',
        rationale: '継続的な学習により、専門知識を深め、成長を実感できる',
        personal_value: '自分が成長・発達する'
      },
      {
        id: 'pa-growth-2',
        title: '月に1冊、自己啓発やスキルアップに関する本を読む',
        description: '通勤時間や休憩時間を活用して、計画的に読書を進める',
        rationale: '新しい知識や視点を得ることで、成長のきっかけをつかめる',
        personal_value: '自分が成長・発達する'
      }
    ],
    '仕事にやりがいを感じる': [
      {
        id: 'pa-fulfillment-1',
        title: 'プロジェクトの目標達成後、成果を振り返る時間を持つ',
        description: '完了したプロジェクトについて、何が良かったか、何を学んだかを記録する',
        rationale: '達成感を言語化することで、やりがいを再確認できる',
        personal_value: '仕事にやりがいを感じる'
      },
      {
        id: 'pa-fulfillment-2',
        title: '自分の仕事が顧客や社会に与える影響を意識する',
        description: '日々の業務が最終的にどう役立つのかを考え、意義を見出す',
        rationale: '仕事の意味を理解することで、やりがいが深まる',
        personal_value: '仕事にやりがいを感じる'
      }
    ],
    '協調性を大切にする': [
      {
        id: 'pa-collaboration-1',
        title: 'チームメンバーと週1回、進捗共有の時間を設ける',
        description: '短時間でも定期的にコミュニケーションを取り、情報を共有する',
        rationale: 'チーム全体の連携が強化され、協力しやすい環境が作れる',
        personal_value: '協調性を大切にする'
      },
      {
        id: 'pa-collaboration-2',
        title: '困っているメンバーに積極的に声をかける',
        description: '相手の様子を観察し、必要に応じてサポートを申し出る',
        rationale: '助け合いの文化を作ることで、協調性が高まる',
        personal_value: '協調性を大切にする'
      }
    ],
    '人から感謝される': [
      {
        id: 'pa-gratitude-1',
        title: '同僚の依頼に迅速に対応する',
        description: '可能な限り早く返信・対応し、相手の時間を大切にする',
        rationale: '素早い対応は感謝され、信頼関係が築ける',
        personal_value: '人から感謝される'
      },
      {
        id: 'pa-gratitude-2',
        title: '他のメンバーの負担を軽減する行動をとる',
        description: '率先して雑務を引き受けたり、サポートを申し出る',
        rationale: '周囲への配慮が感謝につながる',
        personal_value: '人から感謝される'
      }
    ],
    '人の役に立つ': [
      {
        id: 'pa-helpful-1',
        title: '自分の知識やスキルを共有する勉強会を開催する',
        description: '月1回、チーム内で知見を共有するミニ勉強会を企画する',
        rationale: '他者の成長に貢献でき、役立つ実感が得られる',
        personal_value: '人の役に立つ'
      },
      {
        id: 'pa-helpful-2',
        title: '新人や困っている人にメンターとして関わる',
        description: '質問に答えたり、アドバイスを提供したりする',
        rationale: '直接的なサポートで人の役に立てる',
        personal_value: '人の役に立つ'
      }
    ],
    '人から信頼される': [
      {
        id: 'pa-trust-1',
        title: '約束した期日を必ず守る',
        description: '納期管理を徹底し、できない場合は早めに連絡する',
        rationale: '信頼は約束を守ることから生まれる',
        personal_value: '人から信頼される'
      },
      {
        id: 'pa-trust-2',
        title: '報告・連絡・相談を怠らない',
        description: '重要な情報は適切なタイミングで関係者に共有する',
        rationale: '透明性のあるコミュニケーションが信頼を築く',
        personal_value: '人から信頼される'
      }
    ],
    'ワークライフバランスを保つ': [
      {
        id: 'pa-balance-1',
        title: '定時で帰れるよう、業務を効率化する',
        description: 'タスクの優先順位をつけ、無駄な作業を削減する',
        rationale: '効率化により、プライベートの時間を確保できる',
        personal_value: 'ワークライフバランスを保つ'
      },
      {
        id: 'pa-balance-2',
        title: '休日は仕事のことを考えず、リフレッシュする',
        description: '趣味や家族との時間を大切にし、心身をリセットする',
        rationale: 'オンオフの切り替えが長期的なパフォーマンスにつながる',
        personal_value: 'ワークライフバランスを保つ'
      }
    ],
    '高い成果を出す': [
      {
        id: 'pa-achievement-1',
        title: '目標を数値化し、進捗を定期的に確認する',
        description: '週次で達成度をチェックし、必要に応じて計画を調整する',
        rationale: '明確な目標と進捗管理が高い成果につながる',
        personal_value: '高い成果を出す'
      },
      {
        id: 'pa-achievement-2',
        title: '成果を最大化するための改善策を常に考える',
        description: 'PDCAサイクルを回し、より良い方法を模索する',
        rationale: '継続的改善が成果向上のカギとなる',
        personal_value: '高い成果を出す'
      }
    ],
    '創造的な仕事をする': [
      {
        id: 'pa-creative-1',
        title: '新しいアイデアを提案する機会を積極的に作る',
        description: 'ミーティングで改善案や新企画を提示する',
        rationale: '創造性を発揮する場を持つことで、仕事が刺激的になる',
        personal_value: '創造的な仕事をする'
      },
      {
        id: 'pa-creative-2',
        title: '従来のやり方にとらわれず、新しい方法を試す',
        description: '小さな実験を重ね、イノベーションを起こす',
        rationale: 'チャレンジ精神が創造的な成果を生む',
        personal_value: '創造的な仕事をする'
      }
    ],
    '失敗を恐れずに挑戦する': [
      {
        id: 'pa-challenge-1',
        title: '未経験の業務にも積極的に手を挙げる',
        description: '新しいプロジェクトや役割に挑戦する',
        rationale: '挑戦が成長の機会となる',
        personal_value: '失敗を恐れずに挑戦する'
      },
      {
        id: 'pa-challenge-2',
        title: '失敗から学びを得て、次に活かす',
        description: 'ミスを振り返り、改善点を明確にする',
        rationale: '失敗を成長のステップと捉えることで、恐れが減る',
        personal_value: '失敗を恐れずに挑戦する'
      }
    ]
  };

  const actions: PersonalAction[] = [];

  selectedValues.forEach(value => {
    const templates = actionTemplates[value];
    if (templates) {
      actions.push(...templates);
    }
  });

  return actions;
};
