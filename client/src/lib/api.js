const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper for making authenticated requests with retry logic
const request = async (endpoint, options = {}, retries = 3, backoff = 500) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
    credentials: "include", // Required for cookies
  };

  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    // Handle 401 Unauthorized globally - try to refresh token
    if (response.status === 401 && endpoint !== "/auth/refresh") {
      try {
        const refreshData = await authApi.refresh();
        localStorage.setItem("token", refreshData.token);
        // Retry the original request with new token
        return request(endpoint, options, retries, backoff);
      } catch (refreshError) {
        window.dispatchEvent(new Event("auth:unauthorized"));
        throw new Error("Session expired. Please login again.");
      }
    }

    if (response.status === 204) return null;

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    if (retries > 0 && !error.message.includes("Session expired")) {
      await new Promise((resolve) => setTimeout(resolve, backoff));
      return request(endpoint, options, retries - 1, backoff * 2);
    }
    throw error;
  }
};

// Auth API
export const authApi = {
  login: (credentials) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  refresh: () =>
    request("/auth/refresh", {
      method: "POST",
    }),

  logout: () =>
    request("/auth/logout", {
      method: "POST",
    }),

  getProfile: () => request("/auth/profile"),

  syncCart: (cart) =>
    request("/auth/sync-cart", {
      method: "POST",
      body: JSON.stringify({ cart }),
    }),

  updateProfile: (data) =>
    request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  updatePassword: (data) =>
    request("/auth/password", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// Books API
export const booksApi = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return request(`/books?${params}`);
  },

  getById: (id) => request(`/books/${id}`),

  create: (bookData) =>
    request("/books", {
      method: "POST",
      body: JSON.stringify(bookData),
    }),

  update: (id, bookData) =>
    request(`/books/${id}`, {
      method: "PUT",
      body: JSON.stringify(bookData),
    }),

  delete: (id) =>
    request(`/books/${id}`, {
      method: "DELETE",
    }),

  bulkDelete: (ids) =>
    request("/books/bulk-delete", {
      method: "POST",
      body: JSON.stringify({ ids }),
    }),
};

// Orders API
export const ordersApi = {
  getAll: () => request("/orders"),

  getMyOrders: () => request("/orders/my-orders"),

  create: (orderData) =>
    request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    }),

  updateStatus: (id, status) =>
    request(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};

// Upload API
export const uploadApi = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    return request("/upload", {
      method: "POST",
      body: formData,
    });
  },
};
