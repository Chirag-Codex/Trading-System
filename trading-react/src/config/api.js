import axios from "axios";

export const baseUrl = "http://localhost:5454";

const api=axios.create({
    baseURL: baseUrl,
    headers:{
        "Content-Type": "application/json",
    }
})

export default api;