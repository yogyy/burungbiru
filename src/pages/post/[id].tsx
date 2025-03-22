import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { api } from "~/utils/api";
import { renderText } from "~/lib/tweet";
import { cn } from "~/lib/utils";
import { ImageModal } from "~/components/modal/image-modal";
import { LoadingItem } from "~/components/loading";
import { ButtonBack } from "~/components/button-back";
import CreateReply from "~/components/form/reply-form";
import { ReplyTweet } from "~/components/tweet/actions/reply-tweet";
import { RepostTweet } from "~/components/tweet/actions/repost-tweet";
import { LikeTweet } from "~/components/tweet/actions/like-tweet";
import { BookmarkTweet } from "~/components/tweet/actions/bookmark-tweet";
import { ShareTweet } from "~/components/tweet/actions/share-tweet";
import { SEO } from "~/components/simple-seo";
import { generateSSGHelper } from "~/server/helper/ssgHelper";
import { GetStaticProps } from "next";
import { ReactElement } from "react";
import { PageLayout } from "~/components/layouts/root-layout";
import { TweetParentPost } from "~/components/tweet/tweet-parent-post";
import { PostNotFound } from "~/components/tweet/tweet-not-found";
import { TweetTitle } from "~/components/tweet/tweet-title";
import { TweetMenu } from "~/components/tweet/tweet-menu";
import { TweetText } from "~/components/tweet/tweet-text";
import { TweetAction } from "~/components/tweet/tweet-action";
import { Comments } from "~/components/tweet/comments";

const SinglePostPage = ({ id }: { id: string }) => {
  const { data: detail, error, isLoading } = api.post.detailPost.useQuery({ id });
  if (!detail || error?.message === "NOT_FOUND") {
    return <PostNotFound />;
  }

  return (
    <>
      <SEO title={`${detail.author.username} on burbir: "${detail?.content}" / burbir`} />
      <div className="relative flex h-full min-h-screen w-full max-w-[600px] flex-col border-x border-border">
        <div className="sticky top-0 z-20 flex h-[53px] w-full items-center bg-background/[.65] px-4 font-semibold backdrop-blur-md">
          <div className="w-16">
            <ButtonBack />
          </div>
          <p>Post</p>
        </div>
        {isLoading ? (
          <LoadingItem />
        ) : (
          <div className="relative w-full max-w-full border-b border-border outline-none">
            {detail.type === "COMMENT" && detail.parentId && (
              <TweetParentPost parent={detail.parent} showParent={true} />
            )}
            <article
              className="relative flex w-full scroll-mt-[52px] flex-col"
              id={detail.type.toLowerCase()}
              key={detail.id}
            >
              <div className="flex px-4">
                <div className="mr-3 flex flex-shrink-0 basis-10 flex-col">
                  <div
                    className={cn(
                      "mx-auto mb-1 h-2 w-0.5 bg-transparent",
                      detail.type === "COMMENT" && " bg-[rgb(51,54,57)]"
                    )}
                  />
                  <Image
                    width="40"
                    height="40"
                    draggable={false}
                    src={detail.author.image!}
                    alt={`@${detail.author.name}'s profile picture`}
                    className="first-letter flex h-10 w-10 rounded-full"
                  />
                </div>
                <TweetTitle author={detail.author} post={detail} variant="details">
                  <TweetMenu post={detail} author={detail.author} />
                </TweetTitle>
              </div>
              <div className="relative mt-3 w-full flex-col px-4">
                <div className="flex w-fit justify-start">
                  <TweetText
                    content={renderText(detail?.content || "")}
                    className="text-[17px] leading-5"
                  />
                </div>
                {detail.image && (
                  <div className="relative flex h-fit w-full">
                    <div className="relative mt-3 flex w-full items-start justify-center overflow-hidden rounded-2xl border">
                      <div className="relative h-full w-fit max-w-full transition-colors duration-200 hover:bg-secondary xs:w-full">
                        <ImageModal
                          src={detail.image}
                          alt={`${detail.id}'s image`}
                          width="600"
                          height="400"
                          priority
                          className="h-full w-full object-contain object-center"
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-center text-[15px] leading-5 text-accent">
                  <Link
                    href={`/post/${detail.id}`}
                    className="group relative flex w-max items-end py-4 text-sm font-thin outline-none hover:underline focus:underline"
                    aria-label={dayjs(detail.createdAt).format("LL LT")}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild className="font-normal">
                          <time dateTime={detail.createdAt.toISOString()}>
                            {dayjs(detail.createdAt).format("LT")} ·&nbsp;
                            {dayjs(detail.createdAt).format("ll")}
                          </time>
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          className="rounded-none border-none bg-[#495A69] p-1 text-xs text-white"
                        >
                          {dayjs(detail.createdAt).format("LT LL")}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Link>
                </div>
                <hr />
                <TweetAction>
                  <ReplyTweet post={detail} variant="details" />
                  <RepostTweet post={detail} variant="details" />
                  <LikeTweet post={detail} variant="details" />
                  <BookmarkTweet post={detail} variant="details" />
                  <ShareTweet postId={detail.id} author={detail.author} variant="details" />
                </TweetAction>
                <hr className="mb-1 mt-3" />
                <p className="ml-14 text-[15px] leading-5 text-accent">
                  Replying to&nbsp;
                  <span className="text-primary">{`@${detail.author.username}`}</span>
                </p>
              </div>
              <CreateReply post={detail} />
            </article>
          </div>
        )}
        <Comments postId={id} enabled={!!detail} />
        <div className="h-[50dvh]"></div>
      </div>
    </>
  );
};

SinglePostPage.getLayout = function getLayout(page: ReactElement) {
  return <PageLayout>{page}</PageLayout>;
};

export default SinglePostPage;

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await ssg.post.detailPost.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
