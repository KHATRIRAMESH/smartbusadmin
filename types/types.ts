export type AuthFlow = "signIn" | "signUp";
export type AuthRole = "super_admin" | "school_admin";

// User and Authentication Types
export type UserRole = "super_admin" | "school_admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId?: string; // Only for school_admin
}

// School Management Types
export interface School {
  id: string;
  name: string;
  address: string;
  contact: string;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolAdmin {
  id: string;
  name: string;
  email: string;
  schoolId: string;
  phone?: string;
  address?: string;
  school: School;
  createdAt: string;
  updatedAt?: string;
}

// Driver Management Types
export interface Driver {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  licenseNumber: string;
  address?: string;
  isActive: boolean;
  schoolAdminId: string;
  createdAt: string;
  updatedAt: string;
  assignedBus?: Bus;
  routesCount?: number;
}

// Transportation Management Types
export interface Bus {
  id: string;
  busNumber: string;
  capacity: number;
  model?: string;
  plateNumber: string;
  isActive: boolean;
  driverId?: string;
  schoolAdminId: string;
  createdAt: string;
  updatedAt: string;
  driver?: Driver;
  routes?: Route[];
  childrenCount?: number;
}

export interface Route {
  id: string;
  name: string;
  description?: string;
  startStop: string;
  endStop: string;
  stops?: string[];

  isActive: boolean;
  schoolId: string;
  busId?: string;
  createdAt: string;
  updatedAt: string;
  assignedBusId?: string;
  assignedBusNumber?: string;
  assignedPlateNumber?: string;
  childrenCount?: number;
}

export interface Child {
  id: string;
  name: string;
  class: string;
  pickupStop: string;
  dropStop: string;
  isActive: boolean;
  parentId: string;
  busId?: string;
  routeId?: string;
  createdAt: string;
  updatedAt: string;
  parent?: Parent;
  bus?: Bus;
  route?: Route;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  emergencyContact?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  children?: Child[];
  childrenCount?: number;
}

// Tracking Types
export interface BusLocation {
  latitude: number;
  longitude: number;
  timestamp: string;
  speed?: number;
  heading?: number;
  status: "in_transit" | "at_stop" | "completed";
}

export interface RouteProgress {
  currentStop: string;
  nextStop: string;
  progress: number; // percentage
}

export interface EstimatedArrival {
  pickup: string;
  drop: string;
}

export interface TrackingData {
  currentLocation: BusLocation;
  estimatedArrival: EstimatedArrival;
  routeProgress: RouteProgress;
}

export interface BusTrackingInfo {
  id: string;
  busNumber: string;
  plateNumber: string;
  capacity: number;
  model?: string;
  isActive: boolean;
  driver?: Driver;
  route?: Route;
  childrenCount?: number;
  currentLocation: BusLocation;
  estimatedArrival: EstimatedArrival;
  routeProgress: RouteProgress;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalSchools: number;
  totalSchoolAdmins: number;
  totalBuses: number;
  totalDrivers: number;
  totalRoutes: number;
  totalChildren: number;
  totalParents: number;
}

export interface BusStats {
  totalBuses: number;
  activeBuses: number;
  busesWithDrivers: number;
  totalCapacity: number;
}

export interface DriverStats {
  totalDrivers: number;
  activeDrivers: number;
  assignedDrivers: number;
  unassignedDrivers: number;
}

export interface RouteStats {
  totalRoutes: number;
  activeRoutes: number;
  routesWithBuses: number;
  totalDistance: number;
  totalDuration: number;
}

export interface TrackingStats {
  totalBuses: number;
  activeBuses: number;
  busesWithDrivers: number;
  totalChildren: number;
  totalRoutes: number;
}
