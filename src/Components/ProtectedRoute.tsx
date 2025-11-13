// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { getToken, isTokenExpired } from "../utils/auth";

const ProtectedRoute: React.FC<{ element: JSX.Element }> = ({ element }) => {
  const token = getToken();

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default ProtectedRoute;
