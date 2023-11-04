import Link from "next/link";
import React from "react";
import { URL_REGEX } from "~/lib/tweet";
import { convertToHttps } from "~/lib/utils";

export const TweetText = ({ content }: { content: string }) => {
  const words = content.split(" ");
  return (
    <p className="content-post whitespace-pre-wrap">
      {words.map((word: string) => {
        return word.match(URL_REGEX) ? (
          <React.Fragment key={word + new Date()}>
            <Link
              href={convertToHttps(word)?.href!}
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              className="text-primary hover:underline"
            >
              {convertToHttps(word)?.title}
            </Link>
          </React.Fragment>
        ) : (
          word + " "
        );
      })}
    </p>
  );
};
