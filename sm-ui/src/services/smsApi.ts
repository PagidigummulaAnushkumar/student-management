import api from "./api";
import type {
  ApiAssessment,
  ApiAssignmentSubmission,
  ApiAttendanceRecord,
  ApiAttendanceSession,
  ApiClassSection,
  ApiCourse,
  ApiEnrollment,
  ApiGrade,
  ApiParent,
  ApiStudent,
  ApiTeacher,
  ApiUser,
} from "../types/api";

type EntityWithId = { id: number };

type ListResponse<T> = T[];

type ResourceClient<
  T extends EntityWithId,
  CreateInput = Partial<T>,
  UpdateInput = Partial<T>,
> = {
  list: () => Promise<T[]>;
  getById: (id: number | string) => Promise<T>;
  create: (payload: CreateInput) => Promise<T>;
  update: (id: number | string, payload: UpdateInput) => Promise<T>;
  patch: (id: number | string, payload: Partial<UpdateInput>) => Promise<T>;
  remove: (id: number | string) => Promise<unknown>;
};

function createResourceClient<
  T extends EntityWithId,
  CreateInput = Partial<T>,
  UpdateInput = Partial<T>,
>(basePath: string): ResourceClient<T, CreateInput, UpdateInput> {
  return {
    async list() {
      const { data } = await api.get<ListResponse<T>>(basePath);
      return data;
    },
    async getById(id) {
      const { data } = await api.get<T>(`${basePath}/${id}`);
      return data;
    },
    async create(payload) {
      const { data } = await api.post<T>(basePath, payload);
      return data;
    },
    async update(id, payload) {
      const { data } = await api.put<T>(`${basePath}/${id}`, payload);
      return data;
    },
    async patch(id, payload) {
      const { data } = await api.patch<T>(`${basePath}/${id}`, payload);
      return data;
    },
    async remove(id) {
      const { data } = await api.delete<unknown>(`${basePath}/${id}`);
      return data;
    },
  };
}

export const smsApi = {
  users: createResourceClient<ApiUser>("/users"),
  students: createResourceClient<ApiStudent>("/students"),
  teachers: createResourceClient<
    ApiTeacher,
    Record<string, unknown>,
    Record<string, unknown>
  >("/teachers"),
  courses: createResourceClient<
    ApiCourse,
    Record<string, unknown>,
    Record<string, unknown>
  >("/courses"),
  classSections: createResourceClient<
    ApiClassSection,
    Record<string, unknown>,
    Record<string, unknown>
  >("/class-sections"),
  enrollments: createResourceClient<
    ApiEnrollment,
    Record<string, unknown>,
    Record<string, unknown>
  >("/enrollments"),
  assessments: createResourceClient<
    ApiAssessment,
    Record<string, unknown>,
    Record<string, unknown>
  >("/assessments"),
  grades: createResourceClient<
    ApiGrade,
    Record<string, unknown>,
    Record<string, unknown>
  >("/grades"),
  attendanceRecords: createResourceClient<
    ApiAttendanceRecord,
    Record<string, unknown>,
    Record<string, unknown>
  >("/attendance-records"),
  attendanceSessions: createResourceClient<
    ApiAttendanceSession,
    Record<string, unknown>,
    Record<string, unknown>
  >("/attendance-sessions"),
  parents: createResourceClient<
    ApiParent,
    Record<string, unknown>,
    Record<string, unknown>
  >("/parents"),
  assignmentSubmissions: {
    async submit(payload: {
      assessmentId: number;
      studentId?: number;
      userId?: number;
      userEmail?: string;
      comments?: string;
      mediaUrl?: string;
      file?: File;
    }) {
      const formData = new FormData();
      formData.append("assessmentId", payload.assessmentId.toString());

      if (typeof payload.studentId === "number") {
        formData.append("studentId", payload.studentId.toString());
      }

      if (typeof payload.userId === "number") {
        formData.append("userId", payload.userId.toString());
      }

      if (payload.userEmail) {
        formData.append("userEmail", payload.userEmail);
      }

      if (payload.comments) {
        formData.append("comments", payload.comments);
      }

      if (payload.mediaUrl) {
        formData.append("mediaUrl", payload.mediaUrl);
      }

      if (payload.file) {
        formData.append("file", payload.file);
      }

      const { data } = await api
        .getInstance()
        .post<ApiAssignmentSubmission>("/assignment-submissions", formData);

      return data;
    },
    async listByStudent(studentId: number | string) {
      const { data } = await api.get<ApiAssignmentSubmission[]>(
        `/assignment-submissions/student/${studentId}`,
      );
      return data;
    },
  },
};

export default smsApi;
