import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRMSJobDetails } from '../services/api';
import { TableRestaurantOutlined } from '@mui/icons-material';



function testing() {
    const { id } = useParams();
    const [jobDetails, setJobDetails] = useState({});
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
      setLoading(true);
      fetchRMSJobDetails(id)
        .then((data) => {
          setJobDetails(data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error:', error);
          setLoading(false);
        });
    }, [id]);


    // useEffect(() => {
    //     // Prevent page refresh
    //     const handleBeforeUnload = (e) => {
    //       e.preventDefault();
    //       e.returnValue = '';
    //     };
    
    //     window.addEventListener('beforeunload', handleBeforeUnload);
    
    //     return () => {
    //       // Remove the event listener when the component unmounts
    //       window.removeEventListener('beforeunload', handleBeforeUnload);
    //     };
    //   }, []);



    return (
      <div className="JobDetail">
        <h2>Job Details</h2>
        {loading ? (
          <div className="loader">Loading...</div>
        ) : (
          <table>
            <tbody>
              <tr>
                <td>Pulled ID</td>
                <td>{id}</td>
              </tr>
              <tr>
                <td>Pulled Date</td>
                <td>{jobDetails?.[0]?.pulledDate}</td>
              </tr>
            
              <tr>
                <td>Choice Cancellation Count</td>
                <td>{jobDetails?.[0]?.choice_cancellation_count}</td>
              </tr>
              <tr>
                <td>Choice Occ Count</td>
                <td>{jobDetails?.[0]?.choice_occ_count}</td>
              </tr>
              <tr>
                <td>Choice Revenue Count</td>
                <td>{jobDetails?.[0]?.choice_revenue_count}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    );
  }
  

  export default testing;
