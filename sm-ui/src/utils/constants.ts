import type { Role } from "../types";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const ROLES: {
  value: Role;
  label: string;
  icon: string;
  color: string;
}[] = [
  { value: "admin", label: "Admin", icon: "👨‍💼", color: "bg-purple-500" },
  { value: "teacher", label: "Teacher", icon: "👨‍🏫", color: "bg-blue-500" },
  { value: "student", label: "Student", icon: "👨‍🎓", color: "bg-green-500" },
  { value: "parent", label: "Parent", icon: "👪", color: "bg-orange-500" },
];

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: {
    ADMIN: "/dashboard/admin",
    TEACHER: "/dashboard/teacher",
    STUDENT: "/dashboard/student",
    PARENT: "/dashboard/parent",
  },
};

export const DASHBOARD_TITLES: Record<Role, string> = {
  admin: "Admin Dashboard",
  teacher: "Teacher Dashboard",
  student: "Student Dashboard",
  parent: "Parent Dashboard",
};
