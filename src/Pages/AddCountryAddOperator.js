import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import classes from "./AddCountry.module.css";
import { TextField, Box, Button } from "@mui/material";
import MobileNavbar from "../Components/MobileNavbar";
import axios from "axios";
import { addCountryAndOperator, fetchCountryAndOperator } from "../Data/Api";
import Loader from "../Components/Loader";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddCountryAddOperator = () => {
  const [country, setCountry] = useState("");
  const [operator, setOperator] = useState("");
  const [loader, setLoader] = useState("none");
  const [data, setData] = useState([]);
  const navigate=useNavigate();

  useEffect(()=>{
    if(localStorage.getItem("userName") == "etho_1234"){
      navigate("/dailyRevenue")
    }
  },[])

  const client = localStorage.getItem("userName");
  // console.log(clientName);

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
      // console.log("Backend",response);
      setData(response.data.data);
      setLoader('none');
    } catch (error) {
      // console.log(error);
      setLoader("none");
      toast.error(error || error?.data?.message || error?.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log({ country, operator });
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
      // console.log(response);
      setLoader("none");
      setCountry("");
      setOperator("");
      toast.success("Country and Operator Added Successfully");
      fetchDataFromBackend();
    } catch (error) {
      // console.log(error.response.data.message);
      toast.error(error?.response?.data?.message ||error || error?.data?.message || error?.message);
      setLoader("none");
    }
  };

  return (
    <>
      <ToastContainer />
      <Header service="All Services" />
      <MobileNavbar service="All Services" />
      <Loader value={loader} />
      <div className={classes.grid_top_container}>
        <div className={classes.grid_top_container_items_1}>
          <Sidebar highlight={4} top="-25px" />
        </div>
        <div className={classes.grid_top_container_items_2}>
          <div className={classes.grid_container}>
            <Box
              width="350px"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
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
            </Box>
          </div>
        </div>
      </div>

      {data ? (
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
      ) : null}
    </>
  );
};

export default AddCountryAddOperator;
