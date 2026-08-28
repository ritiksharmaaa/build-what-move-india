/**
 * Prints a clean, full-page long document (PDF export)
 * without capturing the screen background, dark modals, or fixed scrollbars.
 */
export function printFormattedDocument({
  title,
  subtitle,
  badge,
  routeBreadcrumb,
  tableHtml,
  contentMarkdown,
  locale = 'hi',
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  routeBreadcrumb?: string;
  tableHtml?: string;
  contentMarkdown: string;
  locale?: 'en' | 'hi';
}) {
  // Convert simple markdown headings and bullets to clean printable HTML
  const formattedContent = contentMarkdown
    .replace(/^### (.*$)/gim, '<h3 style="font-size: 16px; font-weight: 800; margin-top: 18px; margin-bottom: 8px; color: #0f172a; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 4px;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="font-size: 18px; font-weight: 900; margin-top: 22px; margin-bottom: 10px; color: #0f172a; border-left: 4px solid #f97316; padding-left: 8px;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="font-size: 22px; font-weight: 900; margin-top: 24px; margin-bottom: 12px; color: #0f172a;">$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong style="font-weight: 800; color: #0f172a;">$1</strong>')
    .replace(/^\- (.*$)/gim, '<li style="margin-bottom: 6px; line-height: 1.6;">$1</li>')
    .replace(/(<li>.*<\/li>)/gis, '<ul style="margin-left: 20px; margin-bottom: 12px; list-style-type: square;">$1</ul>')
    .replace(/\n\n/gim, '<p style="margin-bottom: 10px; line-height: 1.6;"></p>');

  const html = `
<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=Noto+Sans+Devanagari:wght@400;600;700;900&family=Inter:wght@400;600;700;900&display=swap');

    @page {
      size: A4 portrait;
      margin: 15mm 12mm 15mm 12mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: ${locale === 'hi' ? "'Noto Sans Devanagari', 'Inter', sans-serif" : "'Inter', 'Noto Sans Devanagari', sans-serif"};
      color: #0f172a;
      background: #ffffff;
      font-size: 13px;
      line-height: 1.6;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      padding: 0;
    }

    .doc-header {
      border-bottom: 2.5px solid #0f172a;
      padding-bottom: 14px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .brand-title {
      font-size: 11px;
      font-family: 'IBM Plex Mono', monospace;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #ea580c;
      margin-bottom: 4px;
    }

    .doc-title {
      font-size: 20px;
      font-weight: 900;
      color: #020617;
      line-height: 1.25;
      margin-bottom: 4px;
    }

    .doc-subtitle {
      font-size: 12px;
      color: #475569;
      font-weight: 500;
    }

    .badge-tag {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      font-weight: 700;
      padding: 4px 8px;
      background: #0f172a;
      color: #ffffff;
      border: 1px solid #0f172a;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .route-bar {
      background: #f0fdf4;
      border: 1.5px solid #86efac;
      padding: 8px 12px;
      margin-bottom: 18px;
      font-size: 12px;
      font-weight: 600;
      color: #14532d;
    }

    .table-container {
      margin-bottom: 20px;
      width: 100%;
      overflow: visible;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      border: 2px solid #0f172a;
      font-size: 11px;
      margin-bottom: 16px;
    }

    th {
      background: #f8fafc;
      border: 1.5px solid #0f172a;
      padding: 8px 10px;
      font-weight: 800;
      text-align: left;
    }

    td {
      border: 1.5px solid #0f172a;
      padding: 7px 10px;
      vertical-align: top;
    }

    .content-box {
      border: 2px solid #0f172a;
      padding: 16px 20px;
      background: #ffffff;
      margin-bottom: 20px;
      page-break-inside: auto;
    }

    .doc-footer {
      border-top: 1.5px solid #cbd5e1;
      padding-top: 10px;
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      color: #64748b;
      font-family: 'IBM Plex Mono', monospace;
    }
  </style>
</head>
<body>
  <div class="doc-header">
    <div>
      <div class="brand-title">PATHFINDER INDIA • OFFICIAL STATUTORY DOSSIER</div>
      <div class="doc-title">${title}</div>
      ${subtitle ? `<div class="doc-subtitle">${subtitle}</div>` : ''}
    </div>
    ${badge ? `<div class="badge-tag">${badge}</div>` : ''}
  </div>

  ${routeBreadcrumb ? `<div class="route-bar"><strong>${locale === 'hi' ? 'चयनित मार्ग:' : 'Selected Route:'}</strong> ${routeBreadcrumb}</div>` : ''}

  ${tableHtml ? `<div class="table-container">${tableHtml}</div>` : ''}

  <div class="content-box">
    ${formattedContent}
  </div>

  <div class="doc-footer">
    <span>PathFinder India — Uttar Pradesh & National Education Protocol</span>
    <span>Generated: ${new Date().toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
  </div>

  <script>
    window.onload = function() {
      window.focus();
      window.print();
    };
  </script>
</body>
</html>
`;

  const printFrame = document.createElement('iframe');
  printFrame.style.position = 'fixed';
  printFrame.style.right = '0';
  printFrame.style.bottom = '0';
  printFrame.style.width = '0';
  printFrame.style.height = '0';
  printFrame.style.border = '0';
  document.body.appendChild(printFrame);

  const frameDoc = printFrame.contentWindow?.document || printFrame.contentDocument;
  if (frameDoc) {
    frameDoc.open();
    frameDoc.write(html);
    frameDoc.close();

    // Clean up frame after printing
    setTimeout(() => {
      document.body.removeChild(printFrame);
    }, 2000);
  }
}
