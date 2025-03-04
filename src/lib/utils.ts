import { type ClassValue, clsx } from "clsx";
import { nanoid } from "nanoid";
import { toast } from "react-hot-toast";
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

export function formatViews(num: number, precision = 1) {
  if (Math.abs(num) < 1000) {
    // If num is less than 999, no formatting needed
    return num;
  }

  const precisionToUse = Math.abs(num) > 10000 ? 0 : precision;

  const map = [
    { suffix: "T", threshold: 1e12 },
    { suffix: "B", threshold: 1e9 },
    { suffix: "M", threshold: 1e6 },
    { suffix: "K", threshold: 1e3 },
    { suffix: "", threshold: 1 },
  ];

  const found = map.find((x) => Math.abs(num) >= x.threshold);
  if (found) {
    const formatted =
      (num / found.threshold).toFixed(precisionToUse) + found.suffix;
    return formatted;
  }

  return num;
}

export function featureNotReady(featureName: string, message?: string) {
  const toastMessage = message
    ? message
    : "This feature is not yet implemented.";
  return toast(toastMessage, {
    icon: "🚧",
    position: "top-center",
    id: `feature-${featureName}`,
    style: { background: message ? "#00800080" : "#008000" },
  });
}

export const generateRandId = (prefix = "", length = 21) => {
  const rand = nanoid(length);
  return prefix ? `${prefix}_${rand}` : rand;
};

export function formatUsername(username: string) {
  const randomString = nanoid(5).replace(/-/g, "");
  const formattedUsername = username.slice(0, 5) + randomString;

  return formattedUsername;
}
