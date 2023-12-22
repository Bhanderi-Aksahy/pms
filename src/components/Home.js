import React, { useState, useEffect } from "react";
import { GlobalLoading, showLoading } from 'react-global-loading';
import "../styles/App.css";
import { fetchRMSJobList } from "../services/api";
import moment from "moment/moment";
import AWS from "aws-sdk";
import LogViewModal from "./LogViewModal";

function Home({ isLoggedIn }) {
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [logData, setLogData] = useState("");
  const [itemData, setItemData] = useState(null);
  const itemsPerPage = 20;
  const [loading, setLoading] = useState(true);
  const currentDate = moment(new Date()).format("YYYY-MM-DD");
  const [filters, setFilters] = useState({
    pms: "",
    jobType: "",
    processType: "",
    status: "",
    propertyCode: "",
    startDate: moment(new Date()).format("YYYY-MM-DD"),
    endDate: moment(new Date()).format("YYYY-MM-DD"),
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = async (item_details) => {
    // job_id = '2364'
    setLogData("");
    setItemData(null);
    showLoading(true);
    await fetchLogFile(item_details);
    showLoading(false);
    setModalIsOpen(true);
  };
  const closeModal = () => setModalIsOpen(false);

  const fetchLogFile = async (item_details) => {

    // job_id = '2371'
    var job_id = item_details.id;
    try {

      const s3 = new AWS.S3({
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
        region: process.env.REACT_APP_AWS_REGION
      });

      const params = {
        Bucket: process.env.REACT_APP_AWS_BUCKET,
        Key: job_id+".log"
      };

      const { Body } = await s3.getObject(params).promise();
      setLogData(Body.toString("utf-8"));
      setItemData(item_details);
    } catch (error) {
      console.error("Error fetching log file:", error);
      setLogData("Data not found!!!");
    }
  };

  useEffect(() => {
    //Pass end date as start date
    if (filters?.startDate != null) {
      setLoading(true);
      
      fetchRMSJobList(filters?.startDate, filters?.startDate)
        .then((data) => {
          setTableData(data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoading(false);
        });
    }
  }, [filters.startDate, filters.endDate]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setCurrentPage(1);
  };

  const filteredData = tableData.filter((row) => {
    const pms = row.pms || "";
    const jobType = row.jobType || "";
    const processType = row.processType || "";
    const status = row.status || "";
    const propertyCode = row.propertyCode || "";

    return (
      (filters.pms === "" || pms === filters.pms) &&
      (filters.jobType === "" || jobType === filters.jobType) &&
      (filters.processType === "" || processType === filters.processType) &&
      (filters.status === "" || status === filters.status) &&
      (filters.propertyCode === "" ||
        propertyCode.includes(filters.propertyCode))
    );
  });

  const maxPage = Math.ceil(filteredData.length / itemsPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < maxPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getStatusColor = (status) => {
    status = status.trim();
    switch (status) {
      case "SUCCESS":
        return "#54A051";
      case "FAILED":
        return "#DC4F41";
      case "INPROCESS":
        return "#F8BE34";
      default:
        return "#FFFFFF";
    }
  };

  const getDuration = (start, end) => {
    var startTime = moment(start, "DD-MM-YYYY hh:mm:ss");
    var endTime = moment(end, "DD-MM-YYYY hh:mm:ss");
    var hoursDiff = endTime.diff(startTime, "hours");
    var minutesDiff = endTime.diff(startTime, "minutes");
    var secondsDiff = endTime.diff(startTime, "seconds");
    return `${hoursDiff}h ${minutesDiff}m ${secondsDiff}s`;
  };

  return (
    <div className="Home">
      {/* <CustomModal isOpen={modalIsOpen} onRequestClose={closeModal} logContent={logData} /> */}
      <GlobalLoading />
      <LogViewModal
        show={modalIsOpen}
        onHide={closeModal}
        logContent={logData}
        itemData={itemData}
      />

      {isLoggedIn ? (
        <div>
          <div className="filter-form">

          <select
              name="pms"
              value={filters.pms}
              onChange={handleFilterChange}
            >
              <option value="">Select PMS</option>
              {filterOptions.pms_list.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              name="jobType"
              value={filters.jobType}
              onChange={handleFilterChange}
            >
              <option value="">Select Job Type</option>
              {filterOptions.jobTypes.map((jobType) => (
                <option key={jobType} value={jobType}>
                  {jobType}
                </option>
              ))}
            </select>

            <select
              name="processType"
              value={filters.processType}
              onChange={handleFilterChange}
            >
              <option value="">Select Process Type</option>
              {filterOptions.processTypes.map((processType) => (
                <option key={processType} value={processType}>
                  {processType}
                </option>
              ))}
            </select>

            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">Select Status</option>
              {filterOptions.statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="propertyCode"
              placeholder="Search Property Code"
              value={filters.propertyCode}
              onChange={handleFilterChange}
            />

            <input
              type="date"
              name="startDate"
              placeholder="Start Date"
              value={filters.startDate}
              onChange={handleFilterChange}
              max={currentDate}
            />
            {/* <input
              type="date"
              name="endDate"
              placeholder="End Date"
              value={filters.endDate}
              onChange={handleFilterChange}
              min={filters?.startDate}
              max={currentDate}
            /> */}
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              <table className="PortalTable">
                <thead>
                  <tr>
                    <th style={{ width: "5%" }}>ID</th>
                    <th style={{ width: "6%" }}>Prop Code</th>
                    <th style={{ width: "6%" }}>Pulled Date</th>
                    <th style={{ width: "8%" }}>Job Type</th>
                    <th style={{ width: "10%" }}>Process Type</th>
                    <th style={{ width: "8%" }}>PMS</th>
                    <th style={{ width: "10%" }}>Created At</th>
                    <th style={{ width: "10%" }}>Updated At</th>
                    <th style={{ width: "8%" }}>Duration</th>
                    <th style={{ width: "6%" }}>Status</th>
                    <th style={{ width: "5%" }}>Log View</th>
                    <th>Error Note</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length !== 0 &&
                    filteredData
                      .slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      )
                      .map((row, index) => (
                        <tr key={index} className="myRow">
                          <td>{row.id}</td>
                          <td>{row.propertyCode}</td>
                          <td>{row.pulledDate}</td>
                          <td>{row.jobType}</td>
                          <td>{row.processType}</td>
                          <td>{row.pms}</td>
                          <td>
                            {moment(row.createdAt).format("YYYY-MM-DD HH:mm A")}
                          </td>
                          <td>
                            {moment(row.updatedAt).format("YYYY-MM-DD HH:mm A")}
                          </td>
                          <td>{getDuration(row.createdAt, row.updatedAt)}</td>
                          <td
                            style={{
                              backgroundColor: getStatusColor(row.status),
                            }}
                          >
                            {row.status}
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <div onClick={()=>{openModal(row)}}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                data-ember-extension="1"
                              >
                                <path
                                  d="M9.99967 11.6667C10.9201 11.6667 11.6663 10.9205 11.6663 10C11.6663 9.07952 10.9201 8.33333 9.99967 8.33333C9.0792 8.33333 8.33301 9.07952 8.33301 10C8.33301 10.9205 9.0792 11.6667 9.99967 11.6667Z"
                                  stroke="#202842"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M18.3337 10C16.1112 13.8892 13.3337 15.8333 10.0003 15.8333C6.66699 15.8333 3.88949 13.8892 1.66699 10C3.88949 6.11083 6.66699 4.16666 10.0003 4.16666C13.3337 4.16666 16.1112 6.11083 18.3337 10Z"
                                  stroke="#202842"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <defs>
                                  <clipPath id="clip0_13_375">
                                    <rect width="20" height="20" fill="white" />
                                  </clipPath>
                                </defs>
                              </svg>
                            </div>
                          </td>
                          <td>{row.errorNote}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
              <div className="pagination">
                <button className="page-link" onClick={goToPreviousPage}>
                  Previous
                </button>
                <button className="page-link" onClick={goToNextPage}>
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <h2>Please log in to access the Home Page.</h2>
      )}
    </div>
  );
}

export default Home;

const filterOptions = {
  jobTypes: ["PMS_REPORT", "RATE_SHOP", "EVENT", "STAR_REPORT"],
  processTypes: [
    "PULL_REPORT",
    "REPORT_TO_UNI_RES",
    "REPORT_TO_UNI_OCC",
    "CREATE_WIDGET",
  ],
  statuses: ["SUCCESS", "INPROCESS", "FAILED"],
  pms_list: ["Choice", "OperaCloud","RedRoof"],
};
