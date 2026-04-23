import axios from "axios";

// setup axios config
const api = axios.create({
  baseURL: "http://localhost:3000", // specify server
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // include authentication data in requests
});

export default api;
