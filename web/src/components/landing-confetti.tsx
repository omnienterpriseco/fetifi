"use client";

import { useEffect, useState } from "react";

const COLORS = ["#e8a8c4", "#9fc4b8", "#c9b6de", "#e2c48a", "#9db8cc", "#f0c4b0"];

type FallPiece = {
  kind: "fall";
  id: string;
  left: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  drift: number;
  spin: number;
  round: boolean;
};

type PopPiece = {
  kind: "pop";
  id: string;
  originX: number;
  originY: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
  dx: number;
  dy: number;
  spin: number;
  round: boolean;
};

type Piece = FallPiece | PopPiece;

function burst(originX: number, originY: number, count: number, startId: number): PopPiece[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const distance = 90 + Math.random() * 220;
    return {
      kind: "pop" as const,
      id: `pop-${startId}-${i}`,
      originX,
      originY,
      delay: Math.random() * 0.18,
      duration: 0.85 + Math.random() * 0.55,
      color: COLORS[(startId + i) % COLORS.length],
      size: 6 + Math.random() * 7,
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      spin: 120 + Math.random() * 260,
      round: i % 3 !== 0,
    };
  });
}

export function LandingConfetti() {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const falling: FallPiece[] = Array.from({ length: 36 }, (_, id) => ({
      kind: "fall",
      id: `fall-${id}`,
      left: Math.random() * 100,
      delay: Math.random() * 0.55,
      duration: 2.1 + Math.random() * 1.3,
      color: COLORS[id % COLORS.length],
      size: 5 + Math.random() * 6,
      drift: (Math.random() - 0.5) * 90,
      spin: 180 + Math.random() * 280,
      round: id % 4 !== 0,
    }));

    const pops = [
      ...burst(50, 32, 28, 0),
      ...burst(22, 48, 16, 100),
      ...burst(78, 44, 16, 200),
    ];

    setPieces([...falling, ...pops]);

    const timer = window.setTimeout(() => setPieces([]), 3600);
    return () => window.clearTimeout(timer);
  }, []);

  if (!pieces.length) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {pieces.map((piece) =>
        piece.kind === "fall" ? (
          <span
            key={piece.id}
            className="landing-confetti-piece landing-confetti-fall"
            style={{
              left: `${piece.left}%`,
              width: piece.size,
              height: piece.round ? piece.size : piece.size * 0.55,
              background: piece.color,
              borderRadius: piece.round ? "999px" : "2px",
              animationDuration: `${piece.duration}s`,
              animationDelay: `${piece.delay}s`,
              ["--drift" as string]: `${piece.drift}px`,
              ["--spin" as string]: `${piece.spin}deg`,
            }}
          />
        ) : (
          <span
            key={piece.id}
            className="landing-confetti-piece landing-confetti-pop"
            style={{
              left: `${piece.originX}%`,
              top: `${piece.originY}%`,
              width: piece.size,
              height: piece.round ? piece.size : piece.size * 0.55,
              background: piece.color,
              borderRadius: piece.round ? "999px" : "2px",
              animationDuration: `${piece.duration}s`,
              animationDelay: `${piece.delay}s`,
              ["--dx" as string]: `${piece.dx}px`,
              ["--dy" as string]: `${piece.dy}px`,
              ["--spin" as string]: `${piece.spin}deg`,
            }}
          />
        ),
      )}
    </div>
  );
}
