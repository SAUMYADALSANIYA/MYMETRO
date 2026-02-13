import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import AdminHome from "./pages/admin/admin_home";
import CustomerHome from "./pages/customer/customer_home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/customer" element={<CustomerHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
