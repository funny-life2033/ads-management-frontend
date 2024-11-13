import axios from "axios";

const baseURL = "https://vinylbayads.com/api";
// const baseURL = "http://localhost:5000/api";
export const Axios = axios.create({ baseURL });
