import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import {
  CONTRAST_TABLE,
  KEY_VOCABULARY,
  STUDY_POINTS,
  TEXT_METADATA,
} from '../data/postTruthTest';

export const StudySummaryView: React.FC = () => {
  const [hideKeywords, setHideKeywords] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="mx-auto max-w-[1040px] px-4 py-6 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-stone-200 pb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium text-stone-500">
            {TEXT_METADATA.textbook} · {TEXT_METADATA.unitTitle} · 筆者：{TEXT_METADATA.author}
          </p>
          <h1 className="font-editorial mt-1 text-2xl font-bold text-stone-900 sm:text-3xl">
            「{TEXT_METADATA.lessonTitle}」要点・重要語句まとめ
          </h1>
        </div>

        <button
          type="button"
          onClick={() => {
            setHideKeywords((v) => !v);
            setRevealedIds({});
          }}
          className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 hover:bg-stone-100 whitespace-nowrap shrink-0"
        >
          {hideKeywords ? (
            <>
              <Eye className="h-4 w-4" aria-hidden="true" />
              <span>赤シートモードを解除</span>
            </>
          ) : (
            <>
              <EyeOff className="h-4 w-4" aria-hidden="true" />
              <span>赤シートモード（重要語句を隠す）</span>
            </>
          )}
        </button>
      </div>

      {/* 5 Key Points */}
      <section className="space-y-4">
        <h2 className="font-editorial text-xl font-bold text-stone-900">
          テストで狙われる5つの急所
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {STUDY_POINTS.map((pt) => {
            const isHidden = hideKeywords && !revealedIds[pt.id];
            return (
              <article
                key={pt.id}
                className="rounded-lg border border-stone-200 bg-white p-5 space-y-2.5"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="font-editorial text-base font-bold text-stone-900 sm:text-lg">
                    <span className="font-mono-tabular text-[#1E3A8A] mr-2">
                      {pt.number}.
                    </span>
                    {pt.title}
                    {pt.isHighFreq && (
                      <span className="ml-2 text-xs font-semibold text-[#9A3412]">
                        （超頻出）
                      </span>
                    )}
                  </h3>
                  <button
                    type="button"
                    onClick={() => hideKeywords && toggleReveal(pt.id)}
                    className={`text-left text-xs font-semibold sm:text-right ${
                      isHidden
                        ? 'rounded bg-[#9A3412] px-2 py-0.5 text-transparent select-none cursor-pointer'
                        : 'text-[#1E3A8A]'
                    }`}
                    title={isHidden ? 'クリックして表示' : undefined}
                  >
                    {pt.keyPhrase}
                  </button>
                </div>
                <p className="text-sm leading-relaxed text-stone-700">
                  {pt.summary}
                </p>
                <p className="text-xs text-stone-600 border-t border-stone-100 pt-2">
                  <span className="font-semibold text-stone-800">出題のツボ：</span>
                  {pt.examTip}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Contrast Table */}
      <section className="space-y-3">
        <h2 className="font-editorial text-xl font-bold text-stone-900">
          本文の対比構造マップ
        </h2>
        <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-[#FAF9F5] text-left">
                <th className="px-4 py-3 font-bold text-stone-800 w-1/5">
                  観点
                </th>
                <th className="px-4 py-3 font-bold text-stone-800 w-2/5">
                  本来の理想・かつての状況
                </th>
                <th className="px-4 py-3 font-bold text-stone-800 w-2/5">
                  現代の危機・ポスト真実の状況
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {CONTRAST_TABLE.map((row) => (
                <tr key={row.aspect}>
                  <td className="px-4 py-3 font-semibold text-stone-900 align-top">
                    {row.aspect}
                  </td>
                  <td className="px-4 py-3 text-stone-700 leading-relaxed align-top">
                    {row.beforeOrIdeal}
                  </td>
                  <td className="px-4 py-3 text-stone-700 leading-relaxed align-top">
                    {row.nowOrRisk}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Vocabulary 10 */}
      <section className="space-y-3">
        <h2 className="font-editorial text-xl font-bold text-stone-900">
          チェックしておきたい漢字・重要語句10選
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {KEY_VOCABULARY.map((v) => {
            const isHidden = hideKeywords && !revealedIds[v.id];
            return (
              <div
                key={v.id}
                className="rounded-lg border border-stone-200 bg-white p-4 space-y-1.5"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => hideKeywords && toggleReveal(v.id)}
                    className="text-left"
                  >
                    <span
                      className={`font-editorial text-base font-bold ${
                        isHidden
                          ? 'rounded bg-[#9A3412] px-2 py-0.5 text-transparent select-none'
                          : 'text-stone-900'
                      }`}
                    >
                      {v.term}
                    </span>
                    <span className="ml-2 text-xs text-stone-500">
                      （{v.reading}）
                    </span>
                  </button>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed">
                  {v.meaning}
                </p>
                <p className="text-xs text-stone-500">{v.examNote}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
