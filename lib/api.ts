import { useAuthStore } from "@/store/authStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get the access token from the auth store
    const accessToken = useAuthStore.getState().accessToken;
    
    if (!accessToken) {
      throw new Error("No token provided");
    }
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        ...options.headers,
      },
      credentials: 'include', // Include cookies for authentication
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // School Admin API methods
  async getSchoolAdminStats() {
    return this.request<{
      success: boolean;
      data: {
        school: {
          id: string;
          name: string;
          address: string;
          contact: string;
        } | null;
        totalBuses: number;
        activeBuses: number;
        inactiveBuses: number;
        totalRoutes: number;
        activeRoutes: number;
        inactiveRoutes: number;
        totalDrivers: number;
        activeDrivers: number;
        inactiveDrivers: number;
        totalParents: number;
        activeParents: number;
        inactiveParents: number;
        totalChildren: number;
        activeChildren: number;
        inactiveChildren: number;
      };
      message: string;
    }>('/school-admin/stats');
  }

  async getSchoolAdminProfile() {
    return this.request<{
      success: boolean;
      data: {
        id: string;
        name: string;
        email: string;
        schoolId: string;
        phone: string;
        address: string;
        school: {
          id: string;
          name: string;
          address: string;
          contact: string;
        };
      };
      message: string;
    }>('/school-admin/profile');
  }

  async updateSchoolAdminProfile(data: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  }) {
    return this.request<{
      success: boolean;
      data: any;
      message: string;
    }>('/school-admin/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async changeSchoolAdminPassword(data: {
    currentPassword: string;
    newPassword: string;
  }) {
    return this.request<{
      success: boolean;
      message: string;
    }>('/school-admin/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService(API_BASE_URL); 