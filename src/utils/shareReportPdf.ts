import type { ReportAnalysisView } from "@/service/reports/reportsApi";
import { appAlert } from "@/utils/appAlert";
import {
  createReportAnalysisPdfFile,
  downloadReportAnalysisPdf,
} from "@/utils/exportReportPdf";

export const shareReportPdf = async (analysis: ReportAnalysisView) => {
  const pdfFile = createReportAnalysisPdfFile(analysis, {
    includeTransactions: false,
  });

  if (navigator.share && navigator.canShare?.({ files: [pdfFile] })) {
    try {
      await navigator.share({
        files: [pdfFile],
        title: analysis.title || "Accusum Financial Report",
        text: `Review this analyzed report: ${analysis.title}`,
      });
      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
    }
  }

  try {
    downloadReportAnalysisPdf(analysis, { includeTransactions: false });
    appAlert.fire({
      icon: "info",
      text: "Native PDF sharing is not available in this browser, so the analyzed PDF was downloaded.",
      timer: 2200,
      showConfirmButton: false,
    });
  } catch {
    appAlert.fire({
      icon: "error",
      text: "Could not prepare the analyzed PDF.",
    });
  }
};
