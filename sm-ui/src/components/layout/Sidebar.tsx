import { NavLink } from "react-router-dom";
import { clsx } from "clsx";
import type { Role } from "../../types";

interface SidebarItem {
  label: string;
  path: string;
  icon: string;
}

const commonItems: SidebarItem[] = [
  { label: "Dashboard", path: "", icon: "📊" },
  { label: "Calendar", path: "calendar", icon: "📅" },
  { label: "Notifications", path: "notifications", icon: "🔔" },
  { label: "Profile", path: "profile", icon: "👤" },
];

const roleItems: Record<Role, SidebarItem[]> = {
  admin: [
    { label: "Users", path: "users", icon: "👥" },
    { label: "Classes", path: "classes", icon: "🏫" },
    { label: "Settings", path: "settings", icon: "⚙️" },
  ],
  teacher: [
    { label: "My Classes", path: "classes", icon: "📚" },
    { label: "Students", path: "students", icon: "👨‍🎓" },
    { label: "Assignments", path: "assignments", icon: "📝" },
  ],
  student: [
    { label: "My Courses", path: "courses", icon: "📚" },
    { label: "Assignments", path: "assignments", icon: "📝" },
    { label: "Grades", path: "grades", icon: "📈" },
    { label: "Message Teacher", path: "messages", icon: "📧" },
    { label: "Learning Resources", path: "resources", icon: "🔗" },
  ],
  parent: [
    { label: "My Children", path: "children", icon: "👶" },
    { label: "Progress", path: "progress", icon: "📈" },
    { label: "Messages", path: "messages", icon: "💬" },
  ],
};

interface SidebarProps {
  role: Role;
  collapsed?: boolean;
}

export function Sidebar({ role, collapsed = false }: SidebarProps) {
  const items = [...commonItems, ...roleItems[role]];

  return (
    <aside
      className={clsx(
        "bg-gray-900 text-white min-h-[calc(100vh-4rem)]",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <nav className="p-4 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={`/dashboard/${role}/${item.path === "dashboard" ? "" : item.path}`}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-primary-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white",
              )
            }
          >
            <span className="text-xl">{item.icon}</span>
            {!collapsed && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
