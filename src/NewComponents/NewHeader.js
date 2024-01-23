import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MobileNavbarContext } from "../MobileNavbarContext";
import { FaBars, FaRegWindowClose } from "react-icons/fa";
import classes from "./NewHeader.module.css";

const NewHeader = ({ service }) => {
  const { show, showHandler } = useContext(MobileNavbarContext);
  const navigate = useNavigate();

  const [client, setClient] = useState("Client");

  useEffect(() => {
    getServiceFromLocalStorage();
  }, []);

  const getServiceFromLocalStorage = () => {
    let client = localStorage.getItem("userName");
    if (client !== null || client !== undefined) {
      setClient(client.toUpperCase());
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("services");
    navigate("/");
  };

  return (
    <>
      <header className={classes.header}>
        {/* <button className={classes.toggle_btn} onClick={() => showHandler()}>
          {show ? <FaRegWindowClose /> : <FaBars />}
        </button> */}
        <div className={classes.header_sub_container}>
          <button className={classes.client_name}>{client}</button>

          <button className={classes.service_name}>{service}</button>
        
        </div>
        <div className={classes.header_logout_container}>
        <button
            className={classes.logout_btn}
            onClick={() => {
              handleLogout();
            }}
          >
            Logout
          </button>
        </div>
      </header>
    </>
  );
};
export default NewHeader;
