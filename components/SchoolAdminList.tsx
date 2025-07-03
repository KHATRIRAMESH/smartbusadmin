import { useState } from "react";
import { SchoolAdmin } from "@/types/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { EditSchoolAdmin } from "./EditSchoolAdmin";

interface SchoolAdminListProps {
  schoolAdmins: SchoolAdmin[];
  onRefresh: () => void;
}

export const SchoolAdminList = ({ schoolAdmins, onRefresh }: SchoolAdminListProps) => {
  const [editingAdmin, setEditingAdmin] = useState<SchoolAdmin | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { accessToken } = useAuthStore();

  const handleDelete = async (adminId: string) => {
    if (!confirm("Are you sure you want to delete this school admin?")) {
      return;
    }

    setIsDeleting(adminId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/super-admin/school-admins/${adminId}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert("School admin deleted successfully!");
        onRefresh();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to delete school admin");
      }
    } catch (error) {
      console.error("Error deleting school admin:", error);
      alert("Failed to delete school admin. Please check your connection.");
    } finally {
      setIsDeleting(null);
    }
  };

  if (schoolAdmins.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No school administrators found. Create school admins to manage individual schools.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>School</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schoolAdmins.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell className="font-medium">{admin.name}</TableCell>
              <TableCell>{admin.email}</TableCell>
              <TableCell>{admin.school?.name || "N/A"}</TableCell>
              <TableCell>{admin.phone || "N/A"}</TableCell>
              <TableCell>
                {new Date(admin.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditingAdmin(admin)}
                >
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDelete(admin.id)}
                  disabled={isDeleting === admin.id}
                  className="text-red-600 hover:text-red-700"
                >
                  {isDeleting === admin.id ? "Deleting..." : "Delete"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingAdmin && (
        <EditSchoolAdmin
          admin={editingAdmin}
          open={!!editingAdmin}
          setOpen={() => setEditingAdmin(null)}
          onSuccess={() => {
            onRefresh();
            setEditingAdmin(null);
          }}
        />
      )}
    </div>
  );
}; 