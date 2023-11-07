import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_APIBASEPATH, 
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  proxy: {
    protocol: "http",
    host: process.env.REACT_APP_APIBASEPATH, 
    port: 8080
  }
});

export const fetchRMSJobList = async (startDate, endDate) => {
  try {
    const response = await axiosInstance.post('/widget/rms_job_list', {
      startDate,
      endDate,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};



export const fetchRMSJobDetails = async (id) => {
  try {
    const response = await axiosInstance.post('/widget/rms_job_list_count', {
      pullId : id
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};