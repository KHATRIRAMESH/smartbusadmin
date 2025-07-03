"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { ChangePassword } from "@/components/ChangePassword";
import { BusManagement } from "@/components/BusManagement";
import { RouteManagement } from "@/components/RouteManagement";
import { DriverManagement } from "@/components/DriverManagement";
import { ChildManagement } from "@/components/ChildManagement";
import { ParentManagement } from "@/components/ParentManagement";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiService } from "@/lib/api";

export default function SchoolAdminDashboard() {
  const { user, isAuthenticated, isInitialized, isLoading, accessToken, logout } = useAuthStore();
  const router = useRouter();
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schoolInfo, setSchoolInfo] = useState<any>(null);
  
  // Management section states
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [stats, setStats] = useState({
    buses: 0,
    routes: 0,
    drivers: 0,
    children: 0,
    parents: 0
  });
  
  const [detailedStats, setDetailedStats] = useState({
    activeBuses: 0,
    inactiveBuses: 0,
    activeRoutes: 0,
    inactiveRoutes: 0,
    activeDrivers: 0,
    inactiveDrivers: 0,
    activeParents: 0,
    inactiveParents: 0,
    activeChildren: 0,
    inactiveChildren: 0,
  });

  // Wait for auth initialization before making routing decisions
  useEffect(() => {
    if (!isInitialized) {
      return; // Wait for initialization
    }
    
    if (!isAuthenticated || !user || !accessToken) {
      console.log("Redirecting to login - not authenticated");
      router.replace("/");
      return;
    }
    if (user?.role !== "school_admin") {
      console.log("Redirecting to super admin dashboard - wrong role");
      router.replace("/dashboard");
      return;
    }
    fetchData();
  }, [isInitialized, isAuthenticated, user, accessToken, router]);

  // Show loading while auth is being initialized
  if (!isInitialized || isLoading) {
    return (
      <div className="p-10 min-h-screen bg-gray-500 flex items-center justify-center">
        <div className="text-white text-xl">Initializing...</div>
      </div>
    );
  }

  const fetchData = async () => {
    try {
      setError(null);
      setLoading(true);

      if (!accessToken) {
        throw new Error("No access token found. Please login again.");
      }

      // Fetch real data from API
      const statsResponse = await apiService.getSchoolAdminStats();
      
      if (statsResponse.success) {
        const data = statsResponse.data;
        
        // Set school information
        setSchoolInfo({
          name: data.school?.name || "School Name Not Available",
          address: data.school?.address || "Address Not Available",
          contact: data.school?.contact || "Contact Not Available"
        });

        // Set real statistics
        setStats({
          buses: data.totalBuses,
          routes: data.totalRoutes,
          drivers: data.totalDrivers,
          children: data.totalChildren,
          parents: data.totalParents
        });

        // Set detailed statistics
        setDetailedStats({
          activeBuses: data.activeBuses,
          inactiveBuses: data.inactiveBuses,
          activeRoutes: data.activeRoutes,
          inactiveRoutes: data.inactiveRoutes,
          activeDrivers: data.activeDrivers,
          inactiveDrivers: data.inactiveDrivers,
          activeParents: data.activeParents,
          inactiveParents: data.inactiveParents,
          activeChildren: data.activeChildren,
          inactiveChildren: data.inactiveChildren,
        });
      } else {
        throw new Error(statsResponse.message || "Failed to fetch dashboard data");
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSectionClick = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const renderManagementSection = () => {
    switch (activeSection) {
      case 'buses':
        return <BusManagement />;
      case 'routes':
        return <RouteManagement />;
      case 'drivers':
        return <DriverManagement />;
      case 'children':
        return <ChildManagement />;
      case 'parents':
        return <ParentManagement />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p-10 min-h-screen bg-gray-500 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 min-h-screen bg-gray-500">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">School Admin Dashboard</h1>
            <p className="text-gray-200">Manage your school's transportation</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white">Welcome, {user?.name}</span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
        
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchData} variant="outline">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-6 min-h-screen bg-gray-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">School Admin Dashboard</h1>
          <p className="text-gray-200">Manage your school's transportation</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white">Welcome, {user?.name}</span>
          <Button 
            variant="outline" 
            onClick={() => setOpenChangePassword(true)}
            className="text-sm"
          >
            Change Password
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* School Information */}
      <Card>
        <CardHeader>
          <CardTitle>School Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">School Name</h3>
              <p className="text-gray-600">{schoolInfo?.name || "Loading..."}</p>
            </div>
            <div>
              <h3 className="font-semibold">Address</h3>
              <p className="text-gray-600">{schoolInfo?.address || "Loading..."}</p>
            </div>
            <div>
              <h3 className="font-semibold">Contact</h3>
              <p className="text-gray-600">{schoolInfo?.contact || "Loading..."}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Buses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.buses}</div>
            <div className="text-xs text-gray-500 mt-1">
              <div className="flex justify-between">
                <span className="text-green-600">Active: {detailedStats.activeBuses}</span>
                <span className="text-red-600">Inactive: {detailedStats.inactiveBuses}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.routes}</div>
            <div className="text-xs text-gray-500 mt-1">
              <div className="flex justify-between">
                <span className="text-green-600">Active: {detailedStats.activeRoutes}</span>
                <span className="text-red-600">Inactive: {detailedStats.inactiveRoutes}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.drivers}</div>
            <div className="text-xs text-gray-500 mt-1">
              <div className="flex justify-between">
                <span className="text-green-600">Active: {detailedStats.activeDrivers}</span>
                <span className="text-red-600">Inactive: {detailedStats.inactiveDrivers}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.children}</div>
            <div className="text-xs text-gray-500 mt-1">
              <div className="flex justify-between">
                <span className="text-green-600">Active: {detailedStats.activeChildren}</span>
                <span className="text-red-600">Inactive: {detailedStats.inactiveChildren}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Parents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.parents}</div>
            <div className="text-xs text-gray-500 mt-1">
              <div className="flex justify-between">
                <span className="text-green-600">Active: {detailedStats.activeParents}</span>
                <span className="text-red-600">Inactive: {detailedStats.inactiveParents}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Sections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Transportation Management
            {activeSection && (
              <Badge variant="secondary" className="ml-2">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Management
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!activeSection ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleSectionClick('buses')}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-900">Bus Management</h4>
                  <p className="text-sm text-gray-500 mt-1">Manage school buses</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Manage Buses
                  </Button>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleSectionClick('routes')}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-900">Route Management</h4>
                  <p className="text-sm text-gray-500 mt-1">Plan bus routes</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Manage Routes
                  </Button>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleSectionClick('drivers')}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-900">Driver Management</h4>
                  <p className="text-sm text-gray-500 mt-1">Manage drivers</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Manage Drivers
                  </Button>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleSectionClick('parents')}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-900">Parent Management</h4>
                  <p className="text-sm text-gray-500 mt-1">Manage parents</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Manage Parents
                  </Button>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleSectionClick('children')}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-900">Student Management</h4>
                  <p className="text-sm text-gray-500 mt-1">Manage students</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Manage Students
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Management
                </h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveSection(null)}
                >
                  Back to Dashboard
                </Button>
              </div>
              <div className="border-t pt-4">
                {renderManagementSection()}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <ChangePassword
        open={openChangePassword}
        setOpen={setOpenChangePassword}
      />
    </div>
  );
} 