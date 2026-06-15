// src/api/authApi.js
import axiosClient from "./axiosClient";

const authApi = {
  register: ({ username, email, password, exam_type }) =>
    axiosClient.post("/auth/register/", { username, email, password, exam_type })
      .then((res) => res.data),

  login: ({ username, password }) =>
    axiosClient.post("/auth/login/", { username, password })
      .then((res) => res.data),

  profile: () =>
    axiosClient.get("/auth/profile/")
      .then((res) => res.data),
};

export default authApi;
