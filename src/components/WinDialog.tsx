import { useEffect, useMemo, useRef } from "react";
import { Check, X } from "lucide-react";

import type { Prize } from "../data/prizes";
import type { CSSProperties, ReactNode } from "react";

interface WinDialogProps {
  prize: Prize | null;
  icon: ReactNode;
  onClose: () => void;
}

const CONFETTI_COLORS = [
  "#FF914C",
  "#FFC18D",
  "#FFD8BE",
  "#241A13",
  "#FFF4E7",
  "#F47B2A",
];

interface ConfettiPiece {
  left: number;
  delay: number;
  duration: number;
  width: number;
  height: number;
  drift: number;
  spin: number;
  startRotation: number;
  color: string;
  round: boolean;
}

function Confetti() {
  const pieces = useMemo<ConfettiPiece[]>(
    () =>
      Array.from({ length: 68 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.9,
        duration: 2.4 + Math.random() * 2,
        width: 5 + Math.random() * 7,
        height: 8 + Math.random() * 10,
        drift: -130 + Math.random() * 260,
        spin: 180 + Math.random() * 720,
        startRotation: Math.random() * 360,
        color:
          CONFETTI_COLORS[
            Math.floor(Math.random() * CONFETTI_COLORS.length)
          ],
        round: Math.random() > 0.72,
      })),
    [],
  );

  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((piece, index) => (
        <span
          key={index}
          className="confetti-piece"
          style={
            {
              left: `${piece.left}%`,
              width: `${piece.width}px`,
              height: `${piece.height}px`,
              backgroundColor: piece.color,
              borderRadius: piece.round ? "999px" : "2px",
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              "--confetti-drift": `${piece.drift}px`,
              "--confetti-spin": `${piece.spin}deg`,
              "--confetti-start": `${piece.startRotation}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function WinDialog({ prize, icon, onClose }: WinDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (prize && !dialog.open) {
      dialog.showModal();
    } else if (!prize && dialog.open) {
      dialog.close();
    }
  }, [prize]);

  return (
    <dialog
      ref={dialogRef}
      className="win-dialog"
      aria-labelledby="win-title win-prize-name"
      aria-describedby="win-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      {prize ? (
        <div
          className="win-dialog-shell"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              onClose();
            }
          }}
        >
          <Confetti />
          <div
            className="win-card"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="win-close"
              onClick={onClose}
              aria-label="Close winning prize dialog"
            >
              <X size={18} />
            </button>

            <div
              className="win-icon"
              style={{
                background: prize.wheelFill,
                color: prize.wheelText,
              }}
            >
              {icon}
            </div>

            <p className="win-eyebrow">The wheel has spoken</p>
            <h2 id="win-title">
              You <em>won!</em>
            </h2>
            <p className="win-prize-name" id="win-prize-name">
              {prize.title}
            </p>
            <p className="win-description" id="win-description">
              {prize.winnerDescription}
            </p>

            <div className="win-actions">
              <button
                type="button"
                className="button button-primary"
                onClick={onClose}
                autoFocus
              >
                <Check size={17} strokeWidth={2.4} />
                Continue
              </button>
            </div>

            <p className="win-footnote">
              This was your one spin. Snap a screenshot to keep your win and
              show it to the SCA team.
            </p>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
