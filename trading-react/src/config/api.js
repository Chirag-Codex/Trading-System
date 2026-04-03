import axios from "axios";

export const baseUrl = "faithful-youth-production.up.railway.app";
ex

const api=axios.create({
    baseURL: baseUrl,
    headers:{
        "Content-Type": "application/json",
    }
})

export default api;