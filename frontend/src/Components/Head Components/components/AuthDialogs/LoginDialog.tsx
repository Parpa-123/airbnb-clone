import React, { type FormEvent } from "react";
import ReusableDialog from "../ui/ReusableDialog";
import type { LoginType } from "../../types";

interface LoginDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: LoginType) => Promise<void>;
    loading: boolean;
    onSignupClick: () => void;
    onForgotPasswordClick: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({
    open,
    onOpenChange,
    onSubmit,
    loading,
    onSignupClick,
    onForgotPasswordClick,
}) => {
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        await onSubmit({
            username: String(fd.get("login_username")),
            password: String(fd.get("login_password")),
        });
        onOpenChange(false);
    };

    const handleSignupClick = () => {
        onOpenChange(false);
        onSignupClick();
    };

    const handleForgotPasswordClick = () => {
        onOpenChange(false);
        onForgotPasswordClick();
    };

    return (
        <ReusableDialog open={open} onOpenChange={onOpenChange}>
            <h3 className="text-lg font-semibold mb-4">Log In</h3>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                    name="login_username"
                    placeholder="Username"
                    className="w-full border p-2 rounded-md"
                    required
                />
                <input
                    name="login_password"
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2 rounded-md"
                    required
                />

                <button className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 cursor-pointer">
                    {loading ? "Loading..." : "Log In"}
                </button>
            </form>

            <span>
                Don't have an account?{" "}
                <span onClick={handleSignupClick} className="text-blue-600 cursor-pointer">
                    Sign Up
                </span>
            </span>

            <span>
                Forgot password?{" "}
                <span onClick={handleForgotPasswordClick} className="text-blue-600 cursor-pointer">
                    Forgot Password
                </span>
            </span>
        </ReusableDialog>
    );
};

export default LoginDialog;
