import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";

import CreateAdmin from "./pages/admin/create_admin";
import AdminLayout from "./layouts/AdminLayout";
import AdminHome from "./pages/admin/home";
import UpdateFare from "./pages/admin/update_fare";
import ChangePassword from "./pages/admin/change_pass";
import ViewUsers from "./pages/admin/view_users";

import CustomerLayout from "./layouts/CustomerLayout";
import CustomerHome from "./pages/customer/home";
import CustomerChangePassword from "./pages/customer/change_pass";
import PaymentPage from "./pages/customer/payment";
import TicketPage from "./pages/customer/ticket";
import ExitDemoPage from "./pages/customer/exit_demo";
import ScanTicketPage from "./pages/customer/scan_ticket";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="update-fare" element={<UpdateFare />} />
          <Route path="create-admin" element={<CreateAdmin />} />
          <Route path="view-users" element={<ViewUsers />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<CustomerHome />} />
          <Route path="change-password" element={<CustomerChangePassword />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="ticket" element={<TicketPage />} />
          <Route path="exit-demo" element={<ExitDemoPage />} />
          <Route path="scan/:token" element={<ScanTicketPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;