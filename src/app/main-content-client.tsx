"use client";

import dynamic from "next/dynamic";

const MainContent = dynamic(
  () => import("./main-content").then((m) => ({ default: m.MainContent })),
  { ssr: false }
);

export { MainContent };
