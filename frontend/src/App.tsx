import React from "react"
import Header from "./Components/Head Components/Header"
import {ToastContainer} from 'react-toastify';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthView from "./Components/ProfileComponents/AuthView";
import LoginContextProvider from '../public/loginContext';
import ProtectedRoute from '../public/ProtectedRoute';
import DetailedPage from "./Components/Main Components/Routed Pages/DetailedPage";

const App : React.FC = () => {
  return(
    <>
    <LoginContextProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Header />} />
        
          <Route path="/me" element={<ProtectedRoute><AuthView /></ProtectedRoute>} />
          <Route path=":id" element={<DetailedPage />} />
      </Routes>
    </Router>
    <ToastContainer position="top-center"/>
    </LoginContextProvider>
    </>
  )
}

export default App
