import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex h-screen w-screen items-center justify-center bg-background">
      <SignIn />
    </main>
  );
}
