import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { resetForm } from "../../../../redux/slices/formSlice";
import MultiStepController from "../../../Multiform Components/MultiStepController";

interface HostingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isHost?: boolean;
}

const HostingDialog: React.FC<HostingDialogProps> = ({
    open,
    onOpenChange,
    isHost,
}) => {
    const dispatch = useDispatch();

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            dispatch(resetForm());
        }
        onOpenChange(nextOpen);
    };

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-md z-50" />
                <Dialog.Content className="fixed left-1/2 top-1/2 w-[95%] max-w-4xl h-[85vh] max-h-[800px] -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50">
                    <Dialog.Title className="sr-only">
                        {isHost ? "List More Places" : "Become a Host"}
                    </Dialog.Title>
                    <Dialog.Description className="sr-only">
                        List your property and start earning.
                    </Dialog.Description>
                    <MultiStepController onClose={() => onOpenChange(false)} />

                    <Dialog.Close asChild>
                        <button
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 cursor-pointer"
                            aria-label="Close"
                        >
                            <FaTimes />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default HostingDialog;
