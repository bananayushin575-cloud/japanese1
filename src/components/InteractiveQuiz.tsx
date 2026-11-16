import React, { useState } from 'react';
import { Check, RotateCcw, X } from 'lucide-react';
import {
  COMPREHENSION_QUESTIONS,
  DESCRIPTIVE_QUESTIONS,
  KANJI_QUESTIONS,
  VOCAB_CHOICES,
  VOCAB_QUESTIONS,
} from '../data/postTruthTest';
import {
  createEmptyAttempt,
  GradeResult,
  gradeQuizAttempt,
  QuizAttemptState,
} from '../utils/pdfLogic';

type SectionFilter = 'all' | 'kanji' | 'vocab' | 'comp' | 'desc';

export const InteractiveQuiz: React.FC = () => {
  const [attempt, setAttempt] = useState<QuizAttemptState>(createEmptyAttempt);
  const [grade, setGrade] = useState<GradeResult | null>(null);
  const [filter, setFilter] = useState<SectionFilter>('all');

  const handleSubmitGrade = () => {
    setGrade(gradeQuizAttempt(attempt));
  };

  const handleReset = () => {
    setAttempt(createEmptyAttempt());
    setGrade(null);
  };

  const updateDescriptiveRubric = (rubricId: string, checked: boolean) => {
    const nextAttempt: QuizAttemptState = {
      ...attempt,
      descriptiveRubricChecks: {
        ...attempt.descriptiveRubricChecks,
        [rubricId]: checked,
      },
    };
    setAttempt(nextAttempt);
    if (grade) {
      setGrade(gradeQuizAttempt(nextAttempt));
    }
  };

  const answeredCount =
    Object.values(attempt.kanjiAnswers).filter((v) => v.trim().length > 0).length +
    Object.values(attempt.vocabAnswers).filter((v) => v.trim().length > 0).length +
    Object.values(attempt.comprehensionChoices).filter((v) => v.trim().length > 0).length +
    Object.values(attempt.comprehensionBlanks).filter((arr) =>
      arr.some((v) => v.trim().length > 0)
    ).length +
    Object.values(attempt.descriptiveTexts).filter((v) => v.trim().length > 0).length;

  return (
    <div className="mx-auto max-w-[1040px] px-4 py-6 sm:px-6 lg:px-8">
      {/* Header & Score Summary */}
      <div className="mb-6 border-b border-stone-200 pb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium text-stone-500">
            Web演習モード · 全30問 / 62点満点
          </p>
          <h1 className="font-editorial mt-1 text-2xl font-bold text-stone-900 sm:text-3xl">
            「ポスト真実時代のジャーナリズム」実践テスト
          </h1>
          <p className="mt-1 text-sm text-stone-600 tabular-nums">
            入力・選択済み：{answeredCount} / 30問（第4問の記述は採点後に自己採点チェックできます）
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 whitespace-nowrap shrink-0"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>やり直す</span>
          </button>
          <button
            type="button"
            onClick={handleSubmitGrade}
            className="rounded-md bg-[#1E3A8A] px-5 py-2 text-sm font-semibold text-white hover:bg-[#172554] whitespace-nowrap shrink-0"
          >
            採点する
          </button>
        </div>
      </div>

      {/* Result Banner */}
      {grade && (
        <section
          aria-label="採点結果"
          className="mb-6 rounded-lg border border-stone-300 bg-white p-5"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium text-stone-500">採点結果</p>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="font-mono-tabular text-3xl font-bold text-[#1E3A8A]">
                  {grade.totalScore}
                  <span className="text-lg font-normal text-stone-500">
                    {' '}
                    / {grade.maxScore}点
                  </span>
                </span>
                <span className="font-mono-tabular text-sm font-semibold text-stone-700">
                  （100点換算：{grade.scaled100}点）
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs sm:grid-cols-4 font-mono-tabular">
              <div>
                <span className="text-stone-500 block">第1問 漢字</span>
                <span className="font-bold text-stone-900">
                  {grade.sectionScores.kanji.score} / {grade.sectionScores.kanji.max}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block">第2問 語句</span>
                <span className="font-bold text-stone-900">
                  {grade.sectionScores.vocabulary.score} /{' '}
                  {grade.sectionScores.vocabulary.max}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block">第3問 読解</span>
                <span className="font-bold text-stone-900">
                  {grade.sectionScores.comprehension.score} /{' '}
                  {grade.sectionScores.comprehension.max}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block">第4問 記述</span>
                <span className="font-bold text-stone-900">
                  {grade.sectionScores.descriptive.score} /{' '}
                  {grade.sectionScores.descriptive.max}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section Filter Tabs */}
      <div
        role="tablist"
        aria-label="大問フィルタ"
        className="mb-6 flex flex-wrap gap-1 rounded-lg bg-stone-200/70 p-1"
      >
        {(
          [
            { id: 'all', label: 'すべて表示（30問）' },
            { id: 'kanji', label: '第1問 漢字（10）' },
            { id: 'vocab', label: '第2問 語句（6）' },
            { id: 'comp', label: '第3問 内容理解（8）' },
            { id: 'desc', label: '第4問 記述（6）' },
          ] as { id: SectionFilter; label: string }[]
        ).map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={filter === tab.id}
            onClick={() => setFilter(tab.id)}
            className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              filter === tab.id
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {/* 第1問 */}
        {(filter === 'all' || filter === 'kanji') && (
          <section className="rounded-lg border border-stone-200 bg-white p-5 sm:p-6">
            <div className="border-b border-stone-200 pb-3 mb-4 flex items-baseline justify-between gap-2">
              <h2 className="font-editorial text-lg font-bold text-stone-900">
                第1問　漢字の読み・書き
              </h2>
              <span className="text-xs text-stone-500 tabular-nums shrink-0">
                各1点×10＝10点
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {KANJI_QUESTIONS.map((q) => {
                const isCorrect = grade?.itemCorrectness[q.id];
                return (
                  <div
                    key={q.id}
                    className="rounded border border-stone-200 p-3.5 flex flex-col justify-between gap-2"
                  >
                    <label
                      htmlFor={`quiz-${q.id}`}
                      className="text-sm text-stone-800 leading-relaxed"
                    >
                      <span className="font-mono-tabular font-semibold text-stone-500 mr-1.5">
                        ({q.number})
                      </span>
                      {q.beforeText}
                      <span className="font-bold underline decoration-stone-800 underline-offset-4 mx-0.5">
                        {q.targetText}
                      </span>
                      {q.afterText}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id={`quiz-${q.id}`}
                        type="text"
                        placeholder={
                          q.type === 'write' ? '漢字で入力' : 'ひらがなで入力'
                        }
                        value={attempt.kanjiAnswers[q.id] ?? ''}
                        onChange={(e) =>
                          setAttempt({
                            ...attempt,
                            kanjiAnswers: {
                              ...attempt.kanjiAnswers,
                              [q.id]: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded border border-stone-300 px-3 py-1.5 text-sm text-stone-900 focus:border-[#1E3A8A] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
                      />
                      {grade && (
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold whitespace-nowrap shrink-0 ${
                            isCorrect ? 'text-[#059669]' : 'text-[#B91C1C]'
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <Check className="h-4 w-4" aria-hidden="true" />
                              <span>正解</span>
                            </>
                          ) : (
                            <>
                              <X className="h-4 w-4" aria-hidden="true" />
                              <span>答：{q.displayAnswer}</span>
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 第2問 */}
        {(filter === 'all' || filter === 'vocab') && (
          <section className="rounded-lg border border-stone-200 bg-white p-5 sm:p-6">
            <div className="border-b border-stone-200 pb-3 mb-4 flex items-baseline justify-between gap-2">
              <h2 className="font-editorial text-lg font-bold text-stone-900">
                第2問　重要語句の意味
              </h2>
              <span className="text-xs text-stone-500 tabular-nums shrink-0">
                各2点×6＝12点
              </span>
            </div>

            <div className="mb-4 rounded border border-stone-200 bg-[#FAF9F5] p-3.5 text-xs sm:text-sm space-y-1">
              <div className="font-bold text-stone-800 mb-1">【語群】</div>
              {VOCAB_CHOICES.map((c) => (
                <div key={c.label} className="text-stone-700">
                  <span className="font-bold mr-1.5">{c.label}：</span>
                  {c.text}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {VOCAB_QUESTIONS.map((q) => {
                const isCorrect = grade?.itemCorrectness[q.id];
                return (
                  <div
                    key={q.id}
                    className="rounded border border-stone-200 p-3.5 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <label
                        htmlFor={`quiz-${q.id}`}
                        className="text-sm font-bold text-stone-900"
                      >
                        ({q.number}) {q.term}
                      </label>
                      {grade && (
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold ${
                            isCorrect ? 'text-[#059669]' : 'text-[#B91C1C]'
                          }`}
                        >
                          {isCorrect ? '○ 正解' : `× 答：${q.answer}`}
                        </span>
                      )}
                    </div>
                    <select
                      id={`quiz-${q.id}`}
                      value={attempt.vocabAnswers[q.id] ?? ''}
                      onChange={(e) =>
                        setAttempt({
                          ...attempt,
                          vocabAnswers: {
                            ...attempt.vocabAnswers,
                            [q.id]: e.target.value,
                          },
                        })
                      }
                      className="w-full rounded border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-900 focus:border-[#1E3A8A] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
                    >
                      <option value="">記号を選択...</option>
                      {VOCAB_CHOICES.map((c) => (
                        <option key={c.label} value={c.label}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 第3問 */}
        {(filter === 'all' || filter === 'comp') && (
          <section className="rounded-lg border border-stone-200 bg-white p-5 sm:p-6">
            <div className="border-b border-stone-200 pb-3 mb-4 flex items-baseline justify-between gap-2">
              <h2 className="font-editorial text-lg font-bold text-stone-900">
                第3問　内容理解・空欄補充・正誤問題
              </h2>
              <span className="text-xs text-stone-500 tabular-nums shrink-0">
                各2点×8＝16点
              </span>
            </div>

            <div className="space-y-5">
              {COMPREHENSION_QUESTIONS.map((q) => {
                const isCorrect = grade?.itemCorrectness[q.id];
                return (
                  <div
                    key={q.id}
                    className="border-b border-stone-200 pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-stone-900">
                        問{q.number}　
                        {q.kind === 'true-false' ? q.statement : q.prompt}
                      </p>
                      {grade && (
                        <span
                          className={`text-xs font-bold shrink-0 ${
                            isCorrect ? 'text-[#059669]' : 'text-[#B91C1C]'
                          }`}
                        >
                          {isCorrect ? '○ 正解' : '× 不正解'}
                        </span>
                      )}
                    </div>

                    {(q.kind === 'blank-pair' || q.kind === 'blank-single') && (
                      <div className="mt-2.5 space-y-2.5">
                        <p className="rounded border border-stone-200 bg-[#FAF9F5] p-3 text-sm text-stone-800 leading-relaxed">
                          {q.passage}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {q.blanks.map((b, idx) => (
                            <label
                              key={b.label}
                              className="inline-flex items-center gap-2 text-sm"
                            >
                              <span className="font-bold text-stone-700">
                                空欄 {b.label}：
                              </span>
                              <input
                                type="text"
                                value={
                                  attempt.comprehensionBlanks[q.id]?.[idx] ?? ''
                                }
                                onChange={(e) => {
                                  const prevArr = [
                                    ...(attempt.comprehensionBlanks[q.id] ?? []),
                                  ];
                                  prevArr[idx] = e.target.value;
                                  setAttempt({
                                    ...attempt,
                                    comprehensionBlanks: {
                                      ...attempt.comprehensionBlanks,
                                      [q.id]: prevArr,
                                    },
                                  });
                                }}
                                className="w-36 rounded border border-stone-300 px-3 py-1.5 text-sm focus:border-[#1E3A8A] focus:outline-none"
                              />
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {q.kind === 'choice' && (
                      <div className="mt-2.5 space-y-1.5">
                        {q.choices.map((c) => (
                          <label
                            key={c.label}
                            className="flex items-start gap-2.5 cursor-pointer rounded border border-stone-200 px-3 py-2 text-sm hover:bg-stone-50"
                          >
                            <input
                              type="radio"
                              name={`quiz-${q.id}`}
                              value={c.label}
                              checked={attempt.comprehensionChoices[q.id] === c.label}
                              onChange={() =>
                                setAttempt({
                                  ...attempt,
                                  comprehensionChoices: {
                                    ...attempt.comprehensionChoices,
                                    [q.id]: c.label,
                                  },
                                })
                              }
                              className="mt-0.5 h-4 w-4 text-[#1E3A8A]"
                            />
                            <span>
                              <span className="font-bold mr-1.5">{c.label}：</span>
                              {c.text}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                    {q.kind === 'true-false' && (
                      <div className="mt-2.5 flex items-center gap-3">
                        {(['○', '×'] as const).map((sym) => {
                          const selected =
                            attempt.comprehensionChoices[q.id] === sym;
                          return (
                            <button
                              key={sym}
                              type="button"
                              onClick={() =>
                                setAttempt({
                                  ...attempt,
                                  comprehensionChoices: {
                                    ...attempt.comprehensionChoices,
                                    [q.id]: sym,
                                  },
                                })
                              }
                              className={`rounded-md border px-5 py-1.5 text-sm font-bold transition-colors ${
                                selected
                                  ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white'
                                  : 'border-stone-300 bg-white text-stone-800 hover:bg-stone-50'
                              }`}
                            >
                              {sym === '○' ? '○（正しい）' : '×（誤り）'}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {grade && (
                      <p className="mt-2 text-xs text-stone-600 bg-stone-50 border border-stone-200 px-3 py-2 rounded">
                        <span className="font-bold text-[#9A3412] mr-2">
                          正解：
                          {q.kind === 'choice' || q.kind === 'true-false'
                            ? q.answer
                            : q.blanks
                                .map((b) => `${b.label}=${b.displayAnswer}`)
                                .join(' ／ ')}
                        </span>
                        {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 第4問 */}
        {(filter === 'all' || filter === 'desc') && (
          <section className="rounded-lg border border-stone-200 bg-white p-5 sm:p-6">
            <div className="border-b border-stone-200 pb-3 mb-4 flex items-baseline justify-between gap-2">
              <h2 className="font-editorial text-lg font-bold text-stone-900">
                第4問　記述問題（自己採点ルーブリック付き）
              </h2>
              <span className="text-xs text-stone-500 tabular-nums shrink-0">
                各4点×6＝24点
              </span>
            </div>

            <div className="space-y-6">
              {DESCRIPTIVE_QUESTIONS.map((q) => (
                <div
                  key={q.id}
                  className="border-b border-stone-200 pb-5 last:border-b-0 last:pb-0"
                >
                  <label
                    htmlFor={`quiz-${q.id}`}
                    className="block text-sm font-semibold text-stone-900 mb-2"
                  >
                    問{q.number}　{q.prompt}
                  </label>
                  <textarea
                    id={`quiz-${q.id}`}
                    rows={3}
                    placeholder="自分の言葉で記述解答を入力してください..."
                    value={attempt.descriptiveTexts[q.id] ?? ''}
                    onChange={(e) =>
                      setAttempt({
                        ...attempt,
                        descriptiveTexts: {
                          ...attempt.descriptiveTexts,
                          [q.id]: e.target.value,
                        },
                      })
                    }
                    className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-[#1E3A8A] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
                  />

                  {grade && (
                    <div className="mt-3 rounded-md border border-stone-200 bg-[#FAF9F5] p-3.5 space-y-2.5">
                      <div>
                        <span className="text-xs font-bold text-[#9A3412]">
                          模範解答例：
                        </span>
                        <p className="mt-0.5 text-sm text-stone-900 leading-relaxed">
                          {q.modelAnswer}
                        </p>
                      </div>
                      <div className="border-t border-stone-200 pt-2">
                        <div className="text-xs font-bold text-[#1E3A8A] mb-1.5">
                          自己採点チェック（当てはまる項目にチェックすると点数に反映されます）：
                        </div>
                        <div className="space-y-1.5">
                          {q.rubric.map((r) => (
                            <label
                              key={r.id}
                              className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-stone-800"
                            >
                              <input
                                type="checkbox"
                                checked={!!attempt.descriptiveRubricChecks[r.id]}
                                onChange={(e) =>
                                  updateDescriptiveRubric(r.id, e.target.checked)
                                }
                                className="h-4 w-4 rounded border-stone-300 text-[#1E3A8A]"
                              />
                              <span>
                                {r.label}
                                <span className="ml-1.5 font-mono-tabular text-stone-500">
                                  （+{r.points}点）
                                </span>
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Bottom Submit Strip */}
      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleSubmitGrade}
          className="rounded-md bg-[#1E3A8A] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#172554]"
        >
          採点結果を表示・更新する
        </button>
      </div>
    </div>
  );
};
