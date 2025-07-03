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

interface CreateBusProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
}

export const CreateBus = ({ open, setOpen, onSuccess }: CreateBusProps) => {
  const [busNumber, setBusNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { accessToken } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!busNumber || !capacity) {
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
        `${process.env.NEXT_PUBLIC_API_URL}/super-admin/create-bus`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            busNumber,
            capacity: parseInt(capacity),
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert("Bus created successfully!");
        setOpen(false);
        onSuccess();
        // Reset form
        setBusNumber("");
        setCapacity("");
      } else {
        const errorData = await response.json();
        if (response.status === 401) {
          alert("Authentication failed. Please sign in again.");
          window.location.href = "/";
        } else {
          alert(errorData.message || "Failed to create bus");
        }
      }
    } catch (error) {
      console.error("Error creating bus:", error);
      alert("Failed to create bus. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Bus</DialogTitle>
          <DialogDescription>
            Add a new bus to your school fleet.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="busNumber">Bus Number</Label>
            <Input
              id="busNumber"
              value={busNumber}
              onChange={(e) => setBusNumber(e.target.value)}
              placeholder="Enter bus number"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="Enter passenger capacity"
              min="1"
              max="100"
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
              {isLoading ? "Creating..." : "Create Bus"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 