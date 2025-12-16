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

// ==============================
// App Component
// ==============================
const App: React.FC = () => {
  return (
    <LoginContextProvider>
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
          </Route>
        </Routes>
      </Router>

      {/* Global Toast */}
      <ToastContainer position="top-center" />
    </LoginContextProvider>
  );
};

export default App;
