import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="overflow-none flex h-full justify-center">
      <div className="flex h-full min-h-screen w-full flex-col border-x border-border md:max-w-2xl">
        {props.children}
      </div>
    </main>
  );
};
