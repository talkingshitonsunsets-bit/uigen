"use client";

import { Message } from "ai";
import { cn } from "@/lib/utils";
import { Sparkles, User, Loader2 } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { ToolCallBadge } from "./ToolCallBadge";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="flex flex-col px-4 py-5 space-y-5">
      {messages.map((message) => (
        <div
          key={message.id || message.content}
          className={cn(
            "flex gap-3",
            message.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          {/* AI avatar */}
          {message.role === "assistant" && (
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/30">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
          )}

          <div className={cn(
            "flex flex-col gap-1.5 max-w-[82%]",
            message.role === "user" ? "items-end" : "items-start"
          )}>
            <div className={cn(
              "rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed",
              message.role === "user"
                ? "bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-tr-md shadow-lg shadow-violet-500/20"
                : "bg-white/[0.06] text-white/85 border border-white/[0.08] rounded-tl-md"
            )}>
              {message.parts ? (
                <>
                  {message.parts.map((part, partIndex) => {
                    switch (part.type) {
                      case "text":
                        return message.role === "user" ? (
                          <span key={partIndex} className="whitespace-pre-wrap">{part.text}</span>
                        ) : (
                          <MarkdownRenderer
                            key={partIndex}
                            content={part.text}
                            className="prose-sm prose-invert"
                          />
                        );
                      case "reasoning":
                        return (
                          <div key={partIndex} className="mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
                            <span className="text-[11px] font-medium text-white/40 uppercase tracking-wider block mb-1">Reasoning</span>
                            <span className="text-[13px] text-white/60">{part.reasoning}</span>
                          </div>
                        );
                      case "tool-invocation":
                        return (
                          <ToolCallBadge
                            key={partIndex}
                            tool={part.toolInvocation}
                          />
                        );
                      case "step-start":
                        return partIndex > 0 ? (
                          <hr key={partIndex} className="my-3 border-white/10" />
                        ) : null;
                      default:
                        return null;
                    }
                  })}
                  {isLoading &&
                    message.role === "assistant" &&
                    messages.indexOf(message) === messages.length - 1 && (
                      <div className="flex items-center gap-2 mt-2 text-white/30">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span className="text-[12px]">Generating…</span>
                      </div>
                    )}
                </>
              ) : message.content ? (
                message.role === "user" ? (
                  <span className="whitespace-pre-wrap">{message.content}</span>
                ) : (
                  <MarkdownRenderer content={message.content} className="prose-sm prose-invert" />
                )
              ) : isLoading &&
                message.role === "assistant" &&
                messages.indexOf(message) === messages.length - 1 ? (
                <div className="flex items-center gap-2 text-white/30">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-[12px]">Generating…</span>
                </div>
              ) : null}
            </div>
          </div>

          {/* User avatar */}
          {message.role === "user" && (
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-white/60" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
