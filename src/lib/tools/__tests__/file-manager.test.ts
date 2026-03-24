import { test, expect } from "vitest";
import { buildFileManagerTool } from "../file-manager";
import { VirtualFileSystem } from "@/lib/file-system";

function makeFs(files: Record<string, string> = {}) {
  const fs = new VirtualFileSystem();
  for (const [path, content] of Object.entries(files)) {
    fs.createFile(path, content);
  }
  return fs;
}

test("rename moves a file to a new path", async () => {
  const fs = makeFs({ "/old.jsx": "content" });
  const tool = buildFileManagerTool(fs);
  const result = await tool.execute({ command: "rename", path: "/old.jsx", new_path: "/new.jsx" });
  expect(result.success).toBe(true);
  expect(fs.exists("/old.jsx")).toBe(false);
  expect(fs.readFile("/new.jsx")).toBe("content");
});

test("rename returns failure when source does not exist", async () => {
  const fs = new VirtualFileSystem();
  const tool = buildFileManagerTool(fs);
  const result = await tool.execute({ command: "rename", path: "/missing.jsx", new_path: "/new.jsx" });
  expect(result.success).toBe(false);
});

test("rename requires new_path", async () => {
  const fs = makeFs({ "/App.jsx": "content" });
  const tool = buildFileManagerTool(fs);
  const result = await tool.execute({ command: "rename", path: "/App.jsx" });
  expect(result.success).toBe(false);
  expect(result.error).toContain("new_path");
});

test("rename moves a directory and its contents", async () => {
  const fs = new VirtualFileSystem();
  fs.createFile("/src/index.ts", "index");
  fs.createFile("/src/Button.tsx", "button");
  const tool = buildFileManagerTool(fs);
  const result = await tool.execute({ command: "rename", path: "/src", new_path: "/app" });
  expect(result.success).toBe(true);
  expect(fs.exists("/src")).toBe(false);
  expect(fs.readFile("/app/index.ts")).toBe("index");
  expect(fs.readFile("/app/Button.tsx")).toBe("button");
});

test("delete removes a file", async () => {
  const fs = makeFs({ "/App.jsx": "content" });
  const tool = buildFileManagerTool(fs);
  const result = await tool.execute({ command: "delete", path: "/App.jsx" });
  expect(result.success).toBe(true);
  expect(fs.exists("/App.jsx")).toBe(false);
});

test("delete removes a directory recursively", async () => {
  const fs = new VirtualFileSystem();
  fs.createFile("/components/Button.jsx", "button");
  fs.createFile("/components/Input.jsx", "input");
  const tool = buildFileManagerTool(fs);
  const result = await tool.execute({ command: "delete", path: "/components" });
  expect(result.success).toBe(true);
  expect(fs.exists("/components")).toBe(false);
  expect(fs.exists("/components/Button.jsx")).toBe(false);
});

test("delete returns failure for non-existent path", async () => {
  const fs = new VirtualFileSystem();
  const tool = buildFileManagerTool(fs);
  const result = await tool.execute({ command: "delete", path: "/nonexistent.jsx" });
  expect(result.success).toBe(false);
});
