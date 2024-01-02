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
import { useBurgerMenu, useUserPopover } from "~/hooks/store";

export const LogoutModal: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
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
