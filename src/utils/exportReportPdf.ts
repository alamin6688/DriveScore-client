import type { ReportAnalysisView } from "@/service/reports/reportsApi";

type PdfPage = {
  commands: string[];
};

type ReportPdfOptions = {
  includeTransactions?: boolean;
};

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN_X = 44;
const FOOTER_Y = 30;

const pdfEscape = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[^\x20-\x7E]/g, " ");

const sanitizeFileName = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "report";

const rgb = (r: number, g: number, b: number) =>
  `${(r / 255).toFixed(3)} ${(g / 255).toFixed(3)} ${(b / 255).toFixed(3)}`;

const truncate = (value: string, maxLength: number) =>
  value.length > maxLength
    ? `${value.slice(0, Math.max(0, maxLength - 3))}...`
    : value;

const wrapText = (value: string, maxChars: number) => {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
      return;
    }
    current = next;
  });

  if (current) lines.push(current);
  return lines.length ? lines : ["N/A"];
};

const addText = (
  page: PdfPage,
  text: string,
  x: number,
  y: number,
  options: { size?: number; color?: string; font?: "F1" | "F2" } = {},
) => {
  const size = options.size || 10;
  const font = options.font || "F1";
  const color = options.color || rgb(17, 24, 39);
  page.commands.push(
    `${color} rg BT /${font} ${size} Tf ${x} ${y} Td (${pdfEscape(text)}) Tj ET`,
  );
};

const addRect = (
  page: PdfPage,
  x: number,
  y: number,
  width: number,
  height: number,
  options: { fill?: string; stroke?: string; lineWidth?: number } = {},
) => {
  if (options.fill) {
    page.commands.push(`${options.fill} rg ${x} ${y} ${width} ${height} re f`);
  }

  if (options.stroke) {
    page.commands.push(
      `${options.lineWidth || 1} w ${options.stroke} RG ${x} ${y} ${width} ${height} re S`,
    );
  }
};

const addLine = (
  page: PdfPage,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
) => {
  page.commands.push(`1 w ${color} RG ${x1} ${y1} m ${x2} ${y2} l S`);
};

export const createReportAnalysisPdfBlob = (
  analysis: ReportAnalysisView,
  options: ReportPdfOptions = {},
) => {
  const includeTransactions = options.includeTransactions ?? true;
  const pages: PdfPage[] = [{ commands: [] }];
  let page = pages[0];
  let y = 742;

  const newPage = () => {
    page = { commands: [] };
    pages.push(page);
    y = 742;
  };

  const ensureSpace = (height: number) => {
    if (y - height < 58) newPage();
  };

  const addSectionTitle = (title: string) => {
    ensureSpace(34);
    y -= 20;
    addText(page, title, MARGIN_X, y, {
      size: 13,
      font: "F2",
      color: rgb(17, 24, 39),
    });
    y -= 10;
    addLine(page, MARGIN_X, y, PAGE_WIDTH - MARGIN_X, y, rgb(229, 231, 235));
    y -= 18;
  };

  const titleLines = wrapText(analysis.title || "Financial Report", 44).slice(
    0,
    2,
  );
  const headerBottomY = titleLines.length > 1 ? 684 : 704;
  const headerHeight = PAGE_HEIGHT - headerBottomY;

  addRect(page, 0, headerBottomY, PAGE_WIDTH, headerHeight, {
    fill: rgb(232, 245, 233),
  });
  addRect(page, 0, headerBottomY, 8, headerHeight, { fill: rgb(76, 175, 80) });
  addText(page, "ACCUSUM", MARGIN_X, 756, {
    size: 11,
    font: "F2",
    color: rgb(37, 130, 0),
  });
  titleLines.forEach((line, index) => {
    addText(
      page,
      index === 1 ? truncate(line, 47) : line,
      MARGIN_X,
      732 - index * 18,
      {
        size: titleLines.length > 1 ? 17 : 22,
        font: "F2",
        color: rgb(3, 7, 18),
      },
    );
  });
  addText(
    page,
    `${analysis.type || "N/A"}  |  ${analysis.generatedAt || "N/A"}`,
    MARGIN_X,
    titleLines.length > 1 ? 694 : 714,
    {
      size: 9,
      color: rgb(75, 85, 99),
    },
  );

  y = titleLines.length > 1 ? 656 : 676;
  const infoCards = [
    { label: "Period", value: analysis.periodText || "N/A" },
    { label: "Currency", value: analysis.currency || "N/A" },
    { label: "Document", value: analysis.documentType || "N/A" },
  ];
  const cardWidth = 164;
  infoCards.forEach((card, index) => {
    const x = MARGIN_X + index * (cardWidth + 14);
    addRect(page, x, y - 48, cardWidth, 48, {
      fill: rgb(249, 250, 251),
      stroke: rgb(229, 231, 235),
    });
    addText(page, card.label.toUpperCase(), x + 12, y - 17, {
      size: 7,
      font: "F2",
      color: rgb(156, 163, 175),
    });
    addText(page, truncate(card.value, 25), x + 12, y - 34, {
      size: 9,
      font: "F2",
      color: rgb(17, 24, 39),
    });
  });

  y -= 74;
  addSectionTitle("Executive Summary");
  wrapText(analysis.summary || "No summary available.", 92)
    .slice(0, 3)
    .forEach((line) => {
      addText(page, line, MARGIN_X, y, { size: 9, color: rgb(75, 85, 99) });
      y -= 14;
    });

  addSectionTitle("Key Metrics");
  const metricWidth = 120;
  analysis.metrics.slice(0, 4).forEach((metric, index) => {
    const x = MARGIN_X + index * (metricWidth + 10);
    addRect(page, x, y - 58, metricWidth, 58, {
      fill: rgb(255, 255, 255),
      stroke: rgb(229, 231, 235),
    });
    addText(page, metric.label.toUpperCase(), x + 10, y - 18, {
      size: 7,
      font: "F2",
      color: rgb(107, 114, 128),
    });
    addText(page, metric.value, x + 10, y - 39, {
      size: 14,
      font: "F2",
      color:
        metric.label.toLowerCase() === "net income"
          ? rgb(76, 175, 80)
          : rgb(17, 24, 39),
    });
  });
  y -= 78;

  const netIncome = analysis.metrics.find(
    (metric) => metric.label.toLowerCase() === "net income",
  );
  if (netIncome) {
    ensureSpace(44);
    addRect(page, MARGIN_X, y - 38, PAGE_WIDTH - MARGIN_X * 2, 38, {
      fill: rgb(232, 245, 233),
      stroke: rgb(76, 175, 80),
      lineWidth: 1.5,
    });
    addText(page, "Net Income", MARGIN_X + 14, y - 24, {
      size: 10,
      font: "F2",
      color: rgb(17, 24, 39),
    });
    addText(page, netIncome.value, PAGE_WIDTH - 150, y - 24, {
      size: 14,
      font: "F2",
      color: rgb(76, 175, 80),
    });
    y -= 56;
  }

  addSectionTitle("Account Details");
  analysis.accountDetails.slice(0, 14).forEach((detail, index) => {
    ensureSpace(24);
    const rowY = y - 18;
    if (index % 2 === 0) {
      addRect(page, MARGIN_X, rowY - 5, PAGE_WIDTH - MARGIN_X * 2, 24, {
        fill: rgb(249, 250, 251),
      });
    }
    addText(page, detail.label, MARGIN_X + 10, rowY + 2, {
      size: 9,
      color: rgb(75, 85, 99),
    });
    addText(page, detail.value, PAGE_WIDTH - 178, rowY + 2, {
      size: 9,
      font: "F2",
    });
    y -= 24;
  });

  if (includeTransactions) {
    addSectionTitle("Transactions");
    addRect(page, MARGIN_X, y - 24, PAGE_WIDTH - MARGIN_X * 2, 24, {
      fill: rgb(17, 24, 39),
    });
    addText(page, "Date", MARGIN_X + 10, y - 16, {
      size: 8,
      font: "F2",
      color: rgb(255, 255, 255),
    });
    addText(page, "Description", MARGIN_X + 80, y - 16, {
      size: 8,
      font: "F2",
      color: rgb(255, 255, 255),
    });
    addText(page, "Vendor", MARGIN_X + 286, y - 16, {
      size: 8,
      font: "F2",
      color: rgb(255, 255, 255),
    });
    addText(page, "Amount", PAGE_WIDTH - 112, y - 16, {
      size: 8,
      font: "F2",
      color: rgb(255, 255, 255),
    });
    y -= 30;

    analysis.transactions.slice(0, 18).forEach((transaction, index) => {
      ensureSpace(28);
      if (index % 2 === 0) {
        addRect(page, MARGIN_X, y - 17, PAGE_WIDTH - MARGIN_X * 2, 24, {
          fill: rgb(249, 250, 251),
        });
      }
      addText(page, truncate(transaction.date, 11), MARGIN_X + 10, y - 5, {
        size: 8,
        color: rgb(75, 85, 99),
      });
      addText(
        page,
        truncate(transaction.description, 36),
        MARGIN_X + 80,
        y - 5,
        { size: 8 },
      );
      addText(page, truncate(transaction.vendor, 18), MARGIN_X + 286, y - 5, {
        size: 8,
        color: rgb(75, 85, 99),
      });
      addText(page, String(transaction.amount), PAGE_WIDTH - 112, y - 5, {
        size: 8,
        font: "F2",
      });
      y -= 24;
    });
  }

  pages.forEach((pdfPage, index) => {
    addLine(
      pdfPage,
      MARGIN_X,
      48,
      PAGE_WIDTH - MARGIN_X,
      48,
      rgb(229, 231, 235),
    );
    addText(pdfPage, "Generated by Accusum", MARGIN_X, FOOTER_Y, {
      size: 8,
      color: rgb(156, 163, 175),
    });
    addText(
      pdfPage,
      `Page ${index + 1} of ${pages.length}`,
      PAGE_WIDTH - 104,
      FOOTER_Y,
      {
        size: 8,
        color: rgb(156, 163, 175),
      },
    );
  });

  const fontObjectIdsStart = 3 + pages.length;
  const contentObjectIdsStart = fontObjectIdsStart + 2;
  const pageKids = pages.map((_, index) => `${3 + index} 0 R`).join(" ");
  const objects: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Kids [${pageKids}] /Count ${pages.length} >>`,
  ];

  pages.forEach((_, index) => {
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 ${fontObjectIdsStart} 0 R /F2 ${
        fontObjectIdsStart + 1
      } 0 R >> >> /Contents ${contentObjectIdsStart + index} 0 R >>`,
    );
  });

  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");

  pages.forEach((pdfPage) => {
    const stream = pdfPage.commands.join("\n");
    objects.push(
      `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    );
  });

  let pdfBody = "%PDF-1.4\n";
  const offsets: number[] = [];

  objects.forEach((object, index) => {
    offsets.push(pdfBody.length);
    pdfBody += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdfBody.length;
  pdfBody += `xref\n0 ${objects.length + 1}\n`;
  pdfBody += "0000000000 65535 f \n";
  offsets.forEach((offset) => {
    pdfBody += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  });
  pdfBody += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdfBody += `startxref\n${xrefOffset}\n%%EOF\n`;

  const pdfBytes = new Uint8Array(pdfBody.length);
  for (let i = 0; i < pdfBody.length; i += 1) {
    pdfBytes[i] = pdfBody.charCodeAt(i);
  }

  return new Blob([pdfBytes.buffer], { type: "application/pdf" });
};

export const getReportAnalysisPdfFileName = (analysis: ReportAnalysisView) =>
  `${sanitizeFileName(analysis.title || "financial_report")}.pdf`;

export const createReportAnalysisPdfFile = (
  analysis: ReportAnalysisView,
  options: ReportPdfOptions = {},
) =>
  new File(
    [createReportAnalysisPdfBlob(analysis, options)],
    getReportAnalysisPdfFileName(analysis),
    {
      type: "application/pdf",
    },
  );

export const downloadReportAnalysisPdf = (
  analysis: ReportAnalysisView,
  options: ReportPdfOptions = {},
) => {
  const blob = createReportAnalysisPdfBlob(analysis, options);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = getReportAnalysisPdfFileName(analysis);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
