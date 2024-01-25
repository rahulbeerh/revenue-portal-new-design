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
import classes from "./AdvertiserTrafficPage.module.css";
import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import NewSidebar from "../NewComponents/NewSidebar";
import NewHeader from "../NewComponents/NewHeader";
import ThemeComponent from "../NewComponents/ThemeComponent";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import TitleHeader from "../NewComponents/TitleHeader";

const AdvertiserTrafficPage = () => {
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

  const convertStartDate = (utcDate) => {
    setStartDate(moment(new Date(utcDate)).format("yyyy-MM-DD"));
  };

  const convertEndDate = (utcDate) => {
    setEndDate(moment(new Date(utcDate)).format("yyyy-MM-DD"));
  };

  return (
    <>
      <Loader value={loading} />
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
          <NewHeader service="Advertiser Traffic" />
          <div className={classes.sub_container}>
            <form className={classes.form} onSubmit={submitHandler}>
              <div className={classes.client}>
                 <Dropdown
                  value={client}
                  onChange={(e) => handleClientChange(e.value)}
                  options={clients?.map((data) => ({
                    label: data?.client_name,
                    value: data?.client_name,
                  }))}
                  placeholder="Select a Client"
                />
              </div>

              <div className={classes.service}>
                <Dropdown
                  value={service}
                  onChange={(e) => handleServiceChange(e.value)}
                  options={services?.map((data) => ({
                    label: data?.serviceName,
                    value: data?.serviceName,
                  }))}
                  placeholder="Select Service"
                />
              </div>

              <div className={classes.start_date}>
                  <Calendar
                  value={startDate}
                  onChange={(e) => convertStartDate(e.value)}
                  showIcon
                  touchUI
                  showButtonBar
                  placeholder="Start Date"
                />
              </div>
              <div className={classes.end_date}>
             <Calendar
                  value={endDate}
                  onChange={(e) => convertEndDate(e.value)}
                  showIcon
                  touchUI
                  showButtonBar
                  placeholder="End Date"
                />
              </div>
                <button type="submit" className={classes.search_btn}>Search</button>
            </form>

            <TitleHeader title="Advertiser Traffic" icon={<i className="fa-solid fa-bolt" aria-hidden="true"></i>} />

            {traffic ? (
              <div className={classes.table_container}>
                <div className={classes.table_sub_container}>
                  <ThemeComponent>
                    <DataGrid
                      rows={traffic?.map((row, index) => ({
                        ...row,
                        id: index,
                      }))}
                      getRowId={(row) => row.id}
                      columns={[
                        {
                          field: "clientName",
                          sortable: false,
                          minWidth: 150,
                          headerName: "Client",
                        },
                        {
                          field: "serviceName",
                          sortable: false,
                          minWidth: 150,
                          headerName: "Service",
                        },
                        {
                          field: "publisher",
                          sortable: false,
                          minWidth: 150,
                          headerName: "Publisher",
                        },
                        {
                          field: "country",
                          sortable: false,
                          minWidth: 150,
                          headerName: "Country",
                        },
                        {
                          field: "operator",
                          sortable: false,
                          minWidth: 150,
                          headerName: "Operator",
                        },
                        {
                          field: "COUNT",
                          sortable: false,
                          minWidth: 150,
                          headerName: "Count",
                        },
                      ]}
                    />
                  </ThemeComponent>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdvertiserTrafficPage;
