import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to combine multiple Tailwind class names.
 * - Accepts conditional classes, arrays, and strings (via clsx)
 * - Merges Tailwind classes intelligently (via tailwind-merge)
 *
 * @param inputs - List of class names, arrays, or conditional expressions
 * @returns A single merged class string
 */
export function cn(...inputs: ClassValue[]) {
  // clsx handles conditional classes like { "text-red": isError }
  // twMerge merges conflicting Tailwind classes, e.g. "px-2 px-4" -> "px-4"
  return twMerge(clsx(inputs));
}
