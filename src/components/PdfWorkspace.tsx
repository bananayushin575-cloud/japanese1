import React from 'react';
import { Printer, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import {
  AnswerLayoutMode,
  calculateSelectedPoints,
  DEFAULT_PDF_CONFIG,
  DescriptiveSpaceMode,
  PageDescriptor,
  PdfConfig,
} from '../utils/pdfLogic';
import { A4Pages } from './A4Pages';

interface PdfWorkspaceProps {
  config: PdfConfig;
  onChangeConfig: (next: PdfConfig) => void;
  pages: PageDescriptor[];
  pageRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  scale: number;
  onChangeScale: (scale: number) => void;
  onPrintPdf: () => void;
  exportMessage: string | null;
  exportError: string | null;
}

export const PdfWorkspace: React.FC<PdfWorkspaceProps> = ({
  config,
  onChangeConfig,
  pages,
  pageRefs,
  scale,
  onChangeScale,
  onPrintPdf,
  exportMessage,
  exportError,
}) => {
  const { totalPoints, questionCount } = calculateSelectedPoints(config.sections);

  const toggleSection = (key: keyof PdfConfig['sections']) => {
    onChangeConfig({
      ...config,
      sections: {
        ...config.sections,
        [key]: !config.sections[key],
      },
    });
  };

  const setAnswerLayout = (mode: AnswerLayoutMode) => {
    onChangeConfig({ ...config, answerLayout: mode });
  };

  const setDescriptiveSpace = (space: DescriptiveSpaceMode) => {
    onChangeConfig({ ...config, descriptiveSpace: space });
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      {/* Intro & Action Strip */}
      <div className="no-print mb-6 flex flex-col gap-4 border-b border-stone-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-medium text-stone-500">
            三省堂『現代の国語』 · 国谷裕子「ポスト真実時代のジャーナリズム」
          </p>
          <h1 className="font-editorial mt-1 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl text-balance">
            定期テスト予想問題・要点まとめ PDFメーカー
          </h1>
          <p className="mt-1.5 text-sm text-stone-600 max-w-2xl">
            先ほどの全30問テスト・解答解説・要点まとめをA4プリント用に組版しました。収録内容を選んでそのままPDFファイルとして保存・印刷できます。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onPrintPdf}
            disabled={pages.length === 0}
            className="inline-flex items-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-100 disabled:opacity-50 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A]"
          >
            <Printer className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>印刷 / ブラウザPDF保存</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {(exportMessage || exportError) && (
        <div
          role={exportError ? 'alert' : 'status'}
          className={`no-print mb-5 border px-4 py-3 text-sm rounded-md ${
            exportError
              ? 'border-[#B91C1C]/30 bg-[#FEF2F2] text-[#991B1B]'
              : 'border-[#1E3A8A]/25 bg-[#EFF6FF] text-[#1E3A8A]'
          }`}
        >
          {exportError ? `エラー：${exportError}` : exportMessage}
        </div>
      )}

      {/* Main Two-Column Studio */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Left Control Rail */}
        <aside
          aria-label="PDF構成設定"
          className="no-print w-full lg:w-[340px] shrink-0 rounded-lg border border-stone-200 bg-white p-5 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h2 className="text-sm font-bold text-stone-900">PDF収録設定</h2>
              <p className="mt-0.5 text-xs text-stone-500 tabular-nums">
                全{pages.length}ページ · {questionCount}問 / {totalPoints}点満点
              </p>
            </div>
            <button
              type="button"
              onClick={() => onChangeConfig(DEFAULT_PDF_CONFIG)}
              className="inline-flex items-center gap-1 text-xs font-medium text-stone-600 hover:text-stone-900 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] rounded px-1.5 py-1"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>初期設定</span>
            </button>
          </div>

          {/* 1. 収録シート */}
          <fieldset className="space-y-2.5">
            <legend className="text-xs font-bold text-stone-800 mb-1">
              1. PDFに含めるシート
            </legend>
            <label className="flex items-start gap-2.5 cursor-pointer text-sm text-stone-800">
              <input
                type="checkbox"
                checked={config.includeSummaryPage}
                onChange={(e) =>
                  onChangeConfig({
                    ...config,
                    includeSummaryPage: e.target.checked,
                  })
                }
                className="mt-1 h-4 w-4 rounded border-stone-300 text-[#1E3A8A] focus:ring-[#1E3A8A]"
              />
              <span>
                <span className="font-medium block">要点・重要語句まとめシート</span>
                <span className="text-xs text-stone-500">
                  5つの急所・対比表・頻出語句10選（1ページ）
                </span>
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer text-sm text-stone-800">
              <input
                type="checkbox"
                checked={config.includeTestPages}
                onChange={(e) =>
                  onChangeConfig({
                    ...config,
                    includeTestPages: e.target.checked,
                  })
                }
                className="mt-1 h-4 w-4 rounded border-stone-300 text-[#1E3A8A] focus:ring-[#1E3A8A]"
              />
              <span>
                <span className="font-medium block">予想テスト問題用紙</span>
                <span className="text-xs text-stone-500">
                  選択した大問をA4テスト形式で組版
                </span>
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer text-sm text-stone-800">
              <input
                type="checkbox"
                checked={config.includeAnswerKey}
                onChange={(e) =>
                  onChangeConfig({
                    ...config,
                    includeAnswerKey: e.target.checked,
                  })
                }
                className="mt-1 h-4 w-4 rounded border-stone-300 text-[#1E3A8A] focus:ring-[#1E3A8A]"
              />
              <span>
                <span className="font-medium block">解答・解説・採点基準</span>
                <span className="text-xs text-stone-500">
                  模範解答と記述の採点ポイントを別ページで出力
                </span>
              </span>
            </label>
          </fieldset>

          {/* 2. 出題範囲（大問選択） */}
          <fieldset className="space-y-2 border-t border-stone-200 pt-4">
            <legend className="text-xs font-bold text-stone-800 mb-1">
              2. 収録する大問（全30問）
            </legend>
            {[
              {
                key: 'kanji' as const,
                label: '第1問：漢字の読み・書き',
                meta: '10問 / 10点',
              },
              {
                key: 'vocabulary' as const,
                label: '第2問：重要語句の意味',
                meta: '6問 / 12点',
              },
              {
                key: 'comprehension' as const,
                label: '第3問：内容理解・正誤',
                meta: '8問 / 16点',
              },
              {
                key: 'descriptive' as const,
                label: '第4問：記述問題',
                meta: '6問 / 24点',
              },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center justify-between gap-2 cursor-pointer text-sm text-stone-800 py-0.5"
              >
                <span className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={config.sections[item.key]}
                    onChange={() => toggleSection(item.key)}
                    className="h-4 w-4 rounded border-stone-300 text-[#1E3A8A] focus:ring-[#1E3A8A]"
                  />
                  <span>{item.label}</span>
                </span>
                <span className="text-xs text-stone-500 tabular-nums shrink-0">
                  {item.meta}
                </span>
              </label>
            ))}
          </fieldset>

          {/* 3. 解答欄スタイル */}
          <div className="space-y-2 border-t border-stone-200 pt-4">
            <div className="text-xs font-bold text-stone-800">
              3. 解答欄のレイアウト
            </div>
            <div className="grid grid-cols-3 gap-1 rounded-md bg-stone-100 p-1">
              {(
                [
                  { id: 'both', label: '両方' },
                  { id: 'inline', label: '問題内' },
                  { id: 'separate', label: '別紙のみ' },
                ] as { id: AnswerLayoutMode; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAnswerLayout(opt.id)}
                  className={`rounded py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                    config.answerLayout === opt.id
                      ? 'bg-white text-stone-900 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-stone-500">
              「両方」にすると問題用紙にも記入欄が入り、さらに別紙の解答用紙も付きます。
            </p>
          </div>

          {/* 4. 用紙カスタマイズ */}
          <div className="space-y-3 border-t border-stone-200 pt-4">
            <div className="text-xs font-bold text-stone-800">
              4. タイトル・余白オプション
            </div>

            <div>
              <label
                htmlFor="pdf-custom-title"
                className="block text-xs font-medium text-stone-600 mb-1"
              >
                テスト用紙タイトル
              </label>
              <input
                id="pdf-custom-title"
                type="text"
                value={config.customTitle}
                onChange={(e) =>
                  onChangeConfig({ ...config, customTitle: e.target.value })
                }
                className="w-full rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-900 focus:border-[#1E3A8A] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-stone-700">
                記述欄の高さ
              </span>
              <div className="flex items-center gap-1 rounded-md bg-stone-100 p-1">
                <button
                  type="button"
                  onClick={() => setDescriptiveSpace('compact')}
                  className={`rounded px-2.5 py-1 text-xs font-medium whitespace-nowrap ${
                    config.descriptiveSpace === 'compact'
                      ? 'bg-white text-stone-900 shadow-xs font-semibold'
                      : 'text-stone-600'
                  }`}
                >
                  標準
                </button>
                <button
                  type="button"
                  onClick={() => setDescriptiveSpace('generous')}
                  className={`rounded px-2.5 py-1 text-xs font-medium whitespace-nowrap ${
                    config.descriptiveSpace === 'generous'
                      ? 'bg-white text-stone-900 shadow-xs font-semibold'
                      : 'text-stone-600'
                  }`}
                >
                  広め
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer text-sm text-stone-800">
              <input
                type="checkbox"
                checked={config.showNameField}
                onChange={(e) =>
                  onChangeConfig({ ...config, showNameField: e.target.checked })
                }
                className="h-4 w-4 rounded border-stone-300 text-[#1E3A8A] focus:ring-[#1E3A8A]"
              />
              <span className="text-xs font-medium">
                年・組・番・氏名・得点欄を表示する
              </span>
            </label>
          </div>
        </aside>

        {/* Right A4 Document Preview Stage */}
        <section
          aria-label="A4印刷プレビュー"
          className="flex-1 min-w-0"
        >
          {/* Preview Toolbar */}
          <div className="no-print mb-4 flex items-center justify-between gap-4 rounded-lg border border-stone-200 bg-white px-4 py-2.5">
            <div className="flex items-center gap-4 min-w-0">
              <span className="text-xs font-semibold text-stone-800 tabular-nums whitespace-nowrap shrink-0">
                A4縦プレビュー · 全 {pages.length} ページ
              </span>
              {pages.length > 0 && (
                <div className="hidden xl:flex items-center gap-3 overflow-x-auto text-xs text-stone-500">
                  {pages.map((p, idx) => (
                    <a
                      key={p.id}
                      href={`#${p.id}`}
                      className="whitespace-nowrap shrink-0 hover:text-[#1E3A8A] hover:underline underline-offset-4 transition-colors"
                    >
                      {idx + 1}. {p.label.replace('シート', '').replace('（別紙）', '')}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                aria-label="プレビューを縮小"
                onClick={() =>
                  onChangeScale(Math.max(0.35, Number((scale - 0.1).toFixed(2))))
                }
                className="rounded border border-stone-200 p-1.5 text-stone-700 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A]"
              >
                <ZoomOut className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="w-11 text-center text-xs font-mono-tabular text-stone-700">
                {Math.round(scale * 100)}%
              </span>
              <button
                type="button"
                aria-label="プレビューを拡大"
                onClick={() =>
                  onChangeScale(Math.min(1.1, Number((scale + 0.1).toFixed(2))))
                }
                className="rounded border border-stone-200 p-1.5 text-stone-700 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A]"
              >
                <ZoomIn className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Paper Canvas */}
          {pages.length === 0 ? (
            <div className="rounded-lg border border-dashed border-stone-300 bg-white p-12 text-center">
              <p className="text-base font-semibold text-stone-800">
                出力するページが選択されていません
              </p>
              <p className="mt-1 text-sm text-stone-500">
                左側の設定パネルから「要点まとめ」「予想テスト」「解答・解説」のいずれかを有効にしてください。
              </p>
              <button
                type="button"
                onClick={() => onChangeConfig(DEFAULT_PDF_CONFIG)}
                className="mt-4 rounded-md bg-[#1E3A8A] px-4 py-2 text-sm font-medium text-white hover:bg-[#172554]"
              >
                初期設定に戻す
              </button>
            </div>
          ) : (
            <div className="print-only-container overflow-x-auto rounded-lg border border-stone-300/80 bg-[#EAE6DC] p-4 sm:p-8">
              <A4Pages
                pages={pages}
                config={config}
                pageRefs={pageRefs}
                scale={scale}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
