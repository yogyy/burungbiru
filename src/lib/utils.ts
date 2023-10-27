import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToHttps(url: string):
  | {
      href: string;
      title: string;
    }
  | undefined {
  if (!url) return;

  if (url.startsWith("https://")) {
    return {
      href: url,
      title: url.slice(8),
    };
  } else if (url.startsWith("http://")) {
    return {
      href: "https://" + url.slice(7),
      title: url.slice(7),
    };
  } else {
    return {
      href: "https://" + url,
      title: url,
    };
  }
}
