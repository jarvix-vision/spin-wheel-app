import { Check, RotateCw, Sparkles, Star } from "lucide-react";

import { WHEEL_SEGMENTS, type Prize } from "../data/prizes";

const VIEWBOX = 600;
const CENTER = VIEWBOX / 2;
const WHEEL_RADIUS = 258;
const SEGMENT_ANGLE = 360 / WHEEL_SEGMENTS.length;
const BULB_COUNT = 16;

interface SpinWheelProps {
  rotation: number;
  isSpinning: boolean;
  hasSpun: boolean;
  onSpin: () => void;
  onSpinEnd: () => void;
}

function polarPoint(radius: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;

  return {
    x: CENTER + radius * Math.cos(radians),
    y: CENTER + radius * Math.sin(radians),
  };
}

function slicePath(startAngle: number, endAngle: number) {
  const start = polarPoint(WHEEL_RADIUS, startAngle);
  const end = polarPoint(WHEEL_RADIUS, endAngle);

  return [
    `M ${CENTER} ${CENTER}`,
    `L ${start.x} ${start.y}`,
    `A ${WHEEL_RADIUS} ${WHEEL_RADIUS} 0 0 1 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

function WheelLabel({ prize, index }: { prize: Prize; index: number }) {
  const angle = index * SEGMENT_ANGLE;
  const isFlipped = angle > 90 && angle < 270;
  const groupRotation = isFlipped ? angle + 180 : angle;
  const radius = 176;
  const labelY = isFlipped ? CENTER + radius : CENTER - radius;
  const markerY = isFlipped ? CENTER + 229 : CENTER - 229;
  const lineHeights = prize.wheelLines.map((line) => line.size * 1.14);
  const blockHeight = lineHeights.reduce((total, height) => total + height, 0);
  let lineCursor = labelY - blockHeight / 2;

  return (
    <g transform={`rotate(${groupRotation} ${CENTER} ${CENTER})`}>
      <circle
        cx={CENTER}
        cy={markerY}
        r="3.2"
        fill={prize.wheelText}
        opacity="0.55"
      />
      {prize.wheelLines.map((line, lineIndex) => {
        const lineY = lineCursor + lineHeights[lineIndex] / 2;
        lineCursor += lineHeights[lineIndex];

        return (
          <text
            key={line.text}
            x={CENTER}
            y={lineY}
            fill={lineIndex === 0 ? prize.wheelText : prize.wheelSubtext}
            fontFamily="DM Sans, sans-serif"
            fontSize={line.size}
            fontWeight={line.weight}
            letterSpacing={line.size > 20 ? "-0.02em" : "0.01em"}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {line.text}
          </text>
        );
      })}
    </g>
  );
}

export function SpinWheel({
  rotation,
  isSpinning,
  hasSpun,
  onSpin,
  onSpinEnd,
}: SpinWheelProps) {
  const bulbs = Array.from({ length: BULB_COUNT }, (_, index) => ({
    ...polarPoint(277, index * (360 / BULB_COUNT)),
    index,
  }));

  return (
    <div className="spin-wheel">
      <div className="wheel-orbit" aria-hidden="true" />
      <div className="wheel-stage">
        <div
          className="wheel-rotor"
          style={{ transform: `rotate(${rotation}deg)` }}
          onTransitionEnd={(event) => {
            if (
              event.target === event.currentTarget &&
              event.propertyName === "transform"
            ) {
              onSpinEnd();
            }
          }}
        >
          <svg
            viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <linearGradient
                id="rim-gradient"
                x1="88"
                y1="58"
                x2="512"
                y2="548"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FFC18D" />
                <stop offset="0.48" stopColor="#FF914C" />
                <stop offset="1" stopColor="#EF6F16" />
              </linearGradient>
              <linearGradient
                id="wheel-sheen"
                x1="112"
                y1="80"
                x2="500"
                y2="552"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FFFFFF" stopOpacity="0.18" />
                <stop offset="0.48" stopColor="#FFFFFF" stopOpacity="0" />
                <stop offset="1" stopColor="#21130B" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            <circle cx={CENTER} cy={CENTER} r="296" fill="#1F150F" />
            <circle
              cx={CENTER}
              cy={CENTER}
              r="288"
              fill="url(#rim-gradient)"
            />
            <circle cx={CENTER} cy={CENTER} r="266" fill="#FFF7EF" />

            {WHEEL_SEGMENTS.map((prize, index) => {
              const path = slicePath(
                index * SEGMENT_ANGLE - SEGMENT_ANGLE / 2,
                index * SEGMENT_ANGLE + SEGMENT_ANGLE / 2,
              );

              return (
                <g key={`${prize.id}-${index}`}>
                  <path
                    d={path}
                    fill={prize.wheelFill}
                    stroke="#FFF7EF"
                    strokeWidth="2.4"
                    strokeLinejoin="round"
                  />
                  <path d={path} fill="url(#wheel-sheen)" />
                </g>
              );
            })}

            {bulbs.map((bulb) => (
              <g key={bulb.index}>
                <circle
                  cx={bulb.x}
                  cy={bulb.y}
                  r="4.6"
                  fill="#FFF7EF"
                  opacity="0.96"
                />
                <circle
                  cx={bulb.x}
                  cy={bulb.y}
                  r="2"
                  fill="#FFE3CE"
                  opacity="0.82"
                />
              </g>
            ))}

            {WHEEL_SEGMENTS.map((prize, index) => (
              <WheelLabel
                key={`${prize.id}-label-${index}`}
                prize={prize}
                index={index}
              />
            ))}

            <circle
              cx={CENTER}
              cy={CENTER}
              r={WHEEL_RADIUS}
              fill="none"
              stroke="#241A13"
              strokeOpacity="0.08"
            />
          </svg>
        </div>

        <div className="pointer" aria-hidden="true">
          <span className="pointer-label">
            <Star size={12} fill="currentColor" strokeWidth={0} />
            WIN
          </span>
          <span className="pointer-tip" />
        </div>

        <button
          type="button"
          className={`wheel-hub${hasSpun ? " is-complete" : ""}`}
          onClick={onSpin}
          disabled={isSpinning || hasSpun}
          aria-label={
            isSpinning
              ? "The wheel is spinning"
              : hasSpun
                ? "Your one spin is complete"
                : "Spin the wheel"
          }
          aria-describedby="wheel-description"
        >
          {isSpinning ? (
            <RotateCw className="hub-spinner" size={21} strokeWidth={2.2} />
          ) : hasSpun ? (
            <Check size={21} strokeWidth={2.4} />
          ) : (
            <Sparkles size={21} strokeWidth={2} />
          )}
          <span className="hub-label">
            {isSpinning ? "Spinning" : hasSpun ? "Played" : "Spin"}
          </span>
          <span className="hub-sub">
            {isSpinning ? "Hang tight" : hasSpun ? "One spin only" : "to win"}
          </span>
        </button>
      </div>
    </div>
  );
}
