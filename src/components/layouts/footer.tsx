import Link from "next/link";

export default function Footer() {
  return (
    <footer className="grid w-full px-4 py-4 text-sm text-accent">
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <p>
          Find an issue?&nbsp;&nbsp;
          <Link
            target="_blank"
            href="https://github.com/yogyy/burungbiru/issues"
            className="text-blue-400 underline"
          >
            Report it here
          </Link>
        </p>
        <Link
          target="_blank"
          className="transition-[color] duration-200 hover:text-gray-400 hover:underline"
          href="https://github.com/yogyy/burungbiru"
        >
          Source code
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/support/tos" className="transition-[color] duration-200 hover:text-gray-400">
          Terms of Service
        </Link>
        <Link
          href="/support/privacy-policy"
          className="transition-[color] duration-200 hover:text-gray-400"
        >
          Privacy Policy
        </Link>
        <p className="cursor-default">© {new Date().getFullYear()} burbir.</p>
      </div>
    </footer>
  );
}
