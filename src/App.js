import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Authentication from "./pages/authentication";
import Login from "./pages/authentication/login";
import Register from "./pages/authentication/register";

function App() {
  return (
    <Routes>
      <Route path="/authentication" element={<Authentication />}>
        <Route index element={<Navigate to="/authentication/login" />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="*" element={<Navigate to="/authentication/login" />} />
      </Route>
      <Route path="*" element={<Navigate to="/authentication/login" />} />
    </Routes>
  );
}

export default App;
