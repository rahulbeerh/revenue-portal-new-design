import "./App.css";
import { useNavigate } from "react-router-dom";
import Routing from "./Routes/Routing";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./CSS/style.css";
import { useEffect, useContext } from "react";
import { ThemeChangeContext } from "./ThemeChangeContext";

function App() {
  //Retrieving theme from context

  //Navigate
  const navigate = useNavigate();

  //to run on load
  useEffect(() => {
    getToken();
    // eslint-disable-next-line
  }, []);

  //To check token
  const getToken = () => {
    let token = localStorage.getItem("userToken");
    // console.log("token ",token);
    if (
      token === null ||
      token === undefined ||
      token === "" ||
      token === " "
    ) {
      navigate("/");
    }
  };

  return (
      <Routing />
  );
}

export default App;
