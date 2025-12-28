import React from "react";

// Layout
import Header from "./Components/Head Components/Header";

// Toast notifications
import { ToastContainer } from "react-toastify";

// React Router
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import AuthView from "./Components/ProfileComponents/AuthView";
import DetailedPage from "./Components/Main Components/Routed Pages/DetailedPage";
import PublicListings from "./Components/Main Components/Routed Pages/PublicListings";
import Bookings from "./Components/Main Components/Routed Pages/Bookings";
import ListingsDashboard from "./Components/Main Components/Routed Pages/ListingsDashboard";

// Auth
import LoginContextProvider from "../public/loginContext";
import ProtectedRoute from "../public/ProtectedRoute";
import ListingEditPage from "./Components/Main Components/Routed Pages/ListingEdits/ListingPatch";
import Wishlist from "./Components/Main Components/Wishlist";
import WishlistDetail from "./Components/Main Components/Routed Pages/WishlistDetail";
import BookingStatus from "./Components/Main Components/Routed Pages/BookingStatus";
import { FilterContextProvider } from "./services/filterContext";
import BookingDetails from "./Components/Main Components/Routed Pages/BookingsDetail";

// ==============================
// App Component
// ==============================
const App: React.FC = () => {
  return (
    <LoginContextProvider>
      <FilterContextProvider>
        <Router>
          <Routes>
            {/* Layout route */}
            <Route path="/" element={<Header />}>
              {/* Home */}
              <Route index element={<PublicListings />} />

              {/* Listing detail */}
              <Route path=":slug" element={<DetailedPage />} />

              {/* Bookings */}
              <Route path="bookings" element={<Bookings />} />

              {/* Profile page */}
              <Route
                path="me"
                element={
                  <ProtectedRoute>
                    <AuthView />
                  </ProtectedRoute>
                }
              />

              {/* Host's listings dashboard - separate protected route */}
              <Route
                path="me/listings"
                element={
                  <ProtectedRoute>
                    <ListingsDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Listing edit */}
              <Route
                path="me/listings/:id/edit"
                element={
                  <ProtectedRoute>
                    <ListingEditPage />
                  </ProtectedRoute>
                }
              />

              {/* Wishlist */}
              <Route
                path="me/wishlist"
                element={
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>
                }
              />
              <Route path="/wishlist/:slug" element={<WishlistDetail />} />

              {/* Bookings */}
              <Route path="bookings" element={<Bookings />} />
              <Route path="bookings/:id" element={<BookingStatus />} />
              <Route path="bookings/details/:id" element={<BookingDetails />} />
            </Route>
          </Routes>
        </Router>

        {/* Global Toast */}
        <ToastContainer position="top-center" />
      </FilterContextProvider>
    </LoginContextProvider>
  );
};

export default App;
