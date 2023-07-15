import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postView";
import { generateSSGHelper } from "~/server/helper/ssgHelper";
import ButtonBack from "~/components/ButtonBack";

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.posts.getById.useQuery({
    id,
  });
  if (!data) return <div className="">404</div>;
  // console.log(data);

  return (
    <>
      <Head>
        <title>{`${data.post.content} - ${data.author.username}`}</title>
      </Head>
      <PageLayout className="flex-row">
        <div className="flex h-full min-h-screen w-full flex-col border-x border-border md:w-[42rem]">
          <div className="flex h-14 w-full items-center px-4 font-semibold ">
            <div className="w-16">
              <ButtonBack />
            </div>
            <p>Tweets</p>
          </div>
          <PostView {...data} />
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
