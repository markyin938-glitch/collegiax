"use client";

import dynamic from "next/dynamic";

const Silk = dynamic(() => import("@/components/Silk"), {
  ssr: false,
});

export function BackgroundFx() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(244,247,250,0.32),rgba(244,247,250,0.18))]" />
      <div className="absolute inset-0 opacity-[0.96]">
        <Silk
          speed={4.2}
          scale={0.92}
          color="#4A7A9B"
          noiseIntensity={1.15}
          rotation={0.18}
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_left_top,rgba(255,255,255,0.82),transparent_34%),radial-gradient(circle_at_78%_20%,rgba(91,141,216,0.2),transparent_26%),linear-gradient(135deg,rgba(244,247,250,0.3),rgba(244,247,250,0.08)_46%,rgba(44,62,80,0.12))]" />
    </div>
  );
}
