// onOk called when ok button pressed.
export default function OkDialog({
  onOk,
  children,
}: {
  onOk: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4">
      {/* message/content */}
      <div className="mb-4">{children}</div>

      {/* single action button */}
      <div className="flex justify-center">
        <button
          onClick={onOk} // close / confirm
          className="border border-gray-200 rounded-md px-4 py-2 cursor-pointer text-gray text-xl text-gray-700 hover:bg-gray-200"
        >
          Ok
        </button>
      </div>
    </div>
  );
}
