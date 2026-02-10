import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  // baseURL: "https://servease-1-8pjj.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
