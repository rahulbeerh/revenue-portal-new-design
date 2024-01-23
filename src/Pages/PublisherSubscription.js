import React, { useEffect, useState } from "react";
import Loader from "../Components/Loader";
import { ToastContainer, toast } from "react-toastify";
import Header from "../Components/Header";
import MobileNavbar from "../Components/MobileNavbar";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import {
  publisherSubscriptionApi,
  publisherSubscriptionServicesApi,
} from "../Data/Api";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const PublisherSubscription = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState("block");
  const [startDate, setStartDate] = useState(
    moment(new Date()).format("yyyy-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment(new Date()).format("yyyy-MM-DD")
  );

  const [services, setServices] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [service, setService] = useState("");
  const [publisher, setPublisher] = useState("");

  const navigate=useNavigate();

  useEffect(()=>{
    if(localStorage.getItem("userName") == "etho_1234"){
      navigate("/dailyRevenue")
    }
  },[])

  const fetchServices = async () => {
    try {
      setLoading("block");
      const client = localStorage.getItem("userName");
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      const data = { client, startDate, endDate };
      const res = await axios.post(publisherSubscriptionServicesApi, data, {
        headers: headers,
      });
      setServices(res?.data?.services);
      setPublishers(res?.data?.publisher);

      let newService = { servicename: "All" };

      setServices((prevServices) => {
        // Inserting the new service at the first index
        return [newService, ...prevServices];
      });

      let newPublisher = { partner: "All" };
      setPublishers((prevPublishers) => {
        // Inserting the new service at the first index
        return [newPublisher, ...prevPublishers];
      });

      setLoading("none");
    } catch (error) {
      // console.log(error);
      toast.error(
        error?.data?.message ||
          error?.message ||
          error?.response?.data?.message ||
          error
      );
      setLoading("none");
    }
  };

  async function fetchDataFromBackend() {
    try {
      setLoading("block");
      const client = localStorage.getItem("userName");
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      let data = {};
      if (service == "All" || service == "") {
        data = {
          client,
          startDate,
          endDate,
          service: "All",
          publisher: publisher,
        };
      } else {
        data = {
          client,
          startDate,
          endDate,
          service: service,
          publisher: publisher,
        };
      }
      // const data = { client, startDate, endDate };
      const res = await axios.post(publisherSubscriptionApi, data, {
        headers: headers,
      });
      setData(res.data.data);
      setLoading("none");
      // console.log(res, "2");
    } catch (error) {
      // console.log(error);
      toast.error(
        error?.data?.message ||
          error?.message ||
          error?.response?.data?.message ||
          error
      );
      setLoading("none");
    }
  }

  useEffect(() => {
    fetchServices();
    fetchDataFromBackend();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    fetchDataFromBackend();
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
      <Header service="Publisher Subscription" />
      <MobileNavbar service="Publisher Subscription" />
      <Sidebar highlight={6} />
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
                <label htmlFor="service">Service:</label>
                <select
                  id="service"
                  // onChange={(e) => setService(e.target.value)}
                  onChange={(e) => handleServiceChange(e.target.value)}
                >
                  {services.length > 0 &&
                    services.map((item, index) => {
                      return (
                        <option key={index} value={item.servicename}>
                          {item.servicename}
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
                        <option key={index} value={item.partner}>
                          {item.partner}
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
              <span>Publisher Subscription</span>
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
                        <th>Partner</th>
                        <th>Service Name</th>
                        <th>Queue</th>
                        <th>Sent</th>
                        <th>Skip</th>
                        <th>Duplicate Record</th>
                        <th>Total</th>
                      </tr>
                      {data.map((dataItem, i) => {
                        return (
                          <tr key={i}>
                            <td>{dataItem.partner}</td>
                            <td>{dataItem.servicename}</td>
                            <td>{dataItem?.queue || 0}</td>
                            <td>{dataItem?.sent || 0}</td>
                            <td>{dataItem?.skip || 0}</td>
                            <td>{dataItem?.duplicateRec || 0}</td>
                            <td>{dataItem.total}</td>
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

export default PublisherSubscription;
