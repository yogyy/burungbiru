import { GetStaticProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/server/helper/ssgHelper";
import ButtonBack from "~/components/ButtonBack";
import { TweetText, TweetTitle, TweetAction } from "~/components/tweet";
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
import { PageLayout } from "~/components/layouts";
import { PostNotFound } from "./not-found";
import { LoadingSpinner } from "~/components/loading";

const SinglePostPage = ({
  id,
}: InferGetServerSidePropsType<typeof getStaticProps>) => {
  const { user: currentUser } = useUser();
  const { data, isLoading, error } = api.post.detailPost.useQuery(
    {
      id,
    },
    { retry: 1, keepPreviousData: false }
  );
  if (!data || error?.message === "NOT_FOUND") return <PostNotFound />;
  const { author, post } = data;

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
              "relative w-full max-w-full border-b border-border px-4 outline-none"
            )}
          >
            {isLoading ? (
              <div className="flex h-20 items-center justify-center">
                <LoadingSpinner size={24} />
              </div>
            ) : (
              <div className="relative flex w-full flex-col pt-3">
                <div className="flex">
                  <div className="mr-3 flex h-10 w-10 flex-shrink-0 basis-10">
                    <Image
                      width="40"
                      height="40"
                      draggable={false}
                      src={author.profileImg}
                      alt={`@${
                        author.username || author.lastName
                      }'s profile picture`}
                      className="first-letter flex basis-12 rounded-full"
                    />
                  </div>
                  <TweetTitle author={author} post={post} variant="details" />
                </div>
                <div className="relative mt-3 w-full flex-col pb-3">
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
                      <span className="font-semibold text-white">20</span> Views
                    </p>
                  </div>
                  {currentUser?.id === post.authorId ? (
                    <button
                      type="button"
                      className="flex w-full border-y py-3 text-[15px] leading-5 text-accent hover:bg-white/[.03]"
                    >
                      <AnalyticIcon className="h-5 w-5 fill-accent" />
                      &nbsp;<span>View post engagements</span>
                    </button>
                  ) : null}
                  <TweetAction variant="details" />
                </div>
              </div>
            )}
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default SinglePostPage;

// export const getServerSideProps = async (
//   ctx: GetServerSidePropsContext<{ id: string }>
// ) => {
//   const ssg = generateSSGHelper();
//   const id = ctx.params?.id as string;

//   await ssg.post.detailPost.prefetch({ id });

//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       id,
//     },
//   };
// };
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
