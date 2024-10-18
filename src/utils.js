import axios from "axios";

const baseURL = "http://192.168.144.16:5000";
export const Axios = axios.create({ baseURL });
