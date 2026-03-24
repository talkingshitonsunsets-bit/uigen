"use client";

import { ChangeEvent, FormEvent, KeyboardEvent } from "react";
import { ArrowUp } from "lucide-react";

interface MessageInputProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function MessageInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: MessageInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) form.requestSubmit();
    }
  };

  const canSubmit = !isLoading && input.trim().length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="px-4 pb-4 pt-2"
    >
      <div className="relative rounded-2xl bg-white/[0.06] border border-white/[0.09] focus-within:border-violet-500/40 focus-within:bg-white/[0.08] focus-within:shadow-[0_0_0_3px_rgba(139,92,246,0.08),0_8px_24px_rgba(139,92,246,0.12)] transition-all duration-200">
        <textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="e.g. a SaaS pricing card with 3 tiers and a toggle…"
          disabled={isLoading}
          rows={3}
          className="w-full pl-4 pr-12 pt-3.5 pb-3 bg-transparent text-white/90 placeholder:text-white/20 text-[14px] leading-relaxed resize-none focus:outline-none min-h-[80px] max-h-[180px]"
        />
        <button
          type="submit"
          disabled={!canSubmit}
          aria-label="Send message"
          className={`absolute right-3 bottom-3 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150
            ${canSubmit
              ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 active:scale-95"
              : "bg-white/[0.05] text-white/20 cursor-not-allowed"
            }`}
        >
          <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>
      <div className="flex items-center justify-center gap-3 mt-2.5">
        <span className="flex items-center gap-1 text-white/20 text-[11px]">
          <kbd className="font-mono bg-white/[0.07] border border-white/[0.08] px-1.5 py-0.5 rounded-md text-[10px] text-white/30">↵</kbd>
          <span>send</span>
        </span>
        <span className="text-white/10">·</span>
        <span className="flex items-center gap-1 text-white/20 text-[11px]">
          <kbd className="font-mono bg-white/[0.07] border border-white/[0.08] px-1.5 py-0.5 rounded-md text-[10px] text-white/30">⇧↵</kbd>
          <span>new line</span>
        </span>
      </div>
    </form>
  );
}
