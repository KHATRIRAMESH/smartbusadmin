import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { Route, Bus } from "@/types/types";
import { Plus, Edit, Trash2, MapPin, Car, Clock } from "lucide-react";

interface RouteManagementProps {
  className?: string;
}

export const RouteManagement = ({ className }: RouteManagementProps) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [stats, setStats] = useState({
    totalRoutes: 0,
    activeRoutes: 0,
    routesWithBuses: 0,
    totalDistance: 0,
    totalDuration: 0,
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startStop: "",
    endStop: "",
    stops: "",
    busId: "none",
    schoolId: "",
    schoolAdminId: "",
  });

  const { accessToken, user } = useAuthStore();
  console.log(user);

  const fetchRoutes = async () => {
    if (!accessToken) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/route`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        // console.log("data", data);
        setRoutes(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const fetchBuses = async () => {
    if (!accessToken) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bus`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setBuses(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching buses:", error);
    }
  };

  const fetchStats = async () => {
    if (!accessToken) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/route/stats`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setStats(data.data || {});
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchRoutes(), fetchBuses(), fetchStats()]);
      setIsLoading(false);
    };
    loadData();
  }, [accessToken]);

  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !user?.schoolId) return;
    formData.schoolId = user?.schoolId;
    formData.schoolAdminId = user?.id;
    console.log("formData", formData);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/route/create-route`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            ...formData,
            stops: formData.stops
              ? formData.stops.split(",").map((s) => s.trim())
              : undefined,
            busId: formData.busId === "none" ? undefined : formData.busId,
          }),
        }
      );

      if (response.ok) {
        setCreateDialogOpen(false);
        alert("Route created successfully");
        setFormData({
          name: "",
          description: "",
          startStop: "",
          endStop: "",
          stops: "",
          busId: "none",
          schoolId: "",
          schoolAdminId: "",
        });
        await Promise.all([fetchRoutes(), fetchStats()]);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to create route");
      }
    } catch (error) {
      console.error("Error creating route:", error);
      alert("Failed to create route");
    }
  };

  const handleEditRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !selectedRoute || !user?.schoolId) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/route/${selectedRoute.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            ...formData,
            stops: formData.stops
              ? formData.stops.split(",").map((s) => s.trim())
              : undefined,
            busId: formData.busId === "none" ? undefined : formData.busId,
          }),
        }
      );

      if (response.ok) {
        setEditDialogOpen(false);
        setSelectedRoute(null);
        setFormData({
          name: "",
          description: "",
          startStop: "",
          endStop: "",
          stops: "",
          busId: "none",
          schoolId: "",
          schoolAdminId: "",
        });
        await Promise.all([fetchRoutes(), fetchStats()]);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update route");
      }
    } catch (error) {
      console.error("Error updating route:", error);
      alert("Failed to update route");
    }
  };

  const handleDeleteRoute = async (routeId: string) => {
    if (!accessToken || !confirm("Are you sure you want to delete this route?"))
      return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/route/${routeId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.ok) {
        await Promise.all([fetchRoutes(), fetchStats()]);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to delete route");
      }
    } catch (error) {
      console.error("Error deleting route:", error);
      alert("Failed to delete route");
    }
  };

  const openEditDialog = (route: Route) => {
    setSelectedRoute(route);
    setFormData({
      name: route.name,
      description: route.description || "",
      startStop: route.startStop,
      endStop: route.endStop,
      stops: route.stops ? route.stops.join(", ") : "",
      busId: route.busId || "none",
      schoolId: route.schoolId || "",
      schoolAdminId: (route as any).schoolAdminId || "",
    });
    setEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading routes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRoutes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeRoutes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Buses</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.routesWithBuses}</div>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Route Management
          </h2>
          <p className="text-muted-foreground">
            Manage your school's bus routes and stop locations
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Route
        </Button>
      </div>

      {/* Route List */}
      <Card>
        <CardHeader>
          <CardTitle>Bus Routes</CardTitle>
          <CardDescription>
            All routes in your school's transportation network
          </CardDescription>
        </CardHeader>
        <CardContent>
          {routes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No routes found. Add your first route to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route Name</TableHead>
                  <TableHead>Start - End</TableHead>
                  <TableHead>Stops</TableHead>
                  <TableHead>Assigned Bus</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{route.name}</div>
                        {route.description && (
                          <div className="text-sm text-gray-500">
                            {route.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{route.startStop}</div>
                        <div className="text-sm text-gray-500">
                          → {route.endStop}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {route.stops ? route.stops.length : 0} stops
                      </span>
                    </TableCell>
                    <TableCell>
                      {route.assignedBusId ? (
                        <div>
                          <div className="font-medium">
                            {route.assignedBusNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {route.assignedPlateNumber}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">No bus assigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={route.isActive ? "default" : "secondary"}>
                        {route.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(route)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRoute(route.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Route Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Route</DialogTitle>
            <DialogDescription>
              Create a new bus route with stops and timing information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateRoute} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Route Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Route A"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Morning pickup route"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startStop">Start Stop</Label>
                <Input
                  id="startStop"
                  value={formData.startStop}
                  onChange={(e) =>
                    setFormData({ ...formData, startStop: e.target.value })
                  }
                  placeholder="Central Station"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endStop">End Stop</Label>
                <Input
                  id="endStop"
                  value={formData.endStop}
                  onChange={(e) =>
                    setFormData({ ...formData, endStop: e.target.value })
                  }
                  placeholder="School Gate"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stops">Intermediate Stops</Label>
              <Input
                id="stops"
                value={formData.stops}
                onChange={(e) =>
                  setFormData({ ...formData, stops: e.target.value })
                }
                placeholder="Stop 1, Stop 2, Stop 3 (comma separated)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="busId">Assign Bus</Label>
                <Select
                  value={formData.busId}
                  onValueChange={(value: string) =>
                    setFormData({ ...formData, busId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a bus (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No bus</SelectItem>
                    {buses.map((bus) => (
                      <SelectItem key={bus.id} value={bus.id}>
                        {bus.busNumber} - {bus.plateNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Route</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Route Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Route</DialogTitle>
            <DialogDescription>
              Update route information and bus assignment.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditRoute} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Route Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Route A"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Morning pickup route"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-startStop">Start Stop</Label>
                <Input
                  id="edit-startStop"
                  value={formData.startStop}
                  onChange={(e) =>
                    setFormData({ ...formData, startStop: e.target.value })
                  }
                  placeholder="Central Station"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-endStop">End Stop</Label>
                <Input
                  id="edit-endStop"
                  value={formData.endStop}
                  onChange={(e) =>
                    setFormData({ ...formData, endStop: e.target.value })
                  }
                  placeholder="School Gate"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-stops">Intermediate Stops</Label>
              <Input
                id="edit-stops"
                value={formData.stops}
                onChange={(e) =>
                  setFormData({ ...formData, stops: e.target.value })
                }
                placeholder="Stop 1, Stop 2, Stop 3 (comma separated)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-busId">Assign Bus</Label>
                <Select
                  value={formData.busId}
                  onValueChange={(value: string) =>
                    setFormData({ ...formData, busId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a bus (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No bus</SelectItem>
                    {buses.map((bus) => (
                      <SelectItem key={bus.id} value={bus.id}>
                        {bus.busNumber} - {bus.plateNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update Route</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
