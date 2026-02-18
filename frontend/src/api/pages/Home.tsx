export default function Home() {
  return (
    <div style={page()}>
      <header style={header()}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={logoBox()}>🎓</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>
              Student Management
            </div>
            <div style={{ opacity: 0.7, fontSize: 13 }}>
              Manage classes, students, parents & teachers
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button style={btn()}>Login</button>
          <button style={btnPrimary()}>Get Started</button>
        </div>
      </header>

      <main style={{ marginTop: 26 }}>
        <h1 style={{ margin: 0, fontSize: 40 }}>
          All your classes. One dashboard.
        </h1>
        <p style={{ opacity: 0.8, fontSize: 16, marginTop: 10, maxWidth: 720 }}>
          A role-based platform where teachers manage sections, students enroll
          in courses, and parents choose teachers for their kids. Track
          attendance, assessments, and progress in one place.
        </p>

        <div style={grid()}>
          <div style={card()}>
            <div style={{ fontSize: 26 }}>👩‍🏫</div>
            <h3 style={{ marginBottom: 6 }}>Teacher Modules</h3>
            <div style={muted()}>
              Create sections, approve enrollments, take attendance, publish
              grades.
            </div>
          </div>

          <div style={card()}>
            <div style={{ fontSize: 26 }}>🎓</div>
            <h3 style={{ marginBottom: 6 }}>Student Modules</h3>
            <div style={muted()}>
              Enroll in multiple classes, view timetable, attendance and grades.
            </div>
          </div>

          <div style={card()}>
            <div style={{ fontSize: 26 }}>👨‍👩‍👧</div>
            <h3 style={{ marginBottom: 6 }}>Parent Modules</h3>
            <div style={muted()}>
              Add children, choose teachers/classes, track progress and reports.
            </div>
          </div>

          <div style={card()}>
            <div style={{ fontSize: 26 }}>📊</div>
            <h3 style={{ marginBottom: 6 }}>Analytics Dashboard</h3>
            <div style={muted()}>
              KPIs and reports for attendance, enrollments, and performance.
            </div>
          </div>
        </div>

        <div
          style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}
        >
          <button style={btnPrimary()}>Open Dashboard</button>
          <button style={btn()}>View Students</button>
          <button style={btn()}>Browse Courses</button>
        </div>
      </main>

      <footer style={{ marginTop: 28, opacity: 0.6, fontSize: 12 }}>
        © {new Date().getFullYear()} Student Management System
      </footer>
    </div>
  );
}

function page(): React.CSSProperties {
  return { maxWidth: 1100, margin: "0 auto", padding: 24, color: "white" };
}
function header(): React.CSSProperties {
  return {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    border: "1px solid #2a2a2a",
    background: "#0f0f10",
  };
}
function logoBox(): React.CSSProperties {
  return {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    background: "#111",
    border: "1px solid #2a2a2a",
    fontSize: 22,
  };
}
function grid(): React.CSSProperties {
  return {
    marginTop: 22,
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
  };
}
function card(): React.CSSProperties {
  return {
    padding: 16,
    borderRadius: 14,
    border: "1px solid #2a2a2a",
    background: "#0f0f10",
  };
}
function muted(): React.CSSProperties {
  return { opacity: 0.75, fontSize: 13, lineHeight: 1.4 };
}
function btn(): React.CSSProperties {
  return {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid #444",
    background: "#111",
    color: "white",
    cursor: "pointer",
  };
}
function btnPrimary(): React.CSSProperties {
  return { ...btn(), border: "1px solid #2f6", background: "#0f1a12" };
}
