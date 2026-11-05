import { useCallback, useRef, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  Check,
  CreditCard,
  KeyRound,
  Milk,
  RotateCw,
  Sparkles,
  Ticket,
  ToyBrick,
} from "lucide-react";

import { SpinWheel } from "./components/SpinWheel";
import { WinDialog } from "./components/WinDialog";
import {
  PRIZES,
  WHEEL_SEGMENTS,
  type Prize,
  type PrizeId,
} from "./data/prizes";
import { readStoredSpin, saveStoredSpin } from "./lib/spin-storage";

const PRIZE_ICONS = {
  bottle: Milk,
  visa: CreditCard,
  keychain: KeyRound,
  toy: ToyBrick,
} satisfies Record<PrizeId, typeof Milk>;

const SEGMENT_ANGLE = 360 / WHEEL_SEGMENTS.length;

function randomIndex(length: number) {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buffer = new Uint32Array(1);
    const limit = Math.floor(2 ** 32 / length) * length;
    let value = limit;

    while (value >= limit) {
      crypto.getRandomValues(buffer);
      value = buffer[0];
    }

    return value % length;
  }

  return Math.floor(Math.random() * length);
}

function App() {
  const [storedSpin] = useState(readStoredSpin);
  const [rotation, setRotation] = useState(storedSpin?.rotation ?? 0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(Boolean(storedSpin));
  const [winner, setWinner] = useState<Prize | null>(null);
  const [lastWin, setLastWin] = useState<Prize | null>(
    storedSpin?.prize ?? null,
  );
  const [status, setStatus] = useState(
    storedSpin
      ? `Your one spin is complete. You won ${storedSpin.prize.title}.`
      : "",
  );

  const rotationRef = useRef(storedSpin?.rotation ?? 0);
  const hasSpunRef = useRef(Boolean(storedSpin));
  const spinningRef = useRef(false);
  const pendingWinnerRef = useRef<Prize | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const startSpin = useCallback(() => {
    if (spinningRef.current || hasSpunRef.current) {
      return;
    }

    const winningIndex = randomIndex(WHEEL_SEGMENTS.length);
    const nextWinner = WHEEL_SEGMENTS[winningIndex];
    const currentRotation = rotationRef.current;
    const normalizedRotation = ((currentRotation % 360) + 360) % 360;
    const pointerAlignment = (360 - winningIndex * SEGMENT_ANGLE) % 360;
    const alignmentDelta =
      (pointerAlignment - normalizedRotation + 360) % 360;
    const extraTurns = (7 + Math.floor(Math.random() * 3)) * 360;
    const jitter = (Math.random() - 0.5) * (SEGMENT_ANGLE - 14);
    const nextRotation = currentRotation + extraTurns + alignmentDelta + jitter;

    spinningRef.current = true;
    pendingWinnerRef.current = nextWinner;
    rotationRef.current = nextRotation;

    setIsSpinning(true);
    setStatus("The wheel is spinning. Good luck!");
    setRotation(nextRotation);
  }, []);

  const handleSpinEnd = useCallback(() => {
    if (!spinningRef.current) {
      return;
    }

    spinningRef.current = false;
    setIsSpinning(false);

    const prize = pendingWinnerRef.current;

    if (!prize) {
      return;
    }

    hasSpunRef.current = true;
    setHasSpun(true);
    setLastWin(prize);
    setWinner(prize);
    setStatus(`Your one spin is complete. You won ${prize.title}.`);
    saveStoredSpin(prize, rotationRef.current);
  }, []);

  const handleHeroSpin = useCallback(() => {
    if (spinningRef.current || hasSpunRef.current) {
      return;
    }

    if (window.matchMedia("(max-width: 920px)").matches) {
      wheelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    startSpin();
  }, [startSpin]);

  const handleCloseWin = useCallback(() => {
    setWinner(null);
  }, []);

  const WinnerIcon = winner ? PRIZE_ICONS[winner.id] : null;

  return (
    <div className="page-shell" id="top">
      <header className="site-header">
        <div className="brand" aria-label="ScholarConnect Asia">
          <span className="brand-mark-wrap">
            <img src="/sca-mark.svg" alt="" className="brand-mark" />
          </span>
          <span className="brand-wordmark">
            ScholarConnect <span>Asia</span>
          </span>
        </div>

        <div className="header-right">
          <span className="header-edition">Rewards edition</span>
          <span className="header-pill">
            {hasSpun ? (
              <Check
                className="header-pill-check"
                size={13}
                strokeWidth={2.6}
                aria-hidden="true"
              />
            ) : (
              <span className="live-dot" aria-hidden="true" />
            )}
            {hasSpun ? "Spin complete" : "Spin & win"}
          </span>
        </div>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              ScholarConnect Asia · Rewards
            </p>

            <h1 id="hero-title">
              A little spin.
              <br />
              A lot of
              <br />
              <em>possibility.</em>
            </h1>

            <p className="hero-lede">
              Four exclusive rewards. One spin to see what&apos;s waiting for
              you.
            </p>

            <div className="hero-actions">
              {hasSpun && lastWin ? (
                <div className="spin-result" role="status">
                  <span className="spin-result-icon" aria-hidden="true">
                    <Check size={18} />
                  </span>
                  <span className="spin-result-copy">
                    <span>Your one spin</span>
                    <strong>{lastWin.title}</strong>
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  className="primary-cta"
                  onClick={handleHeroSpin}
                  disabled={isSpinning || hasSpun}
                  aria-busy={isSpinning}
                >
                  <span>
                    {isSpinning
                      ? "Spinning..."
                      : hasSpun
                        ? "Spin used"
                        : "Spin the wheel"}
                  </span>
                  <span className="cta-icon" aria-hidden="true">
                    {isSpinning ? (
                      <RotateCw className="rotating-icon" size={18} />
                    ) : (
                      <ArrowRight size={18} />
                    )}
                  </span>
                </button>
              )}

              <a className="text-link" href="#prizes">
                See the prizes
                <ArrowRight size={15} aria-hidden="true" />
              </a>
            </div>

            <div className="hero-meta">
              <span>
                <Sparkles size={14} aria-hidden="true" />4 prizes, each on two
                slices
              </span>
              <span className="meta-dot" aria-hidden="true" />
              <span>
                <Ticket size={14} aria-hidden="true" />1 spin per visitor
              </span>
            </div>
          </div>

          <div className="hero-wheel" ref={wheelRef}>
            <p className="sr-only" id="wheel-description">
              The prize wheel has eight equal slices. SCA Customized Water
              Bottle, 40% Visa Service Fee Discount, SCA Keychain, and Toy
              Keychain each appear twice.
            </p>
            <div className="wheel-glow" aria-hidden="true" />
            <Sparkles
              className="sparkle sparkle-one"
              size={25}
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <Sparkles
              className="sparkle sparkle-two"
              size={16}
              strokeWidth={1.7}
              aria-hidden="true"
            />
            <Sparkles
              className="sparkle sparkle-three"
              size={20}
              strokeWidth={1.4}
              aria-hidden="true"
            />

            <SpinWheel
              rotation={rotation}
              isSpinning={isSpinning}
              hasSpun={hasSpun}
              onSpin={startSpin}
              onSpinEnd={handleSpinEnd}
            />

            <div
              className={`wheel-caption${hasSpun ? " is-complete" : ""}`}
            >
              {hasSpun ? (
                <Check size={14} aria-hidden="true" />
              ) : (
                <Ticket size={14} aria-hidden="true" />
              )}
              {hasSpun
                ? "Your one spin is complete"
                : "Every reward lands on 2 slices"}
            </div>
          </div>
        </section>

        <section
          className="prizes-section"
          id="prizes"
          aria-labelledby="prizes-title"
        >
          <div className="prizes-heading">
            <div>
              <p className="section-eyebrow">The prize board</p>
              <h2 id="prizes-title">
                Four prizes.
                <br />
                <em>One lucky spin.</em>
              </h2>
            </div>
            <p className="section-note">
              Every reward appears on two equal slices, so the wheel stays
              perfectly balanced. Each visitor gets one spin to see where it
              lands.
            </p>
          </div>

          <div className="prize-grid">
            {PRIZES.map((prize, index) => {
              const Icon = PRIZE_ICONS[prize.id];

              return (
                <article
                  key={prize.id}
                  className="prize-card"
                  style={
                    {
                      "--card-tint": prize.cardTint,
                      "--icon-bg": prize.iconBg,
                      "--icon-color": prize.iconColor,
                    } as CSSProperties
                  }
                >
                  <div className="prize-card-top">
                    <span className="prize-icon">
                      <Icon size={22} strokeWidth={1.9} aria-hidden="true" />
                    </span>
                  </div>

                  <div className="prize-card-body">
                    <span className="prize-index">
                      0{index + 1} · {prize.category}
                    </span>
                    <h3>{prize.title}</h3>
                    <p>{prize.cardDescription}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <img src="/sca-mark.svg" alt="" />
          <span>ScholarConnect Asia</span>
        </div>
        <p>Spin &amp; Win · Made for the next chapter.</p>
      </footer>

      <p className="sr-only" role="status" aria-live="polite">
        {status}
      </p>

      <WinDialog
        prize={winner}
        icon={
          WinnerIcon ? (
            <WinnerIcon size={34} strokeWidth={1.8} aria-hidden="true" />
          ) : null
        }
        onClose={handleCloseWin}
      />
    </div>
  );
}

export default App;
