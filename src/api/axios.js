import axios from "axios";

const api = axios.create({
  baseURL: "https://productbox.runasp.net/api",
});

export default api;
