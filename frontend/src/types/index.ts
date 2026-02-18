export interface User {
  id: bigint;
  email: string;
  passwordHash: string;
  role: "student" | "teacher" | "admin";
}
export interface Student extends User {
  id: bigint;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  enrollmentDate: Date;
}
export interface Teacher extends User {
  id: bigint;
  user: User;
  employeeNumber: string;
  specialization: string;
}
export interface Course {
  id: bigint;
  name: String;
  code: String;
}
export interface Parent {
  id: bigint;
  user: User;
}
export interface Grade {
  id: bigint;
  assessment: Assignment;
  student: Student;
  marks: bigint;
}
export interface Enrollment {
  id: bigint;
  studentId: Student;
  classSection: Course;
  status: string;
  enrollmentDate: Date;
}
export interface classSection {
  id: bigint;
  course: Course;
  teacher: Teacher;
  sectionName: string;
}
export interface AttendanceSession {
  id: bigint;
  classSection: classSection;
  sessionDate: Date;
}
export interface AttendanceRecord {
  id: bigint;
  session: AttendanceSession;
  student: Student;
  present: boolean;
}
export interface Assignment {
  id: bigint;
  title: string;
  description: string;
  classSection: classSection;
  maxMarks: bigint;
}
