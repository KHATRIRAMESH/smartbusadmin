import { useState } from "react";
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
import { useAuthStore } from "@/store/authStore";

interface CreateSchoolProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
}

export const CreateSchool = ({ open, setOpen, onSuccess }: CreateSchoolProps) => {
  const [schoolName, setSchoolName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName || !address || !contact) {
      alert("All fields are required");
      return;
    }

    if (!accessToken) {
      alert("Authentication required. Please sign in again.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/super-admin/create-school`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            schoolName,
            address,
            contact,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert("School created successfully!");
        setOpen(false);
        onSuccess();
        // Reset form
        setSchoolName("");
        setAddress("");
        setContact("");
      } else {
        const errorData = await response.json();
        if (response.status === 401) {
          alert("Authentication failed. Please sign in again.");
          window.location.href = "/";
        } else {
          alert(errorData.message || "Failed to create school");
        }
      }
    } catch (error) {
      console.error("Error creating school:", error);
      alert("Failed to create school. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create School</DialogTitle>
          <DialogDescription>
            Add a new school to the system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">School Name</Label>
            <Input
              id="name"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
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
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
                value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Enter school phone"
              required
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
              {isLoading ? "Creating..." : "Create School"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
