import { ReactNode } from "react";
import { BsTwitterX } from "react-icons/bs";
import { cn } from "~/lib/utils";
import { useBurgerMenu, useUserPopover } from "~/hooks/store";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { buttonVariants } from "../ui/button";
import { authClient } from "~/lib/auth-client";
import { useRouter } from "next/router";

export const LogoutModal = ({ children }: { children: ReactNode }) => {
  const { push } = useRouter();
  const closeBurgerMenu = useBurgerMenu((state) => state.setShow);
  const closeUserPopover = useUserPopover((state) => state.setShow);

  async function Logout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          push("/auth/sign-in");
          closeBurgerMenu((prev) => !prev);
          closeUserPopover((prev) => !prev);
        },
      },
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        close={false}
        className="w-full overflow-hidden !rounded-2xl border-none p-8 text-start [&>button]:invisible"
        overlayClassName="bg-[rgba(91,_112,_131,_0.4)]"
      >
        <DialogHeader className="relative w-full space-y-0">
          <BsTwitterX className="mb-4 h-9 w-full text-3xl" />
          <DialogTitle className="!mb-2 w-full text-xl font-semibold tracking-normal">
            Log out of burbir?
          </DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col gap-6">
              <p className="break-words font-twitter-chirp text-[15px] text-accent">
                You can always log back in at any time. If you just want to
                switch accounts, you can do that by adding an existing account.
              </p>
              <div className="flex w-full flex-col text-[17px] font-bold">
                <DialogClose
                  onClick={Logout}
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "mb-3 min-h-[44px] min-w-[44px] text-[15px]"
                  )}
                >
                  Log out
                </DialogClose>
                <DialogClose
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "min-h-[44px] min-w-[44px] border-border text-[15px]"
                  )}
                >
                  Cancel
                </DialogClose>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
