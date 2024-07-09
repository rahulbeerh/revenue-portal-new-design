import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth = ({ children, admin, conditionApply, condition }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem("userToken");
    if (!token || token == null || token == undefined || token == "") {
      throw new Error("You are not Authorized , Please Login!");
    } else if (admin) {
      let checkAdmin = localStorage.getItem("userName");
      if (checkAdmin != "admin") {
        throw new Error("You are not Authorized as Admin!");
      } else {
        setAuth(true);
      }
    } else if (conditionApply) {
      if (condition) {
        throw new Error("You cannot access this page!");
      } else {
        setAuth(true);
      }
    } else {
      setAuth(true);
    }
  }, [localStorage, auth, condition, conditionApply, admin]);

  return <>{auth ? children : null}</>;
};

export default Auth;
