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
import { School } from "@/types/types";
import { useAuthStore } from "@/store/authStore";

interface EditSchoolProps {
  school: School;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
}

export const EditSchool = ({
  school,
  open,
  setOpen,
  onSuccess,
}: EditSchoolProps) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = useAuthStore();

  // Initialize form with school data
  useEffect(() => {
    if (school) {
      setName(school.name);
      setAddress(school.address);
      setContact(school.contact);
    }
  }, [school]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert("School name is required");
      return;
    }

    if (!accessToken) {
      alert("Authentication required. Please sign in again.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/super-admin/schools/${school.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name,
            address,
            contact,
          }),
        }
      );

      if (response.ok) {
        alert("School updated successfully!");
        setOpen(false);
        onSuccess();
      } else {
        const errorData = await response.json();
        if (response.status === 401) {
          alert("Authentication failed. Please sign in again.");
          window.location.href = "/";
        } else {
          alert(errorData.message || "Failed to update school");
        }
      }
    } catch (error) {
      console.error("Error updating school:", error);
      alert("Failed to update school. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit School</DialogTitle>
          <DialogDescription>
            Update the school's information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">School Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter school name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter school address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact">Contact</Label>
            <Input
              id="contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Enter contact information"
            />
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
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 