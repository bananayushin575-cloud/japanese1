import React from 'react';
import { Download } from 'lucide-react';

export type ActiveTab = 'pdf' | 'quiz' | 'summary';

interface TopBarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onDownloadPdf: () => void;
  isExporting: boolean;
  exportLabel?: string;
  canExport: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onSelectTab,
  onDownloadPdf,
  isExporting,
  exportLabel,
  canExport,
}) => {
  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'pdf', label: 'PDF作成・プレビュー' },
    { id: 'quiz', label: 'Web演習（30問）' },
    { id: 'summary', label: '要点・語句まとめ' },
  ];

  return (
    <header className="no-print sticky top-0 z-30 border-b border-stone-200 bg-[#FBF9F5]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-2 md:gap-8 px-3 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => onSelectTab('pdf')}
          className="font-editorial text-left text-sm font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 hover:text-[#1E3A8A] transition-colors sm:text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] rounded"
        >
          現代の国語｜テスト対策スタジオ
        </button>

        <nav
          aria-label="メインナビゲーション"
          className="hidden md:flex items-center gap-7"
        >
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`relative py-1.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] rounded ${
                  active
                    ? 'text-[#1E3A8A] font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {item.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[13px] h-[2px] bg-[#1E3A8A]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onDownloadPdf}
            disabled={isExporting || !canExport}
            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-md bg-[#1E3A8A] px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#172554] disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] focus-visible:ring-offset-2 sm:text-sm"
          >
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" aria-hidden="true" />
            <span className="sm:hidden">
              {isExporting ? exportLabel ?? '作成中...' : 'PDF保存'}
            </span>
            <span className="hidden sm:inline">
              {isExporting ? exportLabel ?? 'PDF作成中...' : 'PDFダウンロード'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile view switcher bar (kept compact within 15% sticky budget) */}
      <nav
        aria-label="モバイルナビゲーション"
        className="flex md:hidden border-t border-stone-200 bg-[#FBF9F5] px-2"
      >
        {navItems.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 py-2 px-1 text-center text-[11px] font-medium whitespace-nowrap shrink-0 border-b-2 transition-colors ${
                active
                  ? 'border-[#1E3A8A] text-[#1E3A8A] font-semibold'
                  : 'border-transparent text-stone-600'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
