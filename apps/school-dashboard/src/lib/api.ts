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

export interface SchoolInfo {
  id: string;
  nameAr: string;
  slug: string;
  status: string;
}

export interface SubscriptionInfo {
  planName: string;
  status: string;
  endDate: string;
}

export interface AuthResponse {
  user: UserProfile;
  school?: SchoolInfo | null;
  subscription?: SubscriptionInfo | null;
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
  return localStorage.getItem("school_access_token");
};

export const setTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("school_access_token", accessToken);
  localStorage.setItem("school_refresh_token", refreshToken);
  document.cookie = `token=${accessToken}; path=/`;
};

export const clearTokens = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("school_access_token");
  localStorage.removeItem("school_refresh_token");
  localStorage.removeItem("school_user");
  localStorage.removeItem("school_info");
  document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const getStoredUser = (): UserProfile | null => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("school_user");
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const setStoredUser = (user: UserProfile) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("school_user", JSON.stringify(user));
};

export const setStoredSchool = (school: SchoolInfo) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("school_info", JSON.stringify(school));
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
    const refreshToken = localStorage.getItem("school_refresh_token");
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
    deviceInfo: string = "School Dashboard Web",
  ) => {
    const data = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, deviceInfo }),
    });
    setTokens(data.accessToken, data.refreshToken);
    setStoredUser(data.user);
    if (data.school) {
      setStoredSchool(data.school);
    }
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
        : localStorage.getItem("school_refresh_token");
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

export const schoolUsersApi = {
  getUsers: async (page = 1, limit = 20, search = "", role = "") => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      role,
    }).toString();
    return apiRequest<{ items: UserProfile[]; total: number }>(
      `/school/users?${query}`,
    );
  },

  createUser: async (userData: {
    email: string;
    password: string;
    fullName: string;
    role: string;
    phone?: string;
  }) => {
    return apiRequest<UserProfile>("/school/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  getRoles: async () => {
    return apiRequest<
      Array<{
        key: string;
        nameAr: string;
        description: string;
        permissions: string[];
      }>
    >("/school/roles");
  },
};

export const schoolSettingsApi = {
  getSettings: async () => {
    return apiRequest<{ schoolInfo: any; settings: Record<string, string> }>(
      "/school/settings",
    );
  },

  updateSettings: async (settings: Record<string, string>) => {
    return apiRequest<{ message: string }>("/school/settings", {
      method: "PATCH",
      body: JSON.stringify(settings),
    });
  },

  getEnabledFeatures: async () => {
    return apiRequest<
      Array<{ key: string; nameAr: string; isEnabled: boolean }>
    >("/school/settings/features");
  },
};

export const schoolStudentsApi = {
  getStudents: async (page = 1, limit = 20, search = "", grade = "") => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      grade,
    }).toString();
    return apiRequest<{ items: any[]; total: number }>(
      `/school/students?${query}`,
    );
  },
  getStudent: async (id: string) => apiRequest(`/school/students/${id}`),
  createStudent: async (data: any) =>
    apiRequest("/school/students", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateStudent: async (id: string, data: any) =>
    apiRequest(`/school/students/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteStudent: async (id: string) =>
    apiRequest(`/school/students/${id}`, { method: "DELETE" }),
};

export const schoolGuardiansApi = {
  getGuardians: async (page = 1, limit = 20, search = "") => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
    }).toString();
    return apiRequest<{ items: any[]; total: number }>(
      `/school/guardians?${query}`,
    );
  },
  getGuardian: async (id: string) => apiRequest(`/school/guardians/${id}`),
  createGuardian: async (data: any) =>
    apiRequest("/school/guardians", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateGuardian: async (id: string, data: any) =>
    apiRequest(`/school/guardians/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

export const schoolAddressRequestsApi = {
  getRequests: async (page = 1, limit = 20, status = "") => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status,
    }).toString();
    return apiRequest<{ items: any[]; total: number }>(
      `/school/address-requests?${query}`,
    );
  },
  getRequest: async (id: string) =>
    apiRequest(`/school/address-requests/${id}`),
  createRequest: async (data: any) =>
    apiRequest("/school/address-requests", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  approveRequest: async (id: string, notes?: string) =>
    apiRequest(`/school/address-requests/${id}/approve`, {
      method: "POST",
      body: JSON.stringify({ notes }),
    }),
  rejectRequest: async (id: string, reason: string) =>
    apiRequest(`/school/address-requests/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
};

export const schoolBusesApi = {
  getBuses: async (page = 1, limit = 20, search = "", status = "") => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      status,
    }).toString();
    return apiRequest<{ items: any[]; total: number }>(
      `/school/buses?${query}`,
    );
  },
  getBus: async (id: string) => apiRequest(`/school/buses/${id}`),
  createBus: async (data: any) =>
    apiRequest("/school/buses", { method: "POST", body: JSON.stringify(data) }),
  updateBus: async (id: string, data: any) =>
    apiRequest(`/school/buses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteBus: async (id: string) =>
    apiRequest(`/school/buses/${id}`, { method: "DELETE" }),
};

export const schoolSupervisorsApi = {
  getSupervisors: async (page = 1, limit = 20, search = "") => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
    }).toString();
    return apiRequest<{ items: any[]; total: number }>(
      `/school/supervisors?${query}`,
    );
  },
  getSupervisor: async (id: string) => apiRequest(`/school/supervisors/${id}`),
  createSupervisor: async (data: any) =>
    apiRequest("/school/supervisors", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateSupervisor: async (id: string, data: any) =>
    apiRequest(`/school/supervisors/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

export const schoolDriversApi = {
  getDrivers: async (page = 1, limit = 20, search = "") => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
    }).toString();
    return apiRequest<{ items: any[]; total: number }>(
      `/school/drivers?${query}`,
    );
  },
  getDriver: async (id: string) => apiRequest(`/school/drivers/${id}`),
  createDriver: async (data: any) =>
    apiRequest("/school/drivers", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateDriver: async (id: string, data: any) =>
    apiRequest(`/school/drivers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

export const schoolRoutesApi = {
  getRoutes: async (page = 1, limit = 20, search = "", tripType = "") => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      tripType,
    }).toString();
    return apiRequest<{ items: any[]; total: number }>(
      `/school/routes?${query}`,
    );
  },
  getRoute: async (id: string) => apiRequest(`/school/routes/${id}`),
  createRoute: async (data: any) =>
    apiRequest("/school/routes", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateRoute: async (id: string, data: any) =>
    apiRequest(`/school/routes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  assignStudent: async (routeId: string, studentId: string, stopId?: string) =>
    apiRequest(`/school/routes/${routeId}/assign-student`, {
      method: "POST",
      body: JSON.stringify({ studentId, stopId }),
    }),
};

export const schoolTripsApi = {
  getTrips: async (
    page = 1,
    limit = 20,
    search = "",
    status = "",
    date = "",
  ) => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      status,
      date,
    }).toString();
    return apiRequest<{ items: any[]; total: number }>(
      `/school/trips?${query}`,
    );
  },
  getTrip: async (id: string) => apiRequest(`/school/trips/${id}`),
  startTrip: async (data: any) =>
    apiRequest("/school/trips/start", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateStudentStatus: async (
    tripId: string,
    studentId: string,
    status: string,
    notes?: string,
  ) =>
    apiRequest(`/school/trips/${tripId}/student-status`, {
      method: "POST",
      body: JSON.stringify({ studentId, status, notes }),
    }),
  completeTrip: async (id: string) =>
    apiRequest(`/school/trips/${id}/complete`, { method: "POST" }),
};

export const schoolAbsenceRequestsApi = {
  getRequests: async (page = 1, limit = 20, status = "") => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status,
    }).toString();
    return apiRequest<{ items: any[]; total: number }>(
      `/school/absence-requests?${query}`,
    );
  },
  getRequest: async (id: string) =>
    apiRequest(`/school/absence-requests/${id}`),
  createRequest: async (data: any) =>
    apiRequest("/school/absence-requests", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  approveRequest: async (id: string, notes?: string) =>
    apiRequest(`/school/absence-requests/${id}/approve`, {
      method: "POST",
      body: JSON.stringify({ notes }),
    }),
  rejectRequest: async (id: string, reason: string) =>
    apiRequest(`/school/absence-requests/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
};

export const schoolNotificationsApi = {
  getNotifications: async (page = 1, limit = 20, search = "", type = "") => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      type,
    }).toString();
    return apiRequest<{ items: any[]; total: number }>(
      `/school/notifications?${query}`,
    );
  },
  sendNotification: async (data: any) =>
    apiRequest("/school/notifications/send", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const schoolEmergencyApi = {
  getReports: async (page = 1, limit = 20, status = "") => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status,
    }).toString();
    return apiRequest<{ items: any[]; total: number }>(
      `/school/emergency/reports?${query}`,
    );
  },
  createReport: async (data: any) =>
    apiRequest("/school/emergency/reports", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  resolveReport: async (id: string, notes?: string) =>
    apiRequest(`/school/emergency/reports/${id}/resolve`, {
      method: "POST",
      body: JSON.stringify({ notes }),
    }),
};

export const schoolFinancialApi = {
  getFees: async (page = 1, limit = 20, search = "", status = "") => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      status,
    }).toString();
    return apiRequest<{ items: any[]; total: number }>(
      `/school/financial/fees?${query}`,
    );
  },
  createFee: async (data: any) =>
    apiRequest("/school/financial/fees", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  recordPayment: async (data: any) =>
    apiRequest("/school/financial/payments", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getReceipts: async (page = 1, limit = 20, search = "") => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
    }).toString();
    return apiRequest<{ items: any[]; total: number }>(
      `/school/financial/receipts?${query}`,
    );
  },
};

export const schoolReportsApi = {
  getTripsReport: async (startDate?: string, endDate?: string) => {
    const query = new URLSearchParams({
      ...(startDate ? { startDate } : {}),
      ...(endDate ? { endDate } : {}),
    }).toString();
    return apiRequest<any>(`/school/reports/trips?${query}`);
  },
  getBusesReport: async () => apiRequest<any>("/school/reports/buses"),
  getFinancialReport: async () => apiRequest<any>("/school/reports/financial"),
};

export const schoolSupportApi = {
  getTickets: async (page = 1, limit = 20, search = "", status = "") => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      status,
    }).toString();
    return apiRequest<{ items: any[]; total: number }>(
      `/school/support?${query}`,
    );
  },
  createTicket: async (data: any) =>
    apiRequest("/school/support", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
