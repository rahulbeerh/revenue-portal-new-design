import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Header from "../Components/Header";
import MobileNavbar from "../Components/MobileNavbar";
import SidebarAdmin from "../Components/SidebarAdmin";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import axios from "axios";
import Loader from "../Components/Loader";
import { fetchClientsServicesData } from "../Data/Api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DashboardAdmin = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loader, setLoader] = useState("block");
  const [clients, setClients] = useState([]);
  const [client, setClient] = useState("");
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setMonth(date.getMonth() + 1);
    setYear(date.getFullYear());
    // getDataFromBackend(client);
  };

  useEffect(() => {
    const clients_variable = JSON.parse(localStorage.getItem("clients"));
    setClients(clients_variable);
    setClient(clients_variable[0].id);
    // getDataFromBackend(clients_variable[0].id);
  }, []);

  useEffect(()=>{
    if(client){
        getDataFromBackend(client);
    }
  },[client,month,year]);

  const handleClientChange = (clientId) => {
    setClient(clientId);
    // getDataFromBackend(clientId);
  };


  const getDataFromBackend = async (clientId) => {
    try {
      setLoader("block");
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      let data = {};
      const res = await axios.post(
        `${fetchClientsServicesData}?month=${month}&year=${year}&clientId=${clientId}`,
        data,
        { headers: headers }
      );
      setData(res?.data?.data);
      setLoader("none");
    } catch (error) {
      setLoader("none");
      toast.error(
        error?.response?.data?.message || error?.data?.message || error?.message
      );
    }
  };

  return (
    <>
      <Loader value={loader} />
      <ToastContainer />
      <Header service="All Services" />
      <MobileNavbar service="All Services" />
      <SidebarAdmin highlight={3} />
      <div id="firstTab" className="tabcontent">
        {/* <!-- top-home --> */}
        <div className="subscribers-sec">
          <div className="subscribers-home-l">
            <span className="navigation-links">Home</span>
            <span>/</span>
            <span className="navigation-links">Revenue</span>
          </div>
        </div>

        <div className="date-form">
          <form className="main-date-form ss" 
          >

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
                        <option key={index} value={item.id}>
                          {item.username}
                        </option>
                      );
                    })}
                </select>
              </div>

              <div className="end-date">
                <label htmlFor="interval">Month:</label>
                <DatePicker
                className="datePickerInput"
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="MM/yyyy"
                  style={{ width: "100%" }}
                  showMonthYearPicker
                  maxDate={new Date()}
                />
              </div>
             
            </div>
          </form>

          <div className="title-ic">
            <p>
              <span>
                <i className="fa fa-user" aria-hidden="true"></i>
              </span>{" "}
              <span>All Services Monthly Revenue</span>
            </p>
          </div>

          {data.length <= 0 ? (
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
                        <th>Service</th>
                        <th>Month</th>
                        <th>Renewals Revenue</th>
                        <th>Subscription Revenue</th>
                        <th>Total Revenue</th>
                      </tr>
                      {data.map((dataItem, i) => {
                        return (
                          <tr key={i}>
                            <td>{dataItem.service}</td>
                            <td>
                              {dataItem.MONTH}-{dataItem.YEAR}
                            </td>
                            <td>{dataItem?.renewalsRevenue || 0}</td>
                            <td>{dataItem?.subscriptionRevenue || 0}</td>
                            <td>{dataItem?.totalRevenue || 0}</td>
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

export default DashboardAdmin;
