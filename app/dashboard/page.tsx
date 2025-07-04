"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { CreateSchool } from "@/components/CreateSchool";
import { CreateSchoolAdmin } from "@/components/CreateSchoolAdmin";
import { SchoolList } from "@/components/SchoolList";
import { SchoolAdminList } from "@/components/SchoolAdminList";
import { DashboardStats } from "@/components/DashboardStats";
import { ChangePassword } from "@/components/ChangePassword";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { School, SchoolAdmin, DashboardStats as Stats } from "@/types/types";

export default function SuperAdminDashboard() {
  const { user, isAuthenticated, isInitialized, isLoading, accessToken, logout } = useAuthStore();
  const router = useRouter();
  const [openSchoolCreate, setOpenSchoolCreate] = useState(false);
  const [openSchoolAdminCreate, setOpenSchoolAdminCreate] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolAdmins, setSchoolAdmins] = useState<SchoolAdmin[]>([]);
  const [dashboardStats, setDashboardStats] = useState<Stats>({
    totalSchools: 0,
    totalSchoolAdmins: 0,
    totalBuses: 0,
    totalDrivers: 0,
    totalRoutes: 0,
    totalChildren: 0,
    totalParents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Wait for auth initialization before making routing decisions
  useEffect(() => {
    if (!isInitialized) {
      return; // Wait for initialization
    }
    
    console.log("Dashboard auth check:", {
      isAuthenticated,
      user: user ? { id: user.id, name: user.name, role: user.role } : null,
      accessToken: !!accessToken
    });
    
    if (!isAuthenticated || !user || !accessToken) {
      console.log("Redirecting to login - not authenticated");
      router.replace("/");
      return;
    }
    if (user?.role !== "super_admin") {
      console.log("Redirecting to school admin dashboard - wrong role:", user.role);
      router.replace("/school-admin/dashboard");
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

      const headers = {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };

      // Fetch schools
      const schoolsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/super-admin/schools`,
        { headers }
      );
      
      if (!schoolsRes.ok) {
        throw new Error(`Failed to fetch schools: ${schoolsRes.status}`);
      }
      
      const schoolsData = await schoolsRes.json();
      setSchools(schoolsData.data || []);

      // Fetch school admins
      const adminsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/super-admin/school-admins`,
        { headers }
      );
      
      if (!adminsRes.ok) {
        throw new Error(`Failed to fetch school admins: ${adminsRes.status}`);
      }
      
      const adminsData = await adminsRes.json();
      setSchoolAdmins(adminsData.data || []);

      // Fetch dashboard stats
      const statsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/super-admin/stats`,
        { headers }
      );
      
      if (!statsRes.ok) {
        throw new Error(`Failed to fetch stats: ${statsRes.status}`);
      }
      
      const statsData = await statsRes.json();
      setDashboardStats(statsData.data || {
        totalSchools: 0,
        totalSchoolAdmins: 0,
        totalBuses: 0,
        totalDrivers: 0,
        totalRoutes: 0,
        totalChildren: 0,
        totalParents: 0,
      });
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
            <h1 className="text-3xl font-bold text-white">Super Admin Dashboard</h1>
            <p className="text-gray-200">Manage schools and administrators</p>
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
          <h1 className="text-3xl font-bold text-white">Super Admin Dashboard</h1>
          <p className="text-gray-200">Manage schools and administrators</p>
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

      {/* Dashboard Stats */}
      <DashboardStats stats={dashboardStats} />

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={() => setOpenSchoolCreate(true)}>
          Add New School
        </Button>
        <Button 
          onClick={() => setOpenSchoolAdminCreate(true)}
          disabled={schools.length === 0}
        >
          Add School Admin
        </Button>
      </div>

      {/* Schools and Admins Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schools Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Schools ({schools.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SchoolList schools={schools} onRefresh={fetchData} />
          </CardContent>
        </Card>

        {/* School Admins Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              School Administrators ({schoolAdmins.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SchoolAdminList 
              schoolAdmins={schoolAdmins} 
              onRefresh={fetchData} 
            />
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <CreateSchool 
        open={openSchoolCreate} 
        setOpen={setOpenSchoolCreate}
        onSuccess={fetchData}
      />
      <CreateSchoolAdmin 
        open={openSchoolAdminCreate} 
        setOpen={setOpenSchoolAdminCreate}
        schools={schools}
        onSuccess={fetchData}
      />
      
      <ChangePassword
        open={openChangePassword}
        setOpen={setOpenChangePassword}
      />
    </div>
  );
}
