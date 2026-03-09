import type { ReactNode } from "react";

import closeWindowButton from "../assets/icons/close-button.svg"

export default function Fullscreen({open, onClose, children}: {open: boolean, onClose: () => void, children: ReactNode}) {
    if (!open) return null;
    return <div className="fixed inset-0 z-50 flex justify-center items-center" onClick={(e) => e.stopPropagation()}>
        <div className="fixed inset-0 bg-black/50 cursor-default" onClick={onClose} />

        <div className="relative bg-white w-1/2 h-1/2 cursor-default p-4 rounded-lg" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-2 right-2 hover:cursor-pointer" onClick={onClose}><img src={closeWindowButton} alt="Close window" className="w-6"></img></button>
            {children}
        </div>
    </div>
}