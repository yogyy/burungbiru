import Link from "next/link";

const ToastPostSuccess = ({ id }: { id: string }) => {
  return (
    <>
      Your Post was sent.&nbsp;
      <Link href={`/post/${id}`} className="font-bold hover:underline">
        View
      </Link>
    </>
  );
};

const ToastReplySuccess = ({ id }: { id: string }) => {
  return (
    <>
      Your Post was sent.&nbsp;
      <Link href={`/post/${id}#comment`} className="font-bold hover:underline">
        View
      </Link>
    </>
  );
};

export { ToastPostSuccess, ToastReplySuccess };
