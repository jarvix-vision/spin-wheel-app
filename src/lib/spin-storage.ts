import { PRIZES, type Prize, type PrizeId } from "../data/prizes";

const STORAGE_KEY = "sca-spin-wheel-result-v1";

interface StoredSpinPayload {
  prizeId: PrizeId;
  rotation: number;
  timestamp: number;
}

export interface StoredSpin {
  prize: Prize;
  rotation: number;
}

export function readStoredSpin(): StoredSpin | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const payload = JSON.parse(raw) as Partial<StoredSpinPayload>;

    if (
      typeof payload.rotation !== "number" ||
      !Number.isFinite(payload.rotation)
    ) {
      return null;
    }

    const prize = PRIZES.find((item) => item.id === payload.prizeId);

    if (!prize) {
      return null;
    }

    return { prize, rotation: payload.rotation };
  } catch {
    return null;
  }
}

export function saveStoredSpin(prize: Prize, rotation: number) {
  if (typeof window === "undefined") {
    return;
  }

  const payload: StoredSpinPayload = {
    prizeId: prize.id,
    rotation,
    timestamp: Date.now(),
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    return;
  }
}
