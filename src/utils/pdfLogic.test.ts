import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildPdfPagesPlan,
  calculateSelectedPoints,
  createEmptyAttempt,
  DEFAULT_PDF_CONFIG,
  gradeQuizAttempt,
  normalizeJapaneseAnswer,
} from './pdfLogic';
import {
  COMPREHENSION_QUESTIONS,
  DESCRIPTIVE_QUESTIONS,
  KANJI_QUESTIONS,
  VOCAB_QUESTIONS,
} from '../data/postTruthTest';

test('default configuration includes all 30 questions and 62 total points', () => {
  const result = calculateSelectedPoints(DEFAULT_PDF_CONFIG.sections);
  assert.equal(result.questionCount, 30);
  assert.equal(result.totalPoints, 62);
  assert.deepEqual(result.breakdown, {
    kanji: 10,
    vocabulary: 12,
    comprehension: 16,
    descriptive: 24,
  });
});

test('buildPdfPagesPlan returns expected pages for default config', () => {
  const pages = buildPdfPagesPlan(DEFAULT_PDF_CONFIG);
  assert.deepEqual(
    pages.map((p) => p.kind),
    [
      'summary',
      'test-part1',
      'test-part2',
      'answer-sheet',
      'answer-key-1',
      'answer-key-2',
    ]
  );
});

test('buildPdfPagesPlan omits summary, separate answer sheet, and key when disabled', () => {
  const pages = buildPdfPagesPlan({
    ...DEFAULT_PDF_CONFIG,
    includeSummaryPage: false,
    answerLayout: 'inline',
    includeAnswerKey: false,
  });
  assert.deepEqual(
    pages.map((p) => p.kind),
    ['test-part1', 'test-part2']
  );
});

test('buildPdfPagesPlan returns only summary if all question sections are unchecked', () => {
  const pages = buildPdfPagesPlan({
    ...DEFAULT_PDF_CONFIG,
    sections: {
      kanji: false,
      vocabulary: false,
      comprehension: false,
      descriptive: false,
    },
  });
  assert.deepEqual(
    pages.map((p) => p.kind),
    ['summary']
  );
});

test('normalizeJapaneseAnswer normalizes whitespace and katakana readings', () => {
  assert.equal(normalizeJapaneseAnswer('  衝撃  '), '衝撃');
  assert.equal(normalizeJapaneseAnswer(' ヘンケン '), 'へんけん');
  assert.equal(normalizeJapaneseAnswer('メディア'), 'めでぃあ');
});

test('gradeQuizAttempt scores an empty attempt as 0/62', () => {
  const grade = gradeQuizAttempt(createEmptyAttempt());
  assert.equal(grade.totalScore, 0);
  assert.equal(grade.maxScore, 62);
  assert.equal(grade.scaled100, 0);
});

test('gradeQuizAttempt scores a perfect attempt as 62/62 (100%)', () => {
  const attempt = createEmptyAttempt();

  for (const q of KANJI_QUESTIONS) {
    attempt.kanjiAnswers[q.id] = q.displayAnswer;
  }
  for (const q of VOCAB_QUESTIONS) {
    attempt.vocabAnswers[q.id] = q.answer;
  }
  for (const q of COMPREHENSION_QUESTIONS) {
    if (q.kind === 'choice' || q.kind === 'true-false') {
      attempt.comprehensionChoices[q.id] = q.answer;
    } else {
      attempt.comprehensionBlanks[q.id] = q.blanks.map((b) => b.displayAnswer);
    }
  }
  for (const q of DESCRIPTIVE_QUESTIONS) {
    for (const r of q.rubric) {
      attempt.descriptiveRubricChecks[r.id] = true;
    }
  }

  const grade = gradeQuizAttempt(attempt);
  assert.equal(grade.totalScore, 62);
  assert.equal(grade.maxScore, 62);
  assert.equal(grade.scaled100, 100);
  assert.equal(grade.itemCorrectness['k-1'], true);
  assert.equal(grade.itemCorrectness['c-2'], true);
  assert.equal(grade.itemCorrectness['d-6'], true);
});
