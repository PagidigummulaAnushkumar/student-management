import { useEffect, useMemo, useState } from "react";
import { Button, Card, Input, Loading } from "../../components/common";
import { useAuth } from "../../contexts/AuthContext";
import { useDashboardData } from "../../hooks/useDashboardData";
import smsApi from "../../services/smsApi";
import { API_BASE_URL } from "../../utils/constants";
import type {
  ApiAssignmentSubmission,
  ApiEnrollment,
  ApiStudent,
} from "../../types/api";

function resolveCurrentStudent(
  students: ApiStudent[],
  user: { id?: string; email?: string; name?: string } | null,
): ApiStudent | null {
  const userId = Number(user?.id);
  const normalizedUserEmail = user?.email?.trim().toLowerCase() || "";
  const normalizedUserName = user?.name?.trim().toLowerCase() || "";

  const studentByUserId = Number.isFinite(userId)
    ? students.find((student) => student.userId === userId)
    : undefined;

  if (studentByUserId) {
    return studentByUserId;
  }

  const studentByEmail = normalizedUserEmail
    ? students.find(
        (student) => student.email.trim().toLowerCase() === normalizedUserEmail,
      )
    : undefined;

  if (studentByEmail) {
    return studentByEmail;
  }

  const studentByName = normalizedUserName
    ? students.find((student) => {
        const fullName = `${student.firstName} ${student.lastName}`
          .trim()
          .toLowerCase();
        return fullName === normalizedUserName;
      })
    : undefined;

  return studentByName || null;
}

export function DashboardProfilePage() {
  const { user, updateProfile, isLoading, error } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, [user]);

  const isDirty = useMemo(() => {
    const userName = user?.name || "";
    const userEmail = user?.email || "";
    return (
      name.trim() !== userName ||
      email.trim() !== userEmail ||
      password.trim().length > 0
    );
  }, [email, name, password, user?.email, user?.name]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage(null);
    setFormError(null);

    if (!name.trim()) {
      setFormError("Name is required.");
      return;
    }

    if (!email.trim()) {
      setFormError("Email is required.");
      return;
    }

    if (password && password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    try {
      await updateProfile({
        name,
        email,
        password: password.trim() ? password : undefined,
      });
      setPassword("");
      setConfirmPassword("");
      setSuccessMessage("Your profile has been updated successfully.");
    } catch {
      // Auth context exposes the API error through `error`.
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-1">Update your account information</p>
      </div>

      <Card>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            fullWidth
            required
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            fullWidth
            required
          />

          <div>
            <p className="text-sm text-gray-500 mb-1">Role</p>
            <p className="text-base font-semibold text-gray-900 capitalize">
              {user?.role || "N/A"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="New Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              fullWidth
              placeholder="Leave empty to keep current password"
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              fullWidth
              placeholder="Re-enter new password"
            />
          </div>

          {formError && <p className="text-sm text-red-600">{formError}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {successMessage && (
            <p className="text-sm text-green-700">{successMessage}</p>
          )}

          <div className="pt-2">
            <Button type="submit" isLoading={isLoading} disabled={!isDirty}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export function StudentCoursesPage() {
  const { user } = useAuth();
  const { data, isLoading, error } = useDashboardData();
  const [enrollments, setEnrollments] = useState<ApiEnrollment[]>([]);
  const [enrollingSectionId, setEnrollingSectionId] = useState<number | null>(
    null,
  );
  const [courseError, setCourseError] = useState<string | null>(null);
  const [courseMessage, setCourseMessage] = useState<string | null>(null);

  const currentStudent = useMemo(
    () => resolveCurrentStudent(data.students, user),
    [data.students, user],
  );

  useEffect(() => {
    setEnrollments(data.enrollments);
  }, [data.enrollments]);

  const enrolledSectionIds = useMemo(() => {
    if (!currentStudent?.id) {
      return new Set<number>();
    }

    return new Set(
      enrollments
        .filter((enrollment) => enrollment.student?.id === currentStudent.id)
        .map((enrollment) => enrollment.classSection?.id)
        .filter((id): id is number => typeof id === "number"),
    );
  }, [currentStudent?.id, enrollments]);

  const mySections = useMemo(
    () =>
      data.classSections.filter((section) =>
        enrolledSectionIds.has(section.id),
      ),
    [data.classSections, enrolledSectionIds],
  );

  const availableSections = useMemo(
    () =>
      data.classSections.filter(
        (section) => !enrolledSectionIds.has(section.id),
      ),
    [data.classSections, enrolledSectionIds],
  );

  const handleAddCourse = async (sectionId: number) => {
    setCourseError(null);
    setCourseMessage(null);

    if (!currentStudent?.id) {
      setCourseError(
        "Student profile could not be identified. Please update your profile and try again.",
      );
      return;
    }

    setEnrollingSectionId(sectionId);

    try {
      const createdEnrollment = await smsApi.enrollments.create({
        studentId: currentStudent.id,
        classSectionId: sectionId,
        status: "ACTIVE",
      });

      setEnrollments((prev) => [createdEnrollment, ...prev]);
      setCourseMessage("Course added to your profile successfully.");
    } catch (enrollError) {
      const message =
        enrollError instanceof Error
          ? enrollError.message
          : "Failed to add course. Please try again.";
      setCourseError(message);
    } finally {
      setEnrollingSectionId(null);
    }
  };

  if (isLoading) {
    return <Loading text="Loading courses..." />;
  }

  if (error) {
    return (
      <Card>
        <p className="text-red-600 font-medium">Failed to load courses</p>
        <p className="text-sm text-gray-600 mt-2">{error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
        <p className="text-gray-600 mt-1">Manage your enrolled classes</p>
      </div>

      {courseError && (
        <Card>
          <p className="text-red-600 text-sm font-medium">{courseError}</p>
        </Card>
      )}
      {courseMessage && (
        <Card>
          <p className="text-green-700 text-sm font-medium">{courseMessage}</p>
        </Card>
      )}

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Enrolled Courses
        </h2>
        {mySections.length === 0 ? (
          <p className="text-sm text-gray-600">
            You are not enrolled in any courses yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mySections.map((section) => (
              <Card key={section.id}>
                <h3 className="text-lg font-semibold text-gray-900">
                  {section.sectionName}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {section.course?.name || "No course"}
                </p>
                <p className="text-sm text-gray-600 mt-3">
                  Teacher: {section.teacher?.firstName || "N/A"}{" "}
                  {section.teacher?.lastName || ""}
                </p>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Available Courses
        </h2>
        {availableSections.length === 0 ? (
          <p className="text-sm text-gray-600">
            No additional courses available.
          </p>
        ) : (
          <div className="space-y-3">
            {availableSections.map((section) => (
              <div
                key={section.id}
                className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {section.sectionName}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {section.course?.name || "No course"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Teacher: {section.teacher?.firstName || "N/A"}{" "}
                    {section.teacher?.lastName || ""}
                  </p>
                </div>
                <Button
                  type="button"
                  isLoading={enrollingSectionId === section.id}
                  onClick={() => {
                    void handleAddCourse(section.id);
                  }}
                >
                  Add Course
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export function StudentAssignmentsPage() {
  const { user } = useAuth();
  const { data, isLoading, error } = useDashboardData();
  const [submissions, setSubmissions] = useState<ApiAssignmentSubmission[]>([]);
  const [isSubmittingByAssessment, setIsSubmittingByAssessment] = useState<
    Record<number, boolean>
  >({});
  const [submitErrorByAssessment, setSubmitErrorByAssessment] = useState<
    Record<number, string | null>
  >({});
  const [submitSuccessByAssessment, setSubmitSuccessByAssessment] = useState<
    Record<number, string | null>
  >({});
  const [commentByAssessment, setCommentByAssessment] = useState<
    Record<number, string>
  >({});
  const [mediaUrlByAssessment, setMediaUrlByAssessment] = useState<
    Record<number, string>
  >({});
  const [fileByAssessment, setFileByAssessment] = useState<
    Record<number, File | null>
  >({});

  const currentStudent = useMemo(
    () => resolveCurrentStudent(data.students, user),
    [data.students, user],
  );

  useEffect(() => {
    const studentId = currentStudent?.id;
    if (!studentId) {
      setSubmissions([]);
      return;
    }

    const loadSubmissions = async () => {
      try {
        const result =
          await smsApi.assignmentSubmissions.listByStudent(studentId);
        setSubmissions(result);
      } catch {
        setSubmissions([]);
      }
    };

    void loadSubmissions();
  }, [currentStudent?.id]);

  const submissionByAssessment = useMemo(() => {
    const map = new Map<number, ApiAssignmentSubmission>();
    submissions.forEach((submission) => {
      const assessmentId = submission.assessment?.id;
      if (assessmentId) {
        map.set(assessmentId, submission);
      }
    });
    return map;
  }, [submissions]);

  const handleAssignmentSubmit = async (assessmentId: number) => {
    const selectedFile = fileByAssessment[assessmentId];
    const mediaUrl = mediaUrlByAssessment[assessmentId]?.trim() || "";
    const comments = commentByAssessment[assessmentId]?.trim() || "";
    const parsedUserId = Number(user?.id);
    const userId = Number.isFinite(parsedUserId) ? parsedUserId : undefined;

    if (!selectedFile && !mediaUrl) {
      setSubmitErrorByAssessment((prev) => ({
        ...prev,
        [assessmentId]: "Please upload a file or provide a media URL.",
      }));
      setSubmitSuccessByAssessment((prev) => ({
        ...prev,
        [assessmentId]: null,
      }));
      return;
    }

    setIsSubmittingByAssessment((prev) => ({ ...prev, [assessmentId]: true }));
    setSubmitErrorByAssessment((prev) => ({ ...prev, [assessmentId]: null }));
    setSubmitSuccessByAssessment((prev) => ({ ...prev, [assessmentId]: null }));

    try {
      const savedSubmission = await smsApi.assignmentSubmissions.submit({
        assessmentId,
        studentId: currentStudent?.id,
        userId,
        userEmail: user?.email,
        comments,
        mediaUrl,
        file: selectedFile || undefined,
      });

      setSubmissions((prev) => {
        const next = prev.filter(
          (item) => item.assessment?.id !== savedSubmission.assessment?.id,
        );
        return [savedSubmission, ...next];
      });

      setSubmitSuccessByAssessment((prev) => ({
        ...prev,
        [assessmentId]: "Assignment submitted successfully.",
      }));
      setFileByAssessment((prev) => ({ ...prev, [assessmentId]: null }));
      setMediaUrlByAssessment((prev) => ({ ...prev, [assessmentId]: "" }));
      setCommentByAssessment((prev) => ({ ...prev, [assessmentId]: "" }));
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Failed to submit assignment.";

      setSubmitErrorByAssessment((prev) => ({
        ...prev,
        [assessmentId]: message,
      }));
    } finally {
      setIsSubmittingByAssessment((prev) => ({
        ...prev,
        [assessmentId]: false,
      }));
    }
  };

  if (isLoading) {
    return <Loading text="Loading assignments..." />;
  }

  if (error) {
    return (
      <Card>
        <p className="text-red-600 font-medium">Failed to load assignments</p>
        <p className="text-sm text-gray-600 mt-2">{error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
        <p className="text-gray-600 mt-1">
          Upload documents or share media links for online submissions
        </p>
      </div>

      <Card padding="none">
        <div className="divide-y">
          {data.assessments.map((assessment) => (
            <div key={assessment.id} className="p-4 space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    {assessment.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {assessment.classSection?.sectionName || "No section"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {assessment.instructions || "No instructions provided."}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    {assessment.assessmentType || "Assessment"}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    Due: {assessment.dueDate || "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Upload File
                  </label>
                  <input
                    type="file"
                    className="w-full text-sm text-gray-700 file:mr-3 file:rounded file:border-0 file:bg-primary-100 file:px-3 file:py-2 file:text-primary-700 hover:file:bg-primary-200"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.png,.jpg,.jpeg,.gif,.mp4,.mov,.zip"
                    onChange={(event) => {
                      const selected = event.target.files?.[0] || null;
                      setFileByAssessment((prev) => ({
                        ...prev,
                        [assessment.id]: selected,
                      }));
                    }}
                  />
                  {fileByAssessment[assessment.id] && (
                    <p className="text-xs text-gray-600">
                      Selected: {fileByAssessment[assessment.id]?.name}
                    </p>
                  )}
                </div>

                <Input
                  label="Media Link (optional)"
                  placeholder="https://drive.google.com/..."
                  value={mediaUrlByAssessment[assessment.id] || ""}
                  onChange={(event) =>
                    setMediaUrlByAssessment((prev) => ({
                      ...prev,
                      [assessment.id]: event.target.value,
                    }))
                  }
                  fullWidth
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={commentByAssessment[assessment.id] || ""}
                  onChange={(event) =>
                    setCommentByAssessment((prev) => ({
                      ...prev,
                      [assessment.id]: event.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Add notes for your teacher..."
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <Button
                  type="button"
                  isLoading={Boolean(isSubmittingByAssessment[assessment.id])}
                  onClick={() => {
                    void handleAssignmentSubmit(assessment.id);
                  }}
                >
                  Submit Assignment
                </Button>

                {submissionByAssessment.get(assessment.id)?.submittedAt && (
                  <p className="text-xs text-green-700">
                    Submitted on{" "}
                    {submissionByAssessment.get(assessment.id)?.submittedAt}
                  </p>
                )}
              </div>

              {submitErrorByAssessment[assessment.id] && (
                <p className="text-sm text-red-600">
                  {submitErrorByAssessment[assessment.id]}
                </p>
              )}
              {submitSuccessByAssessment[assessment.id] && (
                <p className="text-sm text-green-700">
                  {submitSuccessByAssessment[assessment.id]}
                </p>
              )}

              {submissionByAssessment.get(assessment.id) && (
                <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-800 space-y-1">
                  <p className="font-medium">Current Submission</p>
                  {submissionByAssessment.get(assessment.id)
                    ?.originalFileName && (
                    <a
                      href={`${API_BASE_URL}/assignment-submissions/${submissionByAssessment.get(assessment.id)?.id}/download`}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      Download{" "}
                      {
                        submissionByAssessment.get(assessment.id)
                          ?.originalFileName
                      }
                    </a>
                  )}
                  {submissionByAssessment.get(assessment.id)?.mediaUrl && (
                    <a
                      href={submissionByAssessment.get(assessment.id)?.mediaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block underline"
                    >
                      Open media link
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function StudentGradesPage() {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) {
    return <Loading text="Loading grades..." />;
  }

  if (error) {
    return (
      <Card>
        <p className="text-red-600 font-medium">Failed to load grades</p>
        <p className="text-sm text-gray-600 mt-2">{error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Grades</h1>
        <p className="text-gray-600 mt-1">Assessment scores and performance</p>
      </div>

      <Card padding="none">
        <div className="divide-y">
          {data.grades.map((grade) => (
            <div
              key={grade.id}
              className="p-4 flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-semibold text-gray-900">
                  {grade.assessment?.title || "Assessment"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Max Marks: {grade.assessment?.maxMarks ?? "N/A"}
                </p>
              </div>
              <span className="text-xl font-bold text-primary-600">
                {grade.marks}%
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function StudentMessagesPage() {
  const { data, isLoading, error } = useDashboardData();
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(
    null,
  );
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const selectedTeacher = useMemo(
    () => data.teachers.find((teacher) => teacher.id === selectedTeacherId),
    [data.teachers, selectedTeacherId],
  );

  const teacherEmail = selectedTeacher?.user?.email?.trim();

  const openEmailClient = () => {
    if (!teacherEmail) {
      return;
    }

    const query = new URLSearchParams({
      subject: subject.trim() || "Message from student",
      body: message.trim(),
    });
    window.location.href = `mailto:${teacherEmail}?${query.toString()}`;
  };

  if (isLoading) {
    return <Loading text="Loading teachers..." />;
  }

  if (error) {
    return (
      <Card>
        <p className="text-red-600 font-medium">Failed to load teachers</p>
        <p className="text-sm text-gray-600 mt-2">{error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Message Teacher</h1>
        <p className="text-gray-600 mt-1">
          Choose a teacher and open your email client with a prefilled message
        </p>
      </div>

      <Card>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Teacher
            </label>
            <select
              value={selectedTeacherId ?? ""}
              onChange={(event) => {
                const value = Number(event.target.value);
                setSelectedTeacherId(Number.isFinite(value) ? value : null);
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select a teacher</option>
              {data.teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.firstName} {teacher.lastName}
                  {teacher.specialization ? ` (${teacher.specialization})` : ""}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Question about assignment"
            fullWidth
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={5}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Write your message to the teacher..."
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              {teacherEmail
                ? `Will send to: ${teacherEmail}`
                : "Select a teacher with a valid email"}
            </p>
            <Button
              type="button"
              onClick={openEmailClient}
              disabled={!teacherEmail}
            >
              Open Email Draft
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function StudentLearningResourcesPage() {
  const { data, isLoading, error } = useDashboardData();

  const resourceItems = useMemo(
    () =>
      data.classSections.map((section) => {
        const courseName = section.course?.name || "General Studies";
        const topic = encodeURIComponent(courseName);
        return {
          id: section.id,
          sectionName: section.sectionName,
          courseName,
          resources: [
            {
              label: "Khan Academy",
              url: `https://www.khanacademy.org/search?page_search_query=${topic}`,
            },
            {
              label: "YouTube Lessons",
              url: `https://www.youtube.com/results?search_query=${topic}+lessons`,
            },
            {
              label: "OpenStax Books",
              url: "https://openstax.org/subjects",
            },
          ],
        };
      }),
    [data.classSections],
  );

  if (isLoading) {
    return <Loading text="Loading resources..." />;
  }

  if (error) {
    return (
      <Card>
        <p className="text-red-600 font-medium">Failed to load resources</p>
        <p className="text-sm text-gray-600 mt-2">{error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Learning Resources</h1>
        <p className="text-gray-600 mt-1">
          Study links curated from your current classes
        </p>
      </div>

      {resourceItems.length === 0 ? (
        <Card>
          <p className="text-sm text-gray-600">
            No class sections found yet. Enroll in a class to get resources.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {resourceItems.map((item) => (
            <Card key={item.id}>
              <h2 className="text-lg font-semibold text-gray-900">
                {item.sectionName}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{item.courseName}</p>

              <div className="mt-4 space-y-2">
                {item.resources.map((resource) => (
                  <a
                    key={resource.label}
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-sm text-primary-700 hover:text-primary-800 underline"
                  >
                    {resource.label}
                  </a>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
