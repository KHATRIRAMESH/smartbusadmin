import { DashboardStats as Stats } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStatsProps {
  stats: Stats;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const statCards = [
    {
      title: "Total Schools",
      value: stats.totalSchools,
      description: "Registered schools",
    },
    {
      title: "School Admins",
      value: stats.totalSchoolAdmins,
      description: "Active administrators",
    },
    {
      title: "Total Buses",
      value: stats.totalBuses,
      description: "Fleet vehicles",
    },
    {
      title: "Active Routes",
      value: stats.totalRoutes,
      description: "Transportation routes",
    },
    {
      title: "Students",
      value: stats.totalChildren,
      description: "Registered children",
    },
    {
      title: "Parents",
      value: stats.totalParents,
      description: "Parent accounts",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 