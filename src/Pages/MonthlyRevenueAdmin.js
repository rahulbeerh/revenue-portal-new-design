import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { sendMonthlyDataApi } from "../Data/Api";
import { toast, ToastContainer } from "react-toastify";
import LineGraph from "../Components/LineGraph";
import GetSecure from "../Request/GetSecure";
import Loader from "../Components/Loader";
import MobileNavbar from "../Components/MobileNavbar";
import axios from 'axios';
import { fetchClientServices } from "../Data/Api";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import SidebarAdmin from "../Components/SidebarAdmin";
import { useNavigate } from "react-router-dom";
// import ExportToExcel from "../Components/ExportToExcel";

const MonthlyRevenueAdmin = () => {
    const [clients,setClients]=useState([]);
    const navigate=useNavigate();

    useEffect(()=>{
      const admin=localStorage.getItem("userName")=="admin";
      if(!admin){
          navigate("/");
      }
    },[])

  //to start on load
  useEffect(() => {
    const clients_variable=JSON.parse(localStorage.getItem("clients"));
    setClients(clients_variable);
    // console.log("clients",clients[0]);
    gettingClientServices(clients_variable[0].id);
    // gettingServices();
    // eslint-disable-next-line
  }, []);

  //Hook to store services
  const [services, setServices] = useState([]);
  const [responseService, setResponseService] = useState("");
  const [service, setService] = useState();

  
  async function gettingClientServices(clientId){
    try {
        setLoader("block");
        //fetch Services of that client and store in localStorage;
        // gettingServices() function call;
        let token=localStorage.getItem("userToken");
        let headers={"Authorization":"Bearer "+token};
        const res=await axios.post(`${fetchClientServices}?clientId=${clientId}`,data,{
        headers:headers
        });
        // console.log("client services api",res);
        let servicesArray = [];
        res.data.data.map((service) => {
            return servicesArray.push(service.serviceName);
        });
        localStorage.setItem("services",JSON.stringify(servicesArray));
        gettingServices();
        // setLoader("none");
    } catch (error) {
        // console.log(error);
        setLoader("none");
        toast.error(error?.data?.message||error?.message||error?.data?.data?.message);
    }
  }

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
          id:`${dataItem.MONTH}-${dataItem.YEAR}`,
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

  const handleClientChange=(clientId)=>{
    // console.log("client change",clientId);
    gettingClientServices(clientId);
  }

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

  const totals={
    id:totalRevenue,
    misDate:"Totals",
    renewalsRevenue:totalRenewalRevenue,
    subscriptionRevenue:totalSubscriptionRevenue,
    totalRevenue:totalRevenue
  }

  // console.log([...data,totals])
  return (
    <>
      {/* <!-- subscribers-sec --> */}
      <Loader value={loader} />
      <ToastContainer />
      <Header service={responseService} />
      <MobileNavbar service={responseService} />
      <SidebarAdmin highlight={2}/>
      <div id="firstTab" className="tabcontent">
        {/* <!-- top-home --> */}
        <div className="subscribers-sec">
          <div className="subscribers-home-l">
            <span className="navigation-links">Home</span>
            <span>/</span>
            <span className="navigation-links">Revenue</span>
          </div>
        </div>

        {/* <!-- date --> */}
        <div className="date-form">
          <form className="main-date-form ss" onSubmit={handleFormSubmit}>
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

              <div className="end-date">
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
              <div className="date-search-btn">
                <button type="submit">Search</button>
              </div>
            </div>
          </form>

          {/* <!-- user --> */}
          <div className="title-ic">
            <p>
              <span>
                <i className="fa fa-user" aria-hidden="true"></i>
              </span>{" "}
              <span>Monthly Revenue</span>
            </p>
          </div>

          <LineGraph data={data} width={width} biggest={biggest} />

          {/* <!-- slect box --> */}
          <div className="main-box">
           
            {/* <ExportToExcel data={[...data,totals]}/> */}

            <div style={{ height: 600, width: "100%" }}>
              <DataGrid
                rows={[...data, totals]}
                columns={[
                  { field: "misDate",             sortable:false,minWidth: 150, headerName: "Date" },
                  { field: "renewalsRevenue",     sortable:false,minWidth:150,headerName: "Renewals Revenue" },
                  { field: "subscriptionRevenue", sortable:false,minWidth:150,headerName: "Subscription Revenue" },
                  { field: "totalRevenue",        sortable:false,minWidth:150,headerName: "Total Revenue" },
                ]}
                slots={{
                  toolbar: CustomToolbar,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default MonthlyRevenueAdmin;
