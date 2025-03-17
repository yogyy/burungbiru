import { IconBaseProps } from "./type";

export function ArrowLeft({ size, ...props }: IconBaseProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m12 19l-7-7l7-7m7 7H5"
      ></path>
    </svg>
  );
}

export function Dots({ size = "16", ...props }: IconBaseProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0"
      ></path>
    </svg>
  );
}

export function CameraPlus({ size = "16", ...props }: IconBaseProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M12 20H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1a2 2 0 0 0 2-2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v3.5M16 19h6m-3-3v6"></path>
        <path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0-6 0"></path>
      </g>
    </svg>
  );
}

export function X({ size = "16", ...props }: IconBaseProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M18 6L6 18M6 6l12 12"
      ></path>
    </svg>
  );
}

export function Search({ size = "16", ...props }: IconBaseProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21l-4.3-4.3"></path>
      </g>
    </svg>
  );
}

export function Check({ size = "16", ...props }: IconBaseProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20 6L9 17l-5-5"
      ></path>
    </svg>
  );
}

export function ChevronDown({ size = "16", ...props }: IconBaseProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m6 9l6 6l6-6"
      ></path>
    </svg>
  );
}

export function ChevronRight({ size = "16", ...props }: IconBaseProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m9 18l6-6l-6-6"
      ></path>
    </svg>
  );
}

export function Settings({ size = "16", ...props }: IconBaseProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </g>
    </svg>
  );
}

export function LinkMini({ size = "16", ...props }: IconBaseProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="m17.657 14.828l-1.415-1.414L17.658 12A4 4 0 1 0 12 6.343l-1.414 1.414L9.17 6.343l1.415-1.414a6 6 0 0 1 8.485 8.485zm-2.829 2.829l-1.414 1.414a6 6 0 0 1-8.485-8.485l1.414-1.414l1.414 1.414L6.343 12A4 4 0 0 0 12 17.657l1.414-1.414zm0-9.9l1.415 1.415l-7.072 7.07l-1.414-1.414z"
      ></path>
    </svg>
  );
}

export function UserPlus({ size = "16", ...props }: IconBaseProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        d="M4.5 8.552c0 1.995 1.505 3.5 3.5 3.5s3.5-1.505 3.5-3.5s-1.505-3.5-3.5-3.5s-3.5 1.505-3.5 3.5zM19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3zM4 19h10v-1c0-2.757-2.243-5-5-5H7c-2.757 0-5 2.243-5 5v1h2z"
        fill="currentColor"
      ></path>
    </svg>
  );
}

export function Trash({ size = "16", ...props }: IconBaseProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"
      ></path>
      <path fill="currentColor" d="M9 10h2v8H9zm4 0h2v8h-2z"></path>
    </svg>
  );
}

export function PatchCheck({ size = "16", ...props }: IconBaseProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      {...props}
    >
      <g fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10.354 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7 8.793l2.646-2.647a.5.5 0 0 1 .708 0"
        ></path>
        <path d="m10.273 2.513l-.921-.944l.715-.698l.622.637l.89-.011a2.89 2.89 0 0 1 2.924 2.924l-.01.89l.636.622a2.89 2.89 0 0 1 0 4.134l-.637.622l.011.89a2.89 2.89 0 0 1-2.924 2.924l-.89-.01l-.622.636a2.89 2.89 0 0 1-4.134 0l-.622-.637l-.89.011a2.89 2.89 0 0 1-2.924-2.924l.01-.89l-.636-.622a2.89 2.89 0 0 1 0-4.134l.637-.622l-.011-.89a2.89 2.89 0 0 1 2.924-2.924l.89.01l.622-.636a2.89 2.89 0 0 1 4.134 0l-.715.698a1.89 1.89 0 0 0-2.704 0l-.92.944l-1.32-.016a1.89 1.89 0 0 0-1.911 1.912l.016 1.318l-.944.921a1.89 1.89 0 0 0 0 2.704l.944.92l-.016 1.32a1.89 1.89 0 0 0 1.912 1.911l1.318-.016l.921.944a1.89 1.89 0 0 0 2.704 0l.92-.944l1.32.016a1.89 1.89 0 0 0 1.911-1.912l-.016-1.318l.944-.921a1.89 1.89 0 0 0 0-2.704l-.944-.92l.016-1.32a1.89 1.89 0 0 0-1.912-1.911z"></path>
      </g>
    </svg>
  );
}
