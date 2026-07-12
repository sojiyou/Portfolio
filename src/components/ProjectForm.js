import { useState, useEffect } from "react";
import { getProjects, addProject, updateProject, deleteProject } from "../lib/api";
import "./ProjectForm.css";

const emptyProject = () => ({
  name: "",
  tag: "",
  tagColor: "#4EFFA8",
  year: new Date().getFullYear().toString(),
  description: "",
  highlights: [],
  tech: [],
  type: [],
  order: 0,
});

export default function ProjectForm() {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProject());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  const refresh = () => getProjects().then(setProjects);

  const openNew = () => {
    setForm({ ...emptyProject(), order: projects.length });
    setEditing("new");
  };

  const openEdit = (p) => {
    setForm({ ...p });
    setEditing(p.id);
  };

  const close = () => {
    setEditing(null);
    setForm(emptyProject());
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value.split(",").map((s) => s.trim()).filter(Boolean),
    }));
  };

  const handleTypeField = (value) => {
    try {
      const parsed = JSON.parse(value);
      setForm((prev) => ({ ...prev, type: Array.isArray(parsed) ? parsed : [] }));
    } catch {
      setForm((prev) => ({ ...prev, type: [] }));
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    if (editing === "new") {
      await addProject(form);
    } else {
      await updateProject(editing, form);
    }
    setSaving(false);
    close();
    refresh();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await deleteProject(id);
    refresh();
  };

  return (
    <div className="editor-section">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 className="editor-section__title" style={{ margin: 0 }}>Projects</h2>
        <button className="btn btn--primary" onClick={openNew}>
          + Add Project
        </button>
      </div>

      {editing ? (
        <div className="project-form">
          <h3 className="project-form__title">
            {editing === "new" ? "New Project" : "Edit Project"}
          </h3>

          <div className="editor-field">
            <label className="editor-label">Name</label>
            <input className="admin-input" type="text" value={form.name}
              onChange={(e) => handleChange("name", e.target.value)} />
          </div>

          <div className="editor-field">
            <label className="editor-label">Tag (e.g. "Capstone Project")</label>
            <input className="admin-input" type="text" value={form.tag}
              onChange={(e) => handleChange("tag", e.target.value)} />
          </div>

          <div className="editor-field">
            <label className="editor-label">Tag Color (hex)</label>
            <input className="admin-input" type="text" value={form.tagColor}
              onChange={(e) => handleChange("tagColor", e.target.value)} />
          </div>

          <div className="editor-field">
            <label className="editor-label">Year</label>
            <input className="admin-input" type="text" value={form.year}
              onChange={(e) => handleChange("year", e.target.value)} />
          </div>

          <div className="editor-field">
            <label className="editor-label">Description</label>
            <textarea className="admin-input admin-textarea" rows={4} value={form.description}
              onChange={(e) => handleChange("description", e.target.value)} />
          </div>

          <div className="editor-field">
            <label className="editor-label">Order</label>
            <input className="admin-input" type="number" value={form.order}
              onChange={(e) => handleChange("order", Number(e.target.value))} />
          </div>

          <div className="editor-field">
            <label className="editor-label">Highlights (one per line)</label>
            <textarea className="admin-input admin-textarea" rows={4}
              value={form.highlights.join("\n")}
              onChange={(e) => handleChange("highlights", e.target.value.split("\n").filter(Boolean))} />
          </div>

          <div className="editor-field">
            <label className="editor-label">Tech Stack (comma-separated)</label>
            <input className="admin-input" type="text"
              value={form.tech.join(", ")}
              onChange={(e) => handleArrayField("tech", e.target.value)} />
          </div>

          <div className="editor-field">
            <label className="editor-label">Types (JSON array of {label, url, image})</label>
            <textarea className="admin-input admin-textarea" rows={4}
              value={JSON.stringify(form.type, null, 2)}
              onChange={(e) => handleTypeField(e.target.value)} />
          </div>

          <div className="project-form__actions">
            <button className="btn btn--ghost" onClick={close}>Cancel</button>
            <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <div className="project-list">
          {projects.length === 0 && (
            <p className="editor-empty">No projects yet. Click "+ Add Project" to create one.</p>
          )}
          {projects.map((p) => (
            <div key={p.id} className="project-list__item">
              <div className="project-list__info">
                <strong>{p.name}</strong>
                <span style={{ color: "var(--text-tertiary)", fontSize: "0.8rem" }}>
                  {p.tag} · {p.year}
                </span>
              </div>
              <div className="project-list__actions">
                <button className="btn btn--ghost" onClick={() => openEdit(p)}>
                  Edit
                </button>
                <button
                  className="btn btn--ghost"
                  style={{ color: "#ff6b6b" }}
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
