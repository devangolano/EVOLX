import { FC } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import { Login } from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Index";
import NotFound from "../pages/NotFound";
import PrivateRoute from "./PrivateRoute";
import { AtividadesEconomicas } from "../pages/dashboard/infoBasicas/AtividadesEconomicas";
import { Bairros } from '../pages/dashboard/infoBasicas/Bairros';

const AppRoutes: FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route path="/dashboard/atividades-economicas"
        element={
          <PrivateRoute>
            <AtividadesEconomicas />
          </PrivateRoute> 
        }
      />
      <Route path="/dashboard/bairros"
        element={
          <PrivateRoute>
            <Bairros />
          </PrivateRoute> 
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
