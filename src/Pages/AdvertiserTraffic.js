import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Header from "../Components/Header";
import MobileNavbar from "../Components/MobileNavbar";
import Sidebar from "../Components/Sidebar";
import Loader from "../Components/Loader";
import axios from "axios";
import {
  advertiserTrafficApi,
  advertiserTrafficClientsApi,
  advertiserTrafficServicesApi,
} from "../Data/Api";
import classes from "./PublisherTraffic.module.css";
import moment from "moment";

const AdvertiserTraffic = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userName") != "panz") {
      navigate("/dailyRevenue");
    }
  }, []);

  const [loading, setLoading] = useState("block");
  const [traffic, setTraffic] = useState([]);
  const [startDate, setStartDate] = useState(
    moment(new Date()).format("yyyy-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).format("yyyy-MM-DD")
  );
  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [service, setService] = useState("");
  const [client, setClient] = useState("");

  const fetchAdvertiserTrafficClients = async () => {
    const data = {
      client: localStorage.getItem("userName"),
    };
    try {
      setLoading("block");
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      const res = await axios.post(advertiserTrafficClientsApi, data, {
        headers: headers,
      });
      setClients(res?.data?.result);
      let newClient = { client_name: "All" };
      setClients((prevClients) => {
        return [newClient, ...prevClients];
      });
      setLoading("none");
    } catch (error) {
      setLoading("none");
      toast.error(
        error?.response?.data?.message || error?.message || error?.data?.message
      );
    }
  };

  const fetchAdvertiserTrafficServices = async (clientName) => {
    const data = {
      client: clientName,
    };
    try {
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      const res = await axios.post(advertiserTrafficServicesApi, data, {
        headers: headers,
      });
      setServices(res?.data?.result);
      setService(res?.data?.result[0]?.serviceName);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || error?.data?.message
      );
    }
  };

  const fetchDataFromBackend = async () => {
    const data = {
      startDate: startDate,
      endDate: endDate,
      service: service !== "" ? service : "All",
      client: client !== "" ? client : "All",
    };
    try {
      setLoading("block");
      let token = localStorage.getItem("userToken");

      let headers = { Authorization: "Bearer " + token };

      const res = await axios.post(advertiserTrafficApi, data, {
        headers: headers,
      });
      console.log(res, "res");
      setTraffic(res.data.result);
      setLoading("none");
    } catch (error) {
      setLoading("none");
      toast.error(
        error?.response?.data?.message || error?.message || error?.data?.message
      );
    }
  };

  useEffect(() => {
    fetchAdvertiserTrafficClients();
    setServices([{ serviceName: "All" }]);
    fetchDataFromBackend();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    fetchDataFromBackend();
  };

  const handleServiceChange = (service) => {
    setService(service);
  };

  const handleClientChange = (client) => {
    setClient(client);
    if (client === "All") {
      setServices([{ serviceName: "All" }]);
    } else {
      fetchAdvertiserTrafficServices(client);
    }
  };

  return (
    <>
      <Loader value={loading} />
      <ToastContainer />
      <Header service="Advertiser Traffic" />
      <MobileNavbar service="Advertiser Traffic" />
      <Sidebar highlight={8} />
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
                <label htmlFor="client">Client:</label>
                <select
                  id="client"
                  onChange={(e) => handleClientChange(e.target.value)}
                >
                  {clients.length > 0 &&
                    clients.map((item, index) => {
                      return (
                        <option key={index} value={item?.client_name}>
                          {item?.client_name}
                        </option>
                      );
                    })}
                </select>
              </div>

              <div className="end-date">
                <label htmlFor="service">Service:</label>
                <select
                  id="service"
                  onChange={(e) => handleServiceChange(e.target.value)}
                >
                  {services.length > 0 &&
                    services.map((item, index) => {
                      return (
                        <option key={index} value={item?.serviceName}>
                          {item?.serviceName}
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
              <span>Advertiser Traffic</span>
            </p>
          </div>

          <div className="main-box">
            {traffic.length <= 0 && loading == "none" ? (
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
                        <th>Client</th>
                        <th>Service</th>
                        <th>Publisher</th>
                        <th>Country</th>
                        <th>Operator</th>
                        <th>Count</th>
                      </tr>
                      {traffic.map((dataItems, i) => {
                        return (
                          <tr key={i}>
                            <td>{dataItems?.clientName}</td>
                            <td>{dataItems?.serviceName}</td>
                            <td>{dataItems?.publisher}</td>
                            <td>{dataItems?.country}</td>
                            <td>{dataItems?.operator}</td>
                            <td>{dataItems?.COUNT}</td>
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

export default AdvertiserTraffic;
