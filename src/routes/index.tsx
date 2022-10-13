import React from "react";
import { HashRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { useAuth } from "../context/auth";
import AuthRoutes from "./AuthRoutes";
import { UserType } from "../services/apiTypes/User";
import TeacherRoutes from "./TeacherRoutes";

const Routes: React.FC = () => {
  const { token, currentUser } = useAuth();

  return (
    <HashRouter>
      {token.length > 0 ? (
        currentUser?.type === UserType.PROF.value ? (
          <TeacherRoutes />
        ) : (
          <AppRoutes />
        )
      ) : (
        <AuthRoutes />
      )}
    </HashRouter>
  );
};

export default Routes;
