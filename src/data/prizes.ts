export type PrizeId = "bottle" | "visa" | "keychain" | "toy";

export interface WheelLine {
  text: string;
  size: number;
  weight: number;
}

export interface Prize {
  id: PrizeId;
  category: string;
  title: string;
  cardDescription: string;
  winnerDescription: string;
  wheelLines: WheelLine[];
  wheelFill: string;
  wheelText: string;
  wheelSubtext: string;
  cardTint: string;
  iconBg: string;
  iconColor: string;
}

export const PRIZES: Prize[] = [
  {
    id: "bottle",
    category: "Everyday essential",
    title: "SCA Customized Water Bottle",
    cardDescription:
      "A limited-edition SCA bottle for long study days and bigger goals.",
    winnerDescription:
      "A limited-edition SCA bottle, made to keep you refreshed through every study session.",
    wheelLines: [
      { text: "SCA Customized", size: 13, weight: 600 },
      { text: "Water Bottle", size: 16, weight: 800 },
    ],
    wheelFill: "#241A13",
    wheelText: "#FFF7EF",
    wheelSubtext: "#F4C7A5",
    cardTint: "#F2E8DE",
    iconBg: "#241A13",
    iconColor: "#FFF7EF",
  },
  {
    id: "visa",
    category: "Biggest saving",
    title: "40% Visa Service Fee Discount",
    cardDescription:
      "Save 40% on your ScholarConnect Asia visa service fee.",
    winnerDescription:
      "That's 40% off your ScholarConnect Asia visa service fee. A smarter start to your next chapter.",
    wheelLines: [
      { text: "40% OFF", size: 23, weight: 800 },
      { text: "Visa Service", size: 12.6, weight: 700 },
      { text: "Fee Discount", size: 12.6, weight: 700 },
    ],
    wheelFill: "#FF914C",
    wheelText: "#29170B",
    wheelSubtext: "#4C2A14",
    cardTint: "#FFDFC9",
    iconBg: "#FF914C",
    iconColor: "#241A13",
  },
  {
    id: "keychain",
    category: "Pocket keepsake",
    title: "SCA Keychain",
    cardDescription:
      "A little SCA charm to keep your keys and ambitions close.",
    winnerDescription:
      "A keepsake SCA keychain, small enough to carry and made to remind you how far you can go.",
    wheelLines: [
      { text: "SCA", size: 17, weight: 800 },
      { text: "Keychain", size: 17, weight: 600 },
    ],
    wheelFill: "#FFD8BE",
    wheelText: "#301D11",
    wheelSubtext: "#5A3A26",
    cardTint: "#FFEDDE",
    iconBg: "#FFD8BE",
    iconColor: "#2B190E",
  },
  {
    id: "toy",
    category: "Just for fun",
    title: "Toy Keychain",
    cardDescription:
      "A playful collectible keychain from ScholarConnect Asia.",
    winnerDescription:
      "A playful ScholarConnect Asia toy keychain — a tiny dose of joy for your everyday carry.",
    wheelLines: [
      { text: "Toy", size: 17, weight: 800 },
      { text: "Keychain", size: 17, weight: 600 },
    ],
    wheelFill: "#FFF8F1",
    wheelText: "#301D11",
    wheelSubtext: "#5A3A26",
    cardTint: "#F6ECE1",
    iconBg: "#F1E3D5",
    iconColor: "#2B190E",
  },
];

export const WHEEL_SEGMENTS: Prize[] = [...PRIZES, ...PRIZES];
