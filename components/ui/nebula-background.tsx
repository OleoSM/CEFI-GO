"use client";

import dynamic from "next/dynamic";

const NebulaShader = dynamic(
  () => import("./liquid-shader").then((m) => m.InteractiveNebulaShader),
  { ssr: false }
);

export default function NebulaBackground() {
  return <NebulaShader disableCenterDimming className="opacity-60" />;
}
