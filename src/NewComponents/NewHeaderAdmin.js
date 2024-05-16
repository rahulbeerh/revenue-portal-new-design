import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MobileNavbarContext } from "../MobileNavbarContext";
import classes from "./NewHeader.module.css";
import NewMobileMenu from "./NewMobileMenu";
import NewMobileMenuAdmin from "./NewMobileMenuAdmin";

const NewHeaderAdmin = ({ service,highlight }) => {
  const { show, showHandler } = useContext(MobileNavbarContext);
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);

  const showMobileMenuHandler = () => {
    setMobileMenu(true);
  };

  const hideMobileMenuHandler=()=>{
    setMobileMenu(false);
  }

  const [client, setClient] = useState("Client");
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownHandler = () => {
    setShowDropdown((prevValue) => !prevValue);
  };

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
          <div className={classes.menu}>
            <i
              className={`fa-solid fa-bars ${classes.menu_icon}`}
              onClick={showMobileMenuHandler}
            ></i>
          </div>
          <button className={classes.client_name}>{client}</button>

          <button className={classes.service_name}>{service}</button>
        </div>
        <div className={classes.header_avatar} onClick={dropdownHandler}>
          <img
            src="/assets/images/avatarDropdown.png"
            alt="Avatar"
            className={classes.avatar}
          />
          {showDropdown ? (
            <i class={`fa-solid fa-caret-up ${classes.avatar_icon}`}></i>
          ) : (
            <i className={`fa-solid fa-sort-down ${classes.avatar_icon}`}></i>
          )}
        </div>

        <div className={`${classes.dropdown} ${showDropdown && classes.show}`}>
          <div className={classes.dropdown_sub_container}>
            <div className={classes.user}>
              <i className={`fa-solid fa-user ${classes.user_icon}`}></i>
              <p className={classes.dropdown_client_name}>{client}</p>
            </div>
            <div className={classes.underline}></div>
            <button
              className={classes.logout_btn}
              onClick={() => {
                handleLogout();
              }}
            >
              <i className={`fa-solid fa-power-off ${classes.logout_icon}`}></i>
              Logout
            </button>
          </div>
        </div>
      </header>
      <NewMobileMenuAdmin highlight={highlight} mobileMenu={mobileMenu} hideMobileMenuHandler={hideMobileMenuHandler} />
    </>
  );
};
export default NewHeaderAdmin;
