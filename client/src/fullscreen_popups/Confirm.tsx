import type { ReactNode } from "react";

export default function Confirm({
  children,
  onYes,
  onNo,
}: {
  children: ReactNode;
  onYes: () => void;
  onNo: () => void;
}) {
  return (
    <>
      <div>{children}</div>
      <div className="flex items-center justify-center gap-12 mt-4">
        <button
          className="border border-gray-200 rounded-md px-4 py-2 cursor-pointer text-gray text-xl text-gray-700 hover:bg-gray-200"
          onClick={onYes}
        >
          Yes
        </button>
        <button
          className="border border-gray-200 rounded-md px-4 py-2 cursor-pointer text-gray text-xl text-gray-700 hover:bg-gray-200"
          onClick={onNo}
        >
          No
        </button>
      </div>
    </>
  );
}
