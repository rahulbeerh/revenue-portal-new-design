import React, { useContext, useEffect, useState } from "react";
import Header from "../Components/Header";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../Components/Loader";
import MobileNavbar from "../Components/MobileNavbar";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import SidebarAdmin from "../Components/SidebarAdmin";
import "../CSS/styleForDataProjectDetails.css";
import classes from "./ProjectsDetails.module.css";
import { ProjectDetailsContext } from "../ProjectDetailsContext";
import ProjectDetailsFormModal from "../Components/ProjectDetailsFormModal";
import EditProjectDetailsFormModal from "../Components/EditProjectDetailsFormModal";
import { EditProjectDetailsContext } from "../EditProjectDetailsContext";
import axios from "axios";
import {
  deleteProjectByAdminApi,
  fetchProjectDetailsByAdminApi,
} from "../Data/Api";
import { useNavigate } from "react-router-dom";

const ProjectsDetails = () => {
  const { openProjectDetailsModalHandler } = useContext(ProjectDetailsContext);
  const { openEditHandler } = useContext(EditProjectDetailsContext);
  const [loader, setLoader] = useState("block");
  const [data, setData] = useState([]);
  const navigate=useNavigate();

  useEffect(()=>{
    const admin=localStorage.getItem("userName")=="admin";
    if(!admin){
        navigate("/");
    }
  },[])

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  const fetchDataFromBackend = async () => {
    try {
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      const response = await axios.post(
        fetchProjectDetailsByAdminApi,
        {},
        {
          headers: headers,
        }
      );
      console.log(response);
      setData(response?.data?.result);
      setLoader("none");
    } catch (error) {
      toast.error(
        error?.data?.message || error?.response?.data?.message || error?.message
      );
      setLoader("none");
    }
  };

  useEffect(() => {
    fetchDataFromBackend();
  }, []);

  const columns = [
    {
      field: "projectName",
      sortable: false,
      minWidth: 150,
      headerName: "Project Name",
    },
    {
      field: "server",
      sortable: false,
      minWidth: 150,
      headerName: "Server",
    },
    {
      field: "IpLink",
      sortable: false,
      minWidth: 200,
      headerName: "IP Link",
    },
    {
      field: "domain",
      sortable: false,
      minWidth: 200,
      headerName: "Domain Url",
    },
    {
      field: "location",
      sortable: false,
      minWidth: 150,
      headerName: "Directory",
    },
    {
      field: "technologyUsed",
      minWidth: 150,
      headerName: "Technology Used",
    },
    {
      field: "developerName",
      sortable: false,
      minWidth: 150,
      headerName: "Developer",
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      minWidth: 150,
      renderCell: (params) => (
        <>
          <button
            type="button"
            className={classes.btn_edit}
            onClick={() => openEditHandler(params?.row?.id, data)}
          >
            Edit
          </button>
          <button
            type="button"
            className={classes.btn_delete}
            onClick={() =>
              handleDelete({
                id: params?.row?.id,
                name: params?.row?.projectName,
              })
            }
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  const handleDelete = async ({ id, name }) => {
    if (window.confirm(`Are you sure you want to delete Project: ${name}`)) {
      let token = localStorage.getItem("userToken");
      let headers = { Authorization: "Bearer " + token };
      try {
        await axios.post(`${deleteProjectByAdminApi}?id=${id}`, "", {
          headers: headers,
        });

        toast.success("Project deleted successfully");
        fetchDataFromBackend();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const openModalHandler = () => {
    openProjectDetailsModalHandler();
  };

  return (
    <>
      <Loader value={loader} />
      <ToastContainer />
      <Header service="Project Details" />
      <MobileNavbar service="Project Details" />
      <SidebarAdmin highlight={4} />
      <div id="firstTab" className="tabcontent">
        <div className="subscribers-sec">
          <div className="subscribers-home-l">
            <span className="navigation-links">Home</span>
            <span>/</span>
            <span className="navigation-links">Revenue</span>
          </div>
        </div>

        <div className="date-form">
          <div className="title-ic">
            <p>
              <span>
                <i className="fa fa-user" aria-hidden="true"></i>
              </span>{" "}
              <span>Project Details</span>
            </p>
          </div>

          <div className="main-box">
            <button
              type="button"
              onClick={openModalHandler}
              className={classes.btn_project_details}
            >
              Add Project Details
            </button>
            <div style={{ height: 600, width: "100%" }}>
              <DataGrid
                rows={[...data]}
                columns={columns}
                slots={{
                  toolbar: CustomToolbar,
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <ProjectDetailsFormModal fetchDataFromBackend={fetchDataFromBackend} />
      <EditProjectDetailsFormModal
        fetchDataFromBackend={fetchDataFromBackend}
      />
    </>
  );
};

export default ProjectsDetails;
