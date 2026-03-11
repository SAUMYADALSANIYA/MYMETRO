import { BrowserRouter, Routes, Route } from "react-router-dom";


import Login from "./pages/login";
import Register from "./pages/register";

import CreateAdmin from "./pages/admin/create_admin";
import AdminLayout from "./layouts/AdminLayout";
import AdminHome from "./pages/admin/home";
import UpdateFare from "./pages/admin/update_fare"; 
import ChangePassword from "./pages/admin/change_pass"; 
import ViewUsers from "./pages/admin/view_users";

import CustomerHome from "./pages/customer/home";
import PaymentPage from "./pages/customer/payment";

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
           <Route path="create-admin" element={<CreateAdmin />} />
           <Route path="view-users" element={<ViewUsers />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

        {/* Customer Route */}
        <Route path="/customer" element={<CustomerHome />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;