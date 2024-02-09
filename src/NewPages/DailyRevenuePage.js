import React, { useEffect, useRef, useState } from "react";
import moment from "moment/moment";
import { sendDataApi } from "../Data/Api";
import PostSecure from "../Request/PostSecure";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../Components/Loader";
import { useNavigate } from "react-router-dom";
import NewHeader from "../NewComponents/NewHeader";
import NewSidebar from "../NewComponents/NewSidebar";
import classes from "./DailyRevenuePage.module.css";
import NewLineGraph from "../NewComponents/NewLineGraph";
import ThemeComponent from "../NewComponents/ThemeComponent";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import TitleHeader from "../NewComponents/TitleHeader";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ExportDailyRevenueToExcel from "../NewComponents/ExportDailyRevenueToExcel";

const DailyRevenuePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    gettingServices();
  }, []);

  const [sidebarHide, setSidebarHide] = useState(() =>
    localStorage.getItem("sidebar")
      ? JSON.parse(localStorage.getItem("sidebar"))
      : false
  );
  const sidebarHandler = () => {
    localStorage.setItem("sidebar", JSON.stringify(!sidebarHide));
    setSidebarHide(JSON.parse(localStorage.getItem("sidebar")));
  };

  const [services, setServices] = useState([]);

  const [biggest, setBiggest] = useState(0);

  const dt = useRef(null);

  const gettingServices = () => {
    let services = JSON.parse(localStorage.getItem("services"));
    setServices(services);
    getDataFromBackend(services[0]);
  };

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

  const getDataFromBackend = (service) => {
    setService(service);
    let data = { from: dates.from, to: dates.to, serviceName: service };

    let promise = PostSecure(sendDataApi, data);
    promise
      .then((e) => {
        handleDataResponse(e);
      })
      .catch((err) => toast.error(err?.data?.message || err?.message || err));
  };

  const [data, setData] = useState([]);
  const [kidzManiaData, setKidzManiaData] = useState([]);

  const handleDataResponse = (e) => {
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

  const convertStartDate = (utcDate) => {
    setStartDateForCalendar(utcDate);
    setDates({ ...dates, from: utcDate });
  };

  const convertEndDate = (utcDate) => {
    setEndDateForCalendar(utcDate);
    setDates({ ...dates, to: utcDate });
  };

  

  const header = (
    <ExportDailyRevenueToExcel data={[...data,totals]}/>
  );

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
          <NewSidebar highlight={1} sidebarHide={sidebarHide} />
        </div>
        <div className={classes.container}>
          <NewHeader service={responseService} highlight={1} />
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
                  style={{ width: "100%" }}
                />
              </div>

              <div className={classes.start_date}>
                <Calendar
                  value={startDateForCalendar}
                  // value={dates.from}
                  onChange={(e) => convertStartDate(e.value)}
                  // onChange={(e) => setDates({ ...dates, from: e.value })}
                  showIcon
                  // touchUI
                  showButtonBar
                  placeholder="Start Date"
                  style={{ width: "100%" }}
                />
              </div>
              <div className={classes.end_date}>
                <Calendar
                  // value={dates.to}
                  value={endDateForCalendar}
                  onChange={(e) => convertEndDate(e.value)}
                  // onChange={(e) => setDates({ ...dates, to: e.value })}
                  showIcon
                  // touchUI
                  showButtonBar
                  placeholder="End Date"
                  style={{ width: "100%" }}
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
                <ThemeComponent>
                  <DataTable
                    value={[...data, totals]}
                    emptyMessage="No data found"
                    showGridlines
                    responsive
                    scrollable
                    scrollHeight="500px"
                    rows={15}
                    paginator
                    header={header}
                  >
                    <Column field="misDate" header="Date" />
                    <Column field="totalBase" header="Total Subscription" />
                    <Column
                      field="totalActiveBase"
                      header="Active Subscription"
                    />
                    <Column field="subscriptions" header="Paid Subscriptions" />
                    <Column field="unsubscriptions" header="Unsubscriptions" />
                    <Column field="renewalsRevenue" header="Renewal Revenue" />
                    <Column
                      field="subscriptionRevenue"
                      header="Subscription Revenue"
                    />
                    <Column field="totalRevenue" header="Revenue" />
                    <Column
                      field="dailyIncreaseAccumulated"
                      header="Total Revenue"
                    />
                  </DataTable>
                </ThemeComponent>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DailyRevenuePage;
