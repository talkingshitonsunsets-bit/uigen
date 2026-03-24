# Claude.MD

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Initial setup (installs deps, generates Prisma client, runs migrations)
npm run setup

# Development server (localhost:3000)
npm run dev

# Build for production
npm run build

# Lint
npm run lint

# Run all tests
npm test

# Run a single test file
npx vitest run src/lib/__tests__/file-system.test.ts

# Reset database
npm run db:reset

# Regenerate Prisma client after schema changes
npx prisma generate

# Create a new migration
npx prisma migrate dev
```

## Architecture Overview

UIGen is a Next.js 15 App Router application where users describe React components in a chat interface and an AI (Claude) generates them in real-time. Components are never written to disk — they exist entirely in a virtual file system.

### Request Flow

1. User submits a message in `ChatInterface`
2. `ChatProvider` (`src/lib/contexts/chat-context.tsx`) calls `/api/chat` via Vercel AI SDK's `useChat`, sending the current message history and the serialized virtual file system
3. `POST /api/chat` (`src/app/api/chat/route.ts`) streams a response using `streamText` with two tools: `str_replace_editor` and `file_manager`
4. As tool calls stream in, `onToolCall` in `ChatProvider` fires and dispatches to `handleToolCall` in `FileSystemContext`, which mutates the in-memory `VirtualFileSystem` and triggers a re-render
5. `PreviewFrame` (`src/components/preview/PreviewFrame.tsx`) detects the refresh, calls `createImportMap` to Babel-transpile all virtual files to blob URLs, then injects them into a sandboxed `<iframe>` via `srcdoc`

### Virtual File System

`VirtualFileSystem` (`src/lib/file-system.ts`) is an in-memory tree of `FileNode` objects. It is serialized as a flat `Record<string, FileNode>` for:
- Sending to the API on every chat request
- Persisting to the `Project.data` SQLite column (authenticated users only)
- Storing in `sessionStorage` for anonymous users (`src/lib/anon-work-tracker.ts`)

The AI always creates a `/App.jsx` as the entry point. Local imports use the `@/` alias which maps to the virtual root `/`.

### Preview Pipeline

`src/lib/transform/jsx-transformer.ts` runs in the browser:
1. `createImportMap` iterates virtual files, transpiles each `.jsx/.tsx` via `@babel/standalone`, creates blob URLs, and builds an ES module import map
2. Third-party npm packages are resolved to `https://esm.sh/<package>` automatically
3. Tailwind CSS is loaded from CDN inside the iframe
4. `createPreviewHTML` injects the import map and a bootstrap `<script type="module">` that renders the app via `ReactDOM.createRoot`

### AI Tools

Both tools operate on a `VirtualFileSystem` instance that is reconstructed from the serialized payload on each request:

- **`str_replace_editor`** (`src/lib/tools/str-replace.ts`): `view`, `create`, `str_replace`, `insert` commands. The AI is instructed to always start with `/App.jsx`.
- **`file_manager`** (`src/lib/tools/file-manager.ts`): `rename` and `delete` commands.

### Provider / Model

`src/lib/provider.ts` exports `getLanguageModel()`. If `ANTHROPIC_API_KEY` is set it returns `anthropic("claude-haiku-4-5")`; otherwise it returns a `MockLanguageModel` that streams static pre-canned component code.

### Auth & Persistence

- JWT stored in an `httpOnly` cookie (`auth-token`), signed with `JWT_SECRET` env var
- `src/middleware.ts` guards `/api/projects` and `/api/filesystem`
- Authenticated users: projects (messages + file system snapshot) are persisted to SQLite via Prisma after each chat response
- Anonymous users: work is saved to `sessionStorage` and offered for import on signup/login
- Database: SQLite at `prisma/dev.db`, schema defines `User` and `Project` models

### Layout

`MainContent` (`src/app/main-content.tsx`) renders the full-page split-panel layout:
- Left panel: `ChatInterface` (chat history + input)
- Right panel: togglable Preview / Code view; Code view shows `FileTree` + `CodeEditor` (Monaco)

Pages:
- `/` — anonymous users get `MainContent` without a project; authenticated users are redirected to their latest project
- `/[projectId]` — loads the project from DB, renders `MainContent` with hydrated state

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | No | If absent, mock provider is used |
| `JWT_SECRET` | No | Defaults to `"development-secret-key"` |
