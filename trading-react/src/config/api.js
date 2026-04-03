import axios from "axios";

export const baseUrl = "faithful-youth-production.up.railway.app";
const api=axios.create({
    baseURL: baseUrl,
    headers:{
        "Content-Type": "application/json",
    }
})

export default api;