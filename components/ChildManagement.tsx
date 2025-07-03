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
import { Child, Parent, Bus, Route } from "@/types/types";
import { Plus, Edit, Trash2, User, MapPin } from "lucide-react";

interface ChildManagementProps {
  className?: string;
}

export const ChildManagement = ({ className }: ChildManagementProps) => {
  const [children, setChildren] = useState<Child[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    class: "",
    pickupStop: "",
    dropStop: "",
    parentId: "",
    busId: "none",
    routeId: "none",
  });

  const { accessToken } = useAuthStore();

  const fetchChildren = async () => {
    if (!accessToken) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/child`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setChildren(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching children:", error);
    }
  };

  const fetchParents = async () => {
    if (!accessToken) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parent`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setParents(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching parents:", error);
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

  const fetchRoutes = async () => {
    if (!accessToken) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/route`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setRoutes(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchChildren(), fetchParents(), fetchBuses(), fetchRoutes()]);
      setIsLoading(false);
    };
    loadData();
  }, [accessToken]);

  const handleCreateChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/child`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...formData,
          busId: formData.busId === "none" ? undefined : formData.busId,
          routeId: formData.routeId === "none" ? undefined : formData.routeId,
        }),
      });

      if (response.ok) {
        setCreateDialogOpen(false);
        alert("Child created successfully");
        setFormData({
          name: "", class: "", pickupStop: "", dropStop: "",
          parentId: "", busId: "none", routeId: "none"
        });
        await fetchChildren();
        await fetchParents();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to create child");
      }
    } catch (error) {
      console.error("Error creating child:", error);
      alert("Failed to create child");
    }
  };

  const handleEditChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !selectedChild) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/child/${selectedChild.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...formData,
          busId: formData.busId === "none" ? undefined : formData.busId,
          routeId: formData.routeId === "none" ? undefined : formData.routeId,
        }),
      });

      if (response.ok) {
        setEditDialogOpen(false);
        setSelectedChild(null);
        alert("Child updated successfully");
        setFormData({
          name: "", class: "", pickupStop: "", dropStop: "",
          parentId: "", busId: "none", routeId: "none"
        });
        await fetchChildren();
        await fetchParents();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update child");
      }
    } catch (error) {
      console.error("Error updating child:", error);
      alert("Failed to update child");
    }
  };

  const handleDeleteChild = async (childId: string) => {
    if (!accessToken || !confirm("Are you sure you want to delete this child?")) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/child/${childId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.ok) {
        alert("Child deleted successfully");
        await fetchChildren();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to delete child");
      }
    } catch (error) {
      console.error("Error deleting child:", error);
      alert("Failed to delete child");
    }
  };

  const openEditDialog = (child: Child) => {
    setSelectedChild(child);
    setFormData({
      name: child.name,
      class: child.class,
      pickupStop: child.pickupStop,
      dropStop: child.dropStop,
      parentId: child.parentId,
      busId: child.busId || "none",
      routeId: child.routeId || "none",
    });
    setEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading children...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Child Management</h2>
          <p className="text-muted-foreground">
            Manage children and their transportation assignments
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Child
        </Button>
      </div>

      {/* Child List */}
      <Card>
        <CardHeader>
          <CardTitle>Children Roster</CardTitle>
          <CardDescription>
            All children registered for school transportation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {children.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No children found. Add your first child to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Pickup/Drop</TableHead>
                  <TableHead>Assigned Bus</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {children.map((child) => (
                  <TableRow key={child.id}>
                    <TableCell>
                      <div className="font-medium">{child.name}</div>
                    </TableCell>
                    <TableCell className="font-medium">{child.class}</TableCell>
                    <TableCell>
                      {child.parent ? (
                        <div>
                          <div className="font-medium">{child.parent.name}</div>
                          <div className="text-sm text-gray-500">{child.parent.phone}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">No parent assigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">
                          <MapPin className="h-3 w-3 inline mr-1" />
                          {child.pickupStop}
                        </div>
                        <div className="text-sm text-gray-500">
                          <MapPin className="h-3 w-3 inline mr-1" />
                          {child.dropStop}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {child.bus ? (
                        <div>
                          <div className="font-medium">{child.bus.busNumber}</div>
                          <div className="text-sm text-gray-500">{child.bus.plateNumber}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">No bus assigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={child.isActive ? "default" : "secondary"}>
                        {child.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(child)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteChild(child.id)}
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

      {/* Create Child Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Child</DialogTitle>
            <DialogDescription>
              Register a new child for school transportation.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateChild} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Input
                id="class"
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                placeholder="5th Grade"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentId">Parent</Label>
              <Select
                value={formData.parentId}
                onValueChange={(value: string) => setFormData({ ...formData, parentId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a parent" />
                </SelectTrigger>
                <SelectContent>
                  {parents.map((parent) => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.name} - {parent.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickupStop">Pickup Stop</Label>
                <Input
                  id="pickupStop"
                  value={formData.pickupStop}
                  onChange={(e) => setFormData({ ...formData, pickupStop: e.target.value })}
                  placeholder="Central Station"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dropStop">Drop Stop</Label>
                <Input
                  id="dropStop"
                  value={formData.dropStop}
                  onChange={(e) => setFormData({ ...formData, dropStop: e.target.value })}
                  placeholder="School Gate"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="busId">Assign Bus</Label>
                <Select
                  value={formData.busId}
                  onValueChange={(value: string) => setFormData({ ...formData, busId: value })}
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
              <div className="space-y-2">
                <Label htmlFor="routeId">Assign Route</Label>
                <Select
                  value={formData.routeId}
                  onValueChange={(value: string) => setFormData({ ...formData, routeId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a route (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No route</SelectItem>
                    {routes.map((route) => (
                      <SelectItem key={route.id} value={route.id}>
                        {route.name} - {route.startStop} to {route.endStop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Child</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Child Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Child</DialogTitle>
            <DialogDescription>
              Update child information and transportation assignments.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditChild} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-class">Class</Label>
              <Input
                id="edit-class"
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                placeholder="5th Grade"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-parentId">Parent</Label>
              <Select
                value={formData.parentId}
                onValueChange={(value: string) => setFormData({ ...formData, parentId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a parent" />
                </SelectTrigger>
                <SelectContent>
                  {parents.map((parent) => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.name} - {parent.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-pickupStop">Pickup Stop</Label>
                <Input
                  id="edit-pickupStop"
                  value={formData.pickupStop}
                  onChange={(e) => setFormData({ ...formData, pickupStop: e.target.value })}
                  placeholder="Central Station"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-dropStop">Drop Stop</Label>
                <Input
                  id="edit-dropStop"
                  value={formData.dropStop}
                  onChange={(e) => setFormData({ ...formData, dropStop: e.target.value })}
                  placeholder="School Gate"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-busId">Assign Bus</Label>
                <Select
                  value={formData.busId}
                  onValueChange={(value: string) => setFormData({ ...formData, busId: value })}
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
              <div className="space-y-2">
                <Label htmlFor="edit-routeId">Assign Route</Label>
                <Select
                  value={formData.routeId}
                  onValueChange={(value: string) => setFormData({ ...formData, routeId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a route (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No route</SelectItem>
                    {routes.map((route) => (
                      <SelectItem key={route.id} value={route.id}>
                        {route.name} - {route.startStop} to {route.endStop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Child</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 