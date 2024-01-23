import React, { useEffect, useState } from "react";
import Loader from "../Components/Loader";
import { ToastContainer, toast } from "react-toastify";
import Header from "../Components/Header";
import MobileNavbar from "../Components/MobileNavbar";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import {
    advertiserSubscriptionApi,
    advertiserTrafficApi,
  advertiserTrafficClientsApi,
    advertiserTrafficServicesApi
} from "../Data/Api";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const AdvertiserSubscription = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userName") != "panz") {
      navigate("/dailyRevenue");
    }
  }, []);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState("block");
  const [startDate, setStartDate] = useState(
    moment(new Date()).format("yyyy-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).format("yyyy-MM-DD")
  );

  const [clients, setClients] = useState([]);
  const [client, setClient] = useState("");
  const [services, setServices] = useState([]);
  const [service, setService] = useState("");

  const fetchAdvertiserClients = async () => {
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

  const fetchAdvertiserServices = async (clientName) => {
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

      const res = await axios.post(advertiserSubscriptionApi, data, {
        headers: headers,
      });
      console.log(res, "res");
      setData(res?.data?.result);
      setLoading("none");
    } catch (error) {
      setLoading("none");
      toast.error(
        error?.response?.data?.message || error?.message || error?.data?.message
      );
    }
  };

  useEffect(() => {
    fetchAdvertiserClients();
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
        fetchAdvertiserServices(client);
      }
  };
  return (
    <>
      <Loader value={loading} />
      <ToastContainer />
      <Header service="Advertiser Subscription" />
      <MobileNavbar service="Advertiser Subscription" />
      <Sidebar highlight={9} />
      <div id="firstTab" className="tabcontent">
        <div className="subscribers-sec">
          <div className="subscribers-home-l">
            <span className="navigation-links">Home</span>
            <span>/</span>
            <span className="navigation-links">Revenue</span>
          </div>
        </div>

        {/* <!-- date --> */}
        <div className="date-form">
          <form className="main-date-form ss" onSubmit={submitHandler}>
            {/* <!-- date --> */}
            <div className="date-inner date-1-sec">
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
              <span>Advertiser Subscription</span>
            </p>
          </div>
          {data.length <= 0 && loading == "none" ? (
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
            <div className="main-box">
              <div style={{ margin: "0 2rem" }}>
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
                        <th>Queue</th>
                        <th>Sent</th>
                        <th>Skip</th>
                        <th>Duplicate Record</th>
                        <th>Total</th>
                      </tr>
                      {data.map((dataItem, i) => {
                        return (
                          <tr key={i}>
                            <td>{dataItem?.clientName}</td>
                            <td>{dataItem?.serviceName}</td>
                            <td>{dataItem?.publisher}</td>
                            <td>{dataItem?.queue || 0}</td>
                            <td>{dataItem?.sent || 0}</td>
                            <td>{dataItem?.skip || 0}</td>
                            <td>{dataItem?.duplicateRec || 0}</td>
                            <td>{dataItem?.total}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdvertiserSubscription;
