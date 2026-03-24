import { test, expect } from "vitest";
import { buildStrReplaceTool } from "../str-replace";
import { VirtualFileSystem } from "@/lib/file-system";

function makeFs(files: Record<string, string> = {}) {
  const fs = new VirtualFileSystem();
  for (const [path, content] of Object.entries(files)) {
    fs.createFile(path, content);
  }
  return fs;
}

test("view returns file content with line numbers", async () => {
  const fs = makeFs({ "/App.jsx": "line1\nline2\nline3" });
  const tool = buildStrReplaceTool(fs);
  const result = await tool.execute({ command: "view", path: "/App.jsx" });
  expect(result).toBe("1\tline1\n2\tline2\n3\tline3");
});

test("view with range returns subset of lines", async () => {
  const fs = makeFs({ "/App.jsx": "a\nb\nc\nd\ne" });
  const tool = buildStrReplaceTool(fs);
  const result = await tool.execute({ command: "view", path: "/App.jsx", view_range: [2, 4] });
  expect(result).toBe("2\tb\n3\tc\n4\td");
});

test("create makes a new file", async () => {
  const fs = new VirtualFileSystem();
  const tool = buildStrReplaceTool(fs);
  await tool.execute({ command: "create", path: "/App.jsx", file_text: "export default function App() {}" });
  expect(fs.readFile("/App.jsx")).toBe("export default function App() {}");
});

test("create with nested path creates parent directories", async () => {
  const fs = new VirtualFileSystem();
  const tool = buildStrReplaceTool(fs);
  await tool.execute({ command: "create", path: "/components/Button.jsx", file_text: "export default function Button() {}" });
  expect(fs.exists("/components")).toBe(true);
  expect(fs.readFile("/components/Button.jsx")).toBe("export default function Button() {}");
});

test("create returns error for existing file", async () => {
  const fs = makeFs({ "/App.jsx": "original" });
  const tool = buildStrReplaceTool(fs);
  const result = await tool.execute({ command: "create", path: "/App.jsx", file_text: "new" });
  expect(result).toContain("Error:");
  expect(fs.readFile("/App.jsx")).toBe("original");
});

test("str_replace replaces content in file", async () => {
  const fs = makeFs({ "/App.jsx": "const x = 1;" });
  const tool = buildStrReplaceTool(fs);
  await tool.execute({ command: "str_replace", path: "/App.jsx", old_str: "const x = 1;", new_str: "const x = 2;" });
  expect(fs.readFile("/App.jsx")).toBe("const x = 2;");
});

test("str_replace returns error when old_str not found", async () => {
  const fs = makeFs({ "/App.jsx": "hello world" });
  const tool = buildStrReplaceTool(fs);
  const result = await tool.execute({ command: "str_replace", path: "/App.jsx", old_str: "missing", new_str: "replacement" });
  expect(result).toContain("Error:");
  expect(fs.readFile("/App.jsx")).toBe("hello world");
});

test("str_replace returns error for non-existent file", async () => {
  const fs = new VirtualFileSystem();
  const tool = buildStrReplaceTool(fs);
  const result = await tool.execute({ command: "str_replace", path: "/nonexistent.jsx", old_str: "foo", new_str: "bar" });
  expect(result).toContain("Error:");
});

test("insert adds text at the specified line", async () => {
  const fs = makeFs({ "/App.jsx": "line1\nline2\nline3" });
  const tool = buildStrReplaceTool(fs);
  await tool.execute({ command: "insert", path: "/App.jsx", insert_line: 1, new_str: "inserted" });
  expect(fs.readFile("/App.jsx")).toBe("line1\ninserted\nline2\nline3");
});

test("insert at line 0 prepends content", async () => {
  const fs = makeFs({ "/App.jsx": "line1\nline2" });
  const tool = buildStrReplaceTool(fs);
  await tool.execute({ command: "insert", path: "/App.jsx", insert_line: 0, new_str: "first" });
  expect(fs.readFile("/App.jsx")).toBe("first\nline1\nline2");
});

test("undo_edit returns unsupported error", async () => {
  const fs = new VirtualFileSystem();
  const tool = buildStrReplaceTool(fs);
  const result = await tool.execute({ command: "undo_edit", path: "/App.jsx" });
  expect(result).toContain("not supported");
});
