import axios from "axios";

const api = axios.create({
  baseURL: "https://shopora-uefe.onrender.com/api",
});

export default api;