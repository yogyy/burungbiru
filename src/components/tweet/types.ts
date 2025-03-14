import { RouterOutputs } from "~/utils/api";

export type VariantTweet = "default" | "details" | "parent";
type TypeTweet = "default" | "modal";
export interface TweetTypeVariant {
  variant?: VariantTweet;
  type?: TypeTweet;
  showParent?: boolean;
}

export type TweetProps = Omit<RouterOutputs["post"]["detailPost"], "parent"> & {
  parent?: RouterOutputs["post"]["detailPost"]["parent"];
};
