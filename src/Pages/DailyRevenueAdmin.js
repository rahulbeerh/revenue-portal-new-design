import React, { useEffect, useState } from "react";
import moment from "moment/moment";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { fetchClientServices, sendDataApi } from "../Data/Api";
import PostSecure from "../Request/PostSecure";
import { toast, ToastContainer } from "react-toastify";
import LineGraph from "../Components/LineGraph";
import Loader from "../Components/Loader";
import MobileNavbar from "../Components/MobileNavbar";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import ExportDailyRevenueToExcel from "../Components/ExportDailyRevenueToExcel";
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import SidebarAdmin from "../Components/SidebarAdmin";

const DailyRevenueAdmin = () => {

  const navigate=useNavigate();

  useEffect(()=>{
    const admin=localStorage.getItem("userName")=="admin";
    if(!admin){
        navigate("/");
    }
  },[])

  const [clients, setClients] = useState([]);
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

  //Hook to store biggest value
  const [biggest, setBiggest] = useState(0);


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
  const [kidzManiaData,setKidzManiaData]=useState([]);

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

      const kidzmaniaData=dataFromBackend.map((dataItem) => {
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
          fame:dataItem.fame==null || dataItem.fame.trim().length<=0?0:dataItem.fame,
          subFailed:dataItem.SubFailed==null?0:dataItem.SubFailed,
          callbackcount:dataItem.callbackcount==null?0:dataItem.callbackcount,
          revenueShare:dataItem.revenueShare==null?0:dataItem.revenueShare,
          // companyRevenue:dataItem.companyRevenue==null?0:dataItem.companyRevenue
        };
      });

      const kidzDataLimit=kidzmaniaData.slice(0,31);
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
 

  const handleServiceChange=(service)=>{
    setLoader("block");
    getDataFromBackend(service);
  }

  const handleClientChange=(clientId)=>{
    // console.log("client change",clientId);
    gettingClientServices(clientId);
  }

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  return (
    <>
      {/* <!-- subscribers-sec --> */}
      <Loader value={loader} />
      <ToastContainer />
      <Header service={responseService} />
      <MobileNavbar service={responseService} />
      <SidebarAdmin highlight={1}/>
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
                  // onChange={(e) => setService(e.target.value)}
                  onChange={(e)=>handleClientChange(e.target.value)}
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
                  // onChange={(e) => setService(e.target.value)}
                  onChange={(e)=>handleServiceChange(e.target.value)}
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
                <label htmlFor="start">Start date:</label>
                <input
                  type="date"
                  id="start"
                  name="start"
                  required
                  onChange={(e) => setDates({ ...dates, from: e.target.value })}
                />
              </div>
              <div className="end-date">
                <label htmlFor="end">End date:</label>
                <input
                  type="date"
                  id="end"
                  name="end"
                  required
                  onChange={(e) => setDates({ ...dates, to: e.target.value })}
                />
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
              <span>Revenue</span>
            </p>
          </div>

          {service === "KiddzManiaKenya" ? (
            <>
              <LineGraph data={data} width={width} biggest={biggest} />

              <div className="main-box">
                <ExportDailyRevenueToExcel data={[...kidzManiaData, totals]} />
                <div style={{ height: 600, width: "100%" }}>
                  <DataGrid
                    rows={[...kidzManiaData, totals]}
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
                        field:"subFailed",
                        minWidth:150,
                        sortable:false,
                        headerName:"Subscription Failed",
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
                        sortable:false,
                        headerName: "Total Revenue",
                      },
                      {
                        field:"fame",
                        minWidth:150,
                        sortable:false,
                        headerName:"Fame",
                      },
                      {
                        field:"callbackcount",
                        minWidth:150,
                        sortable:false,
                        headerName:"Callback count",
                      },
                      {
                        field:"revenueShare",
                        minWidth:150,
                        sortable:false,
                        headerName:"Revenue Share",
                      },
                    ]}
                    
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <LineGraph data={data} width={width} biggest={biggest} />

              <div className="main-box">
                <div style={{ height: 600, width: "100%" }}>
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
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default DailyRevenueAdmin;
