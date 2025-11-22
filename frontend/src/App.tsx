import React from "react"
import Header from "./Components/Head Components/Header"
import {ToastContainer} from 'react-toastify';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthView from "./Components/ProfileComponents/AuthView";

const App : React.FC = () => {
  return(
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/me" element={<AuthView />} />
      </Routes>
    </Router>
    <ToastContainer position="top-center"/>
    </>
  )
}

export default App
