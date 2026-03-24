"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  return (
    <div className={cn("prose leading-tight max-w-none", className)}>
      <ReactMarkdown
        components={{
          code: ({ children, className, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match;

            if (isInline) {
              return (
                <code
                  className="not-prose text-[12px] px-1.5 py-0.5 rounded font-mono"
                  style={{
                    background: "rgba(139,92,246,0.15)",
                    color: "rgba(196,181,253,0.95)",
                    border: "1px solid rgba(139,92,246,0.2)",
                  }}
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={cn("text-[12px]", className)} {...props}>
                {children}
              </code>
            );
          },
          p: ({ children, ...props }) => (
            <p className="mb-1.5 last:mb-0 text-[13px] leading-relaxed" style={{color: "rgba(255,255,255,0.75)"}} {...props}>{children}</p>
          ),
          ul: ({ children, ...props }) => (
            <ul className="my-1.5 space-y-1 list-none pl-0" {...props}>{children}</ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="my-1.5 space-y-1 list-none pl-0 counter-reset-item" {...props}>{children}</ol>
          ),
          li: ({ children, ...props }) => (
            <li className="flex items-start gap-2 text-[13px] leading-relaxed" style={{color: "rgba(255,255,255,0.7)"}} {...props}>
              <span className="mt-[7px] w-1 h-1 rounded-full flex-shrink-0" style={{background: "rgba(139,92,246,0.7)"}} />
              <span>{children}</span>
            </li>
          ),
          strong: ({ children, ...props }) => (
            <strong className="font-semibold not-italic" style={{color: "rgba(255,255,255,0.95)"}} {...props}>{children}</strong>
          ),
          h1: ({ children, ...props }) => (
            <h1 className="text-[15px] font-bold mb-2 mt-3 first:mt-0" style={{color: "rgba(255,255,255,0.95)"}} {...props}>{children}</h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-[14px] font-semibold mb-1.5 mt-2.5 first:mt-0" style={{color: "rgba(255,255,255,0.9)"}} {...props}>{children}</h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-[13px] font-semibold mb-1 mt-2 first:mt-0" style={{color: "rgba(255,255,255,0.85)"}} {...props}>{children}</h3>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
