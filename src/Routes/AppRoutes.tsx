import { FC } from 'react';
import { Route, Routes } from "react-router-dom";
import { Login } from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Index";
import NotFound from "../pages/NotFound";
import PrivateRoute from "./PrivateRoute";

const AppRoutes: FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
