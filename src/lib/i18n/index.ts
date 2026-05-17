import type { Locale } from "@/types";
import hy from "./hy";
import ru from "./ru";
import type { Dictionary } from "./types";

const dictionaries: Record<Locale, Dictionary> = { hy, ru };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export { hy, ru };
export type { Dictionary };
