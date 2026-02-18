import { useEffect, useMemo, useState } from "react";
import axios from "axios";

type Student = {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
};

type Kpi = { label: string; value: number | string; hint?: string };

export default function Dashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // You can adjust these later when you build real modules
  const [totalClasses, setTotalClasses] = useState<number>(6);
  const [attendanceToday, setAttendanceToday] = useState<string>("92%");
  const [feesPending, setFeesPending] = useState<number>(14);

  async function load() {
    setLoading(true);
    setError("");
    try {
      // expecting: GET /api/students -> Student[]
      const res = await axios.get<Student[]>("/api/students");
      setStudents(res.data ?? []);
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to load dashboard data. Check backend and /api proxy.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const kpis: Kpi[] = useMemo(() => {
    return [
      {
        label: "Total Students",
        value: students.length,
        hint: "Active records",
      },
      {
        label: "Total Classes",
        value: totalClasses,
        hint: "Configured classes",
      },
      { label: "Attendance Today", value: attendanceToday, hint: "Overall %" },
      { label: "Fees Pending", value: feesPending, hint: "Students with dues" },
    ];
  }, [students.length, totalClasses, attendanceToday, feesPending]);

  const recent = useMemo(() => students.slice(0, 5), [students]);

  return (
    <div style={page()}>
      <div style={headerRow()}>
        <div>
          <h2 style={{ margin: 0 }}>Dashboard</h2>
          <p style={{ margin: "6px 0 0", opacity: 0.75 }}>
            Overview of your Student Management System
          </p>
        </div>
        <button onClick={load} style={btn()}>
          Refresh
        </button>
      </div>

      {error && <div style={errorBox()}>{error}</div>}

      {/* KPI cards */}
      <div style={grid4()}>
        {kpis.map((k) => (
          <div key={k.label} style={card()}>
            <div style={{ opacity: 0.75, fontSize: 13 }}>{k.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 10 }}>
              {k.value}
            </div>
            {k.hint && (
              <div style={{ opacity: 0.6, marginTop: 8, fontSize: 12 }}>
                {k.hint}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick actions + Recent students */}
      <div style={twoCol()}>
        <div style={card()}>
          <h3 style={{ marginTop: 0 }}>Quick Actions</h3>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              style={btnPrimary()}
              onClick={() =>
                alert("Next: Navigate to Students page (we’ll add routing).")
              }
            >
              + Add Student
            </button>

            <button
              style={btn()}
              onClick={() =>
                alert("Next: Navigate to Attendance module (we’ll add it).")
              }
            >
              Take Attendance
            </button>

            <button
              style={btn()}
              onClick={() =>
                alert("Next: Navigate to Classes module (we’ll add it).")
              }
            >
              Create Class
            </button>

            <button
              style={btn()}
              onClick={() => alert("Next: Generate report (we’ll add it).")}
            >
              View Reports
            </button>
          </div>

          <div style={{ marginTop: 14, opacity: 0.7, fontSize: 13 }}>
            Tip: Next step is adding a sidebar + router so these buttons
            navigate to modules.
          </div>
        </div>

        <div style={card()}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Recent Students</h3>
            <div style={{ opacity: 0.7, fontSize: 13 }}>
              {loading ? "Loading..." : `Showing ${recent.length}`}
            </div>
          </div>

          <div
            style={{
              border: "1px solid #2a2a2a",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#141414" }}>
                <tr>
                  <th style={th()}>Name</th>
                  <th style={th()}>Email</th>
                  <th style={th()}>Department</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((s) => (
                  <tr key={s.id ?? s.email}>
                    <td style={td()}>
                      {s.firstName} {s.lastName}
                    </td>
                    <td style={td()}>{s.email}</td>
                    <td style={td()}>{s.department ?? "-"}</td>
                  </tr>
                ))}
                {!loading && recent.length === 0 && (
                  <tr>
                    <td style={td()} colSpan={3}>
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 10, opacity: 0.65, fontSize: 12 }}>
            Backend expected: <code>/api/students</code>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- styles (simple inline CSS) ---- */
function page(): React.CSSProperties {
  return { maxWidth: 1100, margin: "0 auto", padding: 24, color: "white" };
}
function headerRow(): React.CSSProperties {
  return {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  };
}
function grid4(): React.CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
    marginBottom: 12,
  };
}
function twoCol(): React.CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginTop: 12,
  };
}
function card(): React.CSSProperties {
  return {
    background: "#0f0f10",
    border: "1px solid #2a2a2a",
    borderRadius: 14,
    padding: 16,
  };
}
function th(): React.CSSProperties {
  return {
    textAlign: "left",
    padding: 12,
    borderBottom: "1px solid #2a2a2a",
    fontWeight: 600,
  };
}
function td(): React.CSSProperties {
  return { padding: 12, borderBottom: "1px solid #1f1f1f" };
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
function errorBox(): React.CSSProperties {
  return {
    background: "#3b1d1d",
    border: "1px solid #6b2b2b",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  };
}
