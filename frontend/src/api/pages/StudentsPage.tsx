import { useEffect, useMemo, useState } from "react";
import { api } from "E:/student-management/frontend/src/api/client.ts";
import type { Student } from "E:/student-management/frontend/src/types/Student.ts";

const emptyStudent: Student = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "",
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [query, setQuery] = useState("");

  const [form, setForm] = useState<Student>(emptyStudent);
  const [editingId, setEditingId] = useState<number | null>(null);

  async function loadStudents() {
    setLoading(true);
    setError("");
    try {
      // Expecting backend: GET /api/students -> Student[]
      const res = await api.get<Student[]>("/students");
      setStudents(res.data ?? []);
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to load students. Check backend is running.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) =>
      `${s.firstName} ${s.lastName} ${s.email} ${s.department ?? ""}`
        .toLowerCase()
        .includes(q),
    );
  }, [students, query]);

  function onChange<K extends keyof Student>(key: K, value: Student[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function startEdit(s: Student) {
    if (!s.id) return;
    setEditingId(s.id);
    setForm({
      firstName: s.firstName ?? "",
      lastName: s.lastName ?? "",
      email: s.email ?? "",
      phone: s.phone ?? "",
      department: s.department ?? "",
      id: s.id,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyStudent);
  }

  async function save() {
    setError("");

    if (!form.firstName || !form.lastName || !form.email) {
      setError("First name, last name, and email are required.");
      return;
    }

    try {
      if (editingId) {
        // Expecting backend: PUT /api/students/{id}
        await api.put(`/students/${editingId}`, form);
      } else {
        // Expecting backend: POST /api/students
        await api.post("/students", form);
      }
      resetForm();
      await loadStudents();
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Save failed. Check API paths and payload.",
      );
    }
  }

  async function remove(id?: number) {
    if (!id) return;
    setError("");
    try {
      // Expecting backend: DELETE /api/students/{id}
      await api.delete(`/students/${id}`);
      await loadStudents();
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Delete failed. Check backend endpoint.",
      );
    }
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <h2 style={{ marginBottom: 6 }}>Student Management</h2>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Connected to backend via <code>/api</code> proxy →{" "}
        <code>http://localhost:8080</code>
      </p>

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          margin: "16px 0",
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name / email / department..."
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #444",
          }}
        />
        <button onClick={loadStudents} style={btn()}>
          Refresh
        </button>
      </div>

      {error && (
        <div
          style={{
            background: "#3b1d1d",
            padding: 12,
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}
      >
        <input
          value={form.firstName}
          onChange={(e) => onChange("firstName", e.target.value)}
          placeholder="First name *"
          style={input()}
        />
        <input
          value={form.lastName}
          onChange={(e) => onChange("lastName", e.target.value)}
          placeholder="Last name *"
          style={input()}
        />
        <input
          value={form.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="Email *"
          style={input()}
        />
        <input
          value={form.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          placeholder="Phone"
          style={input()}
        />
        <input
          value={form.department}
          onChange={(e) => onChange("department", e.target.value)}
          placeholder="Department"
          style={input()}
        />
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={save} style={btnPrimary()}>
            {editingId ? "Update" : "Add"}
          </button>
          <button onClick={resetForm} style={btn()}>
            Clear
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: 20,
          border: "1px solid #333",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <div
          style={{ padding: 12, borderBottom: "1px solid #333", opacity: 0.9 }}
        >
          {loading ? "Loading..." : `Students (${filtered.length})`}
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#171717" }}>
            <tr>
              <th style={th()}>ID</th>
              <th style={th()}>First</th>
              <th style={th()}>Last</th>
              <th style={th()}>Email</th>
              <th style={th()}>Phone</th>
              <th style={th()}>Dept</th>
              <th style={th()}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id ?? `${s.email}-${s.firstName}`}>
                <td style={td()}>{s.id ?? "-"}</td>
                <td style={td()}>{s.firstName}</td>
                <td style={td()}>{s.lastName}</td>
                <td style={td()}>{s.email}</td>
                <td style={td()}>{s.phone ?? "-"}</td>
                <td style={td()}>{s.department ?? "-"}</td>
                <td style={{ ...td(), whiteSpace: "nowrap" }}>
                  <button style={btn()} onClick={() => startEdit(s)}>
                    Edit
                  </button>{" "}
                  <button style={btnDanger()} onClick={() => remove(s.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td style={td()} colSpan={7}>
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 14, opacity: 0.7, fontSize: 13 }}>
        Backend endpoints expected: <code>GET /api/students</code>,{" "}
        <code>POST /api/students</code>, <code>PUT /api/students/{"{id}"}</code>
        , <code>DELETE /api/students/{"{id}"}</code>
      </div>
    </div>
  );
}

function input(): React.CSSProperties {
  return {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #444",
    background: "#0f0f0f",
    color: "white",
  };
}
function th(): React.CSSProperties {
  return {
    textAlign: "left",
    padding: 12,
    borderBottom: "1px solid #333",
    fontWeight: 600,
  };
}
function td(): React.CSSProperties {
  return { padding: 12, borderBottom: "1px solid #222" };
}
function btn(): React.CSSProperties {
  return {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #444",
    background: "#111",
    color: "white",
    cursor: "pointer",
  };
}
function btnPrimary(): React.CSSProperties {
  return { ...btn(), border: "1px solid #2f6", background: "#0f1a12" };
}
function btnDanger(): React.CSSProperties {
  return { ...btn(), border: "1px solid #f55", background: "#1a0f0f" };
}
