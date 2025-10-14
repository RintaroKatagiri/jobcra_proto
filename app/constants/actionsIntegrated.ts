export interface IntegratedAction {
  id: string;
  title: string;
  description: string;
  rationale: string;
  company_value: string;
  personal_value: string;
  company_weight: number;
  personal_weight: number;
}

// CSVファイルから取得したアクションデータ
const CSV_ACTIONS: IntegratedAction[] = [
  {
    id: "csv-1",
    title: "誠実な現場対応で、トラブルを即時に可視化・対処する",
    description: "約束を守り、隠さず共有。期待を超える初動対応で信頼を得る",
    rationale: "誠実な対応が人から感謝される行動につながる",
    company_value: "誠実",
    personal_value: "人から感謝される",
    company_weight: 80,
    personal_weight: 20,
  },
  {
    id: "csv-2",
    title: "協働で「1ライン1改善／週」を継続する",
    description: "全員がアイデアを出し合い、楽しく小さく早く改善",
    rationale: "協働の実践を通じて仲間と楽しく仕事をする環境を作る",
    company_value: "協働",
    personal_value: "仲間と楽しく仕事をする",
    company_weight: 60,
    personal_weight: 40,
  },
  {
    id: "csv-3",
    title: 'SPCと不良マップで"勘"を脱却する',
    description: "データで傾向把握し、重点箇所に先手を打つ",
    rationale: "データ活用の専門性を高めることで価値を提供する",
    company_value: "データ活用",
    personal_value: "高い専門性を持つ",
    company_weight: 55,
    personal_weight: 45,
  },
  {
    id: "csv-4",
    title: "試作・治具の小規模実験（Do）を毎月実行",
    description: "改善は創造。小さく試し、早く学ぶ",
    rationale: "改善の実践を通じて創造的な仕事に取り組む",
    company_value: "改善",
    personal_value: "創造的な仕事をする",
    company_weight: 50,
    personal_weight: 50,
  },
  {
    id: "csv-5",
    title: '後輩の標準作業定着を"現場コーチング"で支援',
    description: "責めずに支え、できるまで伴走",
    rationale: "責任を持って後輩を支援し、慕われる関係を築く",
    company_value: "責任",
    personal_value: "後輩・部下から慕われ好かれる",
    company_weight: 70,
    personal_weight: 30,
  },
  {
    id: "csv-6",
    title: '他部署と"工程横断のボトルネック潰し"を実施',
    description: "品質×生産×購買が一体でネック解消",
    rationale: "協働を通じて創造的な課題解決に取り組む",
    company_value: "協働",
    personal_value: "創造的な仕事をする",
    company_weight: 40,
    personal_weight: 60,
  },
  {
    id: "csv-7",
    title: "顧客の声（VOC）を週次で取り込み、是正→予防へ",
    description: "感謝される改善を回す仕組み化",
    rationale: "顧客志向の実践が人から感謝される結果につながる",
    company_value: "顧客志向",
    personal_value: "人から感謝される",
    company_weight: 70,
    personal_weight: 30,
  },
];

const actionCombinations: Record<string, Record<string, IntegratedAction[]>> = {
  顧客志向: {
    "自分が成長・発達する": [
      {
        id: "ia-customer-growth-1",
        title: "顧客の声を学びの機会として、週1回フィードバックを分析する",
        description:
          "顧客からのフィードバックを収集し、自己成長のヒントとして活用する",
        rationale: "顧客志向を実践しながら、顧客の期待から学び成長できる",
        company_value: "顧客志向",
        personal_value: "自分が成長・発達する",
        company_weight: 80,
        personal_weight: 20,
      },
      {
        id: "ia-customer-growth-2",
        title: "顧客の業界トレンドを学び、提案の質を高める",
        description:
          "顧客の業界について深く学び、より価値ある提案ができるよう成長する",
        rationale: "顧客理解を深めながら、専門性を高め自己成長につなげる",
        company_value: "顧客志向",
        personal_value: "自分が成長・発達する",
        company_weight: 30,
        personal_weight: 70,
      },
    ],
    協調性を大切にする: [
      {
        id: "ia-customer-collaboration-1",
        title: "チームと協力しながら、顧客の課題を発見する",
        description: "チームメンバーと情報共有し、協力して顧客ニーズを把握する",
        rationale: "顧客志向を実践しながら、チーム協力で課題発見の精度を高める",
        company_value: "顧客志向",
        personal_value: "協調性を大切にする",
        company_weight: 80,
        personal_weight: 20,
      },
      {
        id: "ia-customer-collaboration-2",
        title: "チームと顧客情報をオープンに共有し、協力して顧客満足度を高める",
        description:
          "チーム全体で顧客情報を共有し、全員で顧客対応の質を向上させる",
        rationale: "チームワークを重視しながら、顧客志向の実践につなげる",
        company_value: "顧客志向",
        personal_value: "協調性を大切にする",
        company_weight: 30,
        personal_weight: 70,
      },
    ],
    人の役に立つ: [
      {
        id: "ia-customer-helpful-1",
        title: "顧客の課題解決に全力を尽くし、価値を提供する",
        description:
          "顧客の本質的な課題を理解し、最適なソリューションを提案する",
        rationale: "顧客志向の実践が、人の役に立つ実感につながる",
        company_value: "顧客志向",
        personal_value: "人の役に立つ",
        company_weight: 80,
        personal_weight: 20,
      },
      {
        id: "ia-customer-helpful-2",
        title: "顧客に寄り添い、役立つ情報やサポートを積極的に提供する",
        description: "顧客が困っていることを察知し、先回りして支援する",
        rationale: "人の役に立ちたい気持ちを顧客志向の実践で具現化する",
        company_value: "顧客志向",
        personal_value: "人の役に立つ",
        company_weight: 30,
        personal_weight: 70,
      },
    ],
  },
  協働: {
    協調性を大切にする: [
      {
        id: "ia-teamwork-collaboration-1",
        title: "チームメンバーと協力し、共通目標の達成を目指す",
        description:
          "定期的な情報共有とサポートを通じて、チーム全体の成果を最大化する",
        rationale: "協働の価値観と協調性を組み合わせ、強いチームを作る",
        company_value: "協働",
        personal_value: "協調性を大切にする",
        company_weight: 80,
        personal_weight: 20,
      },
      {
        id: "ia-teamwork-collaboration-2",
        title: "メンバーと楽しく協力しながら、チームの連携を強化する",
        description: "オープンなコミュニケーションで、協力しやすい環境を作る",
        rationale: "協調性を大切にしながら、協働の文化を育てる",
        company_value: "協働",
        personal_value: "協調性を大切にする",
        company_weight: 30,
        personal_weight: 70,
      },
    ],
    人の役に立つ: [
      {
        id: "ia-teamwork-helpful-1",
        title: "チーム全体の成功のために、自分のスキルを共有する",
        description: "知識や経験を積極的にシェアし、チームの能力向上に貢献する",
        rationale: "協働の実践が、人の役に立つ機会を生み出す",
        company_value: "協働",
        personal_value: "人の役に立つ",
        company_weight: 80,
        personal_weight: 20,
      },
      {
        id: "ia-teamwork-helpful-2",
        title: "困っているメンバーを支援し、チームで協力して課題を解決する",
        description: "メンバーの負担を察知し、積極的にサポートを申し出る",
        rationale: "人の役に立ちたい気持ちを協働の実践で発揮する",
        company_value: "協働",
        personal_value: "人の役に立つ",
        company_weight: 30,
        personal_weight: 70,
      },
    ],
    人から信頼される: [
      {
        id: "ia-teamwork-trust-1",
        title: "チームとの約束を守り、協働の基盤となる信頼を築く",
        description: "期日やコミットメントを確実に守り、チームの信頼を獲得する",
        rationale: "協働の実践を通じて、信頼関係を構築する",
        company_value: "協働",
        personal_value: "人から信頼される",
        company_weight: 80,
        personal_weight: 20,
      },
      {
        id: "ia-teamwork-trust-2",
        title:
          "信頼を大切にしながら、チームと透明性の高いコミュニケーションをとる",
        description: "情報をオープンに共有し、信頼される協働関係を作る",
        rationale: "信頼を重視しながら、協働の文化を育てる",
        company_value: "協働",
        personal_value: "人から信頼される",
        company_weight: 30,
        personal_weight: 70,
      },
    ],
  },
  誠実: {
    人から信頼される: [
      {
        id: "ia-integrity-trust-1",
        title: "誠実に対応し、顧客や同僚からの信頼を獲得する",
        description: "約束を守り、透明性の高いコミュニケーションを心がける",
        rationale: "誠実さの実践が、信頼される人材になる基盤となる",
        company_value: "誠実",
        personal_value: "人から信頼される",
        company_weight: 80,
        personal_weight: 20,
      },
      {
        id: "ia-integrity-trust-2",
        title: "信頼を大切にし、誠実に情報を共有する",
        description: "正確な情報を適切なタイミングで伝え、信頼関係を構築する",
        rationale: "信頼を重視しながら、誠実さを実践する",
        company_value: "誠実",
        personal_value: "人から信頼される",
        company_weight: 30,
        personal_weight: 70,
      },
    ],
    協調性を大切にする: [
      {
        id: "ia-integrity-collaboration-1",
        title: "チームに対して誠実に向き合い、協力関係を築く",
        description: "チームメンバーとの約束を守り、協力しやすい関係を作る",
        rationale: "誠実さを基盤に、協調性の高いチームを形成する",
        company_value: "誠実",
        personal_value: "協調性を大切にする",
        company_weight: 80,
        personal_weight: 20,
      },
      {
        id: "ia-integrity-collaboration-2",
        title: "チームと協力しながら、誠実に課題に向き合う",
        description: "問題を隠さず、チーム全体で解決に取り組む姿勢を持つ",
        rationale: "協調性を大切にしながら、誠実さを発揮する",
        company_value: "誠実",
        personal_value: "協調性を大切にする",
        company_weight: 30,
        personal_weight: 70,
      },
    ],
    人から感謝される: [
      {
        id: "ia-integrity-gratitude-1",
        title: "誠実な対応を心がけ、顧客や同僚から感謝される",
        description: "約束を守り、期待を超える対応で信頼と感謝を得る",
        rationale: "誠実さの実践が、感謝される行動につながる",
        company_value: "誠実",
        personal_value: "人から感謝される",
        company_weight: 80,
        personal_weight: 20,
      },
      {
        id: "ia-integrity-gratitude-2",
        title: "感謝される行動を通じて、誠実さを示す",
        description: "相手の期待に誠実に応え、感謝される関係を築く",
        rationale: "感謝を重視しながら、誠実さを実践する",
        company_value: "誠実",
        personal_value: "人から感謝される",
        company_weight: 30,
        personal_weight: 70,
      },
    ],
  },
  データ活用: {
    高い成果を出す: [
      {
        id: "ia-data-achievement-1",
        title: "データを活用して目標を数値化し、高い成果を目指す",
        description: "データ分析で現状を把握し、効果的な施策で成果を最大化する",
        rationale: "データ活用の実践が、成果向上の鍵となる",
        company_value: "データ活用",
        personal_value: "高い成果を出す",
        company_weight: 80,
        personal_weight: 20,
      },
      {
        id: "ia-data-achievement-2",
        title: "成果を最大化するため、データに基づいて戦略を立てる",
        description: "高い成果を目指し、データ分析で最適な方法を見つける",
        rationale: "成果を重視しながら、データ活用を実践する",
        company_value: "データ活用",
        personal_value: "高い成果を出す",
        company_weight: 30,
        personal_weight: 70,
      },
    ],
    "自分が成長・発達する": [
      {
        id: "ia-data-growth-1",
        title: "データ分析スキルを高め、専門性を向上させる",
        description: "継続的にデータ活用の知識を学び、成長につなげる",
        rationale: "データ活用の実践が、スキル向上と成長を促進する",
        company_value: "データ活用",
        personal_value: "自分が成長・発達する",
        company_weight: 80,
        personal_weight: 20,
      },
      {
        id: "ia-data-growth-2",
        title: "成長のためにデータを活用し、自己改善を続ける",
        description: "自分のパフォーマンスをデータで可視化し、成長につなげる",
        rationale: "成長を重視しながら、データ活用を実践する",
        company_value: "データ活用",
        personal_value: "自分が成長・発達する",
        company_weight: 30,
        personal_weight: 70,
      },
    ],
    創造的な仕事をする: [
      {
        id: "ia-data-creative-1",
        title: "データから新しい洞察を見出し、創造的な提案をする",
        description: "データ分析で発見した傾向から、革新的なアイデアを生み出す",
        rationale: "データ活用が、創造的な発想の源泉となる",
        company_value: "データ活用",
        personal_value: "創造的な仕事をする",
        company_weight: 80,
        personal_weight: 20,
      },
      {
        id: "ia-data-creative-2",
        title: "創造的なアイデアをデータで検証し、実現可能性を高める",
        description: "新しい発想をデータで裏付け、説得力のある提案にする",
        rationale: "創造性を重視しながら、データ活用で実現性を高める",
        company_value: "データ活用",
        personal_value: "創造的な仕事をする",
        company_weight: 30,
        personal_weight: 70,
      },
    ],
  },
  改善: {
    "自分が成長・発達する": [
      {
        id: "ia-improvement-growth-1",
        title: "継続的に改善を重ね、自己成長につなげる",
        description: "PDCAサイクルを回し、業務プロセスと自分自身を改善する",
        rationale: "改善の実践が、スキル向上と成長を促進する",
        company_value: "改善",
        personal_value: "自分が成長・発達する",
        company_weight: 80,
        personal_weight: 20,
      },
      {
        id: "ia-improvement-growth-2",
        title: "成長のため、日々の業務を振り返り改善する",
        description: "自己成長を目指し、小さな改善を積み重ねる",
        rationale: "成長を重視しながら、改善の習慣を身につける",
        company_value: "改善",
        personal_value: "自分が成長・発達する",
        company_weight: 30,
        personal_weight: 70,
      },
    ],
    失敗を恐れずに挑戦する: [
      {
        id: "ia-improvement-challenge-1",
        title: "改善のため、新しい方法に挑戦し続ける",
        description: "失敗を恐れず、より良い方法を模索し改善につなげる",
        rationale: "改善の実践には、挑戦と実験が不可欠",
        company_value: "改善",
        personal_value: "失敗を恐れずに挑戦する",
        company_weight: 80,
        personal_weight: 20,
      },
      {
        id: "ia-improvement-challenge-2",
        title: "挑戦から学び、継続的に改善する",
        description: "新しいことに挑戦し、失敗を改善のチャンスとして活かす",
        rationale: "挑戦を重視しながら、改善の文化を育てる",
        company_value: "改善",
        personal_value: "失敗を恐れずに挑戦する",
        company_weight: 30,
        personal_weight: 70,
      },
    ],
    高い成果を出す: [
      {
        id: "ia-improvement-achievement-1",
        title: "継続的な改善で、高い成果を実現する",
        description: "小さな改善を積み重ね、成果を最大化する",
        rationale: "改善の積み重ねが、高い成果につながる",
        company_value: "改善",
        personal_value: "高い成果を出す",
        company_weight: 80,
        personal_weight: 20,
      },
      {
        id: "ia-improvement-achievement-2",
        title: "成果を最大化するため、プロセスを継続的に改善する",
        description: "高い成果を目指し、効率と品質を向上させる",
        rationale: "成果を重視しながら、改善を実践する",
        company_value: "改善",
        personal_value: "高い成果を出す",
        company_weight: 30,
        personal_weight: 70,
      },
    ],
  },
  責任: {
    人から信頼される: [
      {
        id: "ia-responsibility-trust-1",
        title: "責任を持って業務を遂行し、信頼を獲得する",
        description: "約束した仕事を確実に完遂し、信頼される人材となる",
        rationale: "責任感の実践が、信頼構築の基盤となる",
        company_value: "責任",
        personal_value: "人から信頼される",
        company_weight: 80,
        personal_weight: 20,
      },
      {
        id: "ia-responsibility-trust-2",
        title: "信頼を大切にし、責任を持って対応する",
        description: "信頼される行動を通じて、責任感を示す",
        rationale: "信頼を重視しながら、責任を果たす",
        company_value: "責任",
        personal_value: "人から信頼される",
        company_weight: 30,
        personal_weight: 70,
      },
    ],
    高い成果を出す: [
      {
        id: "ia-responsibility-achievement-1",
        title: "責任を持って目標を達成し、高い成果を出す",
        description: "最後まで責任を持って取り組み、確実に成果を上げる",
        rationale: "責任感が、高い成果実現の原動力となる",
        company_value: "責任",
        personal_value: "高い成果を出す",
        company_weight: 80,
        personal_weight: 20,
      },
      {
        id: "ia-responsibility-achievement-2",
        title: "成果にこだわり、責任を持って業務を完遂する",
        description: "高い成果を目指し、自分の役割に責任を持つ",
        rationale: "成果を重視しながら、責任を果たす",
        company_value: "責任",
        personal_value: "高い成果を出す",
        company_weight: 30,
        personal_weight: 70,
      },
    ],
    人の役に立つ: [
      {
        id: "ia-responsibility-helpful-1",
        title: "責任を持って人をサポートし、役に立つ",
        description: "自分の役割に責任を持ち、他者の成功に貢献する",
        rationale: "責任感を持って、人の役に立つ行動をとる",
        company_value: "責任",
        personal_value: "人の役に立つ",
        company_weight: 80,
        personal_weight: 20,
      },
      {
        id: "ia-responsibility-helpful-2",
        title: "人の役に立つことを責任として、積極的に行動する",
        description: "他者のサポートを自分の責任と捉え、実践する",
        rationale: "人の役に立つことを重視しながら、責任を果たす",
        company_value: "責任",
        personal_value: "人の役に立つ",
        company_weight: 30,
        personal_weight: 70,
      },
    ],
  },
};

export const generateIntegratedActions = (
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
  const actions: IntegratedAction[] = [];

  // まずCSVアクションから関連するものを優先的に追加
  const relevantCsvActions = CSV_ACTIONS.filter(
    (action) =>
      personalValues.includes(action.personal_value) &&
      companyValues.includes(action.company_value)
  );
  actions.push(...relevantCsvActions);

  // 次に既存の組み合わせからアクションを収集（CSVアクションと重複しないもの）
  companyValues.forEach((companyValue) => {
    personalValues.forEach((personalValue) => {
      const combinations = actionCombinations[companyValue]?.[personalValue];
      if (combinations) {
        // CSVアクションと重複しない既存アクションを追加
        const nonDuplicateActions = combinations.filter(
          (action) =>
            !actions.some(
              (existing) =>
                existing.company_value === action.company_value &&
                existing.personal_value === action.personal_value
            )
        );
        actions.push(...nonDuplicateActions);
      }
    });
  });

  // 7つに満たない場合は、残りのCSVアクションを追加
  if (actions.length < 7) {
    const remainingCsvActions = CSV_ACTIONS.filter(
      (csvAction) => !actions.some((existing) => existing.id === csvAction.id)
    );
    const needed = Math.min(7 - actions.length, remainingCsvActions.length);
    actions.push(...remainingCsvActions.slice(0, needed));
  }

  // まだ7つに満たない場合は、追加のアクションを生成
  if (actions.length < 7) {
    const additionalActions: IntegratedAction[] = [];

    // より多くの組み合わせを試すため、全ての企業理念と個人価値観の組み合わせを探索
    const allPersonalValues = [
      "自分が成長・発達する",
      "協調性を大切にする",
      "人の役に立つ",
      "人から信頼される",
      "人から感謝される",
      "高い成果を出す",
      "創造的な仕事をする",
      "失敗を恐れずに挑戦する",
      "仕事にやりがいを感じる",
      "ワークライフバランスを保つ",
    ];

    // 不足分を補うための追加アクション
    for (const companyValue of companyValues) {
      for (const personalValue of allPersonalValues) {
        if (additionalActions.length >= 7 - actions.length) break;

        const combinations = actionCombinations[companyValue]?.[personalValue];
        if (
          combinations &&
          !actions.some(
            (action) =>
              action.company_value === companyValue &&
              action.personal_value === personalValue
          )
        ) {
          // まだ追加されていない組み合わせのアクションを追加
          additionalActions.push(combinations[0]); // 最初のアクションを選択
        }
      }
      if (additionalActions.length >= 7 - actions.length) break;
    }

    actions.push(...additionalActions);
  }

  // それでも7つに満たない場合は、汎用的なアクションを追加
  if (actions.length < 7) {
    const fallbackActions: IntegratedAction[] = [
      {
        id: "ia-general-1",
        title: "日々の業務で企業理念を意識した行動を心がける",
        description: "企業の価値観と個人の価値観を両立させながら業務に取り組む",
        rationale:
          "企業理念と個人価値観の統合により、より意義のある仕事ができる",
        company_value: companyValues[0] || "顧客志向",
        personal_value: personalValues[0] || "自分が成長・発達する",
        company_weight: 60,
        personal_weight: 40,
      },
      {
        id: "ia-general-2",
        title: "チームと連携しながら個人の強みを活かす",
        description: "協力関係を大切にしながら、自分らしさを発揮する",
        rationale: "チームワークと個性の両立で、より良い成果を生み出す",
        company_value: "協働",
        personal_value: personalValues[1] || "協調性を大切にする",
        company_weight: 50,
        personal_weight: 50,
      },
      {
        id: "ia-general-3",
        title: "継続的な改善を通じて成長と成果の両立を図る",
        description:
          "PDCAサイクルを活用し、個人の成長と組織の成果を同時に追求する",
        rationale: "改善の実践により、個人と組織の両方に価値を提供する",
        company_value: "改善",
        personal_value: personalValues[2] || "高い成果を出す",
        company_weight: 70,
        personal_weight: 30,
      },
    ];

    const needed = 7 - actions.length;
    actions.push(...fallbackActions.slice(0, needed));
  }

  // 重複を除去し、最終的に7つまでに制限
  const uniqueActions = actions.filter(
    (action, index, self) => index === self.findIndex((a) => a.id === action.id)
  );

  return uniqueActions.slice(0, 7);
};
