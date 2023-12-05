import { useRouter } from "next/router";
import React from "react";
import { LuArrowLeft } from "react-icons/lu";

interface additionalFnc {
  onClick?: () => void | null;
}

const ButtonBack = ({ onClick }: additionalFnc) => {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        router.back();
        onClick;
      }}
      className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-border"
    >
      <LuArrowLeft size={24} />
      <span className="sr-only">back</span>
    </button>
  );
};

export default ButtonBack;
