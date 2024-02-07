import React, { useContext, useState, useEffect } from "react";
import {
  Button,
  FormControlLabel,
  IconButton,
  Switch,
  Tooltip,
} from "@mui/material";
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
import InfoIcon from "@mui/icons-material/Info";
import classes from "./AdvertiserPage.module.css";
import NewHeader from "../NewComponents/NewHeader";
import NewSidebar from "../NewComponents/NewSidebar";
import { InputText } from "primereact/inputtext";
import TitleHeader from "../NewComponents/TitleHeader";

const AdvertiserPage = () => {
  const { openHandler } = useContext(AdvertiserModalContext);
  const { openEditHandler } = useContext(EditAdvertiserContext);
  const { openInputHandler } = useContext(AdvertiserDummyHitContext);
  const [loading, setLoading] = useState("block");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [client, setClient] = useState("");
  const [service, setService] = useState("");
  const navigate = useNavigate();

  const [sidebarHide, setSidebarHide] = useState(() =>
  localStorage.getItem("sidebar")
    ? JSON.parse(localStorage.getItem("sidebar"))
    : false
);
const sidebarHandler = () => {
  localStorage.setItem("sidebar", JSON.stringify(!sidebarHide));
  setSidebarHide(JSON.parse(localStorage.getItem("sidebar")));
};

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
      <Loader value={loading} />
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
          <NewSidebar highlight={7} sidebarHide={sidebarHide} />
        </div>
        <div className={classes.container}>
          <NewHeader service="All Services" />
          <div className={classes.sub_container}>
            <form className={classes.form}>
              <div className={classes.client}>
                <InputText
                  type="text"
                  placeholder="Search By Client"
                  value={client}
                  onChange={handleClientChange}
                />
              </div>

              <div className={classes.service}>
                <InputText
                  type="text"
                  placeholder="Search By Service"
                  value={service}
                  onChange={handleServiceChange}
                />
              </div>
            </form>

            <TitleHeader title="Advertiser" icon="" />

            <button onClick={openHandler} className={classes.add_btn}>
              Add Advertiser
              <AddIcon />
            </button>

            {filteredData?.length > 0 && (
              <div className={classes.table_container}>
                <div className={classes.table_sub_container}>
                  <table className={classes.table}>
                    <tbody>
                      <tr className={classes.tr}>
                        <th className={classes.th}>Client</th>
                        <th className={classes.th}>Publisher</th>
                        <th className={classes.th}>Service</th>
                        <th className={classes.th}>Amount</th>
                        <th className={classes.th}>Service Url</th>
                        <th className={classes.th}>Postback Url</th>
                        <th className={classes.th}>
                          Provider's Postback Url
                          <Tooltip title="This is our postback url in which you will send your pixel">
                            <IconButton>
                              <InfoIcon
                                sx={{ color: "red", fontSize: "1.5rem" }}
                              />
                            </IconButton>
                          </Tooltip>
                        </th>
                        <th className={classes.th}>Promotion Url</th>
                        <th className={classes.th}>Operator</th>
                        <th className={classes.th}>Country</th>
                        <th className={classes.th}>Skip</th>
                        <th className={classes.th}>Daily Cap</th>
                        <th className={classes.th}>Edit</th>
                        <th className={classes.th}>Delete</th>
                        <th className={classes.th}>Enable/Disable</th>
                        <th className={classes.th}>Dummy Hit</th>
                      </tr>
                      {filteredData.map((dataItem) => {
                        return (
                          <tr key={dataItem?.id}>
                            <td className={classes.td}>{dataItem?.client_name}</td>
                            <td className={classes.td}>{dataItem?.publisherName}</td>
                            <td className={classes.td}>{dataItem?.serviceName}</td>
                            <td className={classes.td}>{dataItem?.amount_per_sub}</td>
                            <td className={classes.td} style={{ width: "100%" }}>
                              {dataItem?.service_url}
                            </td>
                            <td className={classes.td} style={{ width: "100%" }}>
                              {dataItem?.postback_url}
                            </td>
                            <td className={classes.td} style={{ width: "100%" }}>
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
                                <ContentCopyIcon sx={{color:"#696CFF"}} fontSize="small" />
                              </IconButton>
                            </td>
                            <td className={classes.td} style={{ width: "100%" }}>
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
                                <ContentCopyIcon sx={{color:"#696CFF"}} fontSize="small" />
                              </IconButton>
                            </td>
                            <td className={classes.td}>{dataItem?.operator}</td>
                            <td className={classes.td}>{dataItem?.country}</td>
                            <td className={classes.td}>{dataItem?.skipBy}</td>
                            <td className={classes.td}>{dataItem?.dailyCap}</td>
                            <td className={classes.td}>
                              <Button
                                variant="contained"
                                onClick={() =>
                                  openEditHandler(dataItem?.id, data)
                                }
                              >
                                Edit
                              </Button>
                            </td>
                            <td className={classes.td}>
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
                            <td className={classes.td}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={dataItem?.status === 1}
                                    onChange={() =>
                                      handleChange(
                                        dataItem?.id,
                                        dataItem?.status
                                      )
                                    }
                                  />
                                }
                                label="Enable"
                              />
                            </td>
                            <td className={classes.td}>
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

export default AdvertiserPage;
