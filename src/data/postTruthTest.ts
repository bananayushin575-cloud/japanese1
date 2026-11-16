export interface StudyPoint {
  id: string;
  number: string;
  title: string;
  isHighFreq?: boolean;
  summary: string;
  keyPhrase: string;
  examTip: string;
}

export interface VocabItem {
  id: string;
  term: string;
  reading: string;
  meaning: string;
  examNote: string;
}

export interface ContrastRow {
  aspect: string;
  beforeOrIdeal: string;
  nowOrRisk: string;
}

export interface KanjiQuestion {
  id: string;
  number: number;
  type: 'write' | 'read';
  beforeText: string;
  targetText: string;
  afterText: string;
  answers: string[];
  displayAnswer: string;
  points: number;
}

export interface VocabChoice {
  label: string; // ア〜カ
  text: string;
}

export interface VocabQuestion {
  id: string;
  number: number;
  term: string;
  answer: string;
  points: number;
  note: string;
}

export interface ComprehensionBlankQuestion {
  id: string;
  number: number;
  kind: 'blank-pair' | 'blank-single';
  prompt: string;
  passage: string;
  blanks: {
    label: string;
    answers: string[];
    displayAnswer: string;
  }[];
  points: number;
  explanation: string;
}

export interface ComprehensionChoiceQuestion {
  id: string;
  number: number;
  kind: 'choice';
  prompt: string;
  choices: { label: string; text: string }[];
  answer: string;
  points: number;
  explanation: string;
}

export interface ComprehensionTrueFalseQuestion {
  id: string;
  number: number;
  kind: 'true-false';
  statement: string;
  answer: '○' | '×';
  points: number;
  explanation: string;
}

export type ComprehensionQuestion =
  | ComprehensionBlankQuestion
  | ComprehensionChoiceQuestion
  | ComprehensionTrueFalseQuestion;

export interface DescriptiveRubricItem {
  id: string;
  label: string;
  points: number;
}

export interface DescriptiveQuestion {
  id: string;
  number: number;
  prompt: string;
  keywords: string[];
  modelAnswer: string;
  rubric: DescriptiveRubricItem[];
  points: number;
}

export const TEXT_METADATA = {
  textbook: '三省堂『現代の国語』',
  unitTitle: '情報社会を生きる',
  lessonTitle: 'ポスト真実時代のジャーナリズム',
  author: '国谷 裕子',
  totalQuestions: 30,
  totalPoints: 62,
};

export const STUDY_POINTS: StudyPoint[] = [
  {
    id: 'point-1',
    number: '01',
    title: '「ポスト真実」の意味と、筆者が衝撃を受けた理由',
    summary:
      '客観的な事実や真実よりも、感情的な訴えかけのほうが多くの人に影響を与え、世論を動かしてしまう状況を指す。約30年間テレビ報道に携わり「真実を踏まえて人々が判断することが健全な民主主義」と信じてきた筆者にとって、自らの仕事そのものを否定されたような衝撃だった。',
    keyPhrase: '客観的な事実 ＜ 感情的な訴えかけ',
    examTip: '「筆者の経歴（約30年の報道経験）」と「信念（真実に基づく民主主義）」の2点を必ず結びつけて押さえる。',
  },
  {
    id: 'point-2',
    number: '02',
    title: '「確証バイアス」とSNSによる情報空間の分断',
    summary:
      '人が自分の考えやあらかじめ共感できるものを裏付ける情報だけを重視し集める心理傾向（確証バイアス）。SNSの普及によって似た考えの人同士がつながりやすくなり、それぞれが固有の情報空間の中だけで対話することで、異なる考えの人を排除し「情報の分断」が進んでいる。',
    keyPhrase: '固有の情報空間での対話 → 異質なものの排除',
    examTip: '「確証バイアス」の意味説明と、SNSが引き起こす「分断」「排除」の因果関係が記述の頻出テーマ。',
  },
  {
    id: 'point-3',
    number: '03',
    title: '受け手の変化：「楽」から「能動的な選択」へ',
    isHighFreq: true,
    summary:
      'ハルバースタムは「人は偏見や感情に寄り添うほうが“楽”だ」と指摘したが、現代の受け手は受動的に流されるだけでなく、能動的に自分の感情に沿う情報ばかりを選ぶようになり、「情報をメディアから選択するのではなく、一体化できるメディアの選択へ」と変化している。',
    keyPhrase: '情報をメディアから選択 → 一体化できるメディアの選択へ',
    examTip: '空欄補充で超頻出。「一体化できるメディア」のフレーズと、背景にある「経済格差・不公平感の高まり」をセットで記憶する。',
  },
  {
    id: 'point-4',
    number: '04',
    title: '伝え手（メディア）側に起こりうる2つの危険性',
    summary:
      '受け手が事実にこだわらなくなると、メディア側も視聴率や読者獲得のために受け手の感情に迎合し、共感を得やすい情報ばかりを流す恐れがある。さらに、その感情に乗れない人にまで「同調圧力」をかけ、感情の一体化を促してしまう危惧がある。',
    keyPhrase: '受け手への迎合 ＋ 同調圧力による一体化の促進',
    examTip: '「受け手の変化」が「伝え手（メディア）の変質」を引き起こすという連鎖構造を正確に答えられるようにする。',
  },
  {
    id: 'point-5',
    number: '05',
    title: 'これからのジャーナリズムが果たすべき役割（結論）',
    summary:
      '分断や技術革新で先が見えにくい時代だからこそ、個人が自らの状況を俯瞰し、課題解決に向けた社会的合意形成の対話に参加できるようにするため、メディアには「異質なもの」「多様性」を提示し続け、世界をありのままに見つめる助けとなる役割が求められる。',
    keyPhrase: '多様性・異質なものの提示 → 社会的合意形成の対話の場',
    examTip: '結論のキーワードは「俯瞰」「多様性（異質なもの）」「社会的合意形成」。',
  },
];

export const CONTRAST_TABLE: ContrastRow[] = [
  {
    aspect: '世論を動かす基準',
    beforeOrIdeal: '客観的な事実・真実に基づく判断（健全な民主主義）',
    nowOrRisk: '感情的な訴えかけ・個人の信念や共感の優先（ポスト真実）',
  },
  {
    aspect: '受け手の情報行動',
    beforeOrIdeal: '“楽”だから偏見や感情に寄り添う情報に流れる（ハルバースタムの指摘）',
    nowOrRisk: '能動的に自分の感情と「一体化できるメディア」を選択する',
  },
  {
    aspect: 'メディアの姿勢',
    beforeOrIdeal: '偏見を乗り越え、多様性・異質なものを提示して合意形成の場をつくる',
    nowOrRisk: '視聴率のために感情に迎合し、同調圧力で感情の一体化を促す',
  },
];

export const KEY_VOCABULARY: VocabItem[] = [
  {
    id: 'v-1',
    term: '衝撃',
    reading: 'しょうげき',
    meaning: '心に強く打たれて受ける大きなショック。',
    examNote: '「衝」の字形（行の中に重）の書き取りに注意。',
  },
  {
    id: 'v-2',
    term: '確証バイアス',
    reading: 'かくしょうばいあす',
    meaning: '自分がもともと持っている考えや共感できるものを裏付ける情報ばかりを重視し、反する情報を軽視する傾向。',
    examNote: '重要語句の意味問題で最頻出。',
  },
  {
    id: 'v-3',
    term: '排除',
    reading: 'はいじょ',
    meaning: '押しのけて取り除くこと。受け入れず締め出すこと。',
    examNote: '漢字書き取り頻出。',
  },
  {
    id: 'v-4',
    term: '試行錯誤',
    reading: 'しこうさくご',
    meaning: '新しい物事に取り組む際、いろいろ試したり失敗したりを繰り返しながら解決策を探ること。',
    examNote: '四字熟語の読み・意味としてチェック。',
  },
  {
    id: 'v-5',
    term: '媒介',
    reading: 'ばいかい',
    meaning: '二つのものの間に立って、両者を結びつけること（メディアの原義）。',
    examNote: '「介」と「媒」の漢字と意味を確認。',
  },
  {
    id: 'v-6',
    term: '危惧',
    reading: 'きぐ',
    meaning: '悪い事態になるのではないかと危ぶみ恐れること。',
    examNote: '読み「きぐ」および「惧」の漢字に注意。',
  },
  {
    id: 'v-7',
    term: '同調圧力',
    reading: 'どうちょうあつりょく',
    meaning: '少数意見を持つ人に対し、周囲と同じ意見や行動をとるよう暗に強制する空気・力。',
    examNote: '第4問記述や語句選択でよく問われる。',
  },
  {
    id: 'v-8',
    term: '俯瞰',
    reading: 'ふかん',
    meaning: '高い所から見下ろすように、物事の全体像を大きく見渡すこと。',
    examNote: '読み「ふかん」が定番出題。',
  },
  {
    id: 'v-9',
    term: '翻弄',
    reading: 'ほんろう',
    meaning: '思いのままにもてあそび、振り回すこと。',
    examNote: '読み「ほんろう」が頻出。',
  },
  {
    id: 'v-10',
    term: '合意形成',
    reading: 'ごういけいせい',
    meaning: '異なる意見を持つ人々が対話を重ね、納得できる共通の結論をつくり上げること。',
    examNote: '最終段落の筆者の主張に直結するキーワード。',
  },
];

export const KANJI_QUESTIONS: KanjiQuestion[] = [
  {
    id: 'k-1',
    number: 1,
    type: 'write',
    beforeText: 'これまでの仕事が否定されたような',
    targetText: 'ショウゲキ',
    afterText: 'を受ける。',
    answers: ['衝撃'],
    displayAnswer: '衝撃',
    points: 1,
  },
  {
    id: 'k-2',
    number: 2,
    type: 'write',
    beforeText: '自分と異なる考えの人を',
    targetText: 'ハイジョ',
    afterText: 'しようとする。',
    answers: ['排除'],
    displayAnswer: '排除',
    points: 1,
  },
  {
    id: 'k-3',
    number: 3,
    type: 'write',
    beforeText: '多角的な情報を',
    targetText: 'テイキョウ',
    afterText: 'する。',
    answers: ['提供'],
    displayAnswer: '提供',
    points: 1,
  },
  {
    id: 'k-4',
    number: 4,
    type: 'write',
    beforeText: '事実を軽視する時代の',
    targetText: 'フウチョウ',
    afterText: 'に危機感を抱く。',
    answers: ['風潮'],
    displayAnswer: '風潮',
    points: 1,
  },
  {
    id: 'k-5',
    number: 5,
    type: 'write',
    beforeText: '',
    targetText: 'ノウドウ',
    afterText: '的に自分の好む情報だけを選ぶ。',
    answers: ['能動'],
    displayAnswer: '能動',
    points: 1,
  },
  {
    id: 'k-6',
    number: 6,
    type: 'write',
    beforeText: '真実を踏まえて判断するのが',
    targetText: 'ケンゼン',
    afterText: 'な民主主義である。',
    answers: ['健全'],
    displayAnswer: '健全',
    points: 1,
  },
  {
    id: 'k-7',
    number: 7,
    type: 'read',
    beforeText: '人は',
    targetText: '偏見',
    afterText: 'や感情に訴える情報に流れやすい。',
    answers: ['へんけん'],
    displayAnswer: 'へんけん',
    points: 1,
  },
  {
    id: 'k-8',
    number: 8,
    type: 'read',
    beforeText: 'メディアの変質に強い',
    targetText: '危惧',
    afterText: 'を抱いている。',
    answers: ['きぐ'],
    displayAnswer: 'きぐ',
    points: 1,
  },
  {
    id: 'k-9',
    number: 9,
    type: 'read',
    beforeText: '感情的な言葉に',
    targetText: '翻弄',
    afterText: 'されてはならない。',
    answers: ['ほんろう'],
    displayAnswer: 'ほんろう',
    points: 1,
  },
  {
    id: 'k-10',
    number: 10,
    type: 'read',
    beforeText: '自分の置かれた状況を',
    targetText: '俯瞰',
    afterText: 'して見る必要がある。',
    answers: ['ふかん'],
    displayAnswer: 'ふかん',
    points: 1,
  },
];

export const VOCAB_CHOICES: VocabChoice[] = [
  { label: 'ア', text: '前もって抱いている固定的な見方や考えのこと。' },
  { label: 'イ', text: '物事をいくつかの方面・視点にわたって見ること。' },
  { label: 'ウ', text: '納得がいかない、合点がいかないこと。' },
  { label: 'エ', text: '自分がもともと持っている考えや共感できるものを裏付ける情報だけを重視する傾向。' },
  { label: 'オ', text: '少数意見を持つ人に対し、周囲と同じ意見・行動をとるよう暗に強制する空気のこと。' },
  { label: 'カ', text: '十分に論議・話し合いを尽くすこと。' },
];

export const VOCAB_QUESTIONS: VocabQuestion[] = [
  {
    id: 'v-q1',
    number: 1,
    term: '確証バイアス',
    answer: 'エ',
    points: 2,
    note: '自分の先入観に都合のよい情報ばかり集めてしまう心理傾向。',
  },
  {
    id: 'v-q2',
    number: 2,
    term: '同調圧力',
    answer: 'オ',
    points: 2,
    note: '周囲と異なる意見を持ちにくくする暗黙の強制力。',
  },
  {
    id: 'v-q3',
    number: 3,
    term: '先入観',
    answer: 'ア',
    points: 2,
    note: '事前に固まってしまった偏った見方・考え方。',
  },
  {
    id: 'v-q4',
    number: 4,
    term: '多角的',
    answer: 'イ',
    points: 2,
    note: '一つの視点にとらわれず、複数の角度から捉えること。',
  },
  {
    id: 'v-q5',
    number: 5,
    term: '熟議',
    answer: 'カ',
    points: 2,
    note: '熟慮して十分に議論を交わすこと。',
  },
  {
    id: 'v-q6',
    number: 6,
    term: '腑に落ちない',
    answer: 'ウ',
    points: 2,
    note: '心から納得できない、しっくりこない状態。',
  },
];

export const COMPREHENSION_QUESTIONS: ComprehensionQuestion[] = [
  {
    id: 'c-1',
    number: 1,
    kind: 'blank-pair',
    prompt: '次の文の空欄（ A ）・（ B ）に入る最も適切な言葉を漢字2字で答えなさい。',
    passage:
      '「ポスト真実」とは、客観的な（　A　）や真実よりも、（　B　）的な訴えかけのほうが多くの人に影響を与え、世論形成に大きなインパクトを与える状況のことである。',
    blanks: [
      { label: 'A', answers: ['事実'], displayAnswer: '事実' },
      { label: 'B', answers: ['感情'], displayAnswer: '感情' },
    ],
    points: 2,
    explanation: '「客観的な事実・真実 ＜ 感情的な訴えかけ」という対比がポスト真実の定義です。',
  },
  {
    id: 'c-2',
    number: 2,
    kind: 'blank-single',
    prompt: '本文中における「情報の受け手」の選び方の変化について、空欄（ C ）に共通して入る適切な語句（カタカナ4字）を答えなさい。',
    passage: '「情報を（　C　）から選択するのではなく、一体化できる（　C　）の選択へ」',
    blanks: [{ label: 'C', answers: ['メディア'], displayAnswer: 'メディア' }],
    points: 2,
    explanation: '現代の受け手は自分の感情と「一体化できるメディア」を能動的に選ぶようになっています。',
  },
  {
    id: 'c-3',
    number: 3,
    kind: 'choice',
    prompt: 'デビッド・ハルバースタムが来日時に語った内容として、誤っているものを1つ選びなさい。',
    choices: [
      { label: 'ア', text: 'テレビは視聴者が偏見や感情に訴える情報に寄り添う手助けをすべきだ。' },
      { label: 'イ', text: '人が偏見や感情に訴える情報に寄り添うのは、そのほうが“楽”だからだ。' },
      { label: 'ウ', text: 'ジャーナリズムは偏見を乗り越え、世界をありのままに見る手助けをしなければならない。' },
      { label: 'エ', text: '現実を見据える努力をしない受け手に迎合してはならない。' },
    ],
    answer: 'ア',
    points: 2,
    explanation: 'テレビやジャーナリズムは偏見に寄り添うのではなく、偏見を乗り越える手助けをすべきだと語っています。',
  },
  {
    id: 'c-4',
    number: 4,
    kind: 'choice',
    prompt: '現代の情報空間の分断が進む背景にある「社会状況」として、筆者が挙げている組み合わせを選びなさい。',
    choices: [
      { label: 'ア', text: '少子高齢化の加速と、世代間の価値観の対立' },
      { label: 'イ', text: '経済格差の広がりと、それによる不公平感の高まり' },
      { label: 'ウ', text: 'テレビ視聴率の低下と、新聞購読者の減少' },
      { label: 'エ', text: '国際紛争の増加と、治安の悪化' },
    ],
    answer: 'イ',
    points: 2,
    explanation: '経済格差の広がりと不公平感の高まりが、社会の分断と情報空間の分断を連動させています。',
  },
  {
    id: 'c-5',
    number: 5,
    kind: 'true-false',
    statement: 'SNSなどで同じ考えの人とばかりつながっていると、異なる考え方を知る機会が減り、情報の分断が進みやすい。',
    answer: '○',
    points: 2,
    explanation: '本文の指摘通りです。確証バイアスにより同じ情報空間内に閉じこもりやすくなります。',
  },
  {
    id: 'c-6',
    number: 6,
    kind: 'true-false',
    statement: '受け手が真実にこだわらなくなると、メディア側も視聴率などのために、受け手の共感を得やすい情報ばかりを流す恐れがある。',
    answer: '○',
    points: 2,
    explanation: '本文の指摘通りです。受け手の変化が伝え手（メディア）の迎合を招きます。',
  },
  {
    id: 'c-7',
    number: 7,
    kind: 'true-false',
    statement: '筆者は、現代の受け手が感情に沿う情報を選ぶのは「楽だから」という理由だけであり、能動的な意思はないと述べている。',
    answer: '×',
    points: 2,
    explanation: '「楽」であるだけでなく、現代の受け手は「より積極的・能動的」に自分の感情に沿う情報だけを選ぶようになったと述べています。',
  },
  {
    id: 'c-8',
    number: 8,
    kind: 'true-false',
    statement: 'メディアには「多くの人が見たいと思う情報だけ」ではなく、「異質なもの」や「多様性」を提示する役割がある。',
    answer: '○',
    points: 2,
    explanation: '筆者が結論で強調するジャーナリズムの本質的な役割です。',
  },
];

export const DESCRIPTIVE_QUESTIONS: DescriptiveQuestion[] = [
  {
    id: 'd-1',
    number: 1,
    prompt:
      '筆者は「ポスト真実」という言葉を知ったとき、なぜ「青臭い」と思いつつも強い衝撃を受けたのか。筆者の経歴と信念にふれて説明しなさい。',
    keywords: ['約30年', '報道', '真実', '民主主義', '否定'],
    modelAnswer:
      '約30年間テレビの報道番組に関わり、真実を踏まえて人々が判断することが健全な民主主義だと考えてきたため、これまでの自分の仕事そのものを否定されたように思えたから。',
    rubric: [
      { id: 'd1-r1', label: '長年（約30年間）報道番組に関わってきたことに触れている', points: 1 },
      { id: 'd1-r2', label: '真実を踏まえた判断が健全な民主主義だと信じていたことを書いている', points: 2 },
      { id: 'd1-r3', label: 'これまでの仕事そのものが否定されたように感じたことを書いている', points: 1 },
    ],
    points: 4,
  },
  {
    id: 'd-2',
    number: 2,
    prompt:
      '人々が自分の考えと同じ情報ばかりに接するようになると、社会にどのような問題が起きると筆者は述べているか。「情報空間」「排除」の2語を使って説明しなさい。',
    keywords: ['情報空間', '排除'],
    modelAnswer:
      '人々がそれぞれ固有の情報空間の中だけで対話するようになるため、情報空間の分断が進み、自分と異なる考えを持つ人々を排除しようとする動きにつながりやすくなる。',
    rubric: [
      { id: 'd2-r1', label: '「固有の情報空間」の中だけで対話し、分断が進むことを書いている', points: 2 },
      { id: 'd2-r2', label: '異なる考えを持つ人々を「排除」する動きにつながると書いている', points: 2 },
    ],
    points: 4,
  },
  {
    id: 'd-3',
    number: 3,
    prompt:
      '筆者が引用したハルバースタムの言葉にある「“楽”」とは、具体的にどういうことを指しているか。わかりやすく説明しなさい。',
    keywords: ['確かめ', '努力', '偏見', '感情'],
    modelAnswer:
      '自分の頭で考えたり、事実を確かめたりする努力をせず、もともとの自分の感情や偏見に寄り添う情報を受け入れていれば済むという気楽さのこと。',
    rubric: [
      { id: 'd3-r1', label: '自分で考えたり事実を確かめたりする努力をしないことを書いている', points: 2 },
      { id: 'd3-r2', label: '自分の感情や偏見に寄り添う情報だけを受け入れて済む気楽さを書いている', points: 2 },
    ],
    points: 4,
  },
  {
    id: 'd-4',
    number: 4,
    prompt:
      '「一体化できるメディアの選択」が進むと、受け手はどのような機会を失うことになるか。簡潔に答えなさい。',
    keywords: ['異なる視点', '異質なもの'],
    modelAnswer: '自分とは異なる視点や考え方、異質なものに触れる機会。',
    rubric: [
      { id: 'd4-r1', label: '自分とは異なる視点や考え方に触れる機会を失うと書いている', points: 2 },
      { id: 'd4-r2', label: '「異質なもの」に触れる機会が失われる意味を簡潔にまとめている', points: 2 },
    ],
    points: 4,
  },
  {
    id: 'd-5',
    number: 5,
    prompt:
      '受け手自身が真実や事実にこだわることを放棄したとき、メディア（伝え手）側に起こりうる危険性を2点挙げて説明しなさい。',
    keywords: ['迎合', '共感', '同調圧力', '一体化'],
    modelAnswer:
      '①受け手の感情に寄り添い、共感を得やすい情報ばかりを積極的に流すようになること。②その感情に乗れない人に対しても同調圧力をかけ、感情の一体化を促してしまう恐れがあること。',
    rubric: [
      { id: 'd5-r1', label: '① 受け手の感情に迎合し、共感を得やすい情報ばかりを流す点', points: 2 },
      { id: 'd5-r2', label: '② 感情に乗れない人に同調圧力をかけ、感情の一体化を促す点', points: 2 },
    ],
    points: 4,
  },
  {
    id: 'd-6',
    number: 6,
    prompt:
      '筆者は結論として、これからのメディアやジャーナリズムは何を提示し、社会の中でどのような場として機能すべきだと主張しているか。「多様性」「合意形成」の2語を使って説明しなさい。',
    keywords: ['多様性', '合意形成'],
    modelAnswer:
      '人々が自分の状況を俯瞰できるように、「異質なもの」や「多様性」を提示し続け、課題解決に向けた社会的合意形成のための対話の場として機能すべきだということ。',
    rubric: [
      { id: 'd6-r1', label: '状況を俯瞰できるよう「異質なもの」「多様性」を提示し続ける点', points: 2 },
      { id: 'd6-r2', label: '課題解決に向けた社会的「合意形成」の対話の場として機能する点', points: 2 },
    ],
    points: 4,
  },
];
