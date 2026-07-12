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
    <div className="admin-tab">
      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit Experience" : "Add Experience"}</h3>

        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} required />

        <label>Company</label>
        <input name="company" value={form.company} onChange={handleChange} required />

        <label>Location</label>
        <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Baguio City" />

        <div className="admin-form__row">
          <div>
            <label>Start Date</label>
            <input name="startDate" value={form.startDate} onChange={handleChange} placeholder="e.g. June 2025" />
          </div>
          <div>
            <label>End Date</label>
            <input name="endDate" value={form.endDate} onChange={handleChange} placeholder="e.g. Present" />
          </div>
        </div>

        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={3} />

        <label>Highlights</label>
        <div className="admin-form__tag-row">
          <input
            value={highlightInput}
            onChange={(e) => setHighlightInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHighlight(); } }}
            placeholder="Type and press Enter"
          />
          <button type="button" className="admin-form__add-btn" onClick={addHighlight}>Add</button>
        </div>
        <div className="admin-form__tags">
          {(form.highlights || []).map((h, i) => (
            <span key={i} className="admin-form__tag">
              {h}
              <button type="button" onClick={() => removeHighlight(i)}>&times;</button>
            </span>
          ))}
        </div>

        <button type="submit" className="admin-form__submit">
          {editingId ? "Update" : "Add"} Experience
        </button>
        {editingId && (
          <button type="button" className="admin-form__cancel" onClick={() => { setForm({ ...empty }); setEditingId(null); }}>
            Cancel
          </button>
        )}
      </form>

      <div className="admin-list">
        {list.map((exp, idx) => (
          <div key={exp.id} className="admin-list__item">
            <div className="admin-list__info">
              <strong>{exp.title}</strong> at {exp.company}
              <span className="admin-list__meta">{exp.startDate}{exp.endDate ? ` — ${exp.endDate}` : ""}</span>
            </div>
            <div className="admin-list__actions">
              <button onClick={() => moveUp(idx)} disabled={idx === 0} title="Move up">&uarr;</button>
              <button onClick={() => moveDown(idx)} disabled={idx >= list.length - 1} title="Move down">&darr;</button>
              <button onClick={() => handleEdit(exp)}>Edit</button>
              <button className="admin-list__del" onClick={() => handleDelete(exp.id)}>Delete</button>
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="admin-list__empty">No experiences yet.</p>}
      </div>

      {confirm && <ConfirmModal message={confirm.message} onConfirm={confirmDelete} onCancel={() => setConfirm(null)} />}
    </div>
  );
}
