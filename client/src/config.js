import axios from "axios";

// Create a new Axios instance with custom configuration
export const axiosInstance = axios.create({
  baseURL: 'https://nusconnect.onrender.com/',
  // You can add more configuration options here
});


