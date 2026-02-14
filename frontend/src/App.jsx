import { BrowserRouter, Routes, Route } from "react-router-dom";

// Fixed casing to match file system
import Login from "./pages/login";
import Register from "./pages/register";

// Fixed: File is AdminLayout.jsx
import AdminLayout from "./layouts/adminLayout";
import AdminHome from "./pages/admin/home";
// Fixed: File is update_fare.jsx
import UpdateFare from "./pages/admin/update_fare"; 
// Fixed: File is change_pass.jsx
import ChangePassword from "./pages/admin/change_pass"; 

import CustomerHome from "./pages/customer/home";

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="update-fare" element={<UpdateFare />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

        {/* Customer Route */}
        <Route path="/customer" element={<CustomerHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;