"use client";

import { useEffect, useRef } from "react";
import { Sparkles, Layers, MousePointer2, LayoutTemplate, ArrowRight } from "lucide-react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/lib/contexts/chat-context";

const SUGGESTIONS = [
  { icon: Layers, label: "Pricing card", sub: "3 tiers with toggle" },
  { icon: MousePointer2, label: "Auth form", sub: "Sign in with social" },
  { icon: LayoutTemplate, label: "Dashboard stats", sub: "KPI grid with charts" },
];

const TECH_TAGS = ["React", "Tailwind CSS", "shadcn/ui", "TypeScript"];

function syntheticChange(value: string): React.ChangeEvent<HTMLTextAreaElement> {
  const el = document.createElement("textarea");
  el.value = value;
  return { target: el, currentTarget: el } as unknown as React.ChangeEvent<HTMLTextAreaElement>;
}

export function ChatInterface() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { messages, input, handleInputChange, handleSubmit, status } = useChat();

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center relative">
          {/* Ambient background glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full" style={{background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 65%)"}} />
            <div className="absolute bottom-1/3 left-1/4 w-32 h-32 rounded-full" style={{background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 65%)"}} />
          </div>

          {/* Glow orb behind icon */}
          <div className="relative mb-7 z-10">
            <div className="absolute inset-0 rounded-2xl bg-violet-500/25 blur-2xl scale-[2]" />
            <div className="absolute inset-0 rounded-2xl bg-indigo-500/15 blur-xl scale-[1.7]" />
            <div className="relative w-[60px] h-[60px] rounded-2xl bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-700 flex items-center justify-center shadow-2xl shadow-violet-500/40">
              <Sparkles className="h-7 w-7 text-white drop-shadow-sm" />
            </div>
          </div>

          <h2 className="font-bold text-[18px] leading-snug tracking-tight mb-2.5 z-10" style={{background: "linear-gradient(135deg, #ffffff 0%, rgba(196,181,253,0.9) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"}}>
            Describe what you want to build
          </h2>
          <p className="text-white/40 text-[13px] leading-relaxed max-w-[220px] z-10">
            I'll generate a polished React component in seconds
          </p>

          {/* Quick suggestion chips */}
          <div className="mt-7 flex flex-col gap-2 w-full max-w-[270px]">
            <div className="flex items-center gap-2 mb-1">
              <div className="h-px flex-1" style={{background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.2))"}} />
              <p className="text-[10px] font-semibold tracking-[0.15em] uppercase" style={{color:"rgba(255,255,255,0.2)"}}>Quick start</p>
              <div className="h-px flex-1" style={{background: "linear-gradient(90deg, rgba(139,92,246,0.2), transparent)"}} />
            </div>
            {SUGGESTIONS.map(({ icon: Icon, label, sub }) => (
              <button
                key={label}
                onClick={() => handleInputChange(syntheticChange(`Create a ${label.toLowerCase()} component`))}
                className="group flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-left relative overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.12)";
                  (e.currentTarget as HTMLElement).style.border = "1px solid rgba(139,92,246,0.3)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(139,92,246,0.12)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                  (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.07)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {/* Left accent bar */}
                <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{background: "linear-gradient(180deg, rgba(139,92,246,0.8), rgba(99,102,241,0.8))"}} />
                <span className="flex items-center gap-2.5 min-w-0">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg flex-shrink-0" style={{background: "rgba(139,92,246,0.18)", border: "1px solid rgba(139,92,246,0.2)"}}>
                    <Icon className="h-3 w-3" style={{color:"rgba(196,181,253,0.95)"}} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-medium" style={{color: "rgba(255,255,255,0.65)"}}>{label}</span>
                    <span className="block text-[11px] mt-0.5" style={{color: "rgba(255,255,255,0.25)"}}>{sub}</span>
                  </span>
                </span>
                <ArrowRight className="h-3 w-3 flex-shrink-0 opacity-0 group-hover:opacity-60 transition-all duration-200 group-hover:translate-x-0.5" style={{color:"rgba(139,92,246,0.8)"}} />
              </button>
            ))}

            {/* Tech stack tags — fills dead space, shows supported stack */}
            <div className="flex items-center gap-1.5 mt-3 flex-wrap justify-center pt-1">
              {TECH_TAGS.map(tag => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.25)"}}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <ScrollArea ref={scrollAreaRef} className="flex-1 overflow-hidden">
          <div className="pr-2">
            <MessageList messages={messages} isLoading={status === "streaming"} />
          </div>
        </ScrollArea>
      )}

      {/* Fade gradient above input */}
      <div className="flex-shrink-0 relative">
        <div className="absolute -top-8 left-0 right-0 h-8 pointer-events-none" style={{background: "linear-gradient(to bottom, transparent, #0f1117)"}} />
        <MessageInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={status === "submitted" || status === "streaming"}
        />
      </div>
    </div>
  );
}
