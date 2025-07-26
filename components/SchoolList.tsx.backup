import { useState } from "react";
import { School } from "@/types/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EditSchool } from "./EditSchool";

interface SchoolListProps {
  schools: School[];
  onRefresh: () => void;
}

export const SchoolList = ({ schools, onRefresh }: SchoolListProps) => {
  const [editingSchool, setEditingSchool] = useState<School | null>(null);

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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditingSchool(school)}
                >
                  Edit
                </Button>
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