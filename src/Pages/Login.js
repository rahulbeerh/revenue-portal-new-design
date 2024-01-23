import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../Images/avatar.png";
import { loginApi, loginMasterApi } from "../Data/Api";
import Post from "../Request/Post";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../Components/Loader";
import axios from "axios";

const Login = () => {
  //to go on other page
  const navigate = useNavigate();

  //Hook to store credentials
  const [credentials, setCredentials] = useState({});
  const [inputType,setInputType]=useState("password");

  //Change the input type
  const changeInputType=()=>{
    if(inputType==="password"){
      setInputType("text");
    }
    else{
      setInputType("password");
    }
  }

  //To handle login button
  const handleSubmit = async(e) => {
    e.preventDefault();

    // console.log("input ",credentials);
    if(credentials.username==="admin"){
      // console.log("hit another api")
      try {
        setLoader("block");
        const data={username:credentials.username,password:credentials.password};
        const res=await axios.post(loginMasterApi,data);
        localStorage.setItem("clients",JSON.stringify(res.data.data.data));
        localStorage.setItem("userToken",res.data.token);
        localStorage.setItem("userName",res.data.username);
        navigate("/dailyRevenueAdmin");
        setLoader("none");
      } catch (error) {
        setLoader("none");
        toast.error(error?.response?.data?.message || error?.message || error?.data?.data?.message);
      }
      // localStorage.setItem("userName", e.username);

    }
    else{
      setLoader("block");
      hitOnBackend();
    }
  };

  //Method to hit on backend
  const hitOnBackend = () => {
    let promise = Post(loginApi, credentials);
    promise.then((e) => {
      handleCredResponse(e);
    });
    // .catch(err=>toast.error(err?.data.message || err?.message ||err))
  };

  //Method to handle response
  const handleCredResponse = (e) => {
    if (e.response === "error") {
      // console.log(e.error.message);
      toast.error(e.error?.response?.data?.message || e.error?.message);
      // console.log(e.error.response.data.message);
      setLoader("none");
    } else {
      // console.log("Backend",e);
      setLoader("none");
      let servicesArray = [];
      e.data.data.map((service) => {
        return servicesArray.push(service.serviceName);
      });
      // console.log(servicesArray);

      // console.log(e.token);
      //Correct Credentials
      localStorage.setItem("userToken", e.token);
      localStorage.setItem("userName", e.username);
      localStorage.setItem("services", JSON.stringify(servicesArray));
      localStorage.setItem("serviceObject", JSON.stringify(e.data.data));

      navigate("/dailyRevenue");
    }
  };

  //Hook to store loader div state
  const [loader, setLoader] = useState("none");

  return (
    <>
      <Loader value={loader} />
      <ToastContainer />
      <section className="login-sec">
        <div className="login-heading">
          <h2>Revenue Portal</h2>
        </div>
        <div className="login-box">
          <div className="login-inner-logo">
            <img src={logo} alt="logo" />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="login-form">
              <div className="form">
                <div className="succe-massge">
                  <p>Welcome User</p>
                </div>
                <div className="user">
                  <span className="icon-u">
                    <i className="fa fa-user" aria-hidden="true"></i>
                  </span>
                  <span>
                    <input
                      type="text"
                      placeholder="Username"
                      name="username"
                      required
                      autoComplete="off"
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          username: e.target.value,
                        })
                      }
                    />
                  </span>
                </div>
                <div className="password" style={{ position: "relative" }}>
                  <span className="icon-l">
                    <i className="fa fa-lock" aria-hidden="true"></i>
                  </span>
                  <span>
                    <input
                      type={inputType}
                      placeholder="Password"
                      name="password"
                      required
                      style={{zIndex:"1"}}
                      autoComplete="off"
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          password: e.target.value,
                        })
                      }
                    />
                  </span>
                  <span className="icon-l-2" onClick={changeInputType}>
                    <i className="fa fa-eye" aria-hidden="true"></i>
                  </span>
                </div>
                <div className="submit-btn">
                  <button type="submit">
                    <span>
                      <i className="fa fa-sign-in" aria-hidden="true"></i>
                    </span>{" "}
                    <span>Login</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};
export default Login;
