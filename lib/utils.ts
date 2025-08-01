import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date | string) => {
  if (date === undefined || date === null) return "";
  if (typeof date === "string") return date.substring(0, 10);
  return date.toDateString();
};

export const formatTime = (date: Date | string) => {
  if (date === undefined || date === null) return "";
  if (typeof date === "string") return date.substring(11, 16);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
