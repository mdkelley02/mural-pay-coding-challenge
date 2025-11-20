import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatUSDC = (atomicAmount: string | number | bigint) => {
  const amount = Number(atomicAmount) / 1_000_000; // Divide by 6 decimals
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const formatRating = (rating: number) => {
  return rating.toFixed(1);
};
