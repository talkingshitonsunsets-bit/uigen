"use client";

import { Loader2, FilePlus, FilePen, Eye, Trash2, FolderInput } from "lucide-react";

export interface ToolInvocationLike {
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
  state: "partial-call" | "call" | "result";
  result?: unknown;
}

interface ToolCallBadgeProps {
  tool: ToolInvocationLike;
}

function getFilename(path: unknown): string {
  if (typeof path !== "string" || !path) return "";
  return path.split("/").filter(Boolean).pop() ?? path;
}

interface ToolLabel {
  label: string;
  icon: React.ReactNode;
}

export function getToolLabel(toolName: string, args: Record<string, unknown>): ToolLabel {
  const command = typeof args.command === "string" ? args.command : "";
  const filename = getFilename(args.path);

  if (toolName === "str_replace_editor") {
    switch (command) {
      case "create":
        return {
          label: `Creating ${filename}`,
          icon: <FilePlus className="w-3 h-3" />,
        };
      case "str_replace":
      case "insert":
        return {
          label: `Editing ${filename}`,
          icon: <FilePen className="w-3 h-3" />,
        };
      case "view":
        return {
          label: `Reading ${filename}`,
          icon: <Eye className="w-3 h-3" />,
        };
      default:
        return {
          label: filename ? `Updating ${filename}` : "Updating file",
          icon: <FilePen className="w-3 h-3" />,
        };
    }
  }

  if (toolName === "file_manager") {
    const newFilename = getFilename(args.new_path);
    switch (command) {
      case "rename":
        return {
          label: `Renaming ${filename}${newFilename ? ` → ${newFilename}` : ""}`,
          icon: <FolderInput className="w-3 h-3" />,
        };
      case "delete":
        return {
          label: `Deleting ${filename}`,
          icon: <Trash2 className="w-3 h-3" />,
        };
    }
  }

  // Fallback for unknown tools
  return {
    label: toolName,
    icon: null,
  };
}

export function ToolCallBadge({ tool }: ToolCallBadgeProps) {
  const isDone = tool.state === "result" && tool.result !== undefined;
  const { label, icon } = getToolLabel(tool.toolName, tool.args);

  return (
    <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1.5 bg-white/[0.05] rounded-lg text-[11px] border border-white/[0.08]">
      {isDone ? (
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-violet-400 flex-shrink-0" />
      )}
      {icon && (
        <span className="text-white/30 flex items-center">{icon}</span>
      )}
      <span className="text-white/50 font-mono tracking-tight">{label}</span>
    </div>
  );
}
