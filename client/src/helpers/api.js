import axios from "axios";

export const initApi = () => {
  axios.defaults.baseURL = "http://localhost:5000/api";
};

export const get = (url, params) =>
  axios.get(url, { params }).then(res => res.data);
