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
import { SchoolAdmin, School } from "@/types/types";
import { useAuthStore } from "@/store/authStore";

interface EditSchoolAdminProps {
  admin: SchoolAdmin;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
}

export const EditSchoolAdmin = ({
  admin,
  open,
  setOpen,
  onSuccess,
}: EditSchoolAdminProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = useAuthStore();

  // Initialize form with admin data
  useEffect(() => {
    if (admin) {
      setName(admin.name);
      setEmail(admin.email);
      setPhone(admin.phone || "");
      setAddress(admin.address || "");
      setSchoolId(admin.schoolId);
    }
  }, [admin]);

  // Fetch schools for dropdown
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/super-admin/schools`,
          {
            headers: {
              "Authorization": `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSchools(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching schools:", error);
      }
    };

    if (open) {
      fetchSchools();
    }
  }, [open, accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !schoolId) {
      alert("Name, email, and school are required");
      return;
    }

    if (!accessToken) {
      alert("Authentication required. Please sign in again.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/super-admin/school-admins/${admin.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            address,
            schoolId,
          }),
        }
      );

      if (response.ok) {
        alert("School admin updated successfully!");
        setOpen(false);
        onSuccess();
      } else {
        const errorData = await response.json();
        if (response.status === 401) {
          alert("Authentication failed. Please sign in again.");
          window.location.href = "/";
        } else {
          alert(errorData.message || "Failed to update school admin");
        }
      }
    } catch (error) {
      console.error("Error updating school admin:", error);
      alert("Failed to update school admin. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit School Administrator</DialogTitle>
          <DialogDescription>
            Update the school administrator's information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter administrator name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address (Optional)</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="school">School</Label>
            <select
              id="school"
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Select a school</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Admin"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 