import React, { useContext, useState, useEffect } from "react";
import { EditModalContext } from "../EditModalContext";
import {
  TextField,
  Button,
  Modal,
  Box,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import {
  editPublisher,
  fetchCountryApi,
  fetchOperatorApi,
  fetchPublisherById,
} from "../Data/Api";
import { toast, ToastContainer } from "react-toastify";
import Loader from "./Loader";
import classes from "./FormModal.module.css";

const marks = [
  {
    value: 0,
    label: "0",
  },
  {
    value: 20,
    label: "20",
  },
  {
    value: 40,
    label: "40",
  },
  {
    value: 60,
    label: "60",
  },
  {
    value: 80,
    label: "80",
  },
  {
    value: 100,
    label: "100",
  },
];

function valuetext(value) {
  return `${value}`;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  overflowY: "scroll",
  height: "90vh",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  border: "0px solid #000",
  boxShadow: 24,
  p: 4,
};

const EditFormModal = (props) => {
  const { openEdit, closeEditHandler, id } = useContext(EditModalContext);
  const [client, setClient] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [serviceUrl, setServiceUrl] = useState("");
  const [postbackUrl, setPostbackUrl] = useState("");
  const [operator, setOperator] = useState("");
  const [country, setCountry] = useState("");
  const [service, setService] = useState("");
  const [skip, setSkip] = useState(0);
  const [dailyCap, setDailyCap] = useState("");
  //   console.log(id);

  const [loading, setLoading] = useState("block");

  const [serviceUrlError, setServiceUrlError] = useState(false);
  const [postbackUrlError, setPostbackUrlError] = useState(false);

  const [countryOptions, setCountryOptions] = useState([]);
  const [operatorOptions, setOperatorOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading("block");
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      try {
        const response = await axios.post(
          `${fetchPublisherById}?id=${id}`,
          "",
          { headers: headers }
        );
        setClient(response.data.result[0].client);
        setName(response.data.result[0].name);
        setAmount(response.data.result[0]?.amount);
        setServiceUrl(response.data.result[0].serviceUrl);
        setPostbackUrl(response.data.result[0].postbackUrl);
        setOperator(response.data.result[0].operator);
        setCountry(response.data.result[0].country);
        setService(response.data.result[0].service);
        setSkip(response.data.result[0].skipValue);
        setDailyCap(response.data.result[0].dailyCap);
        setLoading("none");
      } catch (error) {
        setLoading("none");
        toast.error(error);
      }
    };
    fetchData();
    async function getCountryOptionsFromBackend() {
      try {
        setLoading("block");
        const client = localStorage.getItem("userName");
        const data = { client };
        let token = localStorage.getItem("userToken");
        let headers = { Authorization: "Bearer " + token };
        const response = await axios.post(fetchCountryApi, data, {
          headers: headers,
        });
        // console.log(response, "1");
        setCountryOptions(response.data.data);
        setLoading("none");
      } catch (error) {
        toast.error(
          error?.data?.message ||
            error?.message ||
            error?.response?.data?.message
        );
        setLoading("none");
        // console.log(error);
      }
    }
    getCountryOptionsFromBackend();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (
      client.trim().length === 0 ||
      name.trim().length === 0 ||
      serviceUrl.trim().length === 0 ||
      postbackUrl.trim().length === 0 ||
      operator.trim().length === 0 ||
      country.trim().length === 0 ||
      service.trim().length === 0
    ) {
      toast.error("Input Fields cannot be empty !");
      return;
    }
    if (
      serviceUrl.includes("ext_ref=<") ||
      serviceUrl.includes("&bmgfy_transid=<") ||
      serviceUrl.includes("bm_transid=<") ||
      serviceUrl.includes("bmffy_transid=<") ||
      serviceUrl.includes("bmkdz_transid=<")
    ) {
      // if (postbackUrl.includes("tid=<")) {
      let index = serviceUrl.indexOf("ext_ref=<");

      let index2 = serviceUrl?.indexOf("&bmgfy_transid=<");
      let index3 = serviceUrl?.indexOf("bm_transid=<");
      let index4 = serviceUrl?.indexOf("bmffy_transid=<");
      let index5 = serviceUrl?.indexOf("bmkdz_transid=<");

      let indexLast = serviceUrl.length;
      const string = serviceUrl.substring(index + 9, indexLast - 1);

      const string2 = serviceUrl?.substring(index2 + 9, indexLast - 1);
      const string3 = serviceUrl?.substring(index3 + 9, indexLast - 1);
      const string4 = serviceUrl?.substring(index4 + 9, indexLast - 1);
      const string5 = serviceUrl?.substring(index5 + 9, indexLast - 1);

      const checkLastCharacter = serviceUrl.substring(-1).includes(">");
      // console.log(checkLastCharacter);
      // console.log(serviceUrl.substring(-1));

      const stringCheck = string.includes("CLICK_ID");

      const stringCheck2 = string2.includes("CLICK_ID");
      const stringCheck3 = string3.includes("CLICK_ID");
      const stringCheck4 = string4.includes("CLICK_ID");
      const stringCheck5 = string5.includes("CLICK_ID");

      // console.log(stringCheck);

      if (
        !stringCheck ||
        !checkLastCharacter ||
        string.trim() === "" ||
        !stringCheck2 ||
        !stringCheck3 ||
        !stringCheck4 ||
        !stringCheck5
      ) {
        setServiceUrlError(true);
        setPostbackUrlError(false);
        // console.log("kj");
        toast.error("Wrong Url");
        return;
      }

      const data = {
        id,
        client,
        name,
        amount:amount==""?0:amount,
        serviceUrl,
        postbackUrl,
        operator,
        country,
        service,
        skip,
        dailyCap,
      };
      // console.log(data);
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      try {
        await axios.post(`${editPublisher}`, data, { headers: headers });
        toast.success("Publisher Edited successfully");

        closeEditHandler();

        setServiceUrlError(false);
        setPostbackUrlError(false);
        // console.log(response);
        closeEditHandler();
        props.fetchDataFromBackend();
      } catch (error) {
        // console.log(error);
        toast.error(error);
        closeEditHandler();
      }
    } else {
      // console.log("error");
      setServiceUrlError(true);
      setPostbackUrlError(false);
      toast.error("Wrong Url");
    }
  };

  const handleChange = async (event) => {
    setCountry(event.target.value);
    //hit api to fetch OPerators
  };
  // console.log(country, "2");

  useEffect(() => {
    if (country) {
      // console.log(country); // This will log the updated state.
      getOperatorOptionsFromBackend();
    }
  }, [country]);

  async function getOperatorOptionsFromBackend() {
    try {
      // setLoading("block");
      const client = localStorage.getItem("userName");
      const data = { client, country };
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      const response = await axios.post(fetchOperatorApi, data, {
        headers: headers,
      });
      // console.log(response, "3");
      setOperatorOptions(response.data.data);
      // setLoading("none");
    } catch (error) {
      toast.error(
        error?.data?.message || error?.message || error?.response?.data?.message
      );
      // setLoading("none");
      // console.log(error);
    }
  }

  return (
    <>
      <ToastContainer />
      {/* {loading == "block" ? ( */}
      {/* ) : ( */}
      <Modal
        open={openEdit}
        onClose={closeEditHandler}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          // sx={style}
          className={classes.modalStyle}
        >
          <Loader value={loading} />
          <form onSubmit={submitHandler}>
            <Box my={2}>
              <TextField
                id="client"
                label="Client"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                variant="outlined"
                sx={{ width: "100%" }}
              />
            </Box>
            <Box my={2}>
              <TextField
                id="name"
                label="Publisher Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                sx={{ width: "100%" }}
              />
            </Box>
            <Box my={2}>
              <TextField
                id="amount"
                type="number"
                label="Amount Per Subscription (optional)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                variant="outlined"
                sx={{ width: "100%" }}
              />
            </Box>
            <Box my={2}>
              <TextField
                id="serviceUrl"
                label="Service Url"
                error={serviceUrlError}
                value={serviceUrl}
                onChange={(e) => setServiceUrl(e.target.value)}
                variant="outlined"
                helperText={
                  serviceUrlError &&
                  "must-contain: ext_ref=<CLICK_ID> or bm_transid=<CLICK_ID> or bmgfy_transid=<CLICK_ID>"
                }
                sx={{ width: "100%" }}
              />
            </Box>
            <Box my={2}>
              <TextField
                id="postbackUrl"
                label="Postback Url"
                error={postbackUrlError}
                value={postbackUrl}
                onChange={(e) => setPostbackUrl(e.target.value)}
                variant="outlined"
                helperText={
                  postbackUrlError && "must-contain: ext_ref=<CLICK_ID>"
                }
                sx={{ width: "100%" }}
              />
            </Box>
            <Box my={2}>
              {/* <TextField
                 id="operator"
                 label="Operator"
                 value={operator}
                 onChange={(e) => setOperator(e.target.value)}
                 variant="outlined"
                 sx={{ width: "100%" }}
               /> */}

              <FormControl fullWidth>
                <InputLabel id="country-select-label">
                  Select Country
                </InputLabel>
                <Select
                  labelId="country-select-label"
                  id="country-simple-select"
                  label="Select Country"
                  sx={{ width: "100%" }}
                  value={country}
                  defaultValue={country}
                  onChange={handleChange}
                >
                  {countryOptions.map((data, i) => {
                    return (
                      <MenuItem key={i} value={data.country_name}>
                        {data.country_name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
            <Box my={2}>
              {/* <TextField
                 id="country"
                 label="Country"
                 value={country}
                 onChange={(e) => setCountry(e.target.value)}
                 variant="outlined"
                 sx={{ width: "100%" }}
               /> */}
              <FormControl fullWidth>
                <InputLabel id="operator-select-label">
                  Select Operator
                </InputLabel>
                <Select
                  labelId="operator-select-label"
                  id="operator-simple-select"
                  label="Select Operator"
                  sx={{ width: "100%" }}
                  defaultValue={operator}
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                >
                  {operatorOptions?.map((data, i) => {
                    return (
                      <MenuItem key={i} value={data.operator}>
                        {data.operator}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
            <Box my={2}>
              <TextField
                id="dailyCap"
                type="number"
                label="Daily Cap"
                InputProps={{
                  inputProps: {
                    min: 0, // Set your minimum value here
                  },
                }}
                value={dailyCap}
                onChange={(e) => setDailyCap(e.target.value)}
                variant="outlined"
                sx={{ width: "100%" }}
              />
            </Box>
            <Box my={2}>
              <TextField
                id="service"
                label="Service"
                value={service}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
                sx={{ width: "100%" }}
              />
            </Box>

            <Box my={2}>
              <Slider
                aria-label="Always visible"
                value={skip}
                onChange={(e) => setSkip(e.target.value)}
                getAriaValueText={valuetext}
                step={1}
                marks={marks}
                valueLabelDisplay="on"
              />
              <label>Skip {skip}</label>
            </Box>

            <Button
              type="submit"
              sx={{ width: "100%" }}
              variant="contained"
              color="secondary"
            >
              Save Changes
            </Button>
          </form>
        </Box>
      </Modal>
      {/* )} */}
    </>
  );
};

export default EditFormModal;
