import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { BsTwitterX } from "react-icons/bs";
import { useClerk } from "@clerk/nextjs";
import { UserResource } from "@clerk/types/dist";
import { useBurgerMenu, useUserPopover } from "~/hooks/store";

export const LogoutModal: React.FC<{
  user: UserResource | null | undefined;
  children: React.ReactNode;
}> = ({ user, children }) => {
  const [modalSignOut, setModalSignOut] = React.useState(false);
  const closeBurgerMenu = useBurgerMenu((state) => state.setShow);
  const closeUserPopover = useUserPopover((state) => state.setShow);
  const { signOut } = useClerk();

  function Logout() {
    signOut();
    setModalSignOut((prev) => !prev);
    closeBurgerMenu((prev) => !prev);
    closeUserPopover((prev) => !prev);
  }

  return (
    <Dialog open={modalSignOut} onOpenChange={setModalSignOut}>
      <DialogTrigger
        asChild
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </DialogTrigger>
      <DialogContent
        close={false}
        className="!rounded-2xl border-none p-8 text-start [&>button]:invisible"
        overlayClassName="bg-[rgba(91,_112,_131,_0.4)]"
      >
        <DialogHeader className="space-y-0">
          <BsTwitterX className="mb-4 h-9 w-full text-3xl" />
          <DialogTitle className="!mb-2 text-xl font-semibold tracking-normal">
            Log out of @{user?.username}
          </DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col gap-6">
              <p className="break-words font-twitter-chirp text-[15px] text-accent">
                This will only apply to this account, and you’ll still be logged
                in to your other accounts.
              </p>
              <div className="flex flex-col text-[17px] font-bold">
                <Button
                  variant="secondary"
                  onClick={Logout}
                  className="mb-3 min-h-[44px] min-w-[44px] text-[15px]"
                >
                  Log out
                </Button>
                <Button
                  variant="outline"
                  className="min-h-[44px] min-w-[44px] border-border text-[15px]"
                  onClick={() => setModalSignOut((prev) => !prev)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
