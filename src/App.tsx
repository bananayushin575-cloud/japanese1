import { useMemo, useRef, useState } from 'react';
import { ActiveTab, TopBar } from './components/TopBar';
import { PdfWorkspace } from './components/PdfWorkspace';
import { InteractiveQuiz } from './components/InteractiveQuiz';
import { StudySummaryView } from './components/StudySummaryView';
import {
  buildPdfPagesPlan,
  DEFAULT_PDF_CONFIG,
  PdfConfig,
} from './utils/pdfLogic';
import { exportA4PagesToPdf } from './utils/exportPdf';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('pdf');
  const [config, setConfig] = useState<PdfConfig>(DEFAULT_PDF_CONFIG);
  const [scale, setScale] = useState<number>(() =>
    typeof window !== 'undefined' && window.innerWidth < 640 ? 0.42 : 0.85
  );
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgressLabel, setExportProgressLabel] = useState<string | undefined>(
    undefined
  );
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const pages = useMemo(() => buildPdfPagesPlan(config), [config]);

  const handleDownloadPdf = async () => {
    setExportError(null);
    setExportMessage(null);

    if (activeTab !== 'pdf') {
      setActiveTab('pdf');
      setExportMessage(
        'PDFプレビュー画面に切り替えました。ページ内容をご確認のうえ、もう一度「PDFダウンロード」を押してください。'
      );
      return;
    }

    const elements = pageRefs.current
      .slice(0, pages.length)
      .filter((el): el is HTMLDivElement => el !== null);

    if (elements.length === 0) {
      setExportError('出力できるページがありません。設定でシートを1つ以上選択してください。');
      return;
    }

    setIsExporting(true);
    try {
      await exportA4PagesToPdf(
        elements,
        'ポスト真実時代のジャーナリズム_定期テスト対策.pdf',
        ({ current, total }) => {
          setExportProgressLabel(`作成中 ${current}/${total}`);
        }
      );
      setExportMessage(
        `全${elements.length}ページのPDF（ポスト真実時代のジャーナリズム_定期テスト対策.pdf）を作成し、ダウンロードを開始しました。`
      );
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'PDFの生成中に問題が発生しました。「印刷 / ブラウザPDF保存」もお試しください。';
      setExportError(msg);
    } finally {
      setIsExporting(false);
      setExportProgressLabel(undefined);
    }
  };

  const handlePrintPdf = () => {
    setExportError(null);
    setExportMessage(null);
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EE] text-[#1C1917]">
      <TopBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onDownloadPdf={handleDownloadPdf}
        isExporting={isExporting}
        exportLabel={exportProgressLabel}
        canExport={pages.length > 0}
      />

      <main className="flex-1">
        {activeTab === 'pdf' && (
          <PdfWorkspace
            config={config}
            onChangeConfig={setConfig}
            pages={pages}
            pageRefs={pageRefs}
            scale={scale}
            onChangeScale={setScale}
            onPrintPdf={handlePrintPdf}
            exportMessage={exportMessage}
            exportError={exportError}
          />
        )}

        {activeTab === 'quiz' && <InteractiveQuiz />}

        {activeTab === 'summary' && <StudySummaryView />}
      </main>

      <footer className="no-print border-t border-stone-200 bg-[#FBF9F5] py-4 text-center text-xs text-stone-500">
        三省堂『現代の国語』国谷裕子「ポスト真実時代のジャーナリズム」定期テスト対策プリントスタジオ
      </footer>
    </div>
  );
}
