import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

type PdfPageInfo = {
  getViewport: (params: { scale: number }) => { width: number; height: number };
};

function PDFViewer({ url }: Readonly<{ url: string }>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const scaleByWidth = pageSize.width
    ? containerSize.width / pageSize.width
    : 1;
  const scaleByHeight = pageSize.height
    ? containerSize.height / pageSize.height
    : 1;
  const scale = Math.max(0.2, Math.min(scaleByWidth, scaleByHeight));

  return (
    <div ref={containerRef} className="h-full w-full overflow-hidden">
      {!url ? (
        <p className="p-4 text-center text-sm text-slate-500">
          No preview available.
        </p>
      ) : null}
      {url ? (
        <Document
          file={url}
          loading={
            <p className="p-4 text-center text-sm text-slate-500">
              Rendering PDF...
            </p>
          }
          error={
            <p className="p-4 text-center text-sm text-red-600">
              Unable to render PDF.
            </p>
          }
        >
          <div className="flex h-full w-full items-center justify-center">
            <Page
              pageNumber={1}
              scale={scale}
              onLoadSuccess={(page: PdfPageInfo) => {
                const viewport = page.getViewport({ scale: 1 });
                setPageSize({ width: viewport.width, height: viewport.height });
              }}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </div>
        </Document>
      ) : null}
    </div>
  );
}

export default PDFViewer;
