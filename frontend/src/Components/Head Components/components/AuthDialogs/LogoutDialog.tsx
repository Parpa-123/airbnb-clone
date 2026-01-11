import React from "react";
import ReusableDialog from "../ui/ReusableDialog";

interface LogoutDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

const LogoutDialog: React.FC<LogoutDialogProps> = ({
    open,
    onOpenChange,
    onConfirm,
}) => {
    return (
        <ReusableDialog open={open} onOpenChange={onOpenChange}>
            <h3 className="text-lg font-semibold mb-2">Logout</h3>
            <p className="text-sm text-gray-600">
                Are you sure you want to log out?
            </p>

            <div className="flex justify-end gap-3 mt-6">
                <button
                    onClick={() => onOpenChange(false)}
                    className="px-4 py-2 border rounded-md cursor-pointer"
                >
                    Cancel
                </button>

                <button
                    onClick={onConfirm}
                    className="px-4 py-2 bg-red-600 text-white rounded-md cursor-pointer hover:bg-red-700"
                >
                    Logout
                </button>
            </div>
        </ReusableDialog>
    );
};

export default LogoutDialog;
