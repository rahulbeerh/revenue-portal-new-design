import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Switch,
  FormControlLabel,
  Box,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import classes from "./Service.module.css";
import Dashboard from "./Dashboard";
import { ModalContext } from "../ModalContext";
import FormModal from "../Components/FormModal";
import axios from "axios";
import {
  deletePublisher,
  enableDisablePublisher,
  showPublisher,
} from "../Data/Api";
import { toast, ToastContainer } from "react-toastify";
import EditFormModal from "../Components/EditFormModal";
import { EditModalContext } from "../EditModalContext";
import Loader from "../Components/Loader";
import SendIcon from "@mui/icons-material/Send";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import InputModal from "../Components/InputModal";
import { InputModalContext } from "../InputModalContext";

const Service = () => {
  const [publisherData, setPublisherData] = useState();
  const [loader, setLoader] = useState("block");
  const { serviceName, id } = useParams();
  const { openHandler } = useContext(ModalContext);
  const { openEditHandler } = useContext(EditModalContext);
  const { openInputHandler } = useContext(InputModalContext);
  const [isShowPublisher, setIsShowPublisher] = useState(false);
  console.log(isShowPublisher,'isp')

  useEffect(() => {
    fetchDataFromBackend();
    setIsShowPublisher(JSON.parse(localStorage.getItem('showAddPublisher')));
  }, [serviceName,id]);

  const fetchDataFromBackend = async () => {
    setLoader("block");
    let token = localStorage.getItem("userToken");
    let headers = { Authorization: "Bearer " + token };
    try {
      //id send krni hai
      const response = await axios.post(
        `${showPublisher}?service=${serviceName}`,
        "",
        { headers: headers }
      );
      console.log(response.data.data, "data 7126879");
      setPublisherData(response.data.data);
      setLoader("none");
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDelete = async ({ id, name }) => {
    if (window.confirm(`Are you sure you want to delete publisher ${name}`)) {
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      try {
        await axios.post(`${deletePublisher}?id=${id}`, "", {
          headers: headers,
        });

        toast.success("Publisher deleted successfully");
        fetchDataFromBackend();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const handleChange = async (id, status) => {
    const data = { id, status: status == 1 ? 0 : 1 };
    try {
      // setLoader("block");
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      await axios.post(enableDisablePublisher, data, { headers: headers });
      toast.success("Success");
      // setLoader("none");
      fetchDataFromBackend();
    } catch (error) {
      toast.error(
        error || error?.data?.message || error?.message || error?.status
      );
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      // Store some information in local storage
      localStorage.setItem("pageRefreshed", "true");
    };

    // Listen for the beforeunload event
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    // Check if the page was refreshed
    const pageRefreshed = localStorage.getItem("pageRefreshed");
    if (pageRefreshed === "true") {
      // Redirect the user to the desired page on page refresh
      window.location.replace("/dashboard");
    }

    // Cleanup local storage
    localStorage.removeItem("pageRefreshed");
  }, []);

  return (
    <>
      <ToastContainer />
      <Dashboard serviceName={serviceName} id={id} />
      <Loader value={loader} />
      {isShowPublisher ? (
        <>
          <Box mx={2}>
            <div className={classes.flex_container}>
              <div className={classes.header}>
                <h5 className={classes.heading}>{serviceName}</h5>
              </div>

              <Button
                variant="contained"
                onClick={openHandler}
                sx={{
                  margin: "2% 0",
                  width: {
                    sm: "10%",
                    md: "20%",
                    lg: "30%",
                  },
                }}
                endIcon={<AddIcon />}
              >
                Add Publisher
              </Button>
            </div>

            {publisherData?.length <= 0 ? (
              <Button>No Data</Button>
            ) : (
              <div className="main-box">
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
                        <th>Client</th>
                        <th>Name</th>
                        <th>Amount Per Subscription</th>
                        <th>Service Url</th>
                        <th>Postback Url</th>
                        <th>Promotion Url</th>
                        <th>Operator</th>
                        <th>Country</th>
                        <th>Service</th>
                        <th>Skip</th>
                        <th>Daily Cap</th>
                        <th>Edit</th>
                        <th>Delete</th>
                        <th>Enable/Disable</th>
                        <th>Dummy Hit</th>
                      </tr>

                      {publisherData?.map((data) => {
                        return (
                          <tr key={data.id}>
                            <td>{data.client}</td>
                            <td>{data.name}</td>
                            <td>{data.amount}</td>
                            <td style={{ width: "100%" }}>{data.serviceUrl}</td>
                            <td style={{ width: "100%" }}>
                              {data.postbackUrl}
                            </td>
                            <td style={{ width: "100%" }}>
                              {data.promotionUrl}
                              <IconButton
                                aria-label="copy"
                                size="small"
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    data.promotionUrl
                                  );
                                }}
                              >
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            </td>
                            <td>{data.operator}</td>
                            <td>{data.country}</td>
                            <td>{data.service}</td>
                            <td>{data.skipValue}</td>
                            <td>{data?.dailyCap}</td>
                            <td>
                              <Button
                                variant="contained"
                                onClick={() => openEditHandler(data.id)}
                              >
                                Edit
                              </Button>
                            </td>
                            <td>
                              <Button
                                variant="contained"
                                onClick={() =>
                                  handleDelete({ id: data.id, name: data.name })
                                }
                              >
                                Delete
                              </Button>
                            </td>
                            <td>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={data.status === 1}
                                    onChange={() =>
                                      handleChange(data.id, data.status)
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
                                    postbackUrl: data.postbackUrl,
                                    service: data.service,
                                    partnerName: data.name,
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

            <FormModal
              serviceName={serviceName}
              id={id}
              fetchDataFromBackend={fetchDataFromBackend}
            />
            <EditFormModal fetchDataFromBackend={fetchDataFromBackend} />
            <InputModal fetchDataFromBackend={fetchDataFromBackend} />
          </Box>
        </>
      ):null}
    </>
  );
};

export default Service;