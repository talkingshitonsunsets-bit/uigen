import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge, getToolLabel } from "../ToolCallBadge";
import type { ToolInvocationLike } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

// ─── getToolLabel unit tests ────────────────────────────────────────────────

test("getToolLabel: str_replace_editor create returns Creating label", () => {
  const { label } = getToolLabel("str_replace_editor", {
    command: "create",
    path: "/App.jsx",
  });
  expect(label).toBe("Creating App.jsx");
});

test("getToolLabel: str_replace_editor str_replace returns Editing label", () => {
  const { label } = getToolLabel("str_replace_editor", {
    command: "str_replace",
    path: "/components/Button.tsx",
  });
  expect(label).toBe("Editing Button.tsx");
});

test("getToolLabel: str_replace_editor insert returns Editing label", () => {
  const { label } = getToolLabel("str_replace_editor", {
    command: "insert",
    path: "/utils/helpers.ts",
  });
  expect(label).toBe("Editing helpers.ts");
});

test("getToolLabel: str_replace_editor view returns Reading label", () => {
  const { label } = getToolLabel("str_replace_editor", {
    command: "view",
    path: "/App.jsx",
  });
  expect(label).toBe("Reading App.jsx");
});

test("getToolLabel: str_replace_editor unknown command returns Updating label", () => {
  const { label } = getToolLabel("str_replace_editor", {
    command: "undo_edit",
    path: "/App.jsx",
  });
  expect(label).toBe("Updating App.jsx");
});

test("getToolLabel: file_manager rename shows old and new filename", () => {
  const { label } = getToolLabel("file_manager", {
    command: "rename",
    path: "/components/Old.tsx",
    new_path: "/components/New.tsx",
  });
  expect(label).toBe("Renaming Old.tsx → New.tsx");
});

test("getToolLabel: file_manager delete returns Deleting label", () => {
  const { label } = getToolLabel("file_manager", {
    command: "delete",
    path: "/components/Unused.tsx",
  });
  expect(label).toBe("Deleting Unused.tsx");
});

test("getToolLabel: unknown tool falls back to tool name", () => {
  const { label } = getToolLabel("some_other_tool", { command: "run" });
  expect(label).toBe("some_other_tool");
});

test("getToolLabel: deeply nested path extracts filename only", () => {
  const { label } = getToolLabel("str_replace_editor", {
    command: "create",
    path: "/src/components/ui/Card.tsx",
  });
  expect(label).toBe("Creating Card.tsx");
});

// ─── ToolCallBadge render tests ─────────────────────────────────────────────

function makeTool(
  overrides: Partial<ToolInvocationLike> = {}
): ToolInvocationLike {
  return {
    toolCallId: "test-id",
    toolName: "str_replace_editor",
    args: { command: "create", path: "/App.jsx" },
    state: "result",
    result: "Success",
    ...overrides,
  };
}

test("ToolCallBadge shows friendly label for create command", () => {
  render(<ToolCallBadge tool={makeTool()} />);
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

test("ToolCallBadge shows friendly label for str_replace command", () => {
  render(
    <ToolCallBadge
      tool={makeTool({ args: { command: "str_replace", path: "/Card.tsx" } })}
    />
  );
  expect(screen.getByText("Editing Card.tsx")).toBeDefined();
});

test("ToolCallBadge shows friendly label for view command", () => {
  render(
    <ToolCallBadge
      tool={makeTool({ args: { command: "view", path: "/App.jsx" } })}
    />
  );
  expect(screen.getByText("Reading App.jsx")).toBeDefined();
});

test("ToolCallBadge shows friendly label for file_manager rename", () => {
  render(
    <ToolCallBadge
      tool={makeTool({
        toolName: "file_manager",
        args: {
          command: "rename",
          path: "/Old.tsx",
          new_path: "/New.tsx",
        },
      })}
    />
  );
  expect(screen.getByText("Renaming Old.tsx → New.tsx")).toBeDefined();
});

test("ToolCallBadge shows friendly label for file_manager delete", () => {
  render(
    <ToolCallBadge
      tool={makeTool({
        toolName: "file_manager",
        args: { command: "delete", path: "/Dead.tsx" },
      })}
    />
  );
  expect(screen.getByText("Deleting Dead.tsx")).toBeDefined();
});

test("ToolCallBadge shows green dot when state is result", () => {
  const { container } = render(<ToolCallBadge tool={makeTool({ state: "result", result: "ok" })} />);
  const dot = container.querySelector(".bg-emerald-500");
  expect(dot).not.toBeNull();
});

test("ToolCallBadge shows spinner when state is call (in-progress)", () => {
  const { container } = render(
    <ToolCallBadge tool={makeTool({ state: "call", result: undefined })} />
  );
  const spinner = container.querySelector(".animate-spin");
  expect(spinner).not.toBeNull();
});

test("ToolCallBadge shows spinner when state is partial-call", () => {
  const { container } = render(
    <ToolCallBadge tool={makeTool({ state: "partial-call", result: undefined })} />
  );
  const spinner = container.querySelector(".animate-spin");
  expect(spinner).not.toBeNull();
});

test("ToolCallBadge does not show raw tool name for known tools", () => {
  render(<ToolCallBadge tool={makeTool()} />);
  expect(screen.queryByText("str_replace_editor")).toBeNull();
});

test("ToolCallBadge falls back to tool name for unknown tool", () => {
  render(
    <ToolCallBadge
      tool={makeTool({ toolName: "mystery_tool", args: {} })}
    />
  );
  expect(screen.getByText("mystery_tool")).toBeDefined();
});
