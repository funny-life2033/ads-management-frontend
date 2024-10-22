import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Authentication from "./pages/authentication";
import Login from "./pages/authentication/login";
import Register from "./pages/authentication/register";
import CompanyLayout from "./pages/company/layout";

function App() {
  return (
    <Routes>
      <Route path="/authentication" element={<Authentication />}>
        <Route index element={<Navigate to="/authentication/login" />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="*" element={<Navigate to="/authentication/login" />} />
      </Route>
      <Route path="/company" element={<CompanyLayout />}>
        {/* <Route index element={<Navigate to="/company/dashboard" />} />
        <Route path="dashboard" element={<div>dashboard</div>} />
        <Route path="*" element={<Navigate to="/company/dashboard" />} /> */}
      </Route>
      <Route path="*" element={<Navigate to="/authentication/login" />} />
    </Routes>
  );
}

export default App;
