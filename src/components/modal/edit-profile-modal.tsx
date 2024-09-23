import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { IoArrowBack, IoChevronForwardSharp, IoClose } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { featureNotReady } from "~/lib/utils";
import { getCurrentUser } from "~/hooks/queries";
import { Button } from "../ui/button";

const LazyForm = dynamic(() =>
  import("~/components/form/update-user-form").then((mod) => mod.UpdateUserForm)
);

export const EditUserModal = () => {
  const { data: currentUser } = getCurrentUser();

  return (
    <Dialog>
      <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button
          type="button"
          variant="outline"
          className="focus-visible:border-1 rounded-full border-[rgb(83,_100,_113)] py-4 font-semibold text-[rgb(239,_243,_244)] hover:bg-[rgba(239,243,244,0.1)] focus-visible:bg-[rgba(239,243,244,0.1)]"
        >
          Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent className="hide-scrollbar h-screen max-w-[600px] items-start overflow-hidden overflow-y-scroll rounded-none border-none p-0 text-start max-[570px]:data-[state=open]:!slide-in-from-bottom-[48%] min-[570px]:h-auto min-[570px]:max-h-[650px] min-[570px]:!rounded-2xl">
        <DialogHeader className="relative flex flex-col space-y-0">
          <DialogDescription asChild>
            <div className="sticky top-0 z-10 flex h-[53px] w-full items-center bg-black/60 px-4 backdrop-blur-md">
              <div className="min-w-[3.5rem]">
                <button className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full hover:bg-[rgba(239,243,244,0.1)] focus:bg-[rgba(239,243,244,0.1)]">
                  <IoArrowBack size={26} className="block sm:hidden" />
                  <IoClose size={26} className="hidden sm:block" />
                  <span className="sr-only">cancel</span>
                </button>
              </div>

              <DialogTitle
                className="flex-grow text-xl font-semibold leading-6"
                onClick={() => console.log(currentUser)}
              >
                Edit profile
              </DialogTitle>

              <Button variant="secondary" className="" form="edit_user_form">
                Save
              </Button>
            </div>
          </DialogDescription>
          <LazyForm user={currentUser} />
          <div className="flex flex-col p-4 leading-6 ">
            <div className="flex h-5 ">
              <p className="text-accent">Birth Date</p>
              <span className="px-1">·</span>
              <button
                className="text-primary"
                onClick={() => featureNotReady("edit-birth-date")}
              >
                Edit
              </button>
            </div>
            <div className="h-6 text-xl">
              {dayjs(currentUser?.birthDate).format("LL") || ""}
            </div>
          </div>
          <button className="flex justify-between px-4 py-3 text-left text-xl leading-6 transition-colors duration-200 hover:bg-[rgb(22,24,28)]">
            Switch to professional
            <IoChevronForwardSharp className="text-accent" width={20} />
          </button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
