import { useState, useEffect } from "react";
import { getProjects, addProject, updateProject, deleteProject } from "../lib/api";
import "./ProjectForm.css";

const PLATFORM_OPTIONS = ["Web App", "Mobile App", "PWA"];

const emptyPlatforms = () =>
  PLATFORM_OPTIONS.map((label) => ({
    label,
    enabled: false,
    url: "",
    image: "",
  }));

const emptyProject = () => ({
  name: "",
  tag: "",
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
  const [platforms, setPlatforms] = useState(emptyPlatforms());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  const refresh = () => getProjects().then(setProjects);

  const openNew = () => {
    setForm(emptyProject());
    setPlatforms(emptyPlatforms());
    setEditing("new");
    setError("");
  };

  const openEdit = (p) => {
    setForm({
      name: p.name || "",
      tag: p.tag || "",
      year: p.year || "",
      description: p.description || "",
      highlights: p.highlights || [],
      tech: p.tech || [],
      type: p.type || [],
      order: p.order ?? 0,
    });
    const enabled = (p.type || []).map((t) => t.label);
    setPlatforms(
      PLATFORM_OPTIONS.map((label) => {
        const match = (p.type || []).find((t) => t.label === label);
        return {
          label,
          enabled: enabled.includes(label),
          url: match?.url || "",
          image: match?.image || "",
        };
      }),
    );
    setEditing(p.id);
    setError("");
  };

  const close = () => {
    setEditing(null);
    setForm(emptyProject());
    setPlatforms(emptyPlatforms());
    setError("");
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlatformToggle = (index) => {
    setPlatforms((prev) =>
      prev.map((p, i) => (i === index ? { ...p, enabled: !p.enabled } : p)),
    );
  };

  const handlePlatformChange = (index, field, value) => {
    setPlatforms((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    );
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError("Project name is required.");
      return;
    }

    const type = platforms
      .filter((p) => p.enabled)
      .map((p) => ({
        label: p.label,
        url: p.url,
        image: p.image || undefined,
      }));

    const data = {
      ...form,
      type,
      highlights: form.highlights.filter(Boolean),
      tech: form.tech.filter(Boolean),
    };

    setSaving(true);
    setError("");
    try {
      if (editing === "new") {
        await addProject(data);
      } else {
        await updateProject(editing, data);
      }
      setSaving(false);
      close();
      refresh();
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save. Check console for details.");
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await deleteProject(id);
      refresh();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="editor-section">
      <div className="project-form__header">
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
            <label className="editor-label">Project Name</label>
            <input
              className="admin-input"
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. Aquallera"
            />
          </div>

          <div className="project-form__row">
            <div className="editor-field" style={{ flex: 1 }}>
              <label className="editor-label">Category</label>
              <input
                className="admin-input"
                type="text"
                value={form.tag}
                onChange={(e) => handleChange("tag", e.target.value)}
                placeholder="e.g. Capstone Project"
              />
            </div>
            <div className="editor-field" style={{ flex: 0.5 }}>
              <label className="editor-label">Year</label>
              <input
                className="admin-input"
                type="text"
                value={form.year}
                onChange={(e) => handleChange("year", e.target.value)}
                placeholder="2025"
              />
            </div>
          </div>

          <div className="editor-field">
            <label className="editor-label">Description</label>
            <textarea
              className="admin-input admin-textarea"
              rows={4}
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe the project..."
            />
          </div>

          <div className="editor-field">
            <label className="editor-label">Features (one per line)</label>
            <textarea
              className="admin-input admin-textarea"
              rows={4}
              value={form.highlights.join("\n")}
              onChange={(e) =>
                handleChange("highlights", e.target.value.split("\n"))
              }
              placeholder="Interactive map integration&#10;Delivery scheduling system&#10;Real-time order management"
            />
          </div>

          <div className="editor-field">
            <label className="editor-label">Platforms</label>
            {platforms.map((p, i) => (
              <div key={p.label} className="project-form__platform">
                <label className="project-form__platform-check">
                  <input
                    type="checkbox"
                    checked={p.enabled}
                    onChange={() => handlePlatformToggle(i)}
                  />
                  <span>{p.label}</span>
                </label>
                {p.enabled && (
                  <div className="project-form__platform-fields">
                    <input
                      className="admin-input"
                      type="text"
                      value={p.url}
                      onChange={(e) =>
                        handlePlatformChange(i, "url", e.target.value)
                      }
                      placeholder="Deploy URL"
                    />
                    <input
                      className="admin-input"
                      type="text"
                      value={p.image}
                      onChange={(e) =>
                        handlePlatformChange(i, "image", e.target.value)
                      }
                      placeholder="Image path (e.g. /project-web.png)"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="editor-field">
            <label className="editor-label">Tech Stack (comma-separated)</label>
            <input
              className="admin-input"
              type="text"
              value={form.tech.join(", ")}
              onChange={(e) =>
                handleChange(
                  "tech",
                  e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                )
              }
              placeholder="React, JavaScript, CSS, Mapbox"
            />
          </div>

          {error && <p className="project-form__error">{error}</p>}

          <div className="project-form__actions">
            <button className="btn btn--ghost" onClick={close}>
              Cancel
            </button>
            <button
              className="btn btn--primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <div className="project-list">
          {projects.length === 0 && (
            <p className="editor-empty">
              No projects yet. Click "+ Add Project" to create one.
            </p>
          )}
          {projects.map((p) => (
            <div key={p.id} className="project-list__item">
              <div className="project-list__info">
                <strong>{p.name}</strong>
                <span
                  style={{ color: "var(--text-tertiary)", fontSize: "0.8rem" }}
                >
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
