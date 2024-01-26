import React, { useEffect, useState } from "react";
import moment from "moment/moment";
import { sendDataApi } from "../Data/Api";
import PostSecure from "../Request/PostSecure";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../Components/Loader";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import NewHeader from "../NewComponents/NewHeader";
import NewSidebar from "../NewComponents/NewSidebar";
import classes from "./DailyRevenuePage.module.css";
import NewLineGraph from "../NewComponents/NewLineGraph";
import ThemeComponent from "../NewComponents/ThemeComponent";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import TitleHeader from "../NewComponents/TitleHeader";

const DailyRevenuePage = () => {
  const navigate = useNavigate();
  //to start on load
  useEffect(() => {
    gettingServices();
    // eslint-disable-next-line
  }, []);

  //Hook to store services
  const [services, setServices] = useState([]);

  //Hook to store biggest value
  const [biggest, setBiggest] = useState(0);

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

  const [service, setService] = useState("");
  const [responseService, setResponseService] = useState("");

  // console.log(service);

  //Method to get data from Backend
  const getDataFromBackend = (service) => {
    setService(service);
    let data = { from: dates.from, to: dates.to, serviceName: service };
    // console.log("input ",data);

    let promise = PostSecure(sendDataApi, data);
    promise
      .then((e) => {
        handleDataResponse(e);
      })
      .catch((err) => toast.error(err?.data?.message || err?.message || err));
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
      const dataFromBackend = e.data;
      console.log(dataFromBackend, "d");
      const dataDateManupulate = dataFromBackend.map((dataItem) => {
        return {
          id: dataItem.id,
          misDate: dataItem?.misDate.substring(0, 10),
          totalBase: dataItem.totalBase,
          totalActiveBase: dataItem.totalActiveBase,
          subscriptions: dataItem.subscriptions,
          unsubscriptions: dataItem.unsubscriptions,
          renewalsRevenue: dataItem.renewalsRevenue,
          subscriptionRevenue: dataItem.subscriptionRevenue,
          totalRevenue: dataItem.totalRevenue,
          dailyIncreaseAccumulated: dataItem?.DailyIncreaseAccumulated,
        };
      });

      const kidzmaniaData = dataFromBackend.map((dataItem) => {
        return {
          id: dataItem.id,
          misDate: dataItem?.misDate?.substring(0, 10),
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
          dailyIncreaseAccumulated: dataItem?.DailyIncreaseAccumulated,
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
      setResponseService(e.service);
      setBiggest(biggestValue);
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

  // Math.round(num * 100) / 100;
  const monthlyTotalSubscriptions = data.reduce(
    (total, dataItem) => total + dataItem.subscriptions,
    0
  );
  const monthlyTotalUnsubscriptions = data.reduce(
    (total, dataItem) => total + dataItem.unsubscriptions,
    0
  );
  const totalRenewalRevenue =
    Math.round(
      data.reduce((total, dataItem) => total + dataItem.renewalsRevenue, 0) *
        100
    ) / 100;
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
    subscriptions: monthlyTotalSubscriptions.toFixed(0),
    unsubscriptions: monthlyTotalUnsubscriptions.toFixed(0),
    renewalsRevenue: totalRenewalRevenue.toFixed(0),
    subscriptionRevenue: totalSubscriptionRevenue.toFixed(0),
    totalRevenue: monthlyTotalRevenue.toFixed(0),
  };

  const handleServiceChange = (service) => {
    getDataFromBackend(service);
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
          <NewHeader service={responseService} />
          <div className={classes.sub_container}>
            <form className={classes.form} onSubmit={handleFormSubmit}>
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
                  value={dates.from}
                  onChange={(e) => setDates({ ...dates, from: e.value })}
                  showIcon
                  // touchUI
                  showButtonBar
                  placeholder="Start Date"
                />
              </div>
              <div className={classes.end_date}>
                <Calendar
                  value={dates.to}
                  onChange={(e) => setDates({ ...dates, to: e.value })}
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

            <TitleHeader
              title="Daily Revenue"
              icon={<i className="fa-solid fa-chart-simple"></i>}
            />

            <NewLineGraph data={data} width={width} biggest={biggest} />

            {/* <div style={{ height: 600, width: "100%"}}> */}
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
                        headerName: "Total Subscription",
                      },
                      {
                        field: "totalActiveBase",
                        sortable: false,
                        minWidth: 150,
                        headerName: "Active Subscription",
                      },
                      {
                        field: "subscriptions",
                        sortable: false,
                        minWidth: 150,
                        headerName: "Paid Subscriptions",
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
                        headerName: "Revenue",
                      },
                      {
                        field: "dailyIncreaseAccumulated",
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
export default DailyRevenuePage;
