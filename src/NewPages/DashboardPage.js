import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import classes from "./DashboardPage.module.css";
import Sidebar from "../Components/Sidebar";
import MobileNavbar from "../Components/MobileNavbar";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchAllServices } from "../Data/Api";
import axios from "axios";
import Loader from "../Components/Loader";
import { toast, ToastContainer } from "react-toastify";
import NewSidebar from "../NewComponents/NewSidebar";
import NewHeader from "../NewComponents/NewHeader";
import TitleHeader from "../NewComponents/TitleHeader";
import ThemeComponent from "../NewComponents/ThemeComponent";

const DashboardPage = ({ serviceName, id, children }) => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [mainServices, setMainServices] = useState([]);
  const [loader, setLoader] = useState("block");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userName") == "etho_1234") {
      navigate("/dailyRevenue");
    }
  }, []);

  useEffect(() => {
    const fetchDataFromBackend = async () => {
      setLoader("block");
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      try {
        const response = await axios.post(fetchAllServices, "", {
          headers: headers,
        });
        console.log(response.data, "subservice response");
        setLoader("none");
        setServices(response.data.data);
        setFilteredServices(() =>
          response.data.data?.filter(
            (service) => service?.service == serviceName
          )
        );
        // setServices(()=>response.data.data?.filter((service)=>service?.service==serviceName));
        let main_services = JSON.parse(localStorage.getItem("serviceObject"));
        setMainServices(main_services);
      } catch (error) {
        toast.error(error.message);
        setLoader("none");
      }
    };
    fetchDataFromBackend();
    localStorage.setItem("showAddPublisher", false);
  }, []);

  // console.log(services);
  // const id=services.filter((service)=>service.service===serviceName)
  // console.log(id);
  const handleNavigateAndFilterServices = (
    path,
    serviceName,
    showAddPublisher
  ) => {
    // console.log(serviceName, "siiiiiiiiii");
    setFilteredServices(() =>
      services.filter((service) => service?.service == serviceName)
    );

    if (showAddPublisher) {
      localStorage.setItem("showAddPublisher", JSON.stringify(true));
    } else {
      localStorage.setItem("showAddPublisher", JSON.stringify(false));
    }
    navigate(path);
  };

  // useEffect(()=>{
  //   setFilteredServices(()=>services.filter((service)=>service?.service==serviceName));
  // },[serviceName])

  // console.log(mainServices, "ms");
  // console.log(services, "s");
  return (
    <>
      <Loader value={loader} />
      <ToastContainer />
      <div className={classes.main}>
        <div className={classes.sidebar}>
          <div className={classes.sidebar_header}>
            <img
              src="/assets/images/logo.png"
              alt="Revenue portal"
              className={classes.sidebar_logo}
            />
            <h3 className={classes.dashboard_text}>Dashboard</h3>
          </div>
          <NewSidebar highlight={1} />
        </div>
        <div className={classes.container}>
          <NewHeader service="All Services" />
          <div className={classes.sub_container}>
            <TitleHeader title="Main Services" icon="" />
            <ThemeComponent>
              <div className={classes.flex_container}>
                {mainServices.map((service, i) => {
                  return (
                    <div key={i} className={classes.flex_item}>
                      <Button
                        className={classes.btn}
                        // onClick={() => navigate(`/dashboard/${service.serviceName}/${service.id}`)}
                        onClick={() =>
                          handleNavigateAndFilterServices(
                            `/dashboard/${service.serviceName}/${service.id}`,
                            `${service.serviceName}`,
                            false
                          )
                        }
                        variant={
                          id == service.id && serviceName == service.serviceName
                            ? "contained"
                            : "outlined"
                        }
                        color="success"
                      >
                        {service.serviceName}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </ThemeComponent>

            {filteredServices.length > 0 && (
              <TitleHeader title="Sub Services" icon="" />
            )}

            <ThemeComponent>
              <div className={classes.flex_container}>
                {filteredServices.map((service, i) => {
                  // console.log(service.id);
                  return (
                    <div key={i} className={classes.flex_item}>
                      <Button
                        onClick={() =>
                          handleNavigateAndFilterServices(
                            `/dashboard/${service.subService}/${service.serviceId}`,
                            `${service.service}`,
                            true
                          )
                        }
                        variant={
                          id == service.serviceId &&
                          serviceName === service.subService
                            ? "contained"
                            : "outlined"
                        }
                        color="success"
                      >
                        {service.subService}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </ThemeComponent>

            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
