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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { Bus, Driver } from "@/types/types";
import { Plus, Edit, Trash2, Car, MapPin, Users } from "lucide-react";

interface BusManagementProps {
  className?: string;
}

export const BusManagement = ({ className }: BusManagementProps) => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [stats, setStats] = useState({
    totalBuses: 0,
    activeBuses: 0,
    busesWithDrivers: 0,
    totalCapacity: 0,
  });

  const [formData, setFormData] = useState({
    busNumber: "",
    capacity: "",
    model: "",
    plateNumber: "",
    driverId: "none",
  });

  const { accessToken } = useAuthStore();

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

  const fetchDrivers = async () => {
    if (!accessToken) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/driver`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setDrivers(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  const fetchStats = async () => {
    if (!accessToken) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bus/stats`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
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
      await Promise.all([fetchBuses(), fetchDrivers(), fetchStats()]);
      setIsLoading(false);
    };
    loadData();
  }, [accessToken]);

  const handleCreateBus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...formData,
          capacity: parseInt(formData.capacity),
          driverId: formData.driverId === "none" ? undefined : formData.driverId,
        }),
      });

      if (response.ok) {
        setCreateDialogOpen(false);
        setFormData({ busNumber: "", capacity: "", model: "", plateNumber: "", driverId: "" });
        await Promise.all([fetchBuses(), fetchStats()]);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to create bus");
      }
    } catch (error) {
      console.error("Error creating bus:", error);
      alert("Failed to create bus");
    }
  };

  const handleEditBus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !selectedBus) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bus/${selectedBus.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...formData,
          capacity: parseInt(formData.capacity),
          driverId: formData.driverId === "none" ? undefined : formData.driverId,
        }),
      });

      if (response.ok) {
        setEditDialogOpen(false);
        setSelectedBus(null);
        setFormData({ busNumber: "", capacity: "", model: "", plateNumber: "", driverId: "none" });
        await Promise.all([fetchBuses(), fetchStats()]);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update bus");
      }
    } catch (error) {
      console.error("Error updating bus:", error);
      alert("Failed to update bus");
    }
  };

  const handleDeleteBus = async (busId: string) => {
    if (!accessToken || !confirm("Are you sure you want to delete this bus?")) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bus/${busId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.ok) {
        await Promise.all([fetchBuses(), fetchStats()]);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to delete bus");
      }
    } catch (error) {
      console.error("Error deleting bus:", error);
      alert("Failed to delete bus");
    }
  };

  const openEditDialog = (bus: Bus) => {
    setSelectedBus(bus);
    setFormData({
      busNumber: bus.busNumber,
      capacity: bus.capacity.toString(),
      model: bus.model || "",
      plateNumber: bus.plateNumber,
      driverId: bus.driverId || "none",
    });
    setEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading buses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Buses</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBuses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Buses</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBuses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Drivers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.busesWithDrivers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCapacity}</div>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bus Management</h2>
          <p className="text-muted-foreground">
            Manage your school's bus fleet and driver assignments
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Bus
        </Button>
      </div>

      {/* Bus List */}
      <Card>
        <CardHeader>
          <CardTitle>Bus Fleet</CardTitle>
          <CardDescription>
            All buses in your school's transportation fleet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {buses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Car className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No buses found. Add your first bus to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bus Number</TableHead>
                  <TableHead>Plate Number</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Children</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buses.map((bus) => (
                  <TableRow key={bus.id}>
                    <TableCell className="font-medium">{bus.busNumber}</TableCell>
                    <TableCell>{bus.plateNumber}</TableCell>
                    <TableCell>{bus.capacity} seats</TableCell>
                    <TableCell>
                      {bus.driver ? (
                        <div>
                          <div className="font-medium">{bus.driver.name}</div>
                          <div className="text-sm text-gray-500">{bus.driver.phone}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">No driver assigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={bus.isActive ? "default" : "secondary"}>
                        {bus.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {bus.childrenCount || 0} children
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(bus)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteBus(bus.id)}
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

      {/* Create Bus Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Bus</DialogTitle>
            <DialogDescription>
              Add a new bus to your school's transportation fleet.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateBus} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="busNumber">Bus Number</Label>
                <Input
                  id="busNumber"
                  value={formData.busNumber}
                  onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                  placeholder="BUS001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plateNumber">Plate Number</Label>
                <Input
                  id="plateNumber"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                  placeholder="KA01AB1234"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="50"
                  min="1"
                  max="100"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="Tata Starbus"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="driverId">Assign Driver</Label>
              <Select
                value={formData.driverId}
                onValueChange={(value: string) => setFormData({ ...formData, driverId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a driver (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No driver</SelectItem>
                  {drivers
                    .filter((driver) => !driver.assignedBus)
                    .map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.name} - {driver.licenseNumber}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Bus</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Bus Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Bus</DialogTitle>
            <DialogDescription>
              Update bus information and driver assignment.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditBus} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-busNumber">Bus Number</Label>
                <Input
                  id="edit-busNumber"
                  value={formData.busNumber}
                  onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                  placeholder="BUS001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-plateNumber">Plate Number</Label>
                <Input
                  id="edit-plateNumber"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                  placeholder="KA01AB1234"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-capacity">Capacity</Label>
                <Input
                  id="edit-capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="50"
                  min="1"
                  max="100"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-model">Model</Label>
                <Input
                  id="edit-model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="Tata Starbus"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-driverId">Assign Driver</Label>
              <Select
                value={formData.driverId}
                onValueChange={(value: string) => setFormData({ ...formData, driverId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a driver (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No driver</SelectItem>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name} - {driver.licenseNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Bus</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 