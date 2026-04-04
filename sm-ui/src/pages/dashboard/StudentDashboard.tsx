import { Card } from "../../components/common";
import { Loading } from "../../components/common";
import { ScheduleCalendar } from "../../components/calendar/ScheduleCalendar";
import { useNavigate } from "react-router-dom";
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

export function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading, error } = useDashboardData();

  const events: CalendarEvent[] = [
    ...data.classSections.slice(0, 4).map((section) => {
      const start = parseDateOrNow(section.startDate);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      return {
        id: `class-${section.id}`,
        title: section.sectionName,
        start,
        end,
        type: "class" as const,
        location: section.course?.name,
      };
    }),
    ...data.assessments.slice(0, 4).map((assessment) => {
      const start = parseDateOrNow(assessment.dueDate);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      return {
        id: `exam-${assessment.id}`,
        title: assessment.title,
        start,
        end,
        type: "exam" as const,
        location: assessment.classSection?.sectionName,
      };
    }),
  ];

  const attendancePresent = data.attendanceRecords.filter(
    (record) => record.attendanceStatus?.toLowerCase() === "present",
  ).length;
  const attendanceRate = data.attendanceRecords.length
    ? Math.round((attendancePresent / data.attendanceRecords.length) * 100)
    : 0;

  const averageMarks = data.grades.length
    ? Math.round(
        data.grades.reduce((sum, grade) => sum + grade.marks, 0) /
          data.grades.length,
      )
    : 0;

  const stats = [
    { label: "Attendance", value: `${attendanceRate}%`, icon: "✅" },
    { label: "Average Marks", value: `${averageMarks}%`, icon: "📈" },
    {
      label: "Assessments",
      value: data.assessments.length.toString(),
      icon: "📝",
    },
    {
      label: "Classes",
      value: data.classSections.length.toString(),
      icon: "📚",
    },
  ];

  if (isLoading) {
    return <Loading text="Loading student data..." />;
  }

  if (error) {
    return (
      <Card>
        <p className="text-red-600 font-medium">
          Failed to load student dashboard
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
          <h1 className="text-2xl font-bold text-gray-900">
            Student Dashboard
          </h1>
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar - Takes 2 columns */}
        <div className="lg:col-span-2">
          <ScheduleCalendar events={events} role="student" />
        </div>

        {/* My Classes */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            My Classes
          </h3>
          <div className="space-y-3">
            {data.classSections.slice(0, 6).map((section) => (
              <div
                key={section.id}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <p className="font-medium text-gray-900">
                  {section.sectionName}
                </p>
                <p className="text-sm text-gray-500">
                  {section.course?.name || "No course"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Teacher: {section.teacher?.firstName || "N/A"}{" "}
                  {section.teacher?.lastName || ""}
                </p>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All Classes →
          </button>
        </Card>
      </div>

      {/* Assignments Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Assignments
          </h3>
          <div className="space-y-3">
            {data.assessments.slice(0, 6).map((assessment) => (
              <div
                key={assessment.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {assessment.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {assessment.classSection?.sectionName || "No section"}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                    {assessment.assessmentType || "Assessment"}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    Due: {assessment.dueDate || "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Grades */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Grades
          </h3>
          <div className="space-y-3">
            {data.grades.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium text-gray-900">
                  {item.assessment?.title || "Assessment"}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-primary-600">
                    {item.marks}%
                  </span>
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-sm font-medium">
                    {item.marks >= 90
                      ? "A"
                      : item.marks >= 80
                        ? "B"
                        : item.marks >= 70
                          ? "C"
                          : "D"}
                  </span>
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
          <button
            type="button"
            onClick={() => navigate("/dashboard/student/assignments")}
            className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg text-center transition-colors"
          >
            <span className="text-2xl block mb-2">📝</span>
            <span className="text-sm font-medium text-gray-900">
              Submit Assignment
            </span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/student/grades")}
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors"
          >
            <span className="text-2xl block mb-2">📊</span>
            <span className="text-sm font-medium text-gray-900">
              View Report Card
            </span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/student/messages")}
            className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-center transition-colors"
          >
            <span className="text-2xl block mb-2">📧</span>
            <span className="text-sm font-medium text-gray-900">
              Message Teacher
            </span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/student/resources")}
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors"
          >
            <span className="text-2xl block mb-2">📚</span>
            <span className="text-sm font-medium text-gray-900">
              Learning Resources
            </span>
          </button>
        </div>
      </Card>
    </div>
  );
}
