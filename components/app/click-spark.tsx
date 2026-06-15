"use client";

import { useEffect, useState } from "react";

type Spark = {
  id: number;
  x: number;
  y: number;
};

const SPARK_LIFETIME_MS = 700;
const MAX_SPARKS = 12;

export function ClickSpark() {
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    let nextId = 0;

    function onPointerDown(event: PointerEvent) {
      const id = nextId++;
      const x = event.clientX;
      const y = event.clientY;

      setSparks((current) => [...current.slice(-MAX_SPARKS + 1), { id, x, y }]);

      window.setTimeout(() => {
        setSparks((current) => current.filter((spark) => spark.id !== id));
      }, SPARK_LIFETIME_MS);
    }

    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {sparks.map((spark) => (
        <div
          key={spark.id}
          className="click-spark"
          style={
            {
              left: `${spark.x}px`,
              top: `${spark.y}px`,
            } as React.CSSProperties
          }
        >
          <span className="click-spark__core" />
          <span className="click-spark__ring" />
          {Array.from({ length: 8 }).map((_, index) => (
            <span
              key={index}
              className="click-spark__particle"
              style={
                {
                  "--spark-rotate": `${index * 45}deg`,
                  "--spark-delay": `${index * 18}ms`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}
