import { NextPage } from "next";
import { Layout } from "~/components/layout";

const About: NextPage = () => {
  return (
    <Layout>
      <section className="flex h-screen flex-col items-center justify-center bg-gradient-to-b from-[#02126d] to-[#010102] pt-12">
        <div className="container flex justify-center px-4 py-16 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            MA<span className="text-[hsl(280,100%,70%)]">KA</span>N bang
          </h1>
        </div>
      </section>
      <section className="h-screen"></section>
    </Layout>
  );
};

export default About;
