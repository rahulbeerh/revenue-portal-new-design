import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { sendMonthlyDataApi } from "../Data/Api";
import { toast, ToastContainer } from "react-toastify";
import LineGraph from "../Components/LineGraph";
import GetSecure from "../Request/GetSecure";
import Loader from "../Components/Loader";
import MobileNavbar from "../Components/MobileNavbar";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
// import ExportToExcel from "../Components/ExportToExcel";
import classes from "./MonthlyRevenuePage.module.css";
import NewSidebar from "../NewComponents/NewSidebar";
import NewHeader from "../NewComponents/NewHeader";
import NewLineGraph from "../NewComponents/NewLineGraph";

const MonthlyRevenuePage = () => {
  //to start on load
  useEffect(() => {
    gettingServices();
    // eslint-disable-next-line
  }, []);

  //Hook to store services
  const [services, setServices] = useState([]);
  const [responseService, setResponseService] = useState("");
  const [service, setService] = useState();

  //Getting Services
  const gettingServices = () => {
    let services = JSON.parse(localStorage.getItem("services"));
    setServices(services);
    setService(services[0]);
    getDataFromBackend(services[0]);
  };

  //Hook to store dates
  const [interval, setInterval] = useState("6");

  //Method to get data from Backend
  const getDataFromBackend = (service) => {
    let promise = GetSecure(
      `${sendMonthlyDataApi}?interval=${interval}&service=${service}`
    );
    promise.then((e) => {
      handleDataResponse(e);
    });
  };

  //Hook to store data
  const [data, setData] = useState([]);
  // console.log(data);

  //Hook to store biggest value
  const [biggest, setBiggest] = useState(0);

  //Method to handle response
  const handleDataResponse = (e) => {
    if (e.response === "error") {
      toast.error(e.error?.response?.data?.message || e.error?.message);
      setLoader("none");
    } else {
      setLoader("none");
      // console.log(e);
      const dataDateManupulate = e.data.map((dataItem) => {
        return {
          id: `${dataItem.MONTH}-${dataItem.YEAR}`,
          misDate: `${dataItem.MONTH}-${dataItem.YEAR}`,
          renewalsRevenue: dataItem.renewalsRevenue,
          subscriptionRevenue: dataItem.subscriptionRevenue,
          totalRevenue: dataItem.totalRevenue,
        };
      });
      setData(dataDateManupulate.reverse());
      setResponseService(e.serviceName);
      const biggestValue = Math.max.apply(
        Math,
        e.data.map(function (dataItem) {
          return dataItem.totalRevenue;
        })
      );
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

  //Method to handle service choose
  const handleChooseService = (serviceName) => {
    // console.log("serviceName ",serviceName);
    setService(serviceName);
    getDataFromBackend(serviceName);
  };

  const dataLength = data.length;
  // console.log(dataLength);
  let width = 3000;
  if (dataLength > 10) {
    width = 1000;
  }
  if (dataLength > 0 && dataLength <= 10) {
    width = 700;
  }

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  const totalRenewalRevenue = data.reduce(
    (total, dataItem) => total + dataItem.renewalsRevenue,
    0
  );
  const totalSubscriptionRevenue = data.reduce(
    (total, dataItem) => total + dataItem.subscriptionRevenue,
    0
  );
  const totalRevenue = data.reduce(
    (total, dataItem) => total + dataItem.totalRevenue,
    0
  );

  const totals = {
    id: totalRevenue,
    misDate: "Totals",
    renewalsRevenue: totalRenewalRevenue.toFixed(0),
    subscriptionRevenue: totalSubscriptionRevenue.toFixed(0),
    totalRevenue: totalRevenue.toFixed(0),
  };

  // console.log([...data,totals])
  return (
    <>
      {/* <!-- subscribers-sec --> */}
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
                <label htmlFor="service">Service:</label>
                <select
                  id="service"
                  onChange={(e) => handleChooseService(e.target.value)}
                >
                  {services.length > 0 &&
                    services.map((item, index) => {
                      return (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className={classes.month}>
                <label htmlFor="interval">Months:</label>
                <select
                  id="interval"
                  value={interval}
                  onChange={(e) => setInterval(e.target.value)}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
              </div>
              <button type="submit" className={classes.search_btn}>
                Search
              </button>
            </form>

            <div className={classes.title_container}>
              <div className={classes.title_sub_container}>
                <i className="fa-solid fa-chart-simple"></i>
                <h3>Monthly Revenue Report</h3>
              </div>
            </div>

            <NewLineGraph data={data} width={width} biggest={biggest} />

            {/* <div style={{ height: 600, width: "100%"}}> */}
            <div className={classes.table_container}>
              <div className={classes.table_sub_container}>
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
                      field: "renewalsRevenue",
                      sortable: false,
                      minWidth: 150,
                      headerName: "Renewals Revenue",
                    },
                    {
                      field: "subscriptionRevenue",
                      sortable: false,
                      minWidth: 150,
                      headerName: "Subscription Revenue",
                    },
                    {
                      field: "totalRevenue",
                      sortable: false,
                      minWidth: 150,
                      headerName: "Total Revenue",
                    },
                  ]}
                  slots={{
                    toolbar: CustomToolbar,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default MonthlyRevenuePage;
