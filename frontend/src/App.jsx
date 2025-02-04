import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import NoPage from "./pages/NoPage"
import Profile from "./pages/Profile"
import { UserProvider } from './context/UserContext';
import AddPatient from './pages/AddPatient';
import IndividualPatient from './pages/IndividualPatient';


function App() {

  return (
    <BrowserRouter>

     <UserProvider>

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="addpatient" element={<AddPatient />} />
          <Route path="patient/:id" element={<IndividualPatient />} />

          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>

     </UserProvider>
     
    </BrowserRouter>
  )
}

export default App
