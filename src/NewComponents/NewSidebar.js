import React from "react";
import { useNavigate } from "react-router-dom";
import classes from "./NewSidebar.module.css";

const NewSidebar = (props) => {
  //Use to send on other route/page
  const navigate = useNavigate();

  //Method to handle navigation of sidebar
  const handleNavigate = (route) => {
    navigate(route);
  };

  return (
    <div className={classes.sidebar_container}>
      <div className={classes.sidebar_sub_container}>
        {/* <!-- 1 --> */}
        <button
          className={classes.tab}
          onClick={() => {
            handleNavigate("/dailyRevenue");
          }}
        >
         <i className="fa-solid fa-chart-simple"></i>
          <span>Daily Revenue</span>
        </button>
        {/* <!-- 2 --> */}
        <button
          className={classes.tab}
          onClick={() => {
            handleNavigate("/monthlyRevenue");
          }}
        >
           <i className="fa-regular fa-chart-bar"></i>
          <span>Monthly Revenue</span>
        </button>

        {localStorage.getItem("userName") != "etho_1234" && (
          <button
            className={classes.tab}
            onClick={() => {
              handleNavigate("/dashboard");
            }}
          >
          
              <i className="fa-solid fa-wifi" aria-hidden="true"></i>
            <span>Add Networks</span>
          </button>
        )}

        {localStorage.getItem("userName") != "etho_1234" && (
          <button
            className={classes.tab}
            onClick={() => {
              handleNavigate("/add-country-and-add-operator");
            }}
          >
              <i className="fa-solid fa-globe" aria-hidden="true"></i>
            <span>Add Country and Add Operator</span>
          </button>
        )}

        {localStorage.getItem("userName") != "etho_1234" && (
          <button
            className={classes.tab}
            onClick={() => {
              handleNavigate("/publisher-traffic");
            }}
          >
            {" "}
            <span>
              <i className="fa-solid fa-bolt" aria-hidden="true"></i>
            </span>{" "}
            <span>Publisher Traffic</span>
          </button>
        )}

        {localStorage.getItem("userName") != "etho_1234" && (
          <button
            className={classes.tab}
            onClick={() => {
              handleNavigate("/publisher-subscription");
            }}
          >
            {" "}
            <span>
              <i className="fa-solid fa-snowflake" aria-hidden="true"></i>
            </span>{" "}
            <span>Publisher Subscription</span>
          </button>
        )}

        {localStorage.getItem("userName") == "panz" && (
          <button
            className={classes.tab}
            onClick={() => {
              handleNavigate("/advertiser");
            }}
          >
            {" "}
            <span>
              <i className="fa fa-user" aria-hidden="true"></i>
            </span>{" "}
            <span>Advertiser</span>
          </button>
        )}

        {localStorage.getItem("userName") == "panz" && (
          <button
            className={classes.tab}
            onClick={() => {
              handleNavigate("/advertiser-traffic");
            }}
          >
            {" "}
            <span>
              <i className="fa fa-user" aria-hidden="true"></i>
            </span>{" "}
            <span>Advertiser Traffic</span>
          </button>
        )}

        {localStorage.getItem("userName") == "panz" && (
          <button
            className={classes.tab}
            onClick={() => {
              handleNavigate("/advertiser-subscription");
            }}
          >
            {" "}
            <span>
              <i className="fa fa-user" aria-hidden="true"></i>
            </span>{" "}
            <span>Advertiser Subscription</span>
          </button>
        )}

      </div>
    </div>
  );
};
export default NewSidebar;
