import axios from "axios";

const api = axios.create({
  baseURL: process.env.API_URL
});

api.interceptors.response.use(function (response) {
  return response.data || Promise.reject();
}, function (error) {
  return Promise.reject(error?.response?.data);
});

export default api;
