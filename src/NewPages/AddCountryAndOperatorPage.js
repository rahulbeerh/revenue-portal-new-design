import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import classes from "./AddCountryAndOperator.module.css";
import { TextField, Box, Button } from "@mui/material";
import MobileNavbar from "../Components/MobileNavbar";
import axios from "axios";
import { addCountryAndOperator, fetchCountryAndOperator } from "../Data/Api";
import Loader from "../Components/Loader";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import NewSidebar from "../NewComponents/NewSidebar";
import NewHeader from "../NewComponents/NewHeader";
import { DataGrid } from "@mui/x-data-grid";

const AddCountryAndOperatorPage = () => {
  const [country, setCountry] = useState("");
  const [operator, setOperator] = useState("");
  const [loader, setLoader] = useState("none");
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userName") == "etho_1234") {
      navigate("/dailyRevenue");
    }
  }, []);

  const client = localStorage.getItem("userName");

  useEffect(() => {
    fetchDataFromBackend();
  }, []);

  const fetchDataFromBackend = async () => {
    try {
      setLoader("block");
      const data = { client };
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      const response = await axios.post(fetchCountryAndOperator, data, {
        headers: headers,
      });
      setData(response.data.data);
      setLoader("none");
    } catch (error) {
      setLoader("none");
      toast.error(error || error?.data?.message || error?.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader("block");
    let token = localStorage.getItem("userToken");
    let headers = { Authorization: "Bearer " + token };
    const data = { country, operator, client };

    if (
      !country ||
      !operator ||
      operator.trim().length <= 0 ||
      country.trim().length <= 0
    ) {
      toast.error("Input Fields Cannot be Empty");
      setLoader("none");
      return;
    }
    try {
      const response = await axios.post(addCountryAndOperator, data, {
        headers: headers,
      });
      setLoader("none");
      setCountry("");
      setOperator("");
      toast.success("Country and Operator Added Successfully");
      fetchDataFromBackend();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error ||
          error?.data?.message ||
          error?.message
      );
      setLoader("none");
    }
  };

  return (
    <div>
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
          <NewHeader service="All Services" />
          <div className={classes.sub_container}>
            <div className={classes.form_container}>
              <form onSubmit={handleSubmit}>
                <Box my={2}>
                  <TextField
                    label="Enter Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    fullWidth
                  />
                </Box>
                <Box my={2}>
                  <TextField
                    label="Enter Operator"
                    variant="outlined"
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    fullWidth
                  />
                </Box>

                <Box my={2}>
                  <Button type="submit" variant="contained" color="secondary">
                    Add
                  </Button>
                </Box>
              </form>
            </div>

            <div className={classes.title_container}>
              <div className={classes.title_sub_container}>
                <i className="fa-solid fa-globe" aria-hidden="true"></i>
                <h3>Country and Operator</h3>
              </div>
            </div>

            {/* {data ? (
              <div className="main-box">
                <div style={{ margin: "0 2rem" }}>
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
                          <th>Country</th>
                          <th>Operator</th>
                        </tr>
                        {data.map((dataItems) => {
                          return (
                            <tr key={dataItems.id}>
                              <td>{dataItems.country_name}</td>
                              <td>{dataItems.operator_name}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : null} */}

            {data ? (
              <div className={classes.table_container}>
                <div className={classes.table_sub_container}>
                  <DataGrid
                    rows={data.map((row, index) => ({ ...row, id: index }))} 
                    getRowId={(row) => row.id}
                    columns={[
                      {
                        field: "country_name",
                        sortable: false,
                        minWidth: 150,
                        headerName: "Country",
                      },
                      {
                        field: "operator_name",
                        sortable: false,
                        minWidth: 150,
                        headerName: "Operator",
                      },
                    ]}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCountryAndOperatorPage;
