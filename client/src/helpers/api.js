import axios from "axios";
import socketIoClient from "socket.io-client";

export const socket = socketIoClient("https://test-report-server.herokuapp.com");

export const initApi = () => {
  axios.defaults.baseURL = "https://test-report-server.herokuapp.com/api";
};

export const get = (url, params) =>
  axios.get(url, { params }).then(res => res.data);
