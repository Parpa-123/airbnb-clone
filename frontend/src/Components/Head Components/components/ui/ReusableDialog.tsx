import * as Dialog from "@radix-ui/react-dialog";
import { FaTimes } from "react-icons/fa";
import React from "react";

type ReusableDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  maxWidth?: string;
};

const ReusableDialog: React.FC<ReusableDialogProps> = ({
  open,
  onOpenChange,
  children,
  maxWidth = "max-w-sm",
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay
          className="
            fixed inset-0
            bg-black/40 backdrop-blur-sm
            z-50
          "
        />

        {/* Content */}
        <Dialog.Content
          className={`
            fixed left-1/2 top-1/2
            -translate-x-1/2 -translate-y-1/2
            w-[90%] ${maxWidth}
            rounded-lg bg-white p-6
            shadow-xl border border-gray-200
            z-50
            focus:outline-none
          `}
        >
          {children}

          <Dialog.Close asChild>
            <button
              aria-label="Close dialog"
              className="
                absolute right-4 top-4
                text-gray-600 hover:text-gray-900
                focus:outline-none
              "
            >
              <FaTimes className="text-lg" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ReusableDialog;
