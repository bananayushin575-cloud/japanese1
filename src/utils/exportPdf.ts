import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';

export interface ExportProgress {
  current: number;
  total: number;
}

export async function exportA4PagesToPdf(
  pageElements: HTMLElement[],
  filename: string,
  onProgress?: (progress: ExportProgress) => void
): Promise<void> {
  if (pageElements.length === 0) {
    throw new Error('出力対象のページが選択されていません。');
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidthMm = 210;
  const pageHeightMm = 297;

  for (let i = 0; i < pageElements.length; i++) {
    const el = pageElements[i];
    onProgress?.({ current: i + 1, total: pageElements.length });

    // Yield one animation frame so progress UI renders cleanly before encoding
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

    // Skip cross-origin stylesheet font inlining to prevent SecurityError & hang on CJK Google Font slices
    const dataUrl = await toPng(el, {
      pixelRatio: 1.75,
      backgroundColor: '#ffffff',
      skipFonts: true,
      cacheBust: false,
      width: 794,
      height: 1123,
      style: {
        transform: 'none',
        margin: '0',
      },
    });

    if (i > 0) {
      pdf.addPage('a4', 'portrait');
    }
    pdf.addImage(dataUrl, 'PNG', 0, 0, pageWidthMm, pageHeightMm, undefined, 'FAST');
  }

  pdf.save(filename);
}
