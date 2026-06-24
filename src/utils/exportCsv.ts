"use client";

type CellValue = string | number | boolean | null | undefined;

export type CsvRow = Record<string, CellValue>;

export type CsvSection = {
  title?: string;
  rows: CsvRow[];
};

const escapeCsvValue = (value: CellValue) => {
  const stringValue = String(value ?? "");

  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

const getHeaders = (rows: CsvRow[]) =>
  Array.from(new Set(rows.flatMap((row) => Object.keys(row))));

const downloadCsvContent = (csvContent: string, filename: string) => {
  const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportRowsToCsv = (rows: CsvRow[], filename: string) => {
  if (!rows.length) return false;

  const headers = getHeaders(rows);
  const csvContent = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(",")),
  ].join("\r\n");

  downloadCsvContent(csvContent, filename);

  return true;
};

export const exportSectionsToCsv = (sections: CsvSection[], filename: string) => {
  const csvSections = sections
    .filter((section) => section.rows.length)
    .map((section) => {
      const headers = getHeaders(section.rows);
      const lines = [
        ...(section.title ? [[section.title].map(escapeCsvValue).join(",")] : []),
        headers.map(escapeCsvValue).join(","),
        ...section.rows.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(",")),
      ];

      return lines.join("\r\n");
    });

  if (!csvSections.length) return false;

  downloadCsvContent(csvSections.join("\r\n\r\n"), filename);

  return true;
};
