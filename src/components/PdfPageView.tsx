"use client";

/**
 * Една страница от PDF (react-pdf) за защитените четци. pdf.js иска браузърни
 * API (DOMMatrix…), затова четците зареждат този файл с
 * `dynamic(..., { ssr: false })` — иначе сървърът връща грешка 500.
 */

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import type { ReactNode } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDF_OPTIONS = { disableAutoFetch: true, disableStream: false };

export default function PdfPageView({
  file,
  pageNumber,
  scale,
  onLoadSuccess,
  onLoadError,
  loading,
  error,
  pageClassName,
}: {
  file: string | Blob;
  pageNumber: number;
  scale: number;
  onLoadSuccess: (pdf: { numPages: number }) => void;
  onLoadError: (err: Error) => void;
  loading?: ReactNode;
  error?: ReactNode;
  pageClassName?: string;
}) {
  return (
    <Document file={file} options={PDF_OPTIONS} onLoadSuccess={onLoadSuccess} onLoadError={onLoadError} loading={loading} error={error}>
      <Page pageNumber={pageNumber} scale={scale} renderTextLayer={false} renderAnnotationLayer={false} className={pageClassName} />
    </Document>
  );
}
