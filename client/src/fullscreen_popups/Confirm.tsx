import type { ReactNode } from "react";

// take children (content inside confirm screen), onYes, onNo props. onYes, onNo, called when yes / no button pressed.
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
      {/* content passed into the confirm */}
      <div>{children}</div>

      {/* action buttons */}
      <div className="flex items-center justify-center gap-12 mt-4">
        <button
          className="border border-gray-200 rounded-md px-4 py-2 cursor-pointer text-gray text-xl text-gray-700 hover:bg-gray-200"
          onClick={onYes} // confirm action
        >
          Yes
        </button>

        <button
          className="border border-gray-200 rounded-md px-4 py-2 cursor-pointer text-gray text-xl text-gray-700 hover:bg-gray-200"
          onClick={onNo} // cancel action
        >
          No
        </button>
      </div>
    </>
  );
}
