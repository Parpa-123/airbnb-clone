import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";

import Img from "../../assets/image.png";
import { useAuth } from "./hooks/useAuth";
import { useDialogState } from "./hooks/useDialogState";
import { useSearchFilters } from "./hooks/useSearchFilters";

// Components
import SearchBar from "./components/SearchBar";
import UserMenu from "./components/UserMenu";
import AuthDialogs from "./components/AuthDialogs";
import HostingDialog from "./components/HostingDialog";

// Services
import { showError, showSuccess } from "../../utils/toastMessages";
import axiosInstance from "../../../public/connect";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, loading, doLogin, doSignup, logout } = useAuth();
  const dialogState = useDialogState();
  const searchState = useSearchFilters();

  const searchHidePaths = ['/bookings', '/me'];
  const shouldHideSearch = searchHidePaths.some(path =>
    location.pathname.startsWith(path)
  );

  // Window resize handler for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        dialogState.setMobileSearchOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dialogState]);

  // Logout handler
  const handleLogout = () => {
    logout();
    dialogState.setLogoutOpen(false);
    dialogState.setMenuOpen(false);
    navigate("/");
  };

  // Reset password handler
  const handleResetPassword = async (username: string, newPassword: string) => {
    try {
      await axiosInstance.patch("/me/", {
        username: username,
        password: newPassword,
      });
      showSuccess("Password reset successfully");
      dialogState.setResetPasswordOpen(false);
      dialogState.setMenuOpen(false);
    } catch (error) {
      showError("Failed to reset password");
    }
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-4">
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-y-4 gap-x-4">
            {/* Logo */}
            <Link to="/" className="shrink-0 order-1 md:order-1">
              <img src={Img} alt="Logo" className="h-8 cursor-pointer" />
            </Link>


            <div className="order-3 md:order-2 w-full md:w-auto flex justify-center">
              <SearchBar
                shouldHide={shouldHideSearch}
                checkIn={searchState.checkIn}
                checkOut={searchState.checkOut}
                guests={searchState.guests}
                mobileSearchOpen={dialogState.mobileSearchOpen}
                onMobileSearchOpenChange={dialogState.setMobileSearchOpen}
                onCheckInChange={searchState.handleCheckInChange}
                onCheckOutChange={searchState.handleCheckOutChange}
                onGuestsChange={searchState.handleGuestsChange}
                onCountryChange={searchState.handleCountryChange}
                onCityChange={searchState.handleCityChange}
                onClearFilters={searchState.clearFilters}
                onSearch={searchState.handleSearch}
              />
            </div>


            <div className="order-2 md:order-3">
              <UserMenu
                user={user}
                menuOpen={dialogState.menuOpen}
                onMenuOpenChange={dialogState.setMenuOpen}
                onLoginClick={() => dialogState.setLoginOpen(true)}
                onSignupClick={() => dialogState.setSignupOpen(true)}
                onHostingClick={() => dialogState.setHostingOpen(true)}
                onLogoutClick={() => dialogState.setLogoutOpen(true)}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* ================= AUTH DIALOGS ================= */}
      <AuthDialogs
        loginOpen={dialogState.loginOpen}
        signupOpen={dialogState.signupOpen}
        logoutOpen={dialogState.logoutOpen}
        resetPasswordOpen={dialogState.resetPasswordOpen}
        onLoginOpenChange={dialogState.setLoginOpen}
        onSignupOpenChange={dialogState.setSignupOpen}
        onLogoutOpenChange={dialogState.setLogoutOpen}
        onResetPasswordOpenChange={dialogState.setResetPasswordOpen}
        onLogin={async (data) => {
          await doLogin(data);
        }}
        onSignup={async (data) => {
          await doSignup(data);
        }}
        onLogout={handleLogout}
        onResetPassword={handleResetPassword}
        loading={loading}
      />

      {/* ================= HOSTING DIALOG ================= */}
      <HostingDialog
        open={dialogState.hostingOpen}
        onOpenChange={dialogState.setHostingOpen}
        isHost={user?.is_host}
      />

      <Outlet />
    </>
  );
};

export default Header;
