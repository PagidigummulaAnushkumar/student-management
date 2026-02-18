import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8080/api", // Matches your Spring Boot RequestMapping
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
