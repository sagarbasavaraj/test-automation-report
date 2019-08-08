import axios from "axios";
import socketIoClient from "socket.io-client";

export const socket = socketIoClient("http://192.168.2.101:5000");

export const initApi = () => {
  axios.defaults.baseURL = "http://localhost:5000/api";
};

export const get = (url, params) =>
  axios.get(url, { params }).then(res => res.data);
