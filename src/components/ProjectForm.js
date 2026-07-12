import { useState, useEffect } from "react";
import { getProjects, addProject, updateProject, deleteProject } from "../lib/api";
import "./ProjectForm.css";

const PLATFORM_OPTIONS = ["Web App", "Mobile App", "PWA"];

const TECH_SUGGESTIONS = [
  "React", "Vue", "Angular", "Next.js", "Node.js", "Express",
  "Python", "Django", "Java", "Spring Boot", "PHP", "Laravel",
  "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind CSS", "SASS",
  "Firebase", "MongoDB", "PostgreSQL", "MySQL", "GraphQL",
  "REST API", "Mapbox", "Google Maps", "EmailJS", "Stripe",
  "Git", "Docker", "AWS", "Vercel", "Netlify", "Figma",
];

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

  const [featureInput, setFeatureInput] = useState("");
  const [techInput, setTechInput] = useState("");

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

  /* Features */
  const addFeature = () => {
    const val = featureInput.trim();
    if (!val) return;
    if (form.highlights.includes(val)) return;
    setForm((prev) => ({ ...prev, highlights: [...prev.highlights, val] }));
    setFeatureInput("");
  };

  const removeFeature = (index) => {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  /* Tech */
  const addTech = (val) => {
    const v = (val || techInput).trim();
    if (!v) return;
    if (form.tech.includes(v)) return;
    setForm((prev) => ({ ...prev, tech: [...prev.tech, v] }));
    setTechInput("");
  };

  const removeTech = (index) => {
    setForm((prev) => ({
      ...prev,
      tech: prev.tech.filter((_, i) => i !== index),
    }));
  };

  const filteredSuggestions = techInput.trim()
    ? TECH_SUGGESTIONS.filter(
        (s) =>
          s.toLowerCase().includes(techInput.toLowerCase()) &&
          !form.tech.includes(s),
      )
    : [];

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
      setError(err.message || "Failed to save. Check console for details.");
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

          {/* Name */}
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

          {/* Category + Year */}
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

          {/* Description */}
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

          {/* Features */}
          <div className="editor-field">
            <label className="editor-label">Features</label>
            <div className="add-row">
              <input
                className="admin-input"
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); addFeature(); }
                }}
                placeholder="Type a feature and press Add"
              />
              <button className="btn btn--primary add-row__btn" onClick={addFeature}>
                Add
              </button>
            </div>
            {form.highlights.length > 0 && (
              <div className="tag-list">
                {form.highlights.map((h, i) => (
                  <div key={i} className="tag-list__item">
                    <span className="tag-list__label">{h}</span>
                    <button
                      className="tag-list__remove"
                      onClick={() => removeFeature(i)}
                      aria-label="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Platforms */}
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

          {/* Tech Stack */}
          <div className="editor-field">
            <label className="editor-label">Tech Stack</label>
            <div className="add-row">
              <input
                className="admin-input"
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); addTech(); }
                }}
                placeholder="Type a technology and press Add"
              />
              <button className="btn btn--primary add-row__btn" onClick={() => addTech()}>
                Add
              </button>
            </div>
            {form.tech.length > 0 && (
              <div className="tag-list">
                {form.tech.map((t, i) => (
                  <div key={i} className="tag-list__item">
                    <span className="tag-list__label">{t}</span>
                    <button
                      className="tag-list__remove"
                      onClick={() => removeTech(i)}
                      aria-label="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            {filteredSuggestions.length > 0 && (
              <div className="suggestions">
                {filteredSuggestions.slice(0, 8).map((s) => (
                  <button
                    key={s}
                    className="suggestions__pill"
                    onClick={() => addTech(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
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
