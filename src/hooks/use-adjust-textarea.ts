import { useEffect, useRef } from "react";

export function useTextarea() {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  function adjustTextareaHeight() {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight + 5}px`;
  }

  useEffect(() => {
    const { current } = textareaRef;
    if (!current) return;
    current.addEventListener("input", adjustTextareaHeight);
    adjustTextareaHeight();

    return () => {
      current.removeEventListener("input", adjustTextareaHeight);
    };
  }, [textareaRef]);

  return { textareaRef, adjustTextareaHeight };
}
