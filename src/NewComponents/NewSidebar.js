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
        <div
          className={classes.tab}
          style={{
            color: props.highlight === 1 ? "#fff" : "#6B7281",
          }}
          onClick={() => {
            handleNavigate("/dailyRevenue");
          }}
        >
         <i className="fa-solid fa-chart-simple"></i>
          <span>Daily Revenue</span>
        </div>
        {/* <!-- 2 --> */}
        <div
          className={classes.tab}
          style={{
            color: props.highlight === 2 ? "#fff" : "#6B7281",
          }}
          onClick={() => {
            handleNavigate("/monthlyRevenue");
          }}
        >
           <i className="fa-regular fa-chart-bar"></i>
          <span>Monthly Revenue</span>
        </div>

        {localStorage.getItem("userName") != "etho_1234" && (
          <div
            className={classes.tab}
            style={{
              color: props.highlight === 3 ? "#fff" : "#6B7281",
            }}
            onClick={() => {
              handleNavigate("/dashboard");
            }}
          >
          
              <i className="fa-solid fa-wifi" aria-hidden="true"></i>
            <span>Add Networks</span>
          </div>
        )}

        {localStorage.getItem("userName") != "etho_1234" && (
          <div
            className={classes.tab}
            style={{
              color: props.highlight === 4 ? "#fff" : "#6B7281",
            }}
            onClick={() => {
              handleNavigate("/add-country-and-add-operator");
            }}
          >
              <i className="fa-solid fa-globe" aria-hidden="true"></i>
            <span>Add Country and Add Operator</span>
          </div>
        )}

        {localStorage.getItem("userName") != "etho_1234" && (
          <div
            className={classes.tab}
            style={{
              color: props.highlight === 5 ? "#fff" : "#6B7281",
            }}
            onClick={() => {
              handleNavigate("/publisher-traffic");
            }}
          >
            {" "}
            <span>
              <i className="fa-solid fa-bolt" aria-hidden="true"></i>
            </span>{" "}
            <span>Publisher Traffic</span>
          </div>
        )}

        {localStorage.getItem("userName") != "etho_1234" && (
          <div
            className={classes.tab}
            style={{
              color: props.highlight === 6 ? "#fff" : "#6B7281",
            }}
            onClick={() => {
              handleNavigate("/publisher-subscription");
            }}
          >
            {" "}
            <span>
              <i className="fa-solid fa-snowflake" aria-hidden="true"></i>
            </span>{" "}
            <span>Publisher Subscription</span>
          </div>
        )}

        {localStorage.getItem("userName") == "panz" && (
          <div
            className={classes.tab}
            style={{
              color: props.highlight === 7 ? "#fff" : "#6B7281",
            }}
            onClick={() => {
              handleNavigate("/advertiser");
            }}
          >
            {" "}
            <span>
              <i className="fa fa-user" aria-hidden="true"></i>
            </span>{" "}
            <span>Advertiser</span>
          </div>
        )}

        {localStorage.getItem("userName") == "panz" && (
          <div
            className={classes.tab}
            style={{
              color: props.highlight === 8 ? "#fff" : "#6B7281",
            }}
            onClick={() => {
              handleNavigate("/advertiser-traffic");
            }}
          >
            {" "}
            <span>
              <i className="fa fa-user" aria-hidden="true"></i>
            </span>{" "}
            <span>Advertiser Traffic</span>
          </div>
        )}

        {localStorage.getItem("userName") == "panz" && (
          <div
            className={classes.tab}
            style={{
              color: props.highlight === 9 ? "#fff" : "#6B7281",
            }}
            onClick={() => {
              handleNavigate("/advertiser-subscription");
            }}
          >
            {" "}
            <span>
              <i className="fa fa-user" aria-hidden="true"></i>
            </span>{" "}
            <span>Advertiser Subscription</span>
          </div>
        )}

      </div>
    </div>
  );
};
export default NewSidebar;
