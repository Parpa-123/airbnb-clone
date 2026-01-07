import React, { Suspense, lazy } from "react";

// Layout
import Header from "./Components/Head Components/Header";

// Toast notifications
import { ToastContainer } from "react-toastify";

// React Router
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth (not lazy - needed immediately)
import LoginContextProvider from "../public/loginContext";
import ProtectedRoute from "../public/ProtectedRoute";
import { FilterContextProvider } from "./services/filterContext";

// Loading component
import Loading from "./Components/Loading";

// Lazy loaded pages
const AuthView = lazy(() => import("./Components/ProfileComponents/AuthView"));
const DetailedPage = lazy(() => import("./Components/Main Components/Routed Pages/DetailedPage"));
const PublicListings = lazy(() => import("./Components/Main Components/Routed Pages/PublicListings"));
const Bookings = lazy(() => import("./Components/Main Components/Routed Pages/Bookings"));
const ListingsDashboard = lazy(() => import("./Components/Main Components/Routed Pages/ListingsDashboard"));
const ListingEditPage = lazy(() => import("./Components/Main Components/Routed Pages/ListingEdits/ListingPatch"));
const Wishlist = lazy(() => import("./Components/Main Components/Wishlist"));
const WishlistDetail = lazy(() => import("./Components/Main Components/Routed Pages/WishlistDetail"));
const BookingStatus = lazy(() => import("./Components/Main Components/Routed Pages/BookingStatus"));
const BookingDetails = lazy(() => import("./Components/Main Components/Routed Pages/BookingsDetail"));

// ==============================
// App Component
// ==============================
const App: React.FC = () => {
  return (
    <LoginContextProvider>
      <FilterContextProvider>
        <Router>
          <Suspense fallback={<Loading />}>
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
          </Suspense>
        </Router>

        {/* Global Toast */}
        <ToastContainer position="top-center" />
      </FilterContextProvider>
    </LoginContextProvider>
  );
};

export default App;
