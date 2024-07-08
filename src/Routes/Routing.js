import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../Pages/LoginPage";
import DailyRevenuePage from "../Pages/DailyRevenuePage";
import MonthlyRevenuePage from "../Pages/MonthlyRevenuePage";
import AddCountryAndOperatorPage from "../Pages/AddCountryAndOperatorPage";
import PublisherTrafficPage from "../Pages/PublisherTrafficPage";
import PublisherSubscriptionPage from "../Pages/PublisherSubscriptionPage";
import DashboardPage from "../Pages/DashboardPage";
import ServicePage from "../Pages/ServicePage";
import AdvertiserPage from "../Pages/AdvertiserPage";
import AdvertiserTrafficPage from "../Pages/AdvertiserTrafficPage";
import AdvertiserSubscriptionPage from "../Pages/AdvertiserSubscriptionPage";
import DailyRevenueAdminPage from "../Pages/DailyRevenueAdminPage";
import DashboardAdminPage from "../Pages/DashboardAdminPage";
import MonthlyRevenueAdminPage from "../Pages/MonthlyRevenueAdminPage";

const Routing = () => {
  return (
    <>
      <Routes>
        <Route element={<LoginPage />} path="/" exact={true}></Route>
        <Route
          element={
            localStorage.getItem("hide_data") ? (
              <Navigate to="/" />
            ) : (
              <DailyRevenuePage />
            )
          }
          path="/dailyRevenue"
          exact={true}
        ></Route>
        <Route
          element={
            localStorage.getItem("hide_data") ? (
              <Navigate to="/" />
            ) : (
              <MonthlyRevenuePage />
            )
          }
          path="/monthlyRevenue"
          exact={true}
        ></Route>
        <Route
          element={
            localStorage.getItem("hide_data") ? (
              <Navigate to="/" />
            ) : localStorage.getItem("userName") == "etho_1234" ? (
              <Navigate to="/dailyRevenue" />
            ) : (
              <DashboardPage />
            )
          }
          path="/dashboard"
          exact={true}
        ></Route>
        <Route
          element={
            localStorage.getItem("hide_data") ? (
              <Navigate to="/" />
            ) : localStorage.getItem("userName") == "etho_1234" ? (
              <Navigate to="/dailyRevenue" />
            ) : (
              <ServicePage />
            )
          }
          path="/dashboard/:serviceName/:id"
          exact={true}
        ></Route>
        <Route
          element={
            localStorage.getItem("hide_data") ? (
              <Navigate to="/" />
            ) : localStorage.getItem("userName") == "etho_1234" ? (
              <Navigate to="/dailyRevenue" />
            ) : (
              <AddCountryAndOperatorPage />
            )
          }
          path="/add-country-and-add-operator"
          exact={true}
        ></Route>
        <Route
          element={
            localStorage.getItem("userName") == "etho_1234" ? (
              <Navigate to="/dailyRevenue" />
            ) : (
              <PublisherTrafficPage />
            )
          }
          path="/publisher-traffic"
          exact={true}
        ></Route>
        <Route
          element={
            localStorage.getItem("userName") == "etho_1234" ? (
              <Navigate to="/dailyRevenue" />
            ) : (
              <PublisherSubscriptionPage />
            )
          }
          path="/publisher-subscription"
          exact={true}
        ></Route>
        <Route
          element={
            localStorage.getItem("userName") != "panz" ? (
              <Navigate to="/" />
            ) : (
              <AdvertiserPage />
            )
          }
          path="/advertiser"
          exact={true}
        />
        <Route
          element={
            localStorage.getItem("userName") != "panz" ? (
              <Navigate to="/" />
            ) : (
              <AdvertiserTrafficPage />
            )
          }
          path="/advertiser-traffic"
          exact={true}
        />
        <Route
          element={
            localStorage.getItem("userName") != "panz" ? (
              <Navigate to="/" />
            ) : (
              <AdvertiserSubscriptionPage />
            )
          }
          path="/advertiser-subscription"
          exact={true}
        />
        <Route
          element={
            localStorage.getItem("userName") != "admin" ? (
              <Navigate to="/" />
            ) : (
              <DailyRevenueAdminPage />
            )
          }
          path="/dailyRevenueAdmin"
          exact={true}
        />
        <Route
          element={
            localStorage.getItem("userName") != "admin" ? (
              <Navigate to="/" />
            ) : (
              <MonthlyRevenueAdminPage />
            )
          }
          path="/monthlyRevenueAdmin"
          exact={true}
        />
        <Route
          element={
            localStorage.getItem("userName") != "admin" ? (
              <Navigate to="/" />
            ) : (
              <DashboardAdminPage />
            )
          }
          path="/dashboardAdmin"
          exact={true}
        />
      </Routes>
    </>
  );
};
export default Routing;
