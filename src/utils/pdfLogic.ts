import {
  COMPREHENSION_QUESTIONS,
  DESCRIPTIVE_QUESTIONS,
  KANJI_QUESTIONS,
  VOCAB_QUESTIONS,
} from '../data/postTruthTest';

export type AnswerLayoutMode = 'inline' | 'separate' | 'both';
export type DescriptiveSpaceMode = 'compact' | 'generous';

export interface PdfSectionsConfig {
  kanji: boolean;
  vocabulary: boolean;
  comprehension: boolean;
  descriptive: boolean;
}

export interface PdfConfig {
  includeSummaryPage: boolean;
  includeTestPages: boolean;
  answerLayout: AnswerLayoutMode;
  includeAnswerKey: boolean;
  sections: PdfSectionsConfig;
  customTitle: string;
  subtitle: string;
  showNameField: boolean;
  descriptiveSpace: DescriptiveSpaceMode;
}

export const DEFAULT_PDF_CONFIG: PdfConfig = {
  includeSummaryPage: true,
  includeTestPages: true,
  answerLayout: 'both',
  includeAnswerKey: true,
  sections: {
    kanji: true,
    vocabulary: true,
    comprehension: true,
    descriptive: true,
  },
  customTitle: '現代の国語 定期テスト予想問題',
  subtitle: '国谷裕子「ポスト真実時代のジャーナリズム」（三省堂）',
  showNameField: true,
  descriptiveSpace: 'compact',
};

export type PageKind =
  | 'summary'
  | 'test-part1'
  | 'test-part2'
  | 'answer-sheet'
  | 'answer-key-1'
  | 'answer-key-2';

export interface PageDescriptor {
  id: string;
  kind: PageKind;
  label: string;
}

export function calculateSelectedPoints(sections: PdfSectionsConfig): {
  totalPoints: number;
  questionCount: number;
  breakdown: {
    kanji: number;
    vocabulary: number;
    comprehension: number;
    descriptive: number;
  };
} {
  const kanji = sections.kanji
    ? KANJI_QUESTIONS.reduce((sum, q) => sum + q.points, 0)
    : 0;
  const vocabulary = sections.vocabulary
    ? VOCAB_QUESTIONS.reduce((sum, q) => sum + q.points, 0)
    : 0;
  const comprehension = sections.comprehension
    ? COMPREHENSION_QUESTIONS.reduce((sum, q) => sum + q.points, 0)
    : 0;
  const descriptive = sections.descriptive
    ? DESCRIPTIVE_QUESTIONS.reduce((sum, q) => sum + q.points, 0)
    : 0;

  const questionCount =
    (sections.kanji ? KANJI_QUESTIONS.length : 0) +
    (sections.vocabulary ? VOCAB_QUESTIONS.length : 0) +
    (sections.comprehension ? COMPREHENSION_QUESTIONS.length : 0) +
    (sections.descriptive ? DESCRIPTIVE_QUESTIONS.length : 0);

  return {
    totalPoints: kanji + vocabulary + comprehension + descriptive,
    questionCount,
    breakdown: { kanji, vocabulary, comprehension, descriptive },
  };
}

export function buildPdfPagesPlan(config: PdfConfig): PageDescriptor[] {
  const pages: PageDescriptor[] = [];
  const hasAnySection =
    config.sections.kanji ||
    config.sections.vocabulary ||
    config.sections.comprehension ||
    config.sections.descriptive;

  if (config.includeSummaryPage) {
    pages.push({
      id: 'page-summary',
      kind: 'summary',
      label: '要点・重要語句まとめシート',
    });
  }

  if (config.includeTestPages && hasAnySection) {
    if (config.sections.kanji || config.sections.vocabulary) {
      pages.push({
        id: 'page-test-1',
        kind: 'test-part1',
        label: 'テスト問題（第1問・第2問）',
      });
    }
    if (config.sections.comprehension || config.sections.descriptive) {
      pages.push({
        id: 'page-test-2',
        kind: 'test-part2',
        label: 'テスト問題（第3問・第4問）',
      });
    }
  }

  if (
    hasAnySection &&
    (config.answerLayout === 'separate' || config.answerLayout === 'both')
  ) {
    pages.push({
      id: 'page-answer-sheet',
      kind: 'answer-sheet',
      label: '解答用紙（別紙）',
    });
  }

  if (config.includeAnswerKey && hasAnySection) {
    if (
      config.sections.kanji ||
      config.sections.vocabulary ||
      config.sections.comprehension
    ) {
      pages.push({
        id: 'page-key-1',
        kind: 'answer-key-1',
        label: '解答・解説（第1〜3問）',
      });
    }
    if (config.sections.descriptive) {
      pages.push({
        id: 'page-key-2',
        kind: 'answer-key-2',
        label: '解答・解説・採点基準（第4問）',
      });
    }
  }

  return pages;
}

export function normalizeJapaneseAnswer(input: string): string {
  return input
    .trim()
    .replace(/[\s\u3000]+/g, '')
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (ch) =>
      String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
    )
    .replace(/[\u30a1-\u30f6]/g, (ch) =>
      String.fromCharCode(ch.charCodeAt(0) - 0x60)
    );
}

export interface QuizAttemptState {
  kanjiAnswers: Record<string, string>;
  vocabAnswers: Record<string, string>;
  comprehensionBlanks: Record<string, string[]>;
  comprehensionChoices: Record<string, string>;
  descriptiveTexts: Record<string, string>;
  descriptiveRubricChecks: Record<string, boolean>;
}

export interface GradeResult {
  totalScore: number;
  maxScore: number;
  scaled100: number;
  sectionScores: {
    kanji: { score: number; max: number };
    vocabulary: { score: number; max: number };
    comprehension: { score: number; max: number };
    descriptive: { score: number; max: number };
  };
  itemCorrectness: Record<string, boolean>;
}

export function createEmptyAttempt(): QuizAttemptState {
  return {
    kanjiAnswers: {},
    vocabAnswers: {},
    comprehensionBlanks: {},
    comprehensionChoices: {},
    descriptiveTexts: {},
    descriptiveRubricChecks: {},
  };
}

export function gradeQuizAttempt(attempt: QuizAttemptState): GradeResult {
  const itemCorrectness: Record<string, boolean> = {};

  let kanjiScore = 0;
  let kanjiMax = 0;
  for (const q of KANJI_QUESTIONS) {
    kanjiMax += q.points;
    const raw = attempt.kanjiAnswers[q.id] ?? '';
    const norm = normalizeJapaneseAnswer(raw);
    const isCorrect =
      norm.length > 0 &&
      q.answers.some((ans) => normalizeJapaneseAnswer(ans) === norm);
    itemCorrectness[q.id] = isCorrect;
    if (isCorrect) kanjiScore += q.points;
  }

  let vocabScore = 0;
  let vocabMax = 0;
  for (const q of VOCAB_QUESTIONS) {
    vocabMax += q.points;
    const selected = (attempt.vocabAnswers[q.id] ?? '').trim();
    const isCorrect = selected === q.answer;
    itemCorrectness[q.id] = isCorrect;
    if (isCorrect) vocabScore += q.points;
  }

  let compScore = 0;
  let compMax = 0;
  for (const q of COMPREHENSION_QUESTIONS) {
    compMax += q.points;
    let isCorrect = false;
    if (q.kind === 'blank-pair' || q.kind === 'blank-single') {
      const inputs = attempt.comprehensionBlanks[q.id] ?? [];
      isCorrect = q.blanks.every((blank, idx) => {
        const norm = normalizeJapaneseAnswer(inputs[idx] ?? '');
        return (
          norm.length > 0 &&
          blank.answers.some((ans) => normalizeJapaneseAnswer(ans) === norm)
        );
      });
    } else if (q.kind === 'choice' || q.kind === 'true-false') {
      isCorrect = (attempt.comprehensionChoices[q.id] ?? '').trim() === q.answer;
    }
    itemCorrectness[q.id] = isCorrect;
    if (isCorrect) compScore += q.points;
  }

  let descScore = 0;
  let descMax = 0;
  for (const q of DESCRIPTIVE_QUESTIONS) {
    descMax += q.points;
    let qScore = 0;
    for (const r of q.rubric) {
      if (attempt.descriptiveRubricChecks[r.id]) {
        qScore += r.points;
      }
    }
    const capped = Math.min(qScore, q.points);
    itemCorrectness[q.id] = capped === q.points;
    descScore += capped;
  }

  const totalScore = kanjiScore + vocabScore + compScore + descScore;
  const maxScore = kanjiMax + vocabMax + compMax + descMax;
  const scaled100 = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  return {
    totalScore,
    maxScore,
    scaled100,
    sectionScores: {
      kanji: { score: kanjiScore, max: kanjiMax },
      vocabulary: { score: vocabScore, max: vocabMax },
      comprehension: { score: compScore, max: compMax },
      descriptive: { score: descScore, max: descMax },
    },
    itemCorrectness,
  };
}
