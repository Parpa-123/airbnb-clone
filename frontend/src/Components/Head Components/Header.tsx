import React, { useEffect, lazy, Suspense } from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";

import Img from "../../assets/image.svg";
import { useAuth } from "./hooks/useAuth";
import { useDialogState } from "./hooks/useDialogState";
import { useSearchFilters } from "./hooks/useSearchFilters";

import SearchBar from "./components/SearchBar";
import UserMenu from "./components/UserMenu";
import AuthDialogs from "./components/AuthDialogs";
const HostingDialog = lazy(() => import("./components/HostingDialog"));

import { showApiError, showSuccess } from "../../utils/toastMessages";
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        dialogState.setMobileSearchOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dialogState]);

  const handleLogout = () => {
    logout();
    dialogState.setLogoutOpen(false);
    dialogState.setMenuOpen(false);
    navigate("/");
  };

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
      showApiError(error, "Failed to reset password");
    }
  };

  const searchBarProps = React.useMemo(() => ({
    shouldHide: shouldHideSearch,
    checkIn: searchState.checkIn,
    checkOut: searchState.checkOut,
    guests: searchState.guests,
    mobileSearchOpen: dialogState.mobileSearchOpen,
    onMobileSearchOpenChange: dialogState.setMobileSearchOpen,
    onCheckInChange: searchState.handleCheckInChange,
    onCheckOutChange: searchState.handleCheckOutChange,
    onGuestsChange: searchState.handleGuestsChange,
    onCountryChange: searchState.handleCountryChange,
    onCityChange: searchState.handleCityChange,
    onClearFilters: searchState.clearFilters,
    onSearch: searchState.handleSearch,
  }), [
    shouldHideSearch,
    searchState.checkIn,
    searchState.checkOut,
    searchState.guests,
    dialogState.mobileSearchOpen,
    dialogState.setMobileSearchOpen,
    searchState.handleCheckInChange,
    searchState.handleCheckOutChange,
    searchState.handleGuestsChange,
    searchState.handleCountryChange,
    searchState.handleCityChange,
    searchState.clearFilters,
    searchState.handleSearch,
  ]);

  return (
    <>
      { }
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-4">
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-y-4 gap-x-4">
            { }
            <Link to="/" className="shrink-0 order-1 md:order-1">
              <img src={Img} alt="Logo" className="h-12 cursor-pointer" />
            </Link>

            <div className="order-3 md:order-2 w-full md:w-auto flex justify-center">
              <SearchBar {...searchBarProps} />
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

      { }
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

      { }
      <Suspense fallback={null}>
        <HostingDialog
          open={dialogState.hostingOpen}
          onOpenChange={dialogState.setHostingOpen}
          isHost={user?.is_host}
        />
      </Suspense>

      <Outlet />
    </>
  );
};

export default Header;
