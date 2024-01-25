import React from "react";
import {Routes,Route} from "react-router-dom"
import Login from "../Pages/Login";
import DailyRevenue from "../Pages/DailyRevenue";
import MonthlyRevenue from "../Pages/MonthlyRevenue";
import Dashboard from "../Pages/Dashboard";
import Service from "../Pages/Service";
import AddCountryAddOperator from "../Pages/AddCountryAddOperator";
import PublisherTraffic from "../Pages/PublisherTraffic";
import PublisherSubscription from "../Pages/PublisherSubscription";
import DailyRevenueAdmin from "../Pages/DailyRevenueAdmin";
import MonthlyRevenueAdmin from "../Pages/MonthlyRevenueAdmin";
import Advertiser from "../Pages/Advertiser";
import AdvertiserTraffic from "../Pages/AdvertiserTraffic";
import AdvertiserSubscription from "../Pages/AdvertiserSubscription";
import DashboardAdmin from "../Pages/DashboardAdmin";
import ProjectsDetails from "../Pages/ProjectsDetails";
import LoginPage from "../NewPages/LoginPage";
import DailyRevenuePage from "../NewPages/DailyRevenuePage";
import MonthlyRevenuePage from "../NewPages/MonthlyRevenuePage";
import AddCountryAndOperatorPage from "../NewPages/AddCountryAndOperatorPage";
import PublisherTrafficPage from "../NewPages/PublisherTrafficPage";
import PublisherSubscriptionPage from "../NewPages/PublisherSubscriptionPage";
import DashboardPage from "../NewPages/DashboardPage";
import ServicePage from "../NewPages/ServicePage";
import AdvertiserPage from "../NewPages/AdvertiserPage";
import AdvertiserTrafficPage from "../NewPages/AdvertiserTrafficPage";
import AdvertiserSubscriptionPage from "../NewPages/AdvertiserSubscriptionPage";

const Routing=()=>{
    return(
        <>
                <Routes>
                    {/* <Route element={<Login/>} path="/" exact={true}></Route> */}
                    <Route element={<LoginPage />} path="/" exact={true}></Route>
                    {/* <Route element={<DailyRevenue/>} path="/dailyRevenue" exact={true}></Route> */}
                    <Route element={<DailyRevenuePage />} path="/dailyRevenue" exact={true}></Route>
                    {/* <Route element={<MonthlyRevenue/>} path="/monthlyRevenue" exact={true}></Route> */}
                    <Route element={<MonthlyRevenuePage />} path="/monthlyRevenue" exact={true}></Route>
                    {/* <Route element={<Dashboard />} path="/dashboard" exact={true}></Route> */}
                    <Route element={<DashboardPage />} path="/dashboard" exact={true}></Route>
                    {/* <Route element={<Service />} path="/dashboard/:serviceName/:id" exact={true}></Route> */}
                    <Route element={<ServicePage />} path="/dashboard/:serviceName/:id" exact={true}></Route>
                    {/* <Route element={<AddCountryAddOperator />} path="/add-country-and-add-operator" exact={true}></Route> */}
                    <Route element={<AddCountryAndOperatorPage />} path="/add-country-and-add-operator" exact={true}></Route>
                    {/* <Route element={<PublisherTraffic />} path="/publisher-traffic" exact={true}></Route> */}
                    <Route element={<PublisherTrafficPage />} path="/publisher-traffic" exact={true}></Route>
                    {/* <Route element={<PublisherSubscription />} path="/publisher-subscription" exact={true}></Route> */}
                    <Route element={<PublisherSubscriptionPage />} path="/publisher-subscription" exact={true}></Route>
                    <Route element={<DailyRevenueAdmin />} path="/dailyRevenueAdmin" exact={true} />
                    <Route element={<MonthlyRevenueAdmin />} path="/monthlyRevenueAdmin" exact={true} />
                    <Route element={<DashboardAdmin />} path="/dashboardAdmin" exact={true} />
                    {/* <Route element={<Advertiser />} path="/advertiser" exact={true} /> */}
                    <Route element={<AdvertiserPage />} path="/advertiser" exact={true} />
                    {/* <Route element={<AdvertiserTraffic />} path="/advertiser-traffic" exact={true} /> */}
                    <Route element={<AdvertiserTrafficPage />} path="/advertiser-traffic" exact={true} />
                    {/* <Route element={<AdvertiserSubscription />} path="/advertiser-subscription" exact={true} /> */}
                    <Route element={<AdvertiserSubscriptionPage />} path="/advertiser-subscription" exact={true} />
                    <Route element={<ProjectsDetails />} path="/projectsDetails" exact={true} />
                </Routes>
        </>
    );
}
export default Routing;