import { Bus } from "@/types/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface BusListProps {
  buses: Bus[];
  onRefresh: () => void;
}

export const BusList = ({ buses, onRefresh }: BusListProps) => {
  if (buses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No buses found. Add your first bus to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bus Number</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buses.map((bus) => (
            <TableRow key={bus.id}>
              <TableCell className="font-medium">{bus.busNumber}</TableCell>
              <TableCell>{bus.capacity}</TableCell>
              <TableCell>{bus.driverName}</TableCell>
              <TableCell>{bus.driverContact}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  bus.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {bus.isActive ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}; 