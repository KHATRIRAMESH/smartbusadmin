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
import { Parent } from "@/types/types";
import { Plus, Edit, Trash2, Users, Mail, Phone } from "lucide-react";

interface ParentManagementProps {
  className?: string;
}

export const ParentManagement = ({ className }: ParentManagementProps) => {
  const [parents, setParents] = useState<Parent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [stats, setStats] = useState({
    totalParents: 0,
    activeParents: 0,
    parentsWithChildren: 0,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const { accessToken } = useAuthStore();

  const fetchParents = async () => {
    if (!accessToken) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/parent`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("data", data);
        setParents(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching parents:", error);
    }
  };

  const fetchStats = async () => {
    if (!accessToken) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/parent/stats`,
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
      await Promise.all([fetchParents(), fetchStats()]);
      setIsLoading(false);
    };
    loadData();
  }, [accessToken]);

  const handleCreateParent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/parent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setCreateDialogOpen(false);
        alert("Parent created successfully");
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          address: "",
        });
        await Promise.all([fetchParents(), fetchStats()]);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to create parent");
      }
    } catch (error) {
      console.error("Error creating parent:", error);
      alert("Failed to create parent");
    }
  };

  const handleEditParent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !selectedParent) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/parent/${selectedParent.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setEditDialogOpen(false);
        setSelectedParent(null);
        setFormData({
          name: "",
          email: "",
          password: "",
          phone: "",
          address: "",
        });
        await Promise.all([fetchParents(), fetchStats()]);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update parent");
      }
    } catch (error) {
      console.error("Error updating parent:", error);
      alert("Failed to update parent");
    }
  };

  const handleDeleteParent = async (parentId: string) => {
    if (
      !accessToken ||
      !confirm("Are you sure you want to delete this parent?")
    )
      return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/parent/${parentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.ok) {
        await Promise.all([fetchParents(), fetchStats()]);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to delete parent");
      }
    } catch (error) {
      console.error("Error deleting parent:", error);
      alert("Failed to delete parent");
    }
  };

  const openEditDialog = (parent: Parent) => {
    setSelectedParent(parent);
    setFormData({
      name: parent.name,
      email: parent.email,
      password: parent.password,
      phone: parent.phone,
      address: parent.address || "",
    });
    setEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading parents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalParents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Parents
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeParents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Children</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.parentsWithChildren}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Parent Management
          </h2>
          <p className="text-muted-foreground">
            Manage parent information and contact details
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Parent
        </Button>
      </div>

      {/* Parent List */}
      <Card>
        <CardHeader>
          <CardTitle>Parents</CardTitle>
          <CardDescription>
            All parents registered in your school
          </CardDescription>
        </CardHeader>
        <CardContent>
          {parents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No parents found. Add your first parent to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Children</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parents.map((parent) => (
                  <TableRow key={parent.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{parent.name}</div>
                        <div className="text-sm text-gray-500">
                          {parent.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{parent.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {parent.address || "No address"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {(parent as any).childrenCount || 0} children
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={parent.isActive ? "default" : "secondary"}
                      >
                        {parent.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(parent)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteParent(parent.id)}
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

      {/* Create Parent Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Parent</DialogTitle>
            <DialogDescription>
              Add a new parent with their contact information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateParent} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="john.doe@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="********"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+1234567890"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="123 Main St, City, State"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Parent</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Parent Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Parent</DialogTitle>
            <DialogDescription>
              Update parent information and contact details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditParent} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="john.doe@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone Number</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+1234567890"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="123 Main St, City, State"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update Parent</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
