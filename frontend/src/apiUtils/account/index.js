import { anonAxiosInstance } from "../api";

class AccountApis {
  async login(data) {
    return new Promise(async (resolve, reject) => {
      anonAxiosInstance
        .post("auth/token/", data) // Adjusted to match Django endpoint
        .then((response) => {
          localStorage.setItem("accessToken", response?.data?.access);
          localStorage.setItem("refreshToken", response?.data?.refresh);
          resolve(response?.data);
        })
        .catch((e) => {
          reject(e.message);
        });
    });
  }

  async register(data) {
    return new Promise(async (resolve, reject) => {
      anonAxiosInstance
        .post("auth/register/", data)
        .then((response) => {
          resolve(response?.data);
        })
        .catch((e) => {
          reject(e.response?.data || e.message);
        });
    });
  }

  async refreshToken(data) {
    return new Promise(async (resolve, reject) => {
      anonAxiosInstance
        .post("auth/token/refresh/", data)
        .then((response) => {
          localStorage.setItem("accessToken", response?.data?.access);
          localStorage.setItem("refreshToken", response?.data?.refresh);
          resolve(response?.data);
        })
        .catch((e) => {
          reject(e.message);
        });
    });
  }

  async logout() {
    console.log("Logout function called"); // Debugging log

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      console.warn("No refresh token found, clearing session.");
      this.clearSession();
      return;
    }

    try {
      await anonAxiosInstance.post("auth/logout/", { refresh: refreshToken });
      console.log("Successfully logged out from backend.");
    } catch (error) {
      console.error("Logout request failed:", error);
    }

    this.clearSession(); // Clear tokens & redirect
  }

  clearSession() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/";
  }
}

const accountApis = new AccountApis();
export default accountApis;
