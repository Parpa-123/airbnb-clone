import { useState } from "react";

export const useDialogState = () => {
    const [loginOpen, setLoginOpen] = useState(false);
    const [signupOpen, setSignupOpen] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [hostingOpen, setHostingOpen] = useState(false);
    const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    return {
        loginOpen,
        setLoginOpen,
        signupOpen,
        setSignupOpen,
        logoutOpen,
        setLogoutOpen,
        hostingOpen,
        setHostingOpen,
        resetPasswordOpen,
        setResetPasswordOpen,
        menuOpen,
        setMenuOpen,
        mobileSearchOpen,
        setMobileSearchOpen,
    };
};
