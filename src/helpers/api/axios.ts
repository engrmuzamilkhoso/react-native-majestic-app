// src/utils/api.ts
import axios from "axios";
import store from "@store/index"; // adjust path to your store

const BASE_URL = "http://showcase.majestic.com.pk/api/v1/";

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        // don’t attach token on login
        if (!config.url?.includes("login")) {
            const state = store.getState();
            const token = state.AppReducer.user?.token; // get token from redux
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
