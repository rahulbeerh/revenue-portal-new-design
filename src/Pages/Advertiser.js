import React, { useContext, useState, useEffect } from "react";
import Header from "../Components/Header";
import MobileNavbar from "../Components/MobileNavbar";
import Sidebar from "../Components/Sidebar";
import { Button, FormControlLabel, IconButton, Switch, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { AdvertiserModalContext } from "../AdvertiserModalContext";
import AdvertiserForm from "../Components/AdvertiserForm";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../Components/Loader";
import axios from "axios";
import {
  advertiserDataApi,
  enableDisableAdvertiser,
  deleteAdvertiser,
} from "../Data/Api";
import EditAdvertiserForm from "../Components/EditAdvertiserForm";
import { EditAdvertiserContext } from "../EditAdvertiserContext";
import { useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import AdvertiserDummyHitForm from "../Components/AdvertiserDummyHitForm";
import { AdvertiserDummyHitContext } from "../AdvertiserDummyHitContext";
import InfoIcon from '@mui/icons-material/Info';

const Advertiser = () => {
  const { openHandler } = useContext(AdvertiserModalContext);
  const { openEditHandler } = useContext(EditAdvertiserContext);
  const { openInputHandler } = useContext(AdvertiserDummyHitContext);
  const [loading, setLoading] = useState("block");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [client, setClient] = useState("");
  const [service, setService] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userName") != "panz") {
      navigate("/dailyRevenue");
    }
  }, []);

  const fetchDataFromBackend = async () => {
    try {
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      const response = await axios.post(
        advertiserDataApi,
        {},
        {
          headers: headers,
        }
      );
      setData(response?.data?.result);
      setFilteredData(response?.data?.result);
      setLoading("none");
    } catch (error) {
      toast.error(
        error?.data?.message || error?.response?.data?.message || error?.message
      );
      setLoading("none");
    }
  };

  useEffect(() => {
    fetchDataFromBackend();
  }, []);

  const handleChange = async (id, status) => {
    const data = { id, status: status == 1 ? 0 : 1 };
    try {
      // setLoader("block");
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      await axios.post(`${enableDisableAdvertiser}`, data, {
        headers: headers,
      });
      toast.success("Success");
      // setLoader("none");
      fetchDataFromBackend();
    } catch (error) {
      toast.error(
        error || error?.data?.message || error?.message || error?.status
      );
    }
  };

  const handleDelete = async ({ id, name }) => {
    if (
      window.confirm(
        `Are you sure you want to delete Advertiser Service: ${name}`
      )
    ) {
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      try {
        await axios.post(`${deleteAdvertiser}?id=${id}`, "", {
          headers: headers,
        });

        toast.success("Advertiser deleted successfully");
        fetchDataFromBackend();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const handleClientChange = (e) => {
    setClient(() => e.target.value);
    console.log(client, "cl");

    if (client.length > 0) {
      setService("");
      setFilteredData(() =>
        data.filter((dataItem) =>
          dataItem?.client_name?.includes(e.target.value)
        )
      );
    } else {
      setFilteredData(data); // Set filtered data back to the original data when the client input is empty
    }
  };

  const handleServiceChange = (e) => {
    setService(() => e.target.value);
    if (service.length > 0) {
      setClient("");
      setFilteredData(() =>
        data.filter((dataItem) =>
          dataItem?.serviceName?.includes(e.target.value)
        )
      );
    } else {
      setFilteredData(data);
    }
  };

  return (
    <>
      <ToastContainer />
      <Header service="All Services" />
      <MobileNavbar service="All Services" />
      <Sidebar highlight={7} />
      <Loader value={loading} />
      <div id="firstTab" className="tabcontent">
        <div className="subscribers-sec">
          <div className="subscribers-home-l">
            <span className="navigation-links">Home</span>
            <span>/</span>
            <span className="navigation-links">Revenue</span>
          </div>
        </div>
        <div className="date-form">
          <form className="main-date-form ss" style={{ zIndex: "99" }}>
            <div className={`date-inner date-1-sec `}>
              <div className="end-date">
                <label htmlFor="client">Search By Client:</label>
                <input
                  type="text"
                  value={client}
                  onChange={handleClientChange}
                  placeholder="client"
                />
              </div>

              <div className="end-date">
                <label htmlFor="client">Search By Service:</label>
                <input
                  type="text"
                  value={service}
                  onChange={handleServiceChange}
                  placeholder="service"
                />
              </div>
            </div>
          </form>
          <div className="title-ic">
            <p>
              <span>
                <i className="fa fa-user" aria-hidden="true"></i>
              </span>{" "}
              <span>Advertiser</span>
            </p>
          </div>

          <div className="main-box">
            <div style={{ margin: "0rem 0rem" }}>
              <Button
                variant="contained"
                onClick={openHandler}
                sx={{
                  margin: "2% 0",
                  // width: {
                  //   sm: "10%",
                  //   md: "20%",
                  //   lg: "30%",
                  // },
                }}
                endIcon={<AddIcon />}
              >
                Add Advertiser
              </Button>
            </div>

            {filteredData?.length > 0 && (
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
                      <th>Client</th>
                      <th>Publisher</th>
                      <th>Service</th>
                      <th>Amount</th>
                      <th>Service Url</th>
                      <th>Postback Url</th>
                      <th>
                        Provider's Postback Url
                        <Tooltip title="This is our postback url in which you will send your pixel">
                          <IconButton>
                            <InfoIcon sx={{color:"red",fontSize:"1.5rem"}}/>
                          </IconButton>
                        </Tooltip>
                      </th>
                      <th>Promotion Url</th>
                      <th>Operator</th>
                      <th>Country</th>
                      <th>Skip</th>
                      <th>Daily Cap</th>
                      <th>Edit</th>
                      <th>Delete</th>
                      <th>Enable/Disable</th>
                      <th>Dummy Hit</th>
                    </tr>
                    {filteredData.map((dataItem) => {
                      return (
                        <tr key={dataItem?.id}>
                          <td>{dataItem?.client_name}</td>
                          <td>{dataItem?.publisherName}</td>
                          <td>{dataItem?.serviceName}</td>
                          <td>{dataItem?.amount_per_sub}</td>
                          <td style={{ width: "100%" }}>
                            {dataItem?.service_url}
                          </td>
                          <td style={{ width: "100%" }}>
                            {dataItem?.postback_url}
                          </td>
                          <td style={{ width: "100%" }}>
                            {dataItem?.postbackForClient}
                            <IconButton
                              aria-label="copy"
                              size="small"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  dataItem?.postbackForClient
                                );
                              }}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </td>
                          <td style={{ width: "100%" }}>
                            {dataItem?.promotion_url}
                            <IconButton
                              aria-label="copy"
                              size="small"
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  dataItem?.promotion_url
                                );
                              }}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </td>
                          <td>{dataItem?.operator}</td>
                          <td>{dataItem?.country}</td>
                          <td>{dataItem?.skipBy}</td>
                          <td>{dataItem?.dailyCap}</td>
                          <td>
                            <Button
                              variant="contained"
                              onClick={() =>
                                openEditHandler(dataItem?.id, data)
                              }
                            >
                              Edit
                            </Button>
                          </td>
                          <td>
                            <Button
                              variant="contained"
                              onClick={() =>
                                handleDelete({
                                  id: dataItem?.id,
                                  name: dataItem?.serviceName,
                                })
                              }
                            >
                              Delete
                            </Button>
                          </td>
                          <td>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={dataItem?.status === 1}
                                  onChange={() =>
                                    handleChange(dataItem?.id, dataItem?.status)
                                  }
                                />
                              }
                              label="Enable"
                            />
                          </td>
                          <td>
                            <Button
                              variant="contained"
                              endIcon={<SendIcon />}
                              onClick={() =>
                                openInputHandler({
                                  postbackUrl: dataItem?.postback_url,
                                  service: dataItem?.serviceName,
                                  clientName: dataItem?.client_name,
                                })
                              }
                            >
                              Hit
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <AdvertiserForm fetchDataFromBackend={fetchDataFromBackend} />
      <EditAdvertiserForm fetchDataFromBackend={fetchDataFromBackend} />
      <AdvertiserDummyHitForm />
    </>
  );
};

export default Advertiser;
