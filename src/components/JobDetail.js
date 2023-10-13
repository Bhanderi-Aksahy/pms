import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchRMSJobDetails } from "../services/api";

function JobDetail() {
  const { id } = useParams();
  const [jobDetails, setJobDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDate = async () => {
    setLoading(true);
    let data = await fetchRMSJobDetails(id);
    debugger;
    console.log(data);
    setLoading(false);
    if (data.length !== 0 && data !== undefined && data !== null) {
      if (data.data !== undefined && data.data !== null) {
        setJobDetails(data.data);
      } else {
        alert(data.message);
      }
    } else {
      alert(data);
    }
    //   .then((data) => {
    //     setJobDetails(data.data);
    //
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //     setLoading(false);
    //   });
  };

  useEffect(() => {
    getDate();
  }, [id]);

  return (
    <div className="JobDetail">
      <h2>Job Details</h2>
      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              {jobDetails[0] !== undefined &&
                jobDetails[0] !== null &&
                jobDetails[0] &&
                Object.keys(jobDetails[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {jobDetails[0] !== undefined &&
              jobDetails[0] !== null &&
              jobDetails[0] ?
              jobDetails.map((job, index) => (
                <tr key={index}>
                  {Object.keys(job).map((key) => (
                    <td key={key}>{job[key]}</td>
                  ))}
                </tr>
              ))
            : "Data not found"
            }
          </tbody>
        </table>
      )}
    </div>
  );
}

export default JobDetail;
