import { Outlet, Link } from "react-router-dom";
import { Users, BookOpen, Calendar, Home, LogOut } from "lucide-react";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold">School Management System</div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded text-gray-300 hover:text-white"
          >
            <Home size={20} /> Dashboard
          </Link>

          <div className="text-xs font-bold text-slate-500 uppercase mt-6 mb-2">
            People
          </div>
          <Link
            to="/students"
            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded text-gray-300 hover:text-white"
          >
            <Users size={20} /> Students
          </Link>
          <Link
            to="/teachers"
            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded text-gray-300 hover:text-white"
          >
            <Users size={20} /> Teachers
          </Link>

          <div className="text-xs font-bold text-slate-500 uppercase mt-6 mb-2">
            Academics
          </div>
          <Link
            to="/courses"
            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded text-gray-300 hover:text-white"
          >
            <BookOpen size={20} /> Courses
          </Link>
          <Link
            to="/attendance"
            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded text-gray-300 hover:text-white"
          >
            <Calendar size={20} /> Attendance
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 text-red-400 hover:text-red-300">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet /> {/* This is where your screens will appear */}
      </main>
    </div>
  );
}
