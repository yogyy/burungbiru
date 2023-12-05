import { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/server/helper/ssgHelper";
import ButtonBack from "~/components/ButtonBack";
import {
  TweetText,
  TweetTitle,
  TweetAction,
  PostNotFound,
  TweetPost,
} from "~/components/tweet";
import { cn } from "~/lib/utils";
import Image from "next/image";
import { renderText } from "~/lib/tweet";
import { useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import { ImageModal } from "~/components/modal";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { AnalyticIcon } from "~/components/icons";
import { Feed, PageLayout } from "~/components/layouts";
import { LoadingItem } from "~/components/loading";
import CreateReply from "~/components/form/reply-form";

const SinglePostPage = ({
  id,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { user: currentUser } = useUser();
  const { data, isLoading, error } = api.post.detailPost.useQuery(
    {
      id,
    },
    { refetchOnWindowFocus: false }
  );
  if (!data || error?.message === "NOT_FOUND") return <PostNotFound />;
  const { author, post, repostAuthor } = data;

  const { data: replies, isLoading: repliesloading } =
    api.post.postReplies.useQuery({ postId: post.id });

  const { data: parent } = api.post.parentPost.useQuery({
    parentId: post.parentId ?? "",
  });

  return (
    <>
      <Head>
        <title>{`${author.username} at "${post.content}" / burbir`}</title>
      </Head>
      <PageLayout className="flex">
        <div className="flex h-full min-h-screen w-full max-w-[600px] flex-col border-x border-border">
          <div className="sticky top-0 z-20 flex h-[53px] w-full items-center bg-background/[.65] px-4 font-semibold backdrop-blur-md">
            <div className="w-16">
              <ButtonBack />
            </div>
            <p>Post</p>
          </div>
          <div
            className={cn(
              "relative w-full max-w-full border-b border-border outline-none"
            )}
          >
            {post.type === "COMMENT" &&
              parent?.map((i) => (
                <TweetPost
                  author={i.author}
                  post={i.post}
                  repostAuthor={i.repostAuthor}
                  key={i.post.id}
                  className={cn(
                    "focus-wihtin:bg-white/[.03] border-none hover:bg-white/[.03]",
                    "group/post transition-colors duration-200 ease-linear"
                  )}
                  variant="parent"
                />
              ))}
            {isLoading ? (
              <LoadingItem />
            ) : (
              <div
                className="relative flex w-full scroll-mt-[52px] flex-col"
                id={post.type.toLowerCase()}
              >
                <div className="flex px-4">
                  <div className="mr-3 flex flex-shrink-0 basis-10 flex-col">
                    <div
                      className={cn(
                        "mx-auto mb-1 h-2 w-0.5 bg-transparent",
                        post.type === "COMMENT" && " bg-[rgb(51,54,57)]"
                      )}
                    />
                    <Image
                      width="40"
                      height="40"
                      draggable={false}
                      src={author.profileImg}
                      alt={`@${
                        author.username || author.lastName
                      }'s profile picture`}
                      className="first-letter flex h-10 w-10 rounded-full"
                    />
                  </div>
                  <TweetTitle
                    author={author}
                    post={post}
                    repostAuthor={repostAuthor}
                    variant="details"
                    className=" pt-3"
                  />
                </div>
                <div className="relative mt-3 w-full flex-col px-4">
                  <div className="flex w-fit justify-start">
                    <TweetText
                      content={renderText(post.content)}
                      className="text-[17px] leading-5"
                    />
                  </div>
                  {post.image ? (
                    <div className="relative flex h-fit w-full">
                      <div className="relative mt-3 flex w-full items-start justify-center overflow-hidden rounded-2xl border">
                        <div className="relative h-full w-fit max-w-full transition-colors duration-200 hover:bg-secondary xs:w-full">
                          <ImageModal
                            src={post.image}
                            alt={`${post.id}'s image`}
                            width="600"
                            height="400"
                            priority
                            className="h-full w-full object-contain object-center"
                          />
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <div className="flex items-center text-[15px] leading-5 text-accent">
                    <Link
                      href={`/post/${post.id}`}
                      className="group relative flex w-max items-end py-4 text-sm font-thin outline-none hover:underline focus:underline"
                      aria-label={dayjs(post.createdAt).format("LL LT")}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild className="font-normal ">
                            <time dateTime={post.createdAt.toISOString()}>
                              {dayjs(post.createdAt).format("LT")} ·&nbsp;
                              {dayjs(post.createdAt).format("ll")}
                            </time>
                          </TooltipTrigger>
                          <TooltipContent
                            side="bottom"
                            className="rounded-none border-none bg-[#495A69] p-1 text-xs text-white"
                          >
                            {dayjs(post.createdAt).format("LT LL")}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Link>
                    <p className="text-inherit">
                      &nbsp;·&nbsp;
                      <span className="font-semibold text-white">
                        {post.view}
                      </span>{" "}
                      Views
                    </p>
                  </div>
                  {currentUser?.id === post.authorId ? (
                    <button className="flex w-full border-y py-3 text-[15px] leading-5 text-accent hover:bg-white/[.03]">
                      <AnalyticIcon className="h-5 w-5 fill-accent" />
                      &nbsp;<span>View post engagements</span>
                    </button>
                  ) : null}
                  <TweetAction
                    post={post}
                    variant="details"
                    author={author}
                    repostAuthor={repostAuthor}
                  />
                  <hr className="border-1 mb-1 mt-3" />
                  {!repliesloading && (
                    <p className="ml-14 text-[15px] leading-5 text-accent">
                      Replyign to&nbsp;
                      <span className="text-primary">{`@${author.username}`}</span>
                    </p>
                  )}
                </div>
                {!repliesloading && <CreateReply post={post} />}
              </div>
            )}
          </div>
          <Feed post={replies} postLoading={repliesloading} />
          <div className="h-[90vh]" />
        </div>
      </PageLayout>
    </>
  );
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
