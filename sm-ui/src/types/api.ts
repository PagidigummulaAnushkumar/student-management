export interface ApiUser {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
}

export interface ApiStudent {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
  enrollmentDate?: string;
  userId?: number;
  gradeId?: number;
  gender?: string;
  status?: string;
}

export interface ApiTeacher {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber?: number;
  bio?: string;
  yearsOfExperience?: number;
  employeeNumber?: string;
  specialization?: string;
  user?: ApiUser;
}

export interface ApiCourse {
  id: number;
  name: string;
  code: string;
}

export interface ApiClassSection {
  id: number;
  sectionName: string;
  mode?: string;
  capacity?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  course?: ApiCourse;
  teacher?: ApiTeacher;
}

export interface ApiEnrollment {
  id: number;
  status?: string;
  enrollmentDate?: string;
  student?: ApiStudent;
  classSection?: ApiClassSection;
}

export interface ApiAssessment {
  id: number;
  title: string;
  assessmentType?: string;
  instructions?: string;
  dueDate?: string;
  maxMarks?: number;
  classSection?: ApiClassSection;
}

export interface ApiAssignmentSubmission {
  id: number;
  assessment?: ApiAssessment;
  student?: ApiStudent;
  comments?: string;
  mediaUrl?: string;
  originalFileName?: string;
  fileContentType?: string;
  fileSize?: number;
  submittedAt?: string;
}

export interface ApiGrade {
  id: number;
  marks: number;
  student?: ApiStudent;
  assessment?: ApiAssessment;
}

export interface ApiAttendanceSession {
  id: number;
  sessionDate?: string;
  startTime?: string;
  endTime?: string;
  topics?: string;
  notes?: string;
  classSection?: ApiClassSection;
}

export interface ApiAttendanceRecord {
  id: number;
  remarks?: string;
  attendanceStatus?: string;
  student?: ApiStudent;
  attendanceSession?: ApiAttendanceSession;
}

export interface ApiParent {
  id: number;
  firstName?: string;
  lastName?: string;
  phoneNumber?: number;
  address?: string;
  relationshipToStudent?: string;
  user?: ApiUser;
}

export interface DashboardDataBundle {
  users: ApiUser[];
  students: ApiStudent[];
  teachers: ApiTeacher[];
  courses: ApiCourse[];
  classSections: ApiClassSection[];
  enrollments: ApiEnrollment[];
  assessments: ApiAssessment[];
  grades: ApiGrade[];
  attendanceRecords: ApiAttendanceRecord[];
  attendanceSessions: ApiAttendanceSession[];
  parents: ApiParent[];
}
