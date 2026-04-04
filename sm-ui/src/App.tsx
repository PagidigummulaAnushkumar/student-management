import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Navbar, Sidebar } from "./components/layout";
import { Home } from "./pages/Home";
import { Login, Signup } from "./pages/auth";
import {
  AdminDashboard,
  TeacherDashboard,
  StudentDashboard,
  ParentDashboard,
  DashboardProfilePage,
  StudentCoursesPage,
  StudentAssignmentsPage,
  StudentGradesPage,
  StudentMessagesPage,
  StudentLearningResourcesPage,
} from "./pages/dashboard";
import { ROUTES } from "./utils/constants";
import type { Role } from "./types";
import { getDashboardRoute } from "./utils/auth";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ role }: { role?: Role }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (role && user?.role !== role) {
    return (
      <Navigate
        to={user?.role ? getDashboardRoute(user.role) : ROUTES.HOME}
        replace
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        {user && <Sidebar role={user.role} />}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.SIGNUP} element={<Signup />} />

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route path={ROUTES.DASHBOARD.ADMIN} element={<AdminDashboard />} />
        <Route
          path={ROUTES.DASHBOARD.ADMIN + "/profile"}
          element={<DashboardProfilePage />}
        />
        <Route
          path={ROUTES.DASHBOARD.ADMIN + "/*"}
          element={<Navigate to={ROUTES.DASHBOARD.ADMIN} replace />}
        />
      </Route>

      <Route element={<ProtectedRoute role="teacher" />}>
        <Route path={ROUTES.DASHBOARD.TEACHER} element={<TeacherDashboard />} />
        <Route
          path={ROUTES.DASHBOARD.TEACHER + "/profile"}
          element={<DashboardProfilePage />}
        />
        <Route
          path={ROUTES.DASHBOARD.TEACHER + "/*"}
          element={<Navigate to={ROUTES.DASHBOARD.TEACHER} replace />}
        />
      </Route>

      <Route element={<ProtectedRoute role="student" />}>
        <Route path={ROUTES.DASHBOARD.STUDENT} element={<StudentDashboard />} />
        <Route
          path={ROUTES.DASHBOARD.STUDENT + "/profile"}
          element={<DashboardProfilePage />}
        />
        <Route
          path={ROUTES.DASHBOARD.STUDENT + "/courses"}
          element={<StudentCoursesPage />}
        />
        <Route
          path={ROUTES.DASHBOARD.STUDENT + "/assignments"}
          element={<StudentAssignmentsPage />}
        />
        <Route
          path={ROUTES.DASHBOARD.STUDENT + "/grades"}
          element={<StudentGradesPage />}
        />
        <Route
          path={ROUTES.DASHBOARD.STUDENT + "/messages"}
          element={<StudentMessagesPage />}
        />
        <Route
          path={ROUTES.DASHBOARD.STUDENT + "/resources"}
          element={<StudentLearningResourcesPage />}
        />
        <Route
          path={ROUTES.DASHBOARD.STUDENT + "/*"}
          element={<Navigate to={ROUTES.DASHBOARD.STUDENT} replace />}
        />
      </Route>

      <Route element={<ProtectedRoute role="parent" />}>
        <Route path={ROUTES.DASHBOARD.PARENT} element={<ParentDashboard />} />
        <Route
          path={ROUTES.DASHBOARD.PARENT + "/profile"}
          element={<DashboardProfilePage />}
        />
        <Route
          path={ROUTES.DASHBOARD.PARENT + "/*"}
          element={<Navigate to={ROUTES.DASHBOARD.PARENT} replace />}
        />
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
