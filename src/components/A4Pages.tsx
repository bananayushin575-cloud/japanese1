import React from 'react';
import {
  COMPREHENSION_QUESTIONS,
  CONTRAST_TABLE,
  DESCRIPTIVE_QUESTIONS,
  KANJI_QUESTIONS,
  KEY_VOCABULARY,
  STUDY_POINTS,
  TEXT_METADATA,
  VOCAB_CHOICES,
  VOCAB_QUESTIONS,
} from '../data/postTruthTest';
import {
  calculateSelectedPoints,
  PageDescriptor,
  PdfConfig,
} from '../utils/pdfLogic';

interface A4PagesProps {
  pages: PageDescriptor[];
  config: PdfConfig;
  pageRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  scale: number;
}

const PageFooter: React.FC<{ pageNum: number; totalPages: number; label: string }> = ({
  pageNum,
  totalPages,
  label,
}) => (
  <footer className="mt-auto pt-3 border-t border-[#d6d3d1] flex items-center justify-between text-[10px] text-[#57534e]">
    <span>
      {TEXT_METADATA.textbook}「{TEXT_METADATA.lessonTitle}」（{TEXT_METADATA.author}）
    </span>
    <span className="font-mono-tabular">
      {label} — {pageNum} / {totalPages}
    </span>
  </footer>
);

export const A4Pages: React.FC<A4PagesProps> = ({
  pages,
  config,
  pageRefs,
  scale,
}) => {
  const { totalPoints, questionCount, breakdown } = calculateSelectedPoints(
    config.sections
  );
  const showInlineBoxes =
    config.answerLayout === 'inline' || config.answerLayout === 'both';

  const scaledWidth = Math.round(794 * scale);
  const scaledHeight = Math.round(1123 * scale);

  return (
    <div className="flex flex-col items-center gap-7">
      {pages.map((page, index) => (
        <div
          key={page.id}
          id={page.id}
          className="a4-sheet-wrapper relative shadow-[0_8px_30px_rgba(28,25,23,0.10)] border border-stone-300 bg-white scroll-mt-24"
          style={{
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
          }}
        >
          <div
            ref={(el) => {
              pageRefs.current[index] = el;
            }}
            data-pdf-page="true"
            data-page-kind={page.kind}
            className="a4-sheet flex flex-col px-[44px] py-[38px] text-[#1c1917] origin-top-left"
            style={{
              transform: `scale(${scale})`,
            }}
          >
            {page.kind === 'summary' && (
              <SummarySheet
                config={config}
                pageNum={index + 1}
                totalPages={pages.length}
                label={page.label}
              />
            )}

            {page.kind === 'test-part1' && (
              <TestPart1Sheet
                config={config}
                totalPoints={totalPoints}
                questionCount={questionCount}
                showInlineBoxes={showInlineBoxes}
                pageNum={index + 1}
                totalPages={pages.length}
                label={page.label}
              />
            )}

            {page.kind === 'test-part2' && (
              <TestPart2Sheet
                config={config}
                showInlineBoxes={showInlineBoxes}
                pageNum={index + 1}
                totalPages={pages.length}
                label={page.label}
              />
            )}

            {page.kind === 'answer-sheet' && (
              <SeparateAnswerSheet
                config={config}
                totalPoints={totalPoints}
                breakdown={breakdown}
                pageNum={index + 1}
                totalPages={pages.length}
                label={page.label}
              />
            )}

            {page.kind === 'answer-key-1' && (
              <AnswerKeyPart1Sheet
                config={config}
                pageNum={index + 1}
                totalPages={pages.length}
                label={page.label}
              />
            )}

            {page.kind === 'answer-key-2' && (
              <AnswerKeyPart2Sheet
                pageNum={index + 1}
                totalPages={pages.length}
                label={page.label}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const SummarySheet: React.FC<{
  config: PdfConfig;
  pageNum: number;
  totalPages: number;
  label: string;
}> = ({ config, pageNum, totalPages, label }) => (
  <div className="flex flex-col h-full">
    <div className="border-b-2 border-[#1c1917] pb-2.5 mb-4 flex items-end justify-between">
      <div>
        <p className="text-[11px] text-[#57534e] tracking-wide">
          {TEXT_METADATA.textbook} ｜ {TEXT_METADATA.unitTitle}
        </p>
        <h1 className="text-[20px] font-bold tracking-tight text-[#1c1917] mt-0.5">
          「{TEXT_METADATA.lessonTitle}」要点・重要語句まとめ
        </h1>
      </div>
      <div className="text-right text-[11px] text-[#44403c]">
        <div>筆者：{TEXT_METADATA.author}</div>
        <div>{config.subtitle ? '定期テスト直前確認シート' : ''}</div>
      </div>
    </div>

    <section className="mb-4">
      <h2 className="text-[13px] font-bold text-[#1e3a8a] border-b border-[#d6d3d1] pb-1 mb-2">
        1. テストで狙われる5つの急所
      </h2>
      <div className="space-y-2">
        {STUDY_POINTS.map((pt) => (
          <div
            key={pt.id}
            className="border border-[#e7e5e4] bg-[#fafaf9] px-3 py-2 rounded-[3px]"
          >
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-[11.5px] font-bold text-[#1c1917]">
                {pt.number}. {pt.title}
                {pt.isHighFreq ? '（超頻出）' : ''}
              </h3>
              <span className="text-[10px] font-semibold text-[#1e3a8a] shrink-0">
                {pt.keyPhrase}
              </span>
            </div>
            <p className="text-[10.5px] leading-[1.55] text-[#292524] mt-1">
              {pt.summary}
            </p>
          </div>
        ))}
      </div>
    </section>

    <section className="mb-4">
      <h2 className="text-[13px] font-bold text-[#1e3a8a] border-b border-[#d6d3d1] pb-1 mb-2">
        2. 本文の対比構造マップ
      </h2>
      <table className="w-full border-collapse text-[10px]">
        <thead>
          <tr className="bg-[#f5f5f4] text-[#1c1917]">
            <th className="border border-[#d6d3d1] px-2.5 py-1.5 text-left w-[22%]">
              観点
            </th>
            <th className="border border-[#d6d3d1] px-2.5 py-1.5 text-left w-[39%]">
              本来の理想・かつての状況
            </th>
            <th className="border border-[#d6d3d1] px-2.5 py-1.5 text-left w-[39%]">
              現代の危機・ポスト真実の状況
            </th>
          </tr>
        </thead>
        <tbody>
          {CONTRAST_TABLE.map((row) => (
            <tr key={row.aspect}>
              <td className="border border-[#d6d3d1] px-2.5 py-1.5 font-bold bg-[#fafaf9]">
                {row.aspect}
              </td>
              <td className="border border-[#d6d3d1] px-2.5 py-1.5 leading-[1.45]">
                {row.beforeOrIdeal}
              </td>
              <td className="border border-[#d6d3d1] px-2.5 py-1.5 leading-[1.45]">
                {row.nowOrRisk}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>

    <section className="mb-2">
      <h2 className="text-[13px] font-bold text-[#1e3a8a] border-b border-[#d6d3d1] pb-1 mb-2">
        3. チェックしておきたい漢字・重要語句10選
      </h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px]">
        {KEY_VOCABULARY.map((v) => (
          <div
            key={v.id}
            className="flex items-baseline gap-2 border-b border-dotted border-[#d6d3d1] pb-1"
          >
            <span className="font-bold text-[#1c1917] shrink-0">
              {v.term}
              <span className="font-normal text-[#57534e]">（{v.reading}）</span>
            </span>
            <span className="text-[#44403c] leading-[1.35] truncate">
              {v.meaning}
            </span>
          </div>
        ))}
      </div>
    </section>

    <PageFooter pageNum={pageNum} totalPages={totalPages} label={label} />
  </div>
);

const TestPart1Sheet: React.FC<{
  config: PdfConfig;
  totalPoints: number;
  questionCount: number;
  showInlineBoxes: boolean;
  pageNum: number;
  totalPages: number;
  label: string;
}> = ({
  config,
  totalPoints,
  questionCount,
  showInlineBoxes,
  pageNum,
  totalPages,
  label,
}) => (
  <div className="flex flex-col h-full">
    <div className="border-b-2 border-[#1c1917] pb-2.5 mb-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10.5px] text-[#57534e]">{config.subtitle}</p>
          <h1 className="text-[20px] font-bold tracking-tight text-[#1c1917] mt-0.5">
            {config.customTitle}
          </h1>
        </div>
        <div className="text-right text-[11px] font-mono-tabular border border-[#1c1917] px-3 py-1.5 shrink-0">
          全{questionCount}問 ／ {totalPoints}点満点
        </div>
      </div>

      {config.showNameField && (
        <div className="mt-2.5 grid grid-cols-12 border border-[#44403c] text-[11px]">
          <div className="col-span-2 border-r border-[#44403c] px-2 py-1.5 flex items-center justify-between">
            <span>年</span>
            <span>組</span>
          </div>
          <div className="col-span-2 border-r border-[#44403c] px-2 py-1.5 flex items-center justify-end">
            <span>番</span>
          </div>
          <div className="col-span-5 border-r border-[#44403c] px-2.5 py-1.5">
            氏名：
          </div>
          <div className="col-span-3 px-2.5 py-1.5 flex items-center justify-between bg-[#fafaf9]">
            <span>得点</span>
            <span className="font-mono-tabular">／ {totalPoints}</span>
          </div>
        </div>
      )}
    </div>

    {config.sections.kanji && (
      <section className="mb-5">
        <div className="flex items-baseline justify-between border-b border-[#1c1917] pb-1 mb-2.5">
          <h2 className="text-[13.5px] font-bold">
            第1問　次の（1）〜（6）のカタカナを漢字に、（7）〜（10）の傍線部の読みをひらがなで答えなさい。
          </h2>
          <span className="text-[10.5px] font-mono-tabular text-[#44403c] shrink-0">
            （各1点×10＝10点）
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-2.5">
          {KANJI_QUESTIONS.map((q) => (
            <div
              key={q.id}
              className="flex items-center justify-between gap-2 border-b border-dotted border-[#d6d3d1] pb-1.5"
            >
              <p className="text-[11px] leading-[1.5]">
                <span className="font-mono-tabular font-semibold mr-1">
                  ({q.number})
                </span>
                {q.beforeText}
                <span className="font-bold underline decoration-[#1c1917] underline-offset-4 mx-0.5">
                  {q.targetText}
                </span>
                {q.afterText}
              </p>
              {showInlineBoxes && (
                <div
                  className="w-[74px] h-[26px] border border-[#57534e] shrink-0 bg-white"
                  aria-label={`第1問(${q.number})解答欄`}
                />
              )}
            </div>
          ))}
        </div>
      </section>
    )}

    {config.sections.vocabulary && (
      <section className="mb-2">
        <div className="flex items-baseline justify-between border-b border-[#1c1917] pb-1 mb-2.5">
          <h2 className="text-[13.5px] font-bold">
            第2問　次の（1）〜（6）の語句の意味として最も適切なものを、下の【語群】から選び記号で答えなさい。
          </h2>
          <span className="text-[10.5px] font-mono-tabular text-[#44403c] shrink-0">
            （各2点×6＝12点）
          </span>
        </div>

        <div className="grid grid-cols-3 gap-x-4 gap-y-2.5 mb-3.5">
          {VOCAB_QUESTIONS.map((q) => (
            <div
              key={q.id}
              className="flex items-center justify-between border border-[#d6d3d1] px-2.5 py-1.5"
            >
              <span className="text-[11.5px] font-bold">
                <span className="font-mono-tabular font-semibold mr-1">
                  ({q.number})
                </span>
                {q.term}
              </span>
              {showInlineBoxes && (
                <span className="inline-block w-[32px] h-[24px] border border-[#57534e]" />
              )}
            </div>
          ))}
        </div>

        <div className="border border-[#78716c] bg-[#fafaf9] px-3.5 py-2.5">
          <div className="text-[11px] font-bold mb-1.5">【語群】</div>
          <div className="grid grid-cols-1 gap-1 text-[10.5px] leading-[1.5]">
            {VOCAB_CHOICES.map((c) => (
              <div key={c.label} className="flex items-baseline gap-2">
                <span className="font-bold shrink-0">{c.label}：</span>
                <span>{c.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    )}

    <PageFooter pageNum={pageNum} totalPages={totalPages} label={label} />
  </div>
);

const TestPart2Sheet: React.FC<{
  config: PdfConfig;
  showInlineBoxes: boolean;
  pageNum: number;
  totalPages: number;
  label: string;
}> = ({ config, showInlineBoxes, pageNum, totalPages, label }) => {
  const blankAndChoice = COMPREHENSION_QUESTIONS.filter(
    (q) => q.kind !== 'true-false'
  );
  const trueFalse = COMPREHENSION_QUESTIONS.filter(
    (q) => q.kind === 'true-false'
  );

  return (
    <div className="flex flex-col h-full">
      {config.sections.comprehension && (
        <section className="mb-3.5">
          <div className="flex items-baseline justify-between border-b border-[#1c1917] pb-1 mb-2">
            <h2 className="text-[13px] font-bold">
              第3問　本文の内容に関する次の問いに答えなさい。
            </h2>
            <span className="text-[10px] font-mono-tabular text-[#44403c] shrink-0">
              （各2点×8＝16点）
            </span>
          </div>

          <div className="space-y-2 text-[10px] leading-[1.45]">
            {blankAndChoice.map((q) => (
              <div key={q.id} className="border-b border-dotted border-[#d6d3d1] pb-1.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold">
                    問{q.number}　{q.prompt}
                  </p>
                  {showInlineBoxes && q.kind === 'choice' && (
                    <span className="w-[30px] h-[20px] border border-[#57534e] shrink-0" />
                  )}
                </div>

                {(q.kind === 'blank-pair' || q.kind === 'blank-single') && (
                  <div className="mt-1 pl-3 flex items-center justify-between gap-2">
                    <p className="bg-[#fafaf9] border border-[#e7e5e4] px-2.5 py-1 flex-1">
                      {q.passage}
                    </p>
                    {showInlineBoxes && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        {q.blanks.map((b) => (
                          <span key={b.label} className="inline-flex items-center gap-1">
                            <span className="font-bold">{b.label}</span>
                            <span className="inline-block w-[52px] h-[20px] border border-[#57534e]" />
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {q.kind === 'choice' && (
                  <div className="mt-1 pl-3 grid grid-cols-2 gap-x-3 gap-y-0.5">
                    {q.choices.map((c) => (
                      <div key={c.label}>
                        <span className="font-bold">{c.label}：</span>
                        {c.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-0.5">
              <p className="font-semibold mb-1">
                問5〜8　次の文の内容が本文と合っていれば「○」、誤っていれば「×」で答えなさい。
              </p>
              <div className="space-y-1 pl-2">
                {trueFalse.map((q) => (
                  <div
                    key={q.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <span>
                      <span className="font-semibold mr-1">問{q.number}</span>
                      {q.statement}
                    </span>
                    {showInlineBoxes && (
                      <span className="w-[28px] h-[20px] border border-[#57534e] shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {config.sections.descriptive && (
        <section className="mb-1">
          <div className="flex items-baseline justify-between border-b border-[#1c1917] pb-1 mb-2">
            <h2 className="text-[13px] font-bold">
              第4問　次の問いに、本文の内容を踏まえて答えなさい。
            </h2>
            <span className="text-[10px] font-mono-tabular text-[#44403c] shrink-0">
              （各4点×6＝24点）
            </span>
          </div>

          <div className="space-y-2 text-[10px] leading-[1.45]">
            {DESCRIPTIVE_QUESTIONS.map((q) => (
              <div key={q.id}>
                <p className="font-semibold">
                  問{q.number}　{q.prompt}
                </p>
                {showInlineBoxes && (
                  <div
                    className={`mt-1 border border-[#57534e] bg-white ${
                      config.descriptiveSpace === 'generous' ? 'h-[48px]' : 'h-[36px]'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <PageFooter pageNum={pageNum} totalPages={totalPages} label={label} />
    </div>
  );
};

const SeparateAnswerSheet: React.FC<{
  config: PdfConfig;
  totalPoints: number;
  breakdown: {
    kanji: number;
    vocabulary: number;
    comprehension: number;
    descriptive: number;
  };
  pageNum: number;
  totalPages: number;
  label: string;
}> = ({ config, totalPoints, breakdown, pageNum, totalPages, label }) => (
  <div className="flex flex-col h-full">
    <div className="border-b-2 border-[#1c1917] pb-2 mb-3 flex items-end justify-between">
      <div>
        <p className="text-[10px] text-[#57534e]">{config.subtitle}</p>
        <h1 className="text-[19px] font-bold tracking-tight">
          {config.customTitle}　【解答用紙】
        </h1>
      </div>
      {config.showNameField && (
        <div className="flex items-center border border-[#1c1917] text-[10.5px]">
          <div className="px-3 py-1.5 border-r border-[#1c1917] w-[180px]">
            年　組　番　氏名：
          </div>
          <div className="px-3 py-1.5 w-[90px] flex justify-between bg-[#fafaf9] font-mono-tabular">
            <span>点</span>
            <span>／{totalPoints}</span>
          </div>
        </div>
      )}
    </div>

    {config.sections.kanji && (
      <section className="mb-3">
        <div className="flex items-baseline justify-between mb-1">
          <h2 className="text-[12px] font-bold">第1問　漢字の読み・書き</h2>
          <span className="text-[10px] font-mono-tabular text-[#57534e]">
            （各1点／計{breakdown.kanji}点）
          </span>
        </div>
        <div className="grid grid-cols-5 border-t border-l border-[#1c1917]">
          {KANJI_QUESTIONS.map((q) => (
            <div
              key={q.id}
              className="border-r border-b border-[#1c1917] flex flex-col"
            >
              <div className="bg-[#f5f5f4] border-b border-[#d6d3d1] px-2 py-0.5 text-[10px] font-mono-tabular flex justify-between">
                <span>({q.number})</span>
                <span className="text-[#57534e]">
                  {q.type === 'write' ? '書き' : '読み'}
                </span>
              </div>
              <div className="h-[34px]" />
            </div>
          ))}
        </div>
      </section>
    )}

    {config.sections.vocabulary && (
      <section className="mb-3">
        <div className="flex items-baseline justify-between mb-1">
          <h2 className="text-[12px] font-bold">第2問　重要語句の意味</h2>
          <span className="text-[10px] font-mono-tabular text-[#57534e]">
            （各2点／計{breakdown.vocabulary}点）
          </span>
        </div>
        <div className="grid grid-cols-6 border-t border-l border-[#1c1917]">
          {VOCAB_QUESTIONS.map((q) => (
            <div
              key={q.id}
              className="border-r border-b border-[#1c1917] flex flex-col"
            >
              <div className="bg-[#f5f5f4] border-b border-[#d6d3d1] px-2 py-0.5 text-[10px] font-mono-tabular text-center">
                ({q.number}) {q.term}
              </div>
              <div className="h-[32px]" />
            </div>
          ))}
        </div>
      </section>
    )}

    {config.sections.comprehension && (
      <section className="mb-3">
        <div className="flex items-baseline justify-between mb-1">
          <h2 className="text-[12px] font-bold">
            第3問　内容理解・空欄補充・正誤
          </h2>
          <span className="text-[10px] font-mono-tabular text-[#57534e]">
            （各2点／計{breakdown.comprehension}点）
          </span>
        </div>
        <div className="grid grid-cols-9 border-t border-l border-[#1c1917] text-[10px]">
          <div className="col-span-2 border-r border-b border-[#1c1917] flex flex-col">
            <div className="bg-[#f5f5f4] border-b border-[#d6d3d1] px-1.5 py-0.5 text-center">
              問1 (A / B)
            </div>
            <div className="h-[32px] grid grid-cols-2">
              <div className="border-r border-dotted border-[#a8a29e] px-1 pt-0.5 text-[9px] text-[#78716c]">
                A
              </div>
              <div className="px-1 pt-0.5 text-[9px] text-[#78716c]">B</div>
            </div>
          </div>
          <div className="col-span-1 border-r border-b border-[#1c1917] flex flex-col">
            <div className="bg-[#f5f5f4] border-b border-[#d6d3d1] px-1 py-0.5 text-center">
              問2 (C)
            </div>
            <div className="h-[32px]" />
          </div>
          {[3, 4, 5, 6, 7, 8].map((n) => (
            <div
              key={n}
              className="col-span-1 border-r border-b border-[#1c1917] flex flex-col"
            >
              <div className="bg-[#f5f5f4] border-b border-[#d6d3d1] px-1 py-0.5 text-center">
                問{n}
              </div>
              <div className="h-[32px]" />
            </div>
          ))}
        </div>
      </section>
    )}

    {config.sections.descriptive && (
      <section className="flex-1 flex flex-col">
        <div className="flex items-baseline justify-between mb-1">
          <h2 className="text-[12px] font-bold">第4問　記述問題</h2>
          <span className="text-[10px] font-mono-tabular text-[#57534e]">
            （各4点／計{breakdown.descriptive}点）
          </span>
        </div>
        <div className="border-t border-l border-[#1c1917] flex-1 flex flex-col">
          {DESCRIPTIVE_QUESTIONS.map((q) => (
            <div
              key={q.id}
              className="border-r border-b border-[#1c1917] flex flex-1 min-h-[54px]"
            >
              <div className="w-[44px] bg-[#f5f5f4] border-r border-[#d6d3d1] flex items-center justify-center text-[10.5px] font-bold shrink-0">
                問{q.number}
              </div>
              <div className="flex-1 p-1.5 flex items-end justify-end">
                {q.keywords.length <= 2 && (
                  <span className="text-[9px] text-[#a8a29e]">
                    使用語句：{q.keywords.join('・')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    )}

    <PageFooter pageNum={pageNum} totalPages={totalPages} label={label} />
  </div>
);

const AnswerKeyPart1Sheet: React.FC<{
  config: PdfConfig;
  pageNum: number;
  totalPages: number;
  label: string;
}> = ({ config, pageNum, totalPages, label }) => (
  <div className="flex flex-col h-full">
    <div className="border-b-2 border-[#1c1917] pb-2 mb-4 flex items-end justify-between">
      <div>
        <p className="text-[10.5px] text-[#57534e]">{config.subtitle}</p>
        <h1 className="text-[19px] font-bold tracking-tight">
          解答・解説（第1問〜第3問）
        </h1>
      </div>
      <span className="text-[11px] font-semibold text-[#9a3412]">
        自己採点・復習用
      </span>
    </div>

    {config.sections.kanji && (
      <section className="mb-4">
        <h2 className="text-[13px] font-bold border-b border-[#d6d3d1] pb-1 mb-2 text-[#1e3a8a]">
          第1問　漢字の読み・書き（各1点×10）
        </h2>
        <div className="grid grid-cols-5 gap-2 text-[11px] mb-2">
          {KANJI_QUESTIONS.map((q) => (
            <div
              key={q.id}
              className="border border-[#d6d3d1] px-2 py-1.5 flex items-center justify-between"
            >
              <span className="font-mono-tabular text-[#57534e]">
                ({q.number})
              </span>
              <span className="font-bold text-[#9a3412]">{q.displayAnswer}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[#44403c] bg-[#fafaf9] border border-[#e7e5e4] px-3 py-1.5">
          ワンポイント：「衝撃」「排除」「危惧」「翻弄」「俯瞰」は高校の定期テストで特に出題されやすい語句です。字形まで正確に書けるか確認しましょう。
        </p>
      </section>
    )}

    {config.sections.vocabulary && (
      <section className="mb-4">
        <h2 className="text-[13px] font-bold border-b border-[#d6d3d1] pb-1 mb-2 text-[#1e3a8a]">
          第2問　重要語句の意味（各2点×6）
        </h2>
        <div className="grid grid-cols-3 gap-2 text-[10.5px]">
          {VOCAB_QUESTIONS.map((q) => (
            <div
              key={q.id}
              className="border border-[#d6d3d1] px-2.5 py-1.5"
            >
              <div className="flex items-center justify-between font-bold">
                <span>
                  ({q.number}) {q.term}
                </span>
                <span className="text-[#9a3412]">{q.answer}</span>
              </div>
              <p className="text-[9.5px] text-[#57534e] mt-0.5 leading-[1.4]">
                {q.note}
              </p>
            </div>
          ))}
        </div>
      </section>
    )}

    {config.sections.comprehension && (
      <section className="mb-2">
        <h2 className="text-[13px] font-bold border-b border-[#d6d3d1] pb-1 mb-2 text-[#1e3a8a]">
          第3問　内容理解・空欄補充・正誤（各2点×8）
        </h2>
        <div className="space-y-2 text-[10.5px]">
          {COMPREHENSION_QUESTIONS.map((q) => {
            const ansText =
              q.kind === 'choice' || q.kind === 'true-false'
                ? q.answer
                : q.blanks.map((b) => `${b.label}：${b.displayAnswer}`).join(' ／ ');
            return (
              <div
                key={q.id}
                className="border-b border-dotted border-[#d6d3d1] pb-1.5 flex items-baseline gap-3"
              >
                <span className="font-bold w-[42px] shrink-0">問{q.number}</span>
                <span className="font-bold text-[#9a3412] w-[140px] shrink-0">
                  {ansText}
                </span>
                <span className="text-[#44403c] leading-[1.45]">
                  {q.explanation}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    )}

    <PageFooter pageNum={pageNum} totalPages={totalPages} label={label} />
  </div>
);

const AnswerKeyPart2Sheet: React.FC<{
  pageNum: number;
  totalPages: number;
  label: string;
}> = ({ pageNum, totalPages, label }) => (
  <div className="flex flex-col h-full">
    <div className="border-b-2 border-[#1c1917] pb-2 mb-4 flex items-end justify-between">
      <div>
        <p className="text-[10.5px] text-[#57534e]">
          {TEXT_METADATA.textbook}「{TEXT_METADATA.lessonTitle}」
        </p>
        <h1 className="text-[19px] font-bold tracking-tight">
          解答例・採点基準（第4問：記述問題）
        </h1>
      </div>
      <span className="text-[11px] font-semibold text-[#9a3412]">
        各4点×6＝24点
      </span>
    </div>

    <div className="space-y-3">
      {DESCRIPTIVE_QUESTIONS.map((q) => (
        <div
          key={q.id}
          className="border border-[#d6d3d1] px-3.5 py-2.5 bg-white"
        >
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <span className="text-[11.5px] font-bold text-[#1c1917]">
              問{q.number}　模範解答例
            </span>
            <span className="text-[10px] font-mono-tabular text-[#57534e]">
              配点：{q.points}点
            </span>
          </div>
          <p className="text-[11px] font-semibold text-[#9a3412] leading-[1.55] bg-[#fafaf9] border border-[#e7e5e4] px-2.5 py-1.5">
            {q.modelAnswer}
          </p>
          <div className="mt-1.5 text-[10px] text-[#44403c]">
            <span className="font-bold text-[#1e3a8a] mr-1.5">採点基準：</span>
            {q.rubric.map((r, idx) => (
              <span key={r.id}>
                {idx > 0 ? ' ／ ' : ''}
                □ {r.label}（{r.points}点）
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>

    <PageFooter pageNum={pageNum} totalPages={totalPages} label={label} />
  </div>
);
