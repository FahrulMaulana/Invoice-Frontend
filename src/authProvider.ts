import type { AuthProvider } from "@refinedev/core";
import axios from "axios";

export const TOKEN_KEY = "refine-auth";
export const USER_KEY = "refine-user";

// Define API base URL - adjust as needed
const API_URL = "/api"; // Update with your actual backend URL

// Fungsi untuk mendapatkan token dari localStorage
const getToken = () => localStorage.getItem(TOKEN_KEY);

// Membuat instance Axios yang akan digunakan di seluruh aplikasi
export const axiosInstance = axios.create();

// Setup axios interceptor to include JWT token in all requests
const setupAxiosInterceptors = () => {
  // Clear any existing interceptors
  axiosInstance.interceptors.request.eject(0);
  axios.interceptors.request.eject(0);
  
  // Add interceptor to the axios instance used throughout the app
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token && config.headers) {
        // Gunakan "authorization" lowercase sesuai dengan backend guard
        config.headers.authorization = `Bearer ${token}`;
        // Tambahkan token ke cookies juga sebagai fallback
        document.cookie = `token=${token}; path=/; SameSite=Strict`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  // Add interceptor to the global axios as well
  axios.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token && config.headers) {
        // Gunakan "authorization" lowercase sesuai dengan backend guard
        config.headers.authorization = `Bearer ${token}`;
        // Tambahkan token ke cookies juga sebagai fallback
        document.cookie = `token=${token}; path=/; SameSite=Strict`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  // Add response interceptors to handle auth errors
  const responseInterceptor = (error: any) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      window.location.href = "/login";
    }
    return Promise.reject(error);
  };
  
  axiosInstance.interceptors.response.use(
    (response) => response,
    responseInterceptor
  );
  
  axios.interceptors.response.use(
    (response) => response,
    responseInterceptor
  );
};

// Panggil setup interceptors saat aplikasi dimulai
setupAxiosInterceptors();

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    if (email && password) {
      try {
        const response = await axios.post(`${API_URL}/login`, {
          email,
          password,
        });

        const { token, id, name } = response.data;

        // Simpan token
        localStorage.setItem(TOKEN_KEY, token.token);
        localStorage.setItem(
          USER_KEY,
          JSON.stringify({
            id,
            name,
            role: token.role,
          })
        );
        
        // Juga simpan token di cookie
        document.cookie = `token=${token.token}; path=/; SameSite=Strict`;

        // Setup interceptors setelah login berhasil
        setupAxiosInterceptors();

        return {
          success: true,
          redirectTo: "/",
        };
      } catch (error) {
        const errorMessage =
          (error as any).response?.data?.message ||
          "Login failed. Please check your credentials.";

        return {
          success: false,
          error: {
            name: "LoginError",
            message: errorMessage,
          },
        };
      }
    }

    return {
      success: false,
      error: {
        name: "LoginError",
        message: "Email and password are required",
      },
    };
  },

  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // Hapus juga cookie token
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    const token = getToken();
    if (token) {
      // Setup interceptors untuk memastikan token terbaru digunakan
      setupAxiosInterceptors();
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },

  getPermissions: async () => {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.role;
    }
    return null;
  },

  getIdentity: async () => {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      const user = JSON.parse(userStr);
      return {
        id: user.id,
        name: user.name,
        role: user.role,
      };
    }
    return null;
  },

  onError: async (error) => {
    console.error(error);
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      // Hapus juga cookie token
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      return {
        logout: true,
        redirectTo: "/login",
        error,
      };
    }

    return { error };
  },
};
