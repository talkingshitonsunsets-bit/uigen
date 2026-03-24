"use client";

import { useEffect, useRef, useState } from "react";
import { useFileSystem } from "@/lib/contexts/file-system-context";
import {
  createImportMap,
  createPreviewHTML,
} from "@/lib/transform/jsx-transformer";
import { AlertCircle } from "lucide-react";

export function PreviewFrame() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { getAllFiles, refreshTrigger } = useFileSystem();
  const [error, setError] = useState<string | null>(null);
  const [entryPoint, setEntryPoint] = useState<string>("/App.jsx");
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    const updatePreview = () => {
      try {
        const files = getAllFiles();

        // Clear error first when we have files
        if (files.size > 0 && error) {
          setError(null);
        }

        // Find the entry point - look for App.jsx, App.tsx, index.jsx, or index.tsx
        let foundEntryPoint = entryPoint;
        const possibleEntries = [
          "/App.jsx",
          "/App.tsx",
          "/index.jsx",
          "/index.tsx",
          "/src/App.jsx",
          "/src/App.tsx",
        ];

        if (!files.has(entryPoint)) {
          const found = possibleEntries.find((path) => files.has(path));
          if (found) {
            foundEntryPoint = found;
            setEntryPoint(found);
          } else if (files.size > 0) {
            // Just use the first .jsx/.tsx file found
            const firstJSX = Array.from(files.keys()).find(
              (path) => path.endsWith(".jsx") || path.endsWith(".tsx")
            );
            if (firstJSX) {
              foundEntryPoint = firstJSX;
              setEntryPoint(firstJSX);
            }
          }
        }

        if (files.size === 0) {
          if (isFirstLoad) {
            setError("firstLoad");
          } else {
            setError("No files to preview");
          }
          return;
        }

        // We have files, so it's no longer the first load
        if (isFirstLoad) {
          setIsFirstLoad(false);
        }

        if (!foundEntryPoint || !files.has(foundEntryPoint)) {
          setError(
            "No React component found. Create an App.jsx or index.jsx file to get started."
          );
          return;
        }

        const { importMap, styles, errors } = createImportMap(files);
        const previewHTML = createPreviewHTML(foundEntryPoint, importMap, styles, errors);

        if (iframeRef.current) {
          const iframe = iframeRef.current;

          // Need both allow-scripts and allow-same-origin for blob URLs in import map
          iframe.setAttribute(
            "sandbox",
            "allow-scripts allow-same-origin allow-forms"
          );
          iframe.srcdoc = previewHTML;

          setError(null);
        }
      } catch (err) {
        console.error("Preview error:", err);
        setError(err instanceof Error ? err.message : "Unknown preview error");
      }
    };

    updatePreview();
  }, [refreshTrigger, getAllFiles, entryPoint, error, isFirstLoad]);

  if (error) {
    if (error === "firstLoad") {
      return (
        <div
          className="h-full flex items-center justify-center p-8 relative overflow-hidden"
          style={{
            backgroundColor: "#f7f8fa",
            backgroundImage: "radial-gradient(circle, #e2e4ea 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        >
          {/* Large ambient radial glow behind center */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(139,92,246,0.07) 0%, rgba(99,102,241,0.04) 40%, transparent 70%)",
            }}
          />
          {/* Subtle top-left warm accent */}
          <div
            className="absolute -top-32 -left-32 w-96 h-96 pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 65%)",
            }}
          />
          <div className="text-center max-w-sm relative">
            <div className="relative inline-flex mb-7">
              {/* Multi-layer glow for depth */}
              <div className="absolute inset-0 rounded-3xl bg-violet-400/25 blur-2xl scale-[2]" />
              <div className="absolute inset-0 rounded-3xl bg-indigo-400/15 blur-xl scale-[1.6]" />
              <div className="relative inline-flex items-center justify-center w-[72px] h-[72px] rounded-3xl bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-700 shadow-2xl shadow-violet-500/40">
                <svg className="h-9 w-9 text-white drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <h3 className="text-[20px] font-bold text-neutral-800 mb-2.5 tracking-tight leading-tight">
              Your canvas is ready
            </h3>
            <p className="text-[13.5px] leading-relaxed" style={{color: "rgba(109,40,217,0.55)"}}>
              Describe a component in the chat<br />and it'll appear here instantly
            </p>
            {/* Decorative dots */}
            <div className="flex items-center justify-center gap-1.5 mt-6">
              <div className="w-1 h-1 rounded-full" style={{background: "rgba(139,92,246,0.3)"}} />
              <div className="w-1.5 h-1.5 rounded-full" style={{background: "rgba(139,92,246,0.5)"}} />
              <div className="w-1 h-1 rounded-full" style={{background: "rgba(139,92,246,0.3)"}} />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className="h-full flex items-center justify-center p-8"
        style={{
          backgroundColor: "#f7f8fa",
          backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="text-center max-w-sm">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 border border-red-100 mb-4 shadow-sm">
            <AlertCircle className="h-7 w-7 text-red-400" />
          </div>
          <h3 className="text-[16px] font-semibold text-neutral-800 mb-2">
            Preview Error
          </h3>
          <p className="text-[13px] text-neutral-500 leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full border-0 bg-white"
      title="Preview"
    />
  );
}
