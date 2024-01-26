import React from "react";
import { useNavigate } from "react-router-dom";
import classes from "./NewSidebarAdmin.module.css";

const NewSidebarAdmin = (props) => {
  //Use to send on other route/page
  const navigate = useNavigate();

  //Method to handle navigation of sidebar
  const handleNavigate = (route) => {
    navigate(route);
  };

  return (
    <div className={classes.sidebar_container}>
      <div className={classes.sidebar_sub_container}>
        <div
          className={classes.tab}
          style={{
            color: props.highlight === 1 ? "#fff" : "#6B7281",
          }}
          onClick={() => {
            handleNavigate("/dashboardAdmin");
          }}
          id="defaultOpen"
        >
          {" "}
          <span>
            <i className="fa fa-user" aria-hidden="true"></i>
          </span>{" "}
          <span>Main Dashboard</span>
        </div>
        {/* <!-- 1 --> */}
        <div
          className={classes.tab}
          style={{
            color: props.highlight === 2 ? "#fff" : "#6B7281",
          }}
          onClick={() => {
            handleNavigate("/dailyRevenueAdmin");
          }}
          id="defaultOpen"
        >
          {" "}
          <span>
            <i className="fa fa-user" aria-hidden="true"></i>
          </span>{" "}
          <span>Daily Revenue</span>
        </div>
        {/* <!-- 2 --> */}
        <div
          className={classes.tab}
          style={{
            color: props.highlight === 3 ? "#fff" : "#6B7281",
          }}
          onClick={() => {
            handleNavigate("/monthlyRevenueAdmin");
          }}
        >
          {" "}
          <span>
            <i className="fa fa-user" aria-hidden="true"></i>
          </span>{" "}
          <span>Monthly Revenue</span>
        </div>

        {/* <div
          className={classes.tab}
         
          onClick={() => {
            handleNavigate("/projectsDetails");
          }}
        >
          {" "}
          <span>
            <i className="fa fa-user" aria-hidden="true"></i>
          </span>{" "}
          <span>Projects Details</span>
        </div> */}
      </div>
    </div>
  );
};
export default NewSidebarAdmin;
