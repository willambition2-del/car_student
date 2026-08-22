const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  error?: {
    code: number;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string | null;
}

export interface AuthResponse {
  user: UserProfile;
  school?: {
    id: string;
    nameAr: string;
    slug: string;
    status: string;
  } | null;
  subscription?: {
    planName: string;
    status: string;
    endDate: string;
  } | null;
  permissions: string[];
  features: string[];
  accessToken: string;
  refreshToken: string;
}

export class ApiError extends Error {
  code: number;
  details?: any;

  constructor(message: string, code: number = 500, details?: any) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.details = details;
  }
}

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("platform_access_token");
};

export const setTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("platform_access_token", accessToken);
  localStorage.setItem("platform_refresh_token", refreshToken);
  document.cookie = `token=${accessToken}; path=/`;
};

export const clearTokens = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("platform_access_token");
  localStorage.removeItem("platform_refresh_token");
  localStorage.removeItem("platform_user");
  document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const getStoredUser = (): UserProfile | null => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("platform_user");
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const setStoredUser = (user: UserProfile) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("platform_user", JSON.stringify(user));
};

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
  canRetry = true,
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json: ApiResponse<T> = await response.json();

  if (
    response.status === 401 &&
    canRetry &&
    endpoint !== "/auth/refresh" &&
    typeof window !== "undefined"
  ) {
    const refreshToken = localStorage.getItem("platform_refresh_token");
    if (refreshToken) {
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      const refreshJson: ApiResponse<AuthResponse> =
        await refreshResponse.json();
      if (refreshResponse.ok && refreshJson.success) {
        setTokens(refreshJson.data.accessToken, refreshJson.data.refreshToken);
        return apiRequest<T>(endpoint, options, false);
      }
    }
    clearTokens();
  }

  if (!response.ok || !json.success) {
    const errorMsg =
      json.error?.message ||
      response.statusText ||
      "حدث خطأ في الاتصال بالخادم";
    throw new ApiError(
      errorMsg,
      json.error?.code || response.status,
      json.error?.details,
    );
  }

  return json.data;
}

export const authApi = {
  login: async (
    email: string,
    password: string,
    deviceInfo: string = "Platform Web Admin",
  ) => {
    const data = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, deviceInfo }),
    });
    setTokens(data.accessToken, data.refreshToken);
    setStoredUser(data.user);
    return data;
  },

  forgotPassword: async (email: string) => {
    return apiRequest<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  verifyOtp: async (email: string, otp: string) => {
    return apiRequest<{ message: string }>("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  },

  resetPassword: async (email: string, otp: string, newPassword: string) => {
    return apiRequest<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, otp, newPassword }),
    });
  },

  getMe: async () => {
    return apiRequest<UserProfile>("/auth/me");
  },

  logout: async () => {
    const refreshToken =
      typeof window === "undefined"
        ? null
        : localStorage.getItem("platform_refresh_token");
    try {
      if (refreshToken) {
        await apiRequest("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch {
      // Ignore logout errors
    } finally {
      clearTokens();
    }
  },
};

export const platformOverviewApi = {
  getOverview: async () => apiRequest("/platform/overview"),
  getStats: async () => apiRequest("/platform/statistics"),
};

export const platformSchoolsApi = {
  getSchools: async (page = 1, limit = 20, search = "", status = "") => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      status,
    }).toString();
    return apiRequest<{ items: any[]; total: number }>(
      `/platform/schools?${query}`,
    );
  },
  getSchool: async (id: string) => apiRequest(`/platform/schools/${id}`),
  createSchool: async (data: any) =>
    apiRequest("/platform/schools", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateSchool: async (id: string, data: any) =>
    apiRequest(`/platform/schools/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  suspendSchool: async (id: string, reason: string) =>
    apiRequest(`/platform/schools/${id}/suspend`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
  activateSchool: async (id: string) =>
    apiRequest(`/platform/schools/${id}/activate`, { method: "POST" }),
  supportSession: async (id: string) =>
    apiRequest(`/platform/schools/${id}/support-session`, { method: "POST" }),
};

export const platformPlansApi = {
  getPlans: async () => apiRequest("/platform/plans"),
  getPlan: async (id: string) => apiRequest(`/platform/plans/${id}`),
  createPlan: async (data: any) =>
    apiRequest("/platform/plans", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updatePlan: async (id: string, data: any) =>
    apiRequest(`/platform/plans/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

export const platformSubscriptionsApi = {
  getSubscriptions: async (page = 1, limit = 20, search = "") => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
    }).toString();
    return apiRequest<{ items: any[]; total: number }>(
      `/platform/subscriptions?${query}`,
    );
  },
  getSubscription: async (id: string) =>
    apiRequest(`/platform/subscriptions/${id}`),
  renew: async (id: string) =>
    apiRequest(`/platform/subscriptions/${id}/renew`, { method: "POST" }),
  changePlan: async (id: string, planId: string) =>
    apiRequest(`/platform/subscriptions/${id}/change-plan`, {
      method: "POST",
      body: JSON.stringify({ planId }),
    }),
  suspend: async (id: string) =>
    apiRequest(`/platform/subscriptions/${id}/suspend`, { method: "POST" }),
};

export const platformInvoicesApi = {
  getInvoices: async (page = 1, limit = 20, search = "") => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
    }).toString();
    return apiRequest<{ items: any[]; total: number }>(
      `/platform/invoices?${query}`,
    );
  },
  getInvoice: async (id: string) => apiRequest(`/platform/invoices/${id}`),
  createInvoice: async (data: any) =>
    apiRequest("/platform/invoices", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  recordPayment: async (id: string, data: any) =>
    apiRequest(`/platform/invoices/${id}/payments`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const platformFeaturesApi = {
  getFeatures: async () => apiRequest("/platform/features"),
  createFeature: async (data: any) =>
    apiRequest("/platform/features", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateFeature: async (id: string, data: any) =>
    apiRequest(`/platform/features/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  getSchoolFeatures: async (schoolId: string) =>
    apiRequest(`/platform/schools/${schoolId}/features`),
  updateSchoolFeatures: async (schoolId: string, features: any[]) =>
    apiRequest(`/platform/schools/${schoolId}/features`, {
      method: "PUT",
      body: JSON.stringify({ features }),
    }),
};

export const platformUsersApi = {
  getUsers: async (page = 1, limit = 20, search = "") => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
    }).toString();
    return apiRequest<{ items: UserProfile[]; total: number }>(
      `/platform/users?${query}`,
    );
  },
  createUser: async (userData: {
    email: string;
    password: string;
    fullName: string;
    role: string;
    phone?: string;
  }) => {
    return apiRequest<UserProfile>("/platform/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },
  getRoles: async () =>
    apiRequest<
      Array<{
        key: string;
        nameAr: string;
        description: string;
        permissions: string[];
      }>
    >("/platform/roles"),
};

export const platformSupportApi = {
  getTickets: async (page = 1, limit = 20, status = "") => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status,
    }).toString();
    return apiRequest<{ items: any[]; total: number }>(
      `/platform/support/tickets?${query}`,
    );
  },
  getTicket: async (id: string) => apiRequest(`/platform/support/tickets/${id}`),
  replyTicket: async (id: string, content: string) =>
    apiRequest(`/platform/support/tickets/${id}/messages`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
};

export const platformAuditApi = {
  getLogs: async (page = 1, limit = 20, search = "") => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
    }).toString();
    return apiRequest<{ items: any[]; total: number }>(
      `/platform/audit/logs?${query}`,
    );
  },
  getLog: async (id: string) => apiRequest(`/platform/audit/logs/${id}`),
};

export const platformHealthApi = {
  getHealth: async () => apiRequest("/health"),
  getDbHealth: async () => apiRequest("/health/db"),
  getSystemHealth: async () => apiRequest("/platform/health"),
};
