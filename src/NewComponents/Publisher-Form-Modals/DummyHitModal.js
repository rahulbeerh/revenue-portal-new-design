// Share the url modal when publisher click on Dummy Hit...
import React, { useContext, useState } from "react";
import { TextField, Button, Modal, Box } from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../Loading-States/Loader";
import { InputModalContext } from "../../Context/InputModalContext";
import { sendUrlDummyHit } from "../../Data/Api";
import Loading from "../Loading-States/Loading";

const style = {
  position: "absolute",
  //   overflowY: "scroll",
  height: "50vh",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "0px solid #000",
  boxShadow: 24,
  p: 4,
};

const InputModal = ({ fetchDataFromBackend }) => {
  //   const { open, closeHandler } = useContext(ModalContext);
  const { openInput, closeInputHandler, postbackUrl, service, partnerName } =
    useContext(InputModalContext);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  //   console.log({postbackUrl,service,partnerName});
  const submitHandler = async (e) => {
    e.preventDefault();
    if (url.trim().length > 0) {
      // try {
      setLoading(true);
      const data = { postbackUrl, service, partnerName };
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };

      // Open a new window
      const newWindow = window.open(`${url}`, "_blank");

      // Check if the new window is successfully opened
      if (newWindow) {
        // Set a callback for when the new window is closed
        newWindow.onunload = async function () {
          try {
            const response = await axios.post(`${sendUrlDummyHit}`, data, {
              headers: headers,
            });

            if (response.data.data === "Ok") {
              toast.success("Success");
              setLoading(false);
              setUrl("");
              closeInputHandler();
            } else {
              setLoading(false);
              console.error("Error in API response");
              toast.error("Some Error Occurred!");
              setUrl("");
              closeInputHandler();
            }
          } catch (error) {
            setLoading(false);
            console.error("Error making API request", error);
            toast.error("Some Error Occurred!");
            setUrl("");
            closeInputHandler();
          }
        };
      } else {
        // Handle the case where the new window couldn't be opened
        setLoading(false);
        console.error("Error opening new window");
        toast.error("Some Error Occurred!");
        setUrl("");
        closeInputHandler();
      }
    } else {
      toast.error("Url is empty!");
    }
  };

  return (
    <>
      <ToastContainer />

      <Modal
        open={openInput}
        onClose={closeInputHandler}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={submitHandler}>
            <Box my={2}>
              <TextField
                id="url"
                label="Enter the url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                variant="outlined"
                sx={{ width: "100%" }}
              />
            </Box>
            <Box my={2}>
              <Button
                type="submit"
                sx={{ width: "100%" }}
                variant="contained"
                color="secondary"
                disabled={loading}
              >
                Submit
              </Button>
            </Box>
          </form>
          {loading && <Loading />}
        </Box>
      </Modal>
    </>
  );
};

export default InputModal;