"use client";

import { useState } from "react";
import { FileNode } from "@/lib/file-system";
import { useFileSystem } from "@/lib/contexts/file-system-context";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileCode,
  Files,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FileTreeNodeProps {
  node: FileNode;
  level: number;
}

function FileTreeNode({ node, level }: FileTreeNodeProps) {
  const { selectedFile, setSelectedFile } = useFileSystem();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleClick = () => {
    if (node.type === "directory") {
      setIsExpanded(!isExpanded);
    } else {
      setSelectedFile(node.path);
    }
  };

  const children =
    node.type === "directory" && node.children
      ? Array.from(node.children.values()).sort((a, b) => {
          // Directories first, then files
          if (a.type !== b.type) {
            return a.type === "directory" ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        })
      : [];

  const isSelected = selectedFile === node.path;

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-1.5 py-1.5 cursor-pointer text-[12.5px] transition-all duration-100 relative",
          isSelected
            ? "text-violet-700 font-medium"
            : "text-neutral-500 hover:text-neutral-800"
        )}
        style={{
          paddingLeft: `${level * 12 + 10}px`,
          paddingRight: "8px",
          background: isSelected
            ? "rgba(139,92,246,0.07)"
            : undefined,
        }}
        onMouseEnter={e => {
          if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.04)";
        }}
        onMouseLeave={e => {
          if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent";
        }}
        onClick={handleClick}
      >
        {/* Selected left indicator */}
        {isSelected && (
          <div className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full" style={{background: "rgba(139,92,246,0.7)"}} />
        )}
        {node.type === "directory" ? (
          <>
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 shrink-0 text-neutral-400" />
            ) : (
              <ChevronRight className="h-3 w-3 shrink-0 text-neutral-400" />
            )}
            {isExpanded ? (
              <FolderOpen className="h-3.5 w-3.5 shrink-0" style={{color: "rgba(139,92,246,0.7)"}} />
            ) : (
              <Folder className="h-3.5 w-3.5 shrink-0" style={{color: "rgba(139,92,246,0.6)"}} />
            )}
          </>
        ) : (
          <>
            <div className="w-3" />
            <FileCode className="h-3.5 w-3.5 shrink-0" style={{color: isSelected ? "rgba(109,40,217,0.8)" : "rgba(139,92,246,0.5)"}} />
          </>
        )}
        <span className="truncate">{node.name}</span>
      </div>
      {node.type === "directory" && isExpanded && children.length > 0 && (
        <div>
          {children.map((child) => (
            <FileTreeNode key={child.path} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree() {
  const { fileSystem, refreshTrigger } = useFileSystem();
  const rootNode = fileSystem.getNode("/");

  if (!rootNode || !rootNode.children || rootNode.children.size === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.12)"}}>
          <Files className="h-5 w-5" style={{color: "rgba(139,92,246,0.5)"}} />
        </div>
        <p className="text-[12px] font-medium text-neutral-500">No files yet</p>
        <p className="text-[11px] text-neutral-400 mt-0.5">Generate a component to start</p>
      </div>
    );
  }

  const rootChildren = Array.from(rootNode.children.values()).sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "directory" ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  const fileCount = rootChildren.filter(n => n.type === "file").length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 flex-shrink-0" style={{borderBottom: "1px solid rgba(0,0,0,0.06)"}}>
        <div className="flex items-center gap-1.5">
          <Files className="h-3.5 w-3.5" style={{color: "rgba(139,92,246,0.6)"}} />
          <span className="text-[11px] font-semibold tracking-wider uppercase" style={{color: "rgba(0,0,0,0.35)"}}>Files</span>
        </div>
        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{background: "rgba(139,92,246,0.08)", color: "rgba(109,40,217,0.6)"}}>
          {fileCount}
        </span>
      </div>
      <ScrollArea className="flex-1">
        <div className="py-1.5" key={refreshTrigger}>
          {rootChildren.map((child) => (
            <FileTreeNode key={child.path} node={child} level={0} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
