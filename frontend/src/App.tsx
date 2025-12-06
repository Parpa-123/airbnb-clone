import React from "react";

// Layout and shared header wrapper
import Header from "./Components/Head Components/Header";

// Toast notifications
import { ToastContainer } from "react-toastify";

// React Router
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Pages
import AuthView from "./Components/ProfileComponents/AuthView";
import DetailedPage from "./Components/Main Components/Routed Pages/DetailedPage";
import PublicListings from "./Components/Main Components/Routed Pages/PublicListings";

// Auth and protected routes
import LoginContextProvider from "../public/loginContext";
import ProtectedRoute from "../public/ProtectedRoute";

// ==============================
// App Component
// ==============================
const App: React.FC = () => {
  return (
    <>
      {/* Global login/auth provider */}
      <LoginContextProvider>
        {/* Router wrapper */}
        <Router>
          <Routes>
            {/* Layout route with header */}
            <Route path="/" element={<Header />}>
              {/* Default route: home listings */}
              <Route index element={<PublicListings />} />

              {/* Detailed listing page */}
              <Route path=":id" element={<DetailedPage />} />

              {/* Protected route for profile page */}
              <Route
                path="me"
                element={
                  <ProtectedRoute>
                    <AuthView />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </Router>

        {/* Toast notifications */}
        <ToastContainer position="top-center" />
      </LoginContextProvider>
    </>
  );
};

export default App;
