import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthRole } from "@/types/types";

interface WelcomePageProps {
  onRoleSelect: (role: AuthRole) => void;
}

export const WelcomePage = ({ onRoleSelect }: WelcomePageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to SmartBus Admin
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive school bus transportation management system for administrators
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Super Admin Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onRoleSelect("super_admin")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                Super Administrator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Manage multiple schools and create school administrators. Oversee the entire transportation network.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Create and manage schools</li>
                <li>• Assign school administrators</li>
                <li>• View system-wide statistics</li>
                <li>• Monitor all transportation operations</li>
              </ul>
            </CardContent>
          </Card>

          {/* School Admin Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onRoleSelect("school_admin")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                School Administrator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Manage buses, routes, children, and parents for your specific school. Handle daily transportation operations.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Manage bus fleet and drivers</li>
                <li>• Create and assign routes</li>
                <li>• Register children and parents</li>
                <li>• Monitor daily operations</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Click on a role above to get started, or{" "}
            <span className="text-blue-600 font-medium">contact your system administrator</span> if you need access.
          </p>
        </div>
      </div>
    </div>
  );
}; 