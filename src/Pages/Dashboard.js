import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import classes from "./Dashboard.module.css";
import Sidebar from "../Components/Sidebar";
import MobileNavbar from "../Components/MobileNavbar";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchAllServices } from "../Data/Api";
import axios from "axios";
import Loader from "../Components/Loader";
import { toast, ToastContainer } from "react-toastify";

const Dashboard = ({ serviceName, id }) => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [mainServices, setMainServices] = useState([]);
  const [loader, setLoader] = useState("block");
  const navigate = useNavigate();

  useEffect(()=>{
    if(localStorage.getItem("userName") == "etho_1234"){
      navigate("/dailyRevenue")
    }
  },[])

  useEffect(() => {
    const fetchDataFromBackend = async () => {
      setLoader("block");
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      try {
        const response = await axios.post(fetchAllServices, "", {
          headers: headers,
        });
        console.log(response.data,"subservice response");
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
    localStorage.setItem('showAddPublisher',false);
  }, []);

  // console.log(services);
  // const id=services.filter((service)=>service.service===serviceName)
  // console.log(id);
  const handleNavigateAndFilterServices = (path, serviceName,showAddPublisher) => {
    // console.log(serviceName, "siiiiiiiiii");
    setFilteredServices(() =>
      services.filter((service) => service?.service == serviceName)
    );

    if(showAddPublisher){
      localStorage.setItem('showAddPublisher', JSON.stringify(true));
    }
    else{
      localStorage.setItem('showAddPublisher', JSON.stringify(false));
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
      <ToastContainer />
      <Header service="All Services" />
      <MobileNavbar service="All Services" />
      <Loader value={loader} />
      <div className={classes.grid_top_container}>
        <div className={classes.grid_top_container_items_1}>
          <Sidebar highlight={3} top="-25px" />
        </div>
        <div className={classes.grid_top_container_items_2}>
          <div className={classes.grid_container}>
            {mainServices.map((service, i) => {
              //  console.log(service);
              return (
                <div key={i} className={classes.grid_container_items}>
                  <Button
                    className={classes.btn}
                    // onClick={() => navigate(`/dashboard/${service.serviceName}/${service.id}`)}
                    onClick={() =>
                      handleNavigateAndFilterServices(
                        `/dashboard/${service.serviceName}/${service.id}`,
                        `${service.serviceName}`,false
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
          <div className={classes.grid_container}>
            <div
              className={classes.grid_container_items}
              style={{ gridColumn: "span 6" ,marginTop:'16px',marginBottom:'16px'}}
            >
              {filteredServices.length>0 && <h2>Sub Services</h2>}
            </div>
          </div>
          <div className={classes.grid_container}>
            {filteredServices.map((service, i) => {
              // console.log(service.id);
              return (
                <div key={i} className={classes.grid_container_items}>
                  <Button
                    className={classes.btn}
                    // onClick={() => navigate(`/dashboard/${service.subService}/${service.id}`)}
                    onClick={() =>
                      handleNavigateAndFilterServices(
                        `/dashboard/${service.subService}/${service.serviceId}`,
                        `${service.service}`,true
                      )
                    }
                    variant={
                      id == service.serviceId && serviceName === service.subService
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
        </div>
      </div>
    </>
  );
};

export default Dashboard;
