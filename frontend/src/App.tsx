import React from "react"
import Header from "./Components/Head Components/Header"
import {ToastContainer} from 'react-toastify';

const App : React.FC = () => {
  return(
    <>
      <Header />
      <ToastContainer position="top-center"/>
    </>
  )
}

export default App
