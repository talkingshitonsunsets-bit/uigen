"use client";

import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useFileSystem } from "@/lib/contexts/file-system-context";
import { Code2 } from "lucide-react";

export function CodeEditor() {
  const { selectedFile, getFileContent, updateFile } = useFileSystem();
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value: string | undefined) => {
    if (selectedFile && value !== undefined) {
      updateFile(selectedFile, value);
    }
  };

  const getLanguageFromPath = (path: string): string => {
    const extension = path.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'json':
        return 'json';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      case 'md':
        return 'markdown';
      default:
        return 'plaintext';
    }
  };

  if (!selectedFile) {
    return (
      <div className="h-full flex items-center justify-center" style={{background: "#1e1e2e"}}>
        <div className="text-center">
          <div className="relative inline-flex mb-5">
            <div className="absolute inset-0 rounded-2xl blur-xl scale-150" style={{background: "rgba(139,92,246,0.15)"}} />
            <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center" style={{background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)"}}>
              <Code2 className="h-7 w-7" style={{color: "rgba(167,139,250,0.8)"}} />
            </div>
          </div>
          <p className="text-[13px] font-medium mb-1" style={{color: "rgba(255,255,255,0.5)"}}>
            Select a file to edit
          </p>
          <p className="text-[11px]" style={{color: "rgba(255,255,255,0.25)"}}>
            Choose a file from the file tree
          </p>
        </div>
      </div>
    );
  }

  const content = getFileContent(selectedFile) || '';
  const language = getLanguageFromPath(selectedFile);

  return (
    <Editor
      height="100%"
      language={language}
      value={content}
      onChange={handleEditorChange}
      onMount={handleEditorDidMount}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 13,
        fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Menlo, Monaco, 'Courier New', monospace",
        fontLigatures: true,
        lineHeight: 22,
        lineNumbers: 'on',
        lineNumbersMinChars: 3,
        roundedSelection: true,
        scrollBeyondLastLine: false,
        readOnly: false,
        automaticLayout: true,
        wordWrap: 'on',
        padding: { top: 20, bottom: 20 },
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        smoothScrolling: true,
        renderLineHighlight: 'gutter',
        bracketPairColorization: { enabled: true },
        guides: { bracketPairs: true },
      }}
    />
  );
}