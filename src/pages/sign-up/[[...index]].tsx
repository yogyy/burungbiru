import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex h-[100dvh] w-screen items-center justify-center bg-background">
      <SignUp />
    </main>
  );
}
