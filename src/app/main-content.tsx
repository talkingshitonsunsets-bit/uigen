"use client";

import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FileSystemProvider } from "@/lib/contexts/file-system-context";
import { ChatProvider } from "@/lib/contexts/chat-context";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { FileTree } from "@/components/editor/FileTree";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { PreviewFrame } from "@/components/preview/PreviewFrame";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeaderActions } from "@/components/HeaderActions";
import { Sparkles, Eye, Code2, Zap } from "lucide-react";

interface MainContentProps {
  user?: {
    id: string;
    email: string;
  } | null;
  project?: {
    id: string;
    name: string;
    messages: any[];
    data: any;
    createdAt: Date;
    updatedAt: Date;
  };
}

export function MainContent({ user, project }: MainContentProps) {
  const [activeView, setActiveView] = useState<"preview" | "code">("preview");

  return (
    <FileSystemProvider initialData={project?.data}>
      <ChatProvider projectId={project?.id} initialMessages={project?.messages}>
        <div className="h-screen w-screen overflow-hidden bg-[#0f1117]">
          <ResizablePanelGroup id="main-panel-group" direction="horizontal" className="h-full">

            {/* ── Left Panel — Chat (dark) ── */}
            <ResizablePanel id="chat-panel" defaultSize={35} minSize={25} maxSize={50}>
              <div className="h-full flex flex-col" style={{background: "linear-gradient(160deg, #12111a 0%, #0d0d14 50%, #0f1117 100%)"}}>

                {/* Brand header */}
                <div className="h-14 flex items-center justify-between px-5 flex-shrink-0 relative" style={{borderBottom: "1px solid rgba(255,255,255,0.055)"}}>
                  {/* Subtle violet shimmer at bottom of header */}
                  <div className="absolute bottom-0 left-5 right-5 h-px" style={{background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)"}} />
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 rounded-xl bg-violet-500/30 blur-md scale-125" />
                      <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-violet-600/50">
                        <Sparkles className="h-[15px] w-[15px] text-white" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-white font-bold text-[14px] leading-none tracking-tight">UIGen</h1>
                      <p className="text-[10px] mt-[3px] font-medium tracking-[0.2em] uppercase" style={{color: "rgba(139,92,246,0.7)"}}>AI Studio</p>
                    </div>
                  </div>
                  {/* subtle version badge */}
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{background: "rgba(139,92,246,0.1)", color: "rgba(139,92,246,0.6)", border: "1px solid rgba(139,92,246,0.18)"}}>beta</span>
                </div>

                {/* Chat */}
                <div className="flex-1 overflow-hidden">
                  <ChatInterface />
                </div>

                {/* Model attribution footer */}
                <div className="flex-shrink-0 flex items-center justify-center pb-2 pt-1" style={{borderTop: "1px solid rgba(255,255,255,0.04)"}}>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{background: "rgba(255,255,255,0.03)"}}>
                    <Zap className="w-2.5 h-2.5" style={{color: "rgba(139,92,246,0.5)"}} />
                    <span className="text-[10px] font-medium" style={{color: "rgba(255,255,255,0.2)"}}>Powered by Claude</span>
                  </div>
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle
              id="main-resize-handle"
              className="relative w-px transition-colors duration-200 group"
              style={{background: "linear-gradient(180deg, transparent 0%, rgba(139,92,246,0.25) 20%, rgba(139,92,246,0.35) 50%, rgba(139,92,246,0.25) 80%, transparent 100%)"}}
            />

            {/* ── Right Panel — Preview/Code (light) ── */}
            <ResizablePanel id="preview-panel" defaultSize={65}>
              <div className="h-full flex flex-col bg-white">

                {/* Toolbar */}
                <div className="h-14 px-5 flex items-center justify-between flex-shrink-0 bg-white" style={{borderBottom: "1px solid #ebebed", boxShadow: "0 1px 3px rgba(0,0,0,0.04)"}}>
                  <Tabs
                    id="main-tabs"
                    value={activeView}
                    onValueChange={(v) => setActiveView(v as "preview" | "code")}
                  >
                    <TabsList className="bg-neutral-100/80 p-0.5 h-8 rounded-lg border border-neutral-200/60">
                      <TabsTrigger
                        value="preview"
                        className="data-[state=active]:bg-white data-[state=active]:text-violet-600 data-[state=active]:shadow-sm data-[state=active]:font-semibold text-neutral-400 hover:text-neutral-600 px-3 h-7 text-[13px] font-medium transition-all rounded-md flex items-center gap-1.5 relative"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Preview
                      </TabsTrigger>
                      <TabsTrigger
                        value="code"
                        className="data-[state=active]:bg-white data-[state=active]:text-violet-600 data-[state=active]:shadow-sm data-[state=active]:font-semibold text-neutral-400 hover:text-neutral-600 px-3 h-7 text-[13px] font-medium transition-all rounded-md flex items-center gap-1.5 relative"
                      >
                        <Code2 className="h-3.5 w-3.5" />
                        Code
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  {/* Center status badge */}
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.12)"}}>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{boxShadow: "0 0 4px rgba(52,211,153,0.6)"}} />
                    <span className="text-[11px] font-medium" style={{color: "rgba(109,40,217,0.6)"}}>Live preview</span>
                  </div>
                  <HeaderActions user={user} projectId={project?.id} />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                  {activeView === "preview" ? (
                    <div
                      className="h-full relative"
                      style={{
                        backgroundColor: "#f7f8fa",
                        backgroundImage:
                          "radial-gradient(circle, #e2e4ea 1px, transparent 1px)",
                        backgroundSize: "28px 28px",
                      }}
                    >
                      {/* Corner accent decorations */}
                      <div className="absolute top-3 left-3 w-7 h-7 pointer-events-none z-10" style={{borderTop: "2px solid rgba(139,92,246,0.45)", borderLeft: "2px solid rgba(139,92,246,0.45)", borderRadius: "4px 0 0 0"}} />
                      <div className="absolute top-3 right-3 w-7 h-7 pointer-events-none z-10" style={{borderTop: "2px solid rgba(139,92,246,0.45)", borderRight: "2px solid rgba(139,92,246,0.45)", borderRadius: "0 4px 0 0"}} />
                      <div className="absolute bottom-3 left-3 w-7 h-7 pointer-events-none z-10" style={{borderBottom: "2px solid rgba(139,92,246,0.45)", borderLeft: "2px solid rgba(139,92,246,0.45)", borderRadius: "0 0 0 4px"}} />
                      <div className="absolute bottom-3 right-3 w-7 h-7 pointer-events-none z-10" style={{borderBottom: "2px solid rgba(139,92,246,0.45)", borderRight: "2px solid rgba(139,92,246,0.45)", borderRadius: "0 0 4px 0"}} />
                      <PreviewFrame />
                    </div>
                  ) : (
                    <ResizablePanelGroup
                      id="code-panel-group"
                      direction="horizontal"
                      className="h-full"
                    >
                      <ResizablePanel id="file-tree-panel" defaultSize={30} minSize={20} maxSize={50}>
                        <div className="h-full bg-[#fafafa] border-r border-neutral-100">
                          <FileTree />
                        </div>
                      </ResizablePanel>
                      <ResizableHandle
                        id="code-resize-handle"
                        className="w-px bg-neutral-100 hover:bg-violet-400/50 transition-colors duration-200"
                      />
                      <ResizablePanel id="code-editor-panel" defaultSize={70}>
                        <div className="h-full bg-white">
                          <CodeEditor />
                        </div>
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  )}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </ChatProvider>
    </FileSystemProvider>
  );
}
