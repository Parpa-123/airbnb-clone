import React, { type FormEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";

interface ResetPasswordDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (username: string, newPassword: string) => Promise<void>;
}

const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({
    open,
    onOpenChange,
    onSubmit,
}) => {
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const username = formData.get("Username") as string;
        const newPass = formData.get("NewPassword") as string;
        const confirmPass = formData.get("ConfirmPassword") as string;

        if (!username) {
            alert("Username is required");
            return;
        }

        if (newPass !== confirmPass) {
            alert("Passwords do not match");
            return;
        }

        if (!newPass || newPass.length < 8) {
            alert("Password must be at least 8 characters");
            return;
        }

        await onSubmit(username, newPass);
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 pointer-events-none" />
                <Dialog.Content className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-96 bg-white rounded-2xl shadow-2xl p-6 pointer-events-auto">
                    <div className="flex items-center justify-between mb-4">
                        <Dialog.Title className="text-xl font-semibold">Reset Password</Dialog.Title>
                        <Dialog.Close className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                            <Cross2Icon className="w-5 h-5" />
                        </Dialog.Close>
                    </div>

                    {/* Reset Password Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="Username" className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                id="Username"
                                name="Username"
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-[#FF385C] transition-all"
                                placeholder="Enter your username"
                            />
                        </div>

                        <div>
                            <label htmlFor="NewPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="NewPassword"
                                name="NewPassword"
                                required
                                minLength={8}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-[#FF385C] transition-all"
                                placeholder="Enter new password"
                            />
                        </div>

                        <div>
                            <label htmlFor="ConfirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="ConfirmPassword"
                                name="ConfirmPassword"
                                required
                                minLength={8}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-[#FF385C] transition-all"
                                placeholder="Confirm new password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#FF385C] text-white py-3 rounded-lg font-semibold hover:bg-[#E31C5F] transition-colors cursor-pointer"
                        >
                            Reset Password
                        </button>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default ResetPasswordDialog;
