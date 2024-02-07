import React, { useEffect, useState } from "react";
import moment from "moment/moment";
import { fetchClientServices, sendDataApi } from "../Data/Api";
import PostSecure from "../Request/PostSecure";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../Components/Loader";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import classes from "./DailyRevenuePage.module.css";
import NewHeader from "../NewComponents/NewHeader";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import TitleHeader from "../NewComponents/TitleHeader";
import NewLineGraph from "../NewComponents/NewLineGraph";
import ThemeComponent from "../NewComponents/ThemeComponent";
import NewSidebarAdmin from "../NewComponents/NewSidebarAdmin";

const DailyRevenueAdminPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const admin = localStorage.getItem("userName") == "admin";
    if (!admin) {
      navigate("/");
    }
  }, []);

  const [clients, setClients] = useState([]);
  const [client, setClient] = useState("");
  const [clientForDropdown, setClientForDropdown] = useState("");

  const [sidebarHide, setSidebarHide] = useState(() =>
    localStorage.getItem("sidebar")
      ? JSON.parse(localStorage.getItem("sidebar"))
      : false
  );
  const sidebarHandler = () => {
    localStorage.setItem("sidebar", JSON.stringify(!sidebarHide));
    setSidebarHide(JSON.parse(localStorage.getItem("sidebar")));
  };

  //to start on load
  useEffect(() => {
    const clients_variable = JSON.parse(localStorage.getItem("clients"));
    setClients(clients_variable);
    setClient(clients_variable[0]?.id);
    setClientForDropdown(clients_variable[0]);
    gettingClientServices(clients_variable[0].id);
  }, []);

  //Hook to store services
  const [services, setServices] = useState([]);

  //Hook to store biggest value
  const [biggest, setBiggest] = useState(0);

  async function gettingClientServices(clientId) {
    try {
      setLoader("block");
      //fetch Services of that client and store in localStorage;
      // gettingServices() function call;
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      const res = await axios.post(
        `${fetchClientServices}?clientId=${clientId}`,
        data,
        {
          headers: headers,
        }
      );
      // console.log("client services api",res);
      let servicesArray = [];
      res.data.data.map((service) => {
        return servicesArray.push(service.serviceName);
      });
      localStorage.setItem("services", JSON.stringify(servicesArray));
      gettingServices();
      // setLoader("none");
    } catch (error) {
      // console.log(error);
      setLoader("none");
      toast.error(
        error?.data?.message || error?.message || error?.data?.data?.message
      );
    }
  }

  //Getting Services
  const gettingServices = () => {
    let services = JSON.parse(localStorage.getItem("services"));
    setServices(services);
    getDataFromBackend(services[0]);
  };

  //Hook to store dates
  const [dates, setDates] = useState({
    to: moment(new Date()).format("yyyy-MM-DD"),
    from: moment().subtract(30, "days").format("yyyy-MM-DD"),
  });

  const [startDateForCalendar, setStartDateForCalendar] = useState(
    moment().subtract(30, "days").toDate()
  );
  const [endDateForCalendar, setEndDateForCalendar] = useState(new Date());

  const [service, setService] = useState("");
  const [responseService, setResponseService] = useState("");

  // console.log(service);

  //Method to get data from Backend
  const getDataFromBackend = (service) => {
    setService(service);
    let data = { from: dates.from, to: dates.to, serviceName: service };
    // console.log("input ",data);
    setLoader("block");
    let promise = PostSecure(sendDataApi, data);
    promise
      .then((e) => {
        handleDataResponse(e);
      })
      .catch((err) => toast.error(err?.data?.message || err?.message || err));
    setLoader("none");
  };

  //Hook to store data
  const [data, setData] = useState([]);
  const [kidzManiaData, setKidzManiaData] = useState([]);

  //Method to handle response
  const handleDataResponse = (e) => {
    // console.log(e);
    if (e.response === "error") {
      toast.error(e.error?.response?.data?.message || e.error?.message);
      setTimeout(() => {
        navigate("/");
      }, 2000);
      setLoader("none");
    } else {
      setLoader("none");
      // console.log("Backend e", e);
      const dataFromBackend = e.data;
      // console.log("DataFromBackend", dataFromBackend);
      const dataDateManupulate = dataFromBackend.map((dataItem) => {
        return {
          id: dataItem.id,
          misDate: dataItem.misDate.substring(0, 10),
          totalBase: dataItem.totalBase,
          totalActiveBase: dataItem.totalActiveBase,
          subscriptions: dataItem.subscriptions,
          unsubscriptions: dataItem.unsubscriptions,
          renewalsRevenue: dataItem.renewalsRevenue,
          subscriptionRevenue: dataItem.subscriptionRevenue,
          totalRevenue: dataItem.totalRevenue,
        };
      });

      const kidzmaniaData = dataFromBackend.map((dataItem) => {
        return {
          id: dataItem.id,
          misDate: dataItem.misDate.substring(0, 10),
          totalBase: dataItem.totalBase,
          totalActiveBase: dataItem.totalActiveBase,
          subscriptions: dataItem.subscriptions,
          unsubscriptions: dataItem.unsubscriptions,
          renewalsRevenue: dataItem.renewalsRevenue,
          subscriptionRevenue: dataItem.subscriptionRevenue,
          totalRevenue: dataItem.totalRevenue,
          fame:
            dataItem.fame == null || dataItem.fame.trim().length <= 0
              ? 0
              : dataItem.fame,
          subFailed: dataItem.SubFailed == null ? 0 : dataItem.SubFailed,
          callbackcount:
            dataItem.callbackcount == null ? 0 : dataItem.callbackcount,
          revenueShare:
            dataItem.revenueShare == null ? 0 : dataItem.revenueShare,
          // companyRevenue:dataItem.companyRevenue==null?0:dataItem.companyRevenue
        };
      });

      const kidzDataLimit = kidzmaniaData.slice(0, 31);
      setKidzManiaData(kidzDataLimit.reverse());

      const dataLimit = dataDateManupulate.slice(0, 31);
      setData(dataLimit.reverse());

      const biggestValue = Math.max.apply(
        Math,
        dataLimit.map(function (dataItem) {
          return dataItem.totalRevenue;
        })
      );
      // console.log(biggest);
      setResponseService(e.service);
      setBiggest(biggestValue);
      // console.log(biggest);
    }
  };

  //Method to handle form submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoader("block");
    getDataFromBackend(service);
  };

  //Hook to store loader div state
  const [loader, setLoader] = useState("block");

  const dataLength = data.length;
  let width = 3000;
  if (dataLength > 25) {
    width = 3000;
  }
  if (dataLength > 17 && dataLength <= 25) {
    width = 2200;
  }
  if (dataLength > 10 && dataLength <= 17) {
    width = 1800;
  }
  if (dataLength >= 5 && dataLength <= 10) {
    width = 1100;
  }
  if (dataLength > 0 && dataLength < 5) {
    width = 500;
  }

  const monthlyTotalSubscriptions = data.reduce(
    (total, dataItem) => total + dataItem.subscriptions,
    0
  );
  const monthlyTotalUnsubscriptions = data.reduce(
    (total, dataItem) => total + dataItem.unsubscriptions,
    0
  );
  const totalRenewalRevenue = data.reduce(
    (total, dataItem) => total + dataItem.renewalsRevenue,
    0
  );
  const totalSubscriptionRevenue = data.reduce(
    (total, dataItem) => total + dataItem.subscriptionRevenue,
    0
  );
  const monthlyTotalRevenue = data.reduce(
    (total, dataItem) => total + dataItem.totalRevenue,
    0
  );
  const totals = {
    id: monthlyTotalRevenue,
    misDate: "Totals",
    subscriptions: monthlyTotalSubscriptions,
    unsubscriptions: monthlyTotalUnsubscriptions,
    renewalsRevenue: totalRenewalRevenue,
    subscriptionRevenue: totalSubscriptionRevenue,
    totalRevenue: monthlyTotalRevenue,
  };

  const handleServiceChange = (service) => {
    setLoader("block");
    getDataFromBackend(service);
  };

  const handleClientChange = (client) => {
    setClientForDropdown(client);
    setClient(client?.id);
    gettingClientServices(client?.id);
  };

  const convertStartDate = (utcDate) => {
    setStartDateForCalendar(utcDate);
    setDates({ ...dates, from: utcDate });
  };

  const convertEndDate = (utcDate) => {
    setEndDateForCalendar(utcDate);
    setDates({ ...dates, to: utcDate });
  };

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  return (
    <>
      <Loader value={loader} />
      <ToastContainer />
      <div className={`${classes.main} ${sidebarHide && classes.short}`}>
        <div className={`${classes.sidebar} ${sidebarHide && classes.short}`}>
          <div
            className={`${classes.sidebar_header} ${
              sidebarHide && classes.short
            }`}
          >
            <img
              src="/assets/images/logo.png"
              alt="Revenue portal"
              className={classes.sidebar_logo}
            />
            <h3 className={classes.dashboard_text}>Dashboard</h3>
          </div>
          <div className={classes.sidebar_icon}>
            <div className={classes.circle} onClick={sidebarHandler}>
              {sidebarHide ? (
                <i
                  className={`fa-solid fa-arrow-right ${classes.arrow_icon}`}
                ></i>
              ) : (
                <i
                  className={`fa-solid fa-arrow-left ${classes.arrow_icon}`}
                ></i>
              )}
            </div>
          </div>
          <NewSidebarAdmin highlight={2} sidebarHide={sidebarHide} />
        </div>
        <div className={classes.container}>
          <NewHeader service={responseService} />
          <div className={classes.sub_container}>
            <form className={classes.form} onSubmit={handleFormSubmit}>
              <div className={classes.client}>
                <Dropdown
                  value={clientForDropdown}
                  onChange={(e) => handleClientChange(e.value)}
                  options={clients?.map((client) => ({
                    label: client?.username,
                    value: client,
                  }))}
                  placeholder="Select a Client"
                />
              </div>

              <div className={classes.service}>
                <Dropdown
                  value={service}
                  onChange={(e) => handleServiceChange(e.value)}
                  options={services?.map((service) => ({
                    label: service,
                    value: service,
                  }))}
                  placeholder="Select a Service"
                />
              </div>

              <div className={classes.start_date}>
                <Calendar
                  value={startDateForCalendar}
                  onChange={(e) => convertStartDate(e.value)}
                  showIcon
                  showButtonBar
                  placeholder="Start Date"
                />
              </div>
              <div className={classes.end_date}>
                <Calendar
                  value={endDateForCalendar}
                  onChange={(e) => convertEndDate(e.value)}
                  showIcon
                  showButtonBar
                  placeholder="End Date"
                />
              </div>
              <button type="submit" className={classes.search_btn}>
                Search
              </button>
            </form>

            <TitleHeader title="Revenue" icon="" />

            <NewLineGraph data={data} width={width} biggest={biggest} />

            <div className={classes.table_container}>
              <div className={classes.table_sub_container}>
                <ThemeComponent>
                  <DataGrid
                    rows={[...data, totals]}
                    columns={[
                      {
                        field: "misDate",
                        sortable: false,
                        minWidth: 150,
                        headerName: "Date",
                      },
                      {
                        field: "totalBase",
                        sortable: false,
                        minWidth: 150,
                        headerName: "Total Base",
                      },
                      {
                        field: "totalActiveBase",
                        sortable: false,
                        minWidth: 150,
                        headerName: "Total Active Base",
                      },
                      {
                        field: "subscriptions",
                        sortable: false,
                        minWidth: 150,
                        headerName: "Subscriptions",
                      },
                      {
                        field: "unsubscriptions",
                        sortable: false,
                        minWidth: 150,
                        headerName: "Unsubscriptions",
                      },
                      {
                        field: "renewalsRevenue",
                        sortable: false,
                        minWidth: 150,
                        headerName: "Renewal Revenue",
                      },
                      {
                        field: "subscriptionRevenue",
                        sortable: false,
                        minWidth: 150,
                        headerName: "Subscription Revenue",
                      },
                      {
                        field: "totalRevenue",
                        minWidth: 150,
                        headerName: "Total Revenue",
                      },
                    ]}
                    slots={{
                      toolbar: CustomToolbar,
                    }}
                  />
                </ThemeComponent>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DailyRevenueAdminPage;
