import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import { generateSSGHelper } from "~/server/helper/ssgHelper";
import ButtonBack from "~/components/ButtonBack";
import { TweetText, TweetTitle } from "~/components/tweet";
import { cn } from "~/lib/utils";
import Image from "next/image";
import { renderText } from "~/lib/tweet";
import { useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import { TweetAction } from "~/components/tweet/tweet-action";
import { ImageModal } from "~/components/modal/image-modal";

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { user } = useUser();
  const { data } = api.posts.getById.useQuery({
    id,
  });
  if (!data) return <div className="">404</div>;
  // console.log(data);
  const { author, post } = data;

  return (
    <>
      <Head>
        <title>{`${data.author.username} at "${data.post.content}" / burbir`}</title>
      </Head>
      <PageLayout className="flex">
        <div
          className="flex h-full min-h-screen w-full flex-col border-x border-border md:w-[600px]"
          onClick={() => console.log(post.createdAt)}
        >
          <div className="flex h-14 w-full items-center px-4 font-semibold ">
            <div className="w-16">
              <ButtonBack />
            </div>
            <p>Tweets</p>
          </div>
          <div
            className={cn(
              "relative w-full max-w-full border-b border-border px-4 outline-none"
            )}
          >
            <div className="relative flex w-full flex-col pt-3">
              <div className="mr-3 flex h-auto w-10 flex-shrink-0 basis-10">
                <Image
                  width={40}
                  height={40}
                  draggable={false}
                  src={author.profileImg}
                  alt={`@${
                    author.username || author.lastName
                  }'s profile picture`}
                  className="first-letter flex basis-12 rounded-full"
                />
              </div>
              <TweetTitle author={author} post={post} />
              <div className="relative w-full flex-col pb-3">
                <div className="flex w-fit justify-start">
                  <TweetText content={renderText(post.content)} />
                </div>
                {post.image ? (
                  <div className="relative flex h-fit min-h-[510px] w-full">
                    <div className="relative mt-3 flex w-full items-start justify-center overflow-hidden rounded-2xl border">
                      <div className="relative h-full w-full max-w-full transition-colors duration-200 hover:bg-secondary">
                        <ImageModal
                          src={post.image}
                          alt="test"
                          className="h-full w-full object-contain object-center"
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
                <TweetAction />
              </div>
            </div>
          </div>
        </div>
        {/* <section className="hidden w-[275px] lg:block">ddadd</section> */}
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await ssg.posts.getById.prefetch({ id });

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

export default SinglePostPage;
