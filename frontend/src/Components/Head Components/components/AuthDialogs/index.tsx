import React from "react";
import LoginDialog from "./LoginDialog";
import LogoutDialog from "./LogoutDialog";
import ResetPasswordDialog from "./ResetPasswordDialog";
import SignupDialog from "../dialogs/SignupDialog";
import type { LoginType, SignupType } from "../../types";

interface AuthDialogsProps {
    loginOpen: boolean;
    signupOpen: boolean;
    logoutOpen: boolean;
    resetPasswordOpen: boolean;
    onLoginOpenChange: (open: boolean) => void;
    onSignupOpenChange: (open: boolean) => void;
    onLogoutOpenChange: (open: boolean) => void;
    onResetPasswordOpenChange: (open: boolean) => void;
    onLogin: (data: LoginType) => Promise<void>;
    onSignup: (data: SignupType) => Promise<void>;
    onLogout: () => void;
    onResetPassword: (username: string, newPassword: string) => Promise<void>;
    loading: boolean;
}

/**
 * Container component for all authentication-related dialogs
 * Consolidates login, signup, logout, and reset password functionality
 */
const AuthDialogs: React.FC<AuthDialogsProps> = ({
    loginOpen,
    signupOpen,
    logoutOpen,
    resetPasswordOpen,
    onLoginOpenChange,
    onSignupOpenChange,
    onLogoutOpenChange,
    onResetPasswordOpenChange,
    onLogin,
    onSignup,
    onLogout,
    onResetPassword,
    loading,
}) => {
    return (
        <>
            {/* Signup Dialog */}
            <SignupDialog
                open={signupOpen}
                onOpenChange={onSignupOpenChange}
                loading={loading}
                onSubmit={async (fd) => {
                    const pwd = String(fd.get("password"));
                    const conf = String(fd.get("conf_password"));
                    if (pwd !== conf) throw new Error("Passwords do not match");

                    await onSignup({
                        username: String(fd.get("username")),
                        email: String(fd.get("email")),
                        password: pwd,
                        phone: String(fd.get("phone")),
                    });
                    onSignupOpenChange(false);
                    onLoginOpenChange(true);
                }}
            />

            {/* Login Dialog */}
            <LoginDialog
                open={loginOpen}
                onOpenChange={onLoginOpenChange}
                onSubmit={onLogin}
                loading={loading}
                onSignupClick={() => {
                    onLoginOpenChange(false);
                    onSignupOpenChange(true);
                }}
                onForgotPasswordClick={() => {
                    onLoginOpenChange(false);
                    onResetPasswordOpenChange(true);
                }}
            />

            {/* Logout Confirmation Dialog */}
            <LogoutDialog
                open={logoutOpen}
                onOpenChange={onLogoutOpenChange}
                onConfirm={onLogout}
            />

            {/* Reset Password Dialog */}
            <ResetPasswordDialog
                open={resetPasswordOpen}
                onOpenChange={onResetPasswordOpenChange}
                onSubmit={onResetPassword}
            />
        </>
    );
};

export default AuthDialogs;
