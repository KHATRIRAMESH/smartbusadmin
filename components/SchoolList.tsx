import { useState } from "react";
import { School } from "@/types/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EditSchool } from "./EditSchool";
import { useAuthStore } from "@/store/authStore";

interface SchoolListProps {
  schools: School[];
  onRefresh: () => void;
}

export const SchoolList = ({ schools, onRefresh }: SchoolListProps) => {
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [deletingSchool, setDeletingSchool] = useState<School | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { accessToken } = useAuthStore();

  const handleDelete = async (school: School) => {
    if (!window.confirm(`Are you sure you want to delete "${school.name}"? This action cannot be undone.`)) {
      return;
    }

    if (!accessToken) {
      alert("Authentication required. Please sign in again.");
      return;
    }

    setIsDeleting(true);
    setDeletingSchool(school);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/super-admin/schools/${school.id}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert("School deleted successfully!");
        onRefresh(); // Refresh the list
      } else {
        const errorData = await response.json();
        if (response.status === 401) {
          alert("Authentication failed. Please sign in again.");
          window.location.href = "/";
        } else {
          alert(errorData.message || "Failed to delete school");
        }
      }
    } catch (error) {
      console.error("Error deleting school:", error);
      alert("Failed to delete school. Please check your connection.");
    } finally {
      setIsDeleting(false);
      setDeletingSchool(null);
    }
  };

  if (schools.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No schools found. Create your first school to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>School Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schools.map((school) => (
            <TableRow key={school.id}>
              <TableCell className="font-medium">{school.name}</TableCell>
              <TableCell>{school.address}</TableCell>
              <TableCell>{school.contact}</TableCell>
              <TableCell>
                {new Date(school.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingSchool(school)}
                    disabled={isDeleting && deletingSchool?.id === school.id}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(school)}
                    disabled={isDeleting && deletingSchool?.id === school.id}
                  >
                    {isDeleting && deletingSchool?.id === school.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingSchool && (
        <EditSchool
          school={editingSchool}
          open={!!editingSchool}
          setOpen={() => setEditingSchool(null)}
          onSuccess={() => {
            onRefresh();
            setEditingSchool(null);
          }}
        />
      )}
    </div>
  );
};
