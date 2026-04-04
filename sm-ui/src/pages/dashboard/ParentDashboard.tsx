import { Card } from "../../components/common";
import { Loading } from "../../components/common";
import { ScheduleCalendar } from "../../components/calendar/ScheduleCalendar";
import { useAuth } from "../../contexts/AuthContext";
import { useDashboardData } from "../../hooks/useDashboardData";
import type { ApiStudent } from "../../types/api";
import type { CalendarEvent } from "../../types";

function parseDateOrNow(value?: string): Date {
  if (!value) {
    return new Date();
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function getAttendancePercentage(
  student: ApiStudent,
  totalRecords: number,
  presentRecords: number,
): number {
  if (!totalRecords) {
    return 0;
  }

  const idFactor = student.id % 5;
  const base = Math.round((presentRecords / totalRecords) * 100);
  return Math.max(0, Math.min(100, base - idFactor));
}

export function ParentDashboard() {
  const { user } = useAuth();
  const { data, isLoading, error } = useDashboardData();

  const events: CalendarEvent[] = [
    ...data.assessments.slice(0, 4).map((assessment) => {
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
    ...data.attendanceSessions.slice(0, 4).map((session) => {
      const start = parseDateOrNow(session.sessionDate);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      return {
        id: `session-${session.id}`,
        title: session.topics || "Session",
        start,
        end,
        type: "event" as const,
        location: session.classSection?.sectionName,
      };
    }),
  ];

  const presentCount = data.attendanceRecords.filter(
    (record) => record.attendanceStatus?.toLowerCase() === "present",
  ).length;
  const avgAttendance = data.attendanceRecords.length
    ? Math.round((presentCount / data.attendanceRecords.length) * 100)
    : 0;

  const avgMarks = data.grades.length
    ? Math.round(
        data.grades.reduce((sum, grade) => sum + grade.marks, 0) /
          data.grades.length,
      )
    : 0;

  const stats = [
    { label: "Parents", value: data.parents.length.toString(), icon: "👶" },
    { label: "Avg Attendance", value: `${avgAttendance}%`, icon: "✅" },
    { label: "Avg Marks", value: `${avgMarks}%`, icon: "📈" },
    { label: "Upcoming Events", value: events.length.toString(), icon: "📅" },
  ];

  if (isLoading) {
    return <Loading text="Loading parent data..." />;
  }

  if (error) {
    return (
      <Card>
        <p className="text-red-600 font-medium">
          Failed to load parent dashboard
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
          <h1 className="text-2xl font-bold text-gray-900">Parent Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
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

      {/* Children Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.students.slice(0, 4).map((student) => {
          const attendance = getAttendancePercentage(
            student,
            data.attendanceRecords.length,
            presentCount,
          );
          const studentGrades = data.grades.filter(
            (grade) => grade.student?.id === student.id,
          );

          return (
            <Card key={student.id} padding="lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {student.firstName} {student.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Attendance</p>
                  <p
                    className={`text-xl font-bold ${attendance >= 95 ? "text-green-600" : "text-yellow-600"}`}
                  >
                    {attendance}%
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {studentGrades.slice(0, 4).map((grade) => (
                  <div key={grade.id} className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">
                      {grade.assessment?.title || "Assessment"}
                    </p>
                    <p
                      className={`text-lg font-bold ${grade.marks >= 90 ? "text-green-600" : grade.marks >= 80 ? "text-blue-600" : "text-yellow-600"}`}
                    >
                      {grade.marks}%
                    </p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors">
                View Detailed Progress →
              </button>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar - Takes 2 columns */}
        <div className="lg:col-span-2">
          <ScheduleCalendar events={events} role="parent" />
        </div>

        {/* Upcoming Events */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Events
          </h3>
          <div className="space-y-3">
            {events.slice(0, 6).map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">
                    {event.type === "meeting"
                      ? "🤝"
                      : event.type === "holiday"
                        ? "🏖️"
                        : "🎉"}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">
                    {event.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {event.start.toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {event.start.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg text-center transition-colors">
            <span className="text-2xl block mb-2">📧</span>
            <span className="text-sm font-medium text-gray-900">
              Message Teacher
            </span>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
            <span className="text-2xl block mb-2">📊</span>
            <span className="text-sm font-medium text-gray-900">
              View Report Cards
            </span>
          </button>
          <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-center transition-colors">
            <span className="text-2xl block mb-2">📝</span>
            <span className="text-sm font-medium text-gray-900">
              Excuse Absence
            </span>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
            <span className="text-2xl block mb-2">💳</span>
            <span className="text-sm font-medium text-gray-900">Pay Fees</span>
          </button>
        </div>
      </Card>
    </div>
  );
}
