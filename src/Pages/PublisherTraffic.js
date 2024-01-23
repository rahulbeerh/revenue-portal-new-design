import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Header from "../Components/Header";
import MobileNavbar from "../Components/MobileNavbar";
import Sidebar from "../Components/Sidebar";
import Loader from "../Components/Loader";
import axios from "axios";
import { publisherTrafficApi, publisherTrafficServicesApi } from "../Data/Api";
import classes from "./PublisherTraffic.module.css";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const PublisherTraffic = () => {
  const navigate=useNavigate();
  const [loading, setLoading] = useState("block");
  const [publisherData, setPublisherData] = useState([]);
  const [startDate, setStartDate] = useState(
    moment(new Date()).format("yyyy-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).format("yyyy-MM-DD")
  );
  // const [date, setDate] = useState(moment(new Date()).format("yyyy-MM-DD"));
  const [services, setServices] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [service, setService] = useState("");
  const [publisher, setPublisher] = useState("");

  useEffect(()=>{
    if(localStorage.getItem("userName") == "etho_1234"){
      navigate("/dailyRevenue")
    }
  },[])

  const fetchPublisherTrafficServices = async () => {
    const data = {
      client: localStorage.getItem("userName"),
    };
    try {
      setLoading("block");
      let token = localStorage.getItem("userToken");

      let headers = { Authorization: "Bearer " + token };

      const res = await axios.post(publisherTrafficServicesApi, data, {
        headers: headers,
      });
      setServices(res?.data?.services);
      setPublishers(res?.data?.publisher);

      let newService = { service: "All" };

      setServices((prevServices) => {
        // Inserting the new service at the first index
        return [newService, ...prevServices];
      });

      let newPublisher = { publisher: "All" };
      setPublishers((prevPublishers) => {
        // Inserting the new service at the first index
        return [newPublisher, ...prevPublishers];
      });

      // console.log(res);
      setLoading("none");
    } catch (error) {
      // console.log(error);
      setLoading("none");
      toast.error(
        error?.response?.data?.message || error?.message || error?.data?.message
      );
    }
  };
  const fetchDataFromBackend = async (showLoading,dateStart,dateEnd,serviceName,publisherName) => {
    let data = {};
    // if (service == "All" || service == "") {
      if (serviceName == "All" || serviceName == "") {
      data = {
        client: localStorage.getItem("userName"),
        startDate: dateStart,
        endDate: dateEnd,
        service: "All",
        publisher: publisherName,
      };
    } else {
      data = {
        client: localStorage.getItem("userName"),
        startDate: dateStart,
        endDate: dateEnd,
        service: serviceName,
        publisher: publisherName,
      };
    }
    try {
      if (showLoading) {
        setLoading("block");
      }
      let token = localStorage.getItem("userToken");

      let headers = { Authorization: "Bearer " + token };

      const res = await axios.post(publisherTrafficApi, data, {
        headers: headers,
      });
      setPublisherData(res.data.data);
      setLoading("none");
    } catch (error) {
      setLoading("none");
      toast.error(
        error?.response?.data?.message || error?.message || error?.data?.message
      );
    }
  };

 
  useEffect(() => {
    fetchPublisherTrafficServices();
    fetchDataFromBackend(true,startDate,endDate,service,publisher);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchDataFromBackend(null, startDate, endDate, service, publisher);
    }, 10000);
  
    // Cleanup function to clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  
  }, [startDate, endDate, service, publisher]); 

  const submitHandler = async (e) => {
    e.preventDefault();
    fetchDataFromBackend(true,startDate,endDate,service,publisher);
  };

  const handleServiceChange = (service) => {
    setService(service);
  };

  const handlePublisherChange = (publisher) => {
    setPublisher(publisher);
  };


  return (
    <>
      <Loader value={loading} />
      <ToastContainer />
      <Header service="Publisher Traffic" />
      <MobileNavbar service="Publisher Traffic" />
      <Sidebar highlight={5} />
      <div id="firstTab" className="tabcontent">
        <div className="subscribers-sec">
          <div className="subscribers-home-l">
            <span className="navigation-links">Home</span>
            <span>/</span>
            <span className="navigation-links">Revenue</span>
          </div>
        </div>
        <div className="date-form">
          <form
            className="main-date-form ss"
            style={{ zIndex: "99" }}
            onSubmit={submitHandler}
          >
            {/* <!-- date --> */}

            <div className={`date-inner date-1-sec ${classes.date_flex}`}>
              <div className="end-date">
                <label htmlFor="service">Service:</label>
                <select
                  id="service"
                  // onChange={(e) => setService(e.target.value)}
                  onChange={(e) => handleServiceChange(e.target.value)}
                >
                  {services.length > 0 &&
                    services.map((item, index) => {
                      return (
                        <option key={index} value={item.service}>
                          {item.service}
                        </option>
                      );
                    })}
                </select>
              </div>

              <div className="end-date">
                <label htmlFor="publisher">Partner:</label>
                <select
                  id="publisher"
                  onChange={(e) => handlePublisherChange(e.target.value)}
                >
                  {publishers.length > 0 &&
                    publishers.map((item, index) => {
                      return (
                        <option key={index} value={item.publisher}>
                          {item.publisher}
                        </option>
                      );
                    })}
                </select>
              </div>

              <div className="end-date">
                <label htmlFor="start">Start date:</label>
                <input
                  type="date"
                  id="start"
                  name="start"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="end-date">
                <label htmlFor="end">End date:</label>
                <input
                  type="date"
                  id="end"
                  name="end"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div className="date-search-btn">
                <button type="submit">Search</button>
              </div>
            </div>
          </form>
          <div className="title-ic">
            <p>
              <span>
                <i className="fa fa-user" aria-hidden="true"></i>
              </span>{" "}
              <span>Publisher Traffic</span>
            </p>
          </div>

          <div className="main-box">
            {publisherData.length <= 0 && loading == "none" ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <h5>No Data Available</h5>
              </div>
            ) : (
              <div style={{ margin: "0rem 0rem" }}>
                {/* <!-- table --> */}
                <div
                  className="table-sec"
                  style={{
                    maxHeight: "500px",
                    overflowY: "scroll",
                    overflowX: "auto",
                    marginBottom: "50px",
                    width: "100%",
                  }}
                >
                  <table className="main-table">
                    <tbody>
                      <tr>
                        <th>Partner Id</th>
                        <th>Service</th>
                        <th>Country</th>
                        <th>Operator</th>
                        <th>Count</th>
                      </tr>
                      {publisherData.map((dataItems, i) => {
                        return (
                          <tr key={i}>
                            <td>{dataItems?.partnerid}</td>
                            <td>{dataItems?.service}</td>
                            <td>{dataItems?.country}</td>
                            <td>{dataItems?.operator}</td>
                            <td>{dataItems?.count}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PublisherTraffic;
