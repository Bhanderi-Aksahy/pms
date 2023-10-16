import React, { useState, useEffect } from "react";
import "../styles/App.css";
import { fetchRMSJobList } from "../services/api";

import { Link } from "react-router-dom";
import moment from "moment/moment";

function homeTesting({ isLoggedIn }) {
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    jobType: "",
    processType: "",
    status: "",
    propertyCode: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    setLoading(false);
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
    setLoading(true);
    fetchRMSJobList(
      filters?.startDate
        ? filters?.startDate
        : moment(firstDay).format("YYYY-MM-DD"),
      filters.endDate ? filters.endDate : moment(lastDay).format("YYYY-MM-DD")
    )
      .then((data) => {
        setTableData(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, [filters.startDate, filters.endDate]);
  

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setCurrentPage(1);
  };

  const filteredData = tableData.filter((row) => {
    const jobType = row.jobType || "";
    const processType = row.processType || "";
    const status = row.status || "";
    const propertyCode = row.propertyCode || "";

    return (
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

  return (
    <div className="Home">
      {isLoggedIn ? (
        <div>
          <h2>RMS JOBLIST</h2>
          {loading ? (
            <div className="loader">Loading...</div>
          ) : (
            <>
              <div className="filter-form">
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
                />
                <input
                  type="date"
                  name="endDate"
                  placeholder="End Date"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                />
              </div>
              <table className="PortalTable">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Property Code</th>
                    <th>Pulled Date</th>
                    <th>Error Note</th>
                    <th>PMS</th>
                    <th>Process Type</th>
                    <th>Job Type</th>
                    <th>Client ID</th>
                    <th>Log File</th>
                    <th>Status</th>
                    <th>View</th>
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
                        <tr key={index}>
                          <td>{row.id}</td>
                          <td>{row.propertyCode}</td>
                          <td>{row.pulledDate}</td>
                          <td>{row.errorNote}</td>
                          <td>{row.pms}</td>
                          <td>{row.processType}</td>
                          <td>{row.jobType}</td>
                          <td>{row.clientId}</td>
                          <td>
                            <a
                              href={row.logFile}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Log
                            </a>
                          </td>
                          <td>{row.status}</td>
                          <td>
                            <Link to={`/job/${row.id}`}>View</Link>
                          </td>
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

export default homeTesting;

const filterOptions = {
  jobTypes: ["PMS_REPORT", "RATE_SHOP", "EVENT"],
  processTypes: ["PULL_REPORT", "REPORT_TO_UNI", "CREATE_WIDGET"],
  statuses: ["SUCCESS", "INPROCESS", "FAILED"],
};
