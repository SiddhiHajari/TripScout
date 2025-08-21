import axios from "axios"

//stores the url running at backend 
const BASE_URL = "http://localhost:3000/api"

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

export default axiosInstance
