import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { IoArrowBack, IoChevronForwardSharp, IoClose } from "react-icons/io5";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { featureNotReady } from "~/lib/utils";
import { useUpdateUserModal } from "~/hooks/store";
import { Button } from "../ui/button";
import { useProfileContext } from "~/context";
import { authClient } from "~/lib/auth-client";

const LazyForm = dynamic(
  () => import("../form/update-user-form").then((mod) => mod.UpdateUserForm),
  { ssr: false }
);

export const EditUserModal = () => {
  const { show, setShow } = useUpdateUserModal();
  const { data } = authClient.useSession();
  const user = useProfileContext();

  if (data?.user.id !== user.id) return null;

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button
          type="button"
          variant="outline"
          className="focus-visible:border-1 rounded-full border-[rgb(83,_100,_113)] py-4 font-semibold text-[rgb(239,_243,_244)] hover:bg-[rgba(239,243,244,0.1)] focus-visible:bg-[rgba(239,243,244,0.1)]"
        >
          Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent className="hide-scrollbar h-screen items-start overflow-hidden overflow-y-scroll rounded-none border-none p-0 text-start max-modal:max-w-[720px] modal:h-[650px] modal:min-w-[600px] modal:rounded-2xl">
        <DialogHeader className="relative mx-auto flex w-full max-w-[600px] flex-col space-y-0 pb-16">
          <DialogDescription asChild>
            <div className="sticky top-0 z-10 flex h-[53px] w-full items-center bg-black/60 px-4 backdrop-blur-md">
              <div className="min-w-[3.5rem]">
                <DialogClose className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full hover:bg-[rgba(239,243,244,0.1)] focus-visible:bg-[rgba(239,243,244,0.1)]">
                  <IoArrowBack size={26} className="block modal:hidden" />
                  <IoClose size={26} className="hidden modal:block" />
                  <span className="sr-only">cancel</span>
                </DialogClose>
              </div>

              <DialogTitle className="flex-grow text-xl font-semibold leading-6">
                Edit profile
              </DialogTitle>

              <Button variant="secondary" form="edit_user_form">
                Save
              </Button>
            </div>
          </DialogDescription>
          <LazyForm />
          <div className="flex flex-col p-4 leading-6">
            <div className="flex h-5 ">
              <p className="text-accent">Birth Date</p>
              <span className="px-1">·</span>
              <button className="text-primary" onClick={() => featureNotReady("edit-birth-date")}>
                Edit
              </button>
            </div>
            <div className="h-6 text-xl">{dayjs(user?.birthDate).format("LL") || ""}</div>
          </div>
          <button
            className="flex justify-between px-4 py-3 text-left text-xl leading-6 transition-colors duration-200 hover:bg-[rgb(22,24,28)] disabled:cursor-not-allowed"
            onClick={() => featureNotReady("switch-to-pro", "This feature won't be implemented")}
          >
            Switch to professional
            <IoChevronForwardSharp className="text-accent" width={20} />
          </button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
