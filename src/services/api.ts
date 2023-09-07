import { useAppStore } from "@/store/app";
import axios, { AxiosRequestConfig } from "axios";

function authHeader() {
  // return auth header with jwt if user is logged in and request is to the api url
  const appStore = useAppStore();
  if (appStore.isAuthenticated) {
      return { Authorization: `Bearer ${appStore.token}` };
  } else {
      return {};
  }
}

export default ({ requiresAuth } = { requiresAuth: false }) => {
  const options: AxiosRequestConfig = {};

  if (requiresAuth) {
    if(!options.headers){ options.headers = {} }
    options.headers = authHeader();
  }

  options.baseURL = process.env.API_URL;

  const instance = axios.create(options);

  instance.interceptors.response.use(function (response) {
    return response.data || Promise.reject();
  }, function (error) {
    return Promise.reject(error?.response?.data);
  });

  return instance;
};
