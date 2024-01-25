import { RouterOutputs } from "~/utils/api";

type VariantTweet = "default" | "details" | "parent";
type TypeTweet = "default" | "modal";
export interface TweetTypeVariant {
  variant?: VariantTweet;
  type?: TypeTweet;
  showParent?: boolean;
}

export type TweetProps = RouterOutputs["post"]["detailPost"] & TweetTypeVariant;
