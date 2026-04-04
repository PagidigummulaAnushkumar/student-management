export type Role = "admin" | "teacher" | "student" | "parent";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: Role;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
}

export interface UpdateProfileInput {
  name: string;
  email: string;
  password?: string;
}

export interface DashboardStats {
  totalUsers?: number;
  totalStudents?: number;
  totalTeachers?: number;
  totalClasses?: number;
  attendance?: number;
  upcomingEvents?: CalendarEvent[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: "class" | "exam" | "meeting" | "event" | "holiday";
  description?: string;
  location?: string;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  attendance: number;
  grades: Record<string, number>;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  classes: string[];
}

export interface Class {
  id: string;
  name: string;
  teacher: string;
  schedule: string;
  students: number;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: Date;
  status: "pending" | "submitted" | "graded";
  grade?: number;
}

export interface Child {
  id: string;
  name: string;
  grade: string;
  attendance: number;
  recentGrades: Record<string, number>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
}
