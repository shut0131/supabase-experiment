import React, { Children } from "react";

interface Props {
    open: Boolean;
    children: React.ReactNode | React.ReactNode[]
}
export function Dialog({ open, children }: Props) {
    if (!open) return

    return (
        <>
            <dialog className="modal">
                <div className="modal-box">
                    {children}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
}