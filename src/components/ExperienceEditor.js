import { useState, useEffect } from "react";
import { getExperiences, addExperience, updateExperience, deleteExperience } from "../lib/api";
import ConfirmModal from "./ConfirmModal";

const empty = {
  title: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  description: "",
  highlights: [],
  order: 0,
};

export default function ExperienceEditor() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ ...empty });
  const [editingId, setEditingId] = useState(null);
  const [highlightInput, setHighlightInput] = useState("");
  const [confirm, setConfirm] = useState(null);

  useEffect(() => { getExperiences().then(setList); }, []);

  const load = async () => setList(await getExperiences());

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addHighlight = () => {
    const h = highlightInput.trim();
    if (!h) return;
    setForm({ ...form, highlights: [...(form.highlights || []), h] });
    setHighlightInput("");
  };

  const removeHighlight = (i) => {
    setForm({ ...form, highlights: form.highlights.filter((_, idx) => idx !== i) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateExperience(editingId, form);
    } else {
      await addExperience({ ...form, order: list.length });
    }
    setForm({ ...empty });
    setEditingId(null);
    await load();
  };

  const handleEdit = (exp) => {
    setForm({
      title: exp.title || "",
      company: exp.company || "",
      location: exp.location || "",
      startDate: exp.startDate || "",
      endDate: exp.endDate || "",
      description: exp.description || "",
      highlights: exp.highlights || [],
      order: exp.order ?? 0,
    });
    setEditingId(exp.id);
  };

  const handleDelete = (id) => {
    setConfirm({ id, message: "Delete this experience entry?" });
  };

  const confirmDelete = async () => {
    if (!confirm) return;
    await deleteExperience(confirm.id);
    setConfirm(null);
    await load();
  };

  const moveUp = async (idx) => {
    if (idx === 0) return;
    const a = list[idx], b = list[idx - 1];
    await updateExperience(a.id, { order: b.order });
    await updateExperience(b.id, { order: a.order });
    await load();
  };

  const moveDown = async (idx) => {
    if (idx >= list.length - 1) return;
    const a = list[idx], b = list[idx + 1];
    await updateExperience(a.id, { order: b.order });
    await updateExperience(b.id, { order: a.order });
    await load();
  };

  return (
    <div className="editor-section">
      <h2 className="editor-section__title">Experience</h2>
      <p className="editor-section__desc">Add or edit your work experience entries.</p>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <div className="editor-field">
          <label className="editor-label">Title</label>
          <input className="admin-input" name="title" value={form.title} onChange={handleChange} required />
        </div>

        <div className="editor-field">
          <label className="editor-label">Company</label>
          <input className="admin-input" name="company" value={form.company} onChange={handleChange} required />
        </div>

        <div className="editor-field">
          <label className="editor-label">Location</label>
          <input className="admin-input" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Baguio City" />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <div className="editor-field" style={{ flex: 1 }}>
            <label className="editor-label">Start Date</label>
            <input className="admin-input" name="startDate" value={form.startDate} onChange={handleChange} placeholder="e.g. June 2025" />
          </div>
          <div className="editor-field" style={{ flex: 1 }}>
            <label className="editor-label">End Date</label>
            <input className="admin-input" name="endDate" value={form.endDate} onChange={handleChange} placeholder="e.g. Present" />
          </div>
        </div>

        <div className="editor-field">
          <label className="editor-label">Description</label>
          <textarea className="admin-input admin-textarea" name="description" value={form.description} onChange={handleChange} rows={3} />
        </div>

        <div className="editor-field">
          <label className="editor-label">Highlights</label>
          <div className="add-row">
            <input
              className="admin-input"
              value={highlightInput}
              onChange={(e) => setHighlightInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHighlight(); } }}
              placeholder="Type and press Add"
            />
            <button type="button" className="btn btn--primary add-row__btn" onClick={addHighlight}>Add</button>
          </div>
          {(form.highlights || []).length > 0 && (
            <div className="tag-list">
              {(form.highlights || []).map((h, i) => (
                <div key={i} className="tag-list__item">
                  <span className="tag-list__label">{h}</span>
                  <button type="button" className="tag-list__remove" onClick={() => removeHighlight(i)}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="project-form__actions">
          {editingId && (
            <button type="button" className="btn btn--ghost" onClick={() => { setForm({ ...empty }); setEditingId(null); }}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn--primary">
            {editingId ? "Update" : "Add"} Experience
          </button>
        </div>
      </form>

      <div className="project-list">
        {list.length === 0 && <p className="editor-empty">No experiences yet.</p>}
        {list.map((exp, idx) => (
          <div key={exp.id} className="project-list__item">
            <div className="project-list__info">
              <strong>{exp.title}</strong>
              <span style={{ color: "var(--text-tertiary)", fontSize: "0.8rem" }}>
                {exp.company}{exp.location ? ` · ${exp.location}` : ""} · {exp.startDate}{exp.endDate ? ` — ${exp.endDate}` : ""}
              </span>
            </div>
            <div className="project-list__actions">
              <button className="btn btn--ghost" onClick={() => moveUp(idx)} disabled={idx === 0} title="Move up">&uarr;</button>
              <button className="btn btn--ghost" onClick={() => moveDown(idx)} disabled={idx >= list.length - 1} title="Move down">&darr;</button>
              <button className="btn btn--ghost" onClick={() => handleEdit(exp)}>Edit</button>
              <button className="btn btn--ghost" style={{ color: "#ff6b6b" }} onClick={() => handleDelete(exp.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {confirm && <ConfirmModal message={confirm.message} onConfirm={confirmDelete} onCancel={() => setConfirm(null)} />}
    </div>
  );
}
