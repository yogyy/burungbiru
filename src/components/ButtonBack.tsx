import { useRouter } from "next/router";
import React from "react";

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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
        />
      </svg>
    </button>
  );
};

export default ButtonBack;
