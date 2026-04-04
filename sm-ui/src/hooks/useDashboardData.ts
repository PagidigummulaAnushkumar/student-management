import { useEffect, useState } from "react";
import smsApi from "../services/smsApi";
import type { DashboardDataBundle } from "../types/api";

const initialData: DashboardDataBundle = {
  users: [],
  students: [],
  teachers: [],
  courses: [],
  classSections: [],
  enrollments: [],
  assessments: [],
  grades: [],
  attendanceRecords: [],
  attendanceSessions: [],
  parents: [],
};

export function useDashboardData() {
  const [data, setData] = useState<DashboardDataBundle>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [
          users,
          students,
          teachers,
          courses,
          classSections,
          enrollments,
          assessments,
          grades,
          attendanceRecords,
          attendanceSessions,
          parents,
        ] = await Promise.all([
          smsApi.users.list(),
          smsApi.students.list(),
          smsApi.teachers.list(),
          smsApi.courses.list(),
          smsApi.classSections.list(),
          smsApi.enrollments.list(),
          smsApi.assessments.list(),
          smsApi.grades.list(),
          smsApi.attendanceRecords.list(),
          smsApi.attendanceSessions.list(),
          smsApi.parents.list(),
        ]);

        if (!mounted) {
          return;
        }

        setData({
          users,
          students,
          teachers,
          courses,
          classSections,
          enrollments,
          assessments,
          grades,
          attendanceRecords,
          attendanceSessions,
          parents,
        });
      } catch (err) {
        if (!mounted) {
          return;
        }

        const message =
          err instanceof Error ? err.message : "Failed to load dashboard data";
        setError(message);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  return { data, isLoading, error };
}
