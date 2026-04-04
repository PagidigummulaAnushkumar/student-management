import { useNavigate } from "react-router-dom";
import { Card, Button } from "../components/common";
import { ROLES, ROUTES } from "../utils/constants";
import type { Role } from "../types";

export function Home() {
  const navigate = useNavigate();

  const handleRoleSelect = (role: Role) => {
    navigate(ROUTES.LOGIN, { state: { selectedRole: role } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <span className="text-6xl mb-4 block">🎓</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Student Management System
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A comprehensive platform for managing students, teachers, classes,
              and more. Choose your role to get started.
            </p>
          </div>
        </div>
      </div>

      {/* Role Selection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
          Select Your Role
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ROLES.map((role) => (
            <Card key={role.value} padding="none" hover className="group">
              <div
                onClick={() => handleRoleSelect(role.value)}
                className="p-6 text-center cursor-pointer"
              >
                <div
                  className={`w-16 h-16 ${role.color} rounded-full flex items-center justify-center mx-auto mb-4 text-3xl group-hover:scale-110 transition-transform`}
                >
                  {role.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {role.label}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {role.value === "admin" &&
                    "Manage users, classes, and system settings"}
                  {role.value === "teacher" &&
                    "Manage classes, students, and assignments"}
                  {role.value === "student" &&
                    "View schedule, grades, and assignments"}
                  {role.value === "parent" &&
                    "Monitor child's progress and attendance"}
                </p>
                <Button variant="outline" size="sm" fullWidth>
                  Continue as {role.label}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">📅</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Smart Calendar
              </h3>
              <p className="text-gray-600 text-sm">
                View your schedule, classes, exams, and events in one place
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Real-time Analytics
              </h3>
              <p className="text-gray-600 text-sm">
                Track performance, attendance, and progress with detailed
                insights
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Communication
              </h3>
              <p className="text-gray-600 text-sm">
                Stay connected with teachers, students, and parents
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
