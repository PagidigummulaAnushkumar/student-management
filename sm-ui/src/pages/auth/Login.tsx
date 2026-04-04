import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Input, Card } from "../../components/common";
import { ROUTES } from "../../utils/constants";
import type { Role } from "../../types";
import { ROLES } from "../../utils/constants";
import { getDashboardRoute } from "../../utils/auth";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role:
      (location.state as { selectedRole?: Role })?.selectedRole || "student",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const user = await login({
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      navigate(getDashboardRoute(user.role), { replace: true });
    } catch (err) {
      // Error is handled by AuthContext
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md" padding="lg">
        <div className="text-center mb-8">
          <span className="text-4xl mb-2 block">🎓</span>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a
            </label>
            <div className="grid grid-cols-4 gap-2">
              {ROLES.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: role.value })}
                  className={`p-2 rounded-lg text-center transition-all ${
                    formData.role === role.value
                      ? `${role.color} text-white ring-2 ring-offset-2 ring-primary-500`
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span className="text-xl block">{role.icon}</span>
                  <span className="text-xs mt-1 block capitalize">
                    {role.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="you@example.com"
            required
            fullWidth
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="••••••••"
            required
            fullWidth
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <Button type="submit" fullWidth isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to={ROUTES.SIGNUP}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign up
            </Link>
          </p>
          <Link
            to={ROUTES.HOME}
            className="text-sm text-gray-500 hover:text-gray-700 mt-2 block"
          >
            ← Back to home
          </Link>
        </div>
      </Card>
    </div>
  );
}
