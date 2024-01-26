import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../Components/Loader";
import axios from "axios";
import { publisherTrafficApi, publisherTrafficServicesApi } from "../Data/Api";
import classes from "./DailyRevenuePage.module.css";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import NewSidebar from "../NewComponents/NewSidebar";
import NewHeader from "../NewComponents/NewHeader";
import ThemeComponent from "../NewComponents/ThemeComponent";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import TitleHeader from "../NewComponents/TitleHeader";

const PublisherTrafficPage = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    if (localStorage.getItem("userName") == "etho_1234") {
      navigate("/dailyRevenue");
    }
  }, []);

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
  const fetchDataFromBackend = async (
    showLoading,
    dateStart,
    dateEnd,
    serviceName,
    publisherName
  ) => {
    let data = {};
    console.log(serviceName, "s");
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
    fetchDataFromBackend(true, startDate, endDate, service, publisher);
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
    fetchDataFromBackend(true, startDate, endDate, service, publisher);
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
          <NewSidebar highlight={5} />
        </div>
        <div className={classes.container}>
          <NewHeader service="Publisher Traffic" />
          <div className={classes.sub_container}>
            <form className={classes.form} onSubmit={submitHandler}>
              <div className={classes.service}>
                <Dropdown
                  value={service}
                  onChange={(e) => handleServiceChange(e.value)}
                  options={services?.map((data) => ({
                    label: data?.service,
                    value: data?.service,
                  }))}
                  placeholder="Select a Service"
                />
              </div>

              <div className={classes.partner}>
                <Dropdown
                  value={publisher}
                  onChange={(e) => handlePublisherChange(e.value)}
                  options={publishers?.map((data) => ({
                    label: data?.publisher,
                    value: data?.publisher,
                  }))}
                  placeholder="Select a Publisher"
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

            <TitleHeader title="Publisher Traffic" icon={<i className="fa-solid fa-bolt" aria-hidden="true"></i>} />

            {publisherData ? (
              <div className={classes.table_container}>
                <div className={classes.table_sub_container}>
                  <ThemeComponent>
                    <DataGrid
                      rows={publisherData?.map((row, index) => ({
                        ...row,
                        id: index,
                      }))}
                      getRowId={(row) => row.id}
                      columns={[
                        {
                          field: "partnerid",
                          sortable: false,
                          minWidth: 150,
                          headerName: "Partner Id",
                        },
                        {
                          field: "service",
                          sortable: false,
                          minWidth: 150,
                          headerName: "Service",
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
                          field: "count",
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

export default PublisherTrafficPage;
