import { Card } from "../../components/common";
import { Loading } from "../../components/common";
import { ScheduleCalendar } from "../../components/calendar/ScheduleCalendar";
import { useAuth } from "../../contexts/AuthContext";
import { useDashboardData } from "../../hooks/useDashboardData";
import type { CalendarEvent } from "../../types";

function parseDateOrNow(value?: string): Date {
  if (!value) {
    return new Date();
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export function AdminDashboard() {
  const { user } = useAuth();
  const { data, isLoading, error } = useDashboardData();

  const events: CalendarEvent[] = [
    ...data.assessments.slice(0, 5).map((assessment) => {
      const start = parseDateOrNow(assessment.dueDate);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      return {
        id: `assessment-${assessment.id}`,
        title: assessment.title,
        start,
        end,
        type: "exam" as const,
        location: assessment.classSection?.sectionName,
      };
    }),
    ...data.attendanceSessions.slice(0, 5).map((session) => {
      const start = parseDateOrNow(session.sessionDate);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      return {
        id: `session-${session.id}`,
        title: session.topics || "Attendance Session",
        start,
        end,
        type: "class" as const,
        location: session.classSection?.sectionName,
      };
    }),
  ];

  const stats = [
    {
      label: "Total Students",
      value: data.students.length.toLocaleString(),
      icon: "👨‍🎓",
    },
    {
      label: "Total Teachers",
      value: data.teachers.length.toLocaleString(),
      icon: "👨‍🏫",
    },
    {
      label: "Total Classes",
      value: data.classSections.length.toLocaleString(),
      icon: "🏫",
    },
    {
      label: "Enrollments",
      value: data.enrollments.length.toLocaleString(),
      icon: "📊",
    },
  ];

  if (isLoading) {
    return <Loading text="Loading live dashboard data..." />;
  }

  if (error) {
    return (
      <Card>
        <p className="text-red-600 font-medium">
          Failed to load dashboard data
        </p>
        <p className="text-sm text-gray-600 mt-2">{error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            🟢 System Online
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="flex items-center gap-4">
            <div className="text-4xl">{stat.icon}</div>
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar - Takes 2 columns */}
        <div className="lg:col-span-2">
          <ScheduleCalendar events={events} role="admin" />
        </div>

        {/* Database Snapshot */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Database Snapshot
          </h3>
          <div className="space-y-4">
            {[
              ["Users", data.users.length],
              ["Parents", data.parents.length],
              ["Courses", data.courses.length],
              ["Assessments", data.assessments.length],
              ["Grades", data.grades.length],
              ["Attendance Records", data.attendanceRecords.length],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between pb-2 border-b last:border-0"
              >
                <p className="text-sm text-gray-700">{label}</p>
                <p className="text-sm font-semibold text-gray-900">
                  {String(value)}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Latest Students
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.students.slice(0, 6).map((student) => (
                  <tr key={student.id} className="border-b last:border-0">
                    <td className="py-2 text-gray-900">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="py-2 text-gray-700">{student.email}</td>
                    <td className="py-2 text-gray-700">
                      {student.status || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Courses</h3>
          <div className="space-y-2">
            {data.courses.slice(0, 6).map((course) => (
              <div key={course.id} className="p-2 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">{course.name}</p>
                <p className="text-xs text-gray-500">Code: {course.code}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
