import React from "react";
import { useNavigate, useRouteError } from "react-router-dom";
import classes from "./ErrorBoundary.module.css";
import { Button } from "primereact/button";

const ErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  return (
    <div className={classes.message_container}>
      <p className={classes.text}>Error!</p>
      <p className={classes.text}>{error?.message || error?.data || error?.statusText || error?.status || "Unknown Error"}</p>

      {/* <p className={classes.info}>
        Take a screenshot and forward this error to the developers of this
        service,
      </p> */}

      <Button
        onClick={() => navigate("/")}
        severity="danger"
        label="Go Back"
        style={{ fontFamily: "Montserrat,sans-serif" }}
        rounded
        icon="pi pi-arrow-left"
      />
    </div>
  );
};

export default ErrorBoundary;
