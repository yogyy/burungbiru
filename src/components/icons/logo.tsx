import Image from "next/image";

interface Props {
  size: number;
  className?: string;
}

export const Logo = ({ size = 20, className }: Props) => {
  return (
    <Image
      src="/apple-touch-icon.png"
      draggable={false}
      width={size}
      height={size}
      alt="burbir logo"
      className={className}
    />
  );
};
