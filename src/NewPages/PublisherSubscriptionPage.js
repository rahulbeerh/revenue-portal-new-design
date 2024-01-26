import React, { useEffect, useState } from "react";
import Loader from "../Components/Loader";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import {
  publisherSubscriptionApi,
  publisherSubscriptionServicesApi,
} from "../Data/Api";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import classes from "./DailyRevenuePage.module.css";
import NewSidebar from "../NewComponents/NewSidebar";
import NewHeader from "../NewComponents/NewHeader";
import { DataGrid } from "@mui/x-data-grid";
import ThemeComponent from "../NewComponents/ThemeComponent";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import TitleHeader from "../NewComponents/TitleHeader";

const PublisherSubscriptionPage = () => {
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

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userName") == "etho_1234") {
      navigate("/dailyRevenue");
    }
  }, []);

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
          <NewSidebar highlight={6} />
        </div>
        <div className={classes.container}>
          <NewHeader service="Publisher Subscription" />
          <div className={classes.sub_container}>
            <form className={classes.form} onSubmit={submitHandler}>
              <div className={classes.service}>
                <Dropdown
                  value={service}
                  onChange={(e) => handleServiceChange(e.value)}
                  options={services?.map((data) => ({
                    label: data?.servicename,
                    value: data?.servicename,
                  }))}
                  placeholder="Select a Service"
                />
              </div>

              <div className={classes.partner}>
                <Dropdown
                  value={publisher}
                  onChange={(e) => handlePublisherChange(e.value)}
                  options={publishers?.map((data) => ({
                    label: data?.partner,
                    value: data?.partner,
                  }))}
                  placeholder="Select a Partner"
                />
              </div>

              <div className={classes.start_date}>
                <Calendar
                  value={startDate}
                  onChange={(e) => convertStartDate(e.value)}
                  showIcon
                  // touchUI
                  showButtonBar
                  placeholder="Start Date"
                />
              </div>
              <div className={classes.end_date}>
                <Calendar
                  value={endDate}
                  onChange={(e) => convertEndDate(e.value)}
                  showIcon
                  // touchUI
                  showButtonBar
                  placeholder="End Date"
                />
              </div>
              <button type="submit" className={classes.search_btn}>
                Search
              </button>
            </form>

            <TitleHeader title="Publisher Subscription" icon={<i className="fa-solid fa-snowflake" aria-hidden="true"></i>} />

            {data ? (
              <div className={classes.table_container}>
                <div className={classes.table_sub_container}>
                  <ThemeComponent>
                    <DataGrid
                      rows={data?.map((row, index) => ({
                        ...row,
                        id: index,
                      }))}
                      getRowId={(row) => row.id}
                      columns={[
                        {
                          field: "partner",
                          sortable: false,
                          minWidth: 150,
                          headerName: "Partner",
                        },
                        {
                          field: "servicename",
                          sortable: false,
                          minWidth: 150,
                          headerName: "Service",
                        },
                        {
                          field: "queue",
                          sortable: false,
                          minWidth: 150,
                          headerName: "Queue",
                          renderCell: (params) =>
                            params.value === undefined || params.value === null
                              ? 0
                              : params.value,
                        },
                        {
                          field: "sent",
                          sortable: false,
                          minWidth: 150,
                          headerName: "Sent",
                          renderCell: (params) =>
                            params.value === undefined || params.value === null
                              ? 0
                              : params.value,
                        },
                        {
                          field: "skip",
                          sortable: false,
                          minWidth: 150,
                          headerName: "Skip",
                          renderCell: (params) =>
                            params.value === undefined || params.value === null
                              ? 0
                              : params.value,
                        },
                        {
                          field: "duplicateRec",
                          sortable: false,
                          minWidth: 150,
                          headerName: "Duplicate Record",
                          renderCell: (params) =>
                            params.value === undefined || params.value === null
                              ? 0
                              : params.value,
                        },
                        {
                          field: "total",
                          sortable: false,
                          minWidth: 150,
                          headerName: "Total",
                          renderCell: (params) =>
                            params.value === undefined || params.value === null
                              ? 0
                              : params.value,
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

export default PublisherSubscriptionPage;
