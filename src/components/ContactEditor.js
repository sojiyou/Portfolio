import { useState, useEffect } from "react";
import { getContact, updateContact } from "../lib/api";

export default function ContactEditor() {
  const [data, setData] = useState({
    location: "",
    education: "",
    focus: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getContact().then(setData);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await updateContact(data);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="editor-section">
      <h2 className="editor-section__title">Contact Info</h2>
      <p className="editor-section__desc">
        The details shown on the contact section sidebar.
      </p>

      <div className="editor-field">
        <label className="editor-label">Location</label>
        <input
          className="admin-input"
          type="text"
          value={data.location}
          onChange={(e) => setData({ ...data, location: e.target.value })}
        />
      </div>

      <div className="editor-field">
        <label className="editor-label">Education</label>
        <input
          className="admin-input"
          type="text"
          value={data.education}
          onChange={(e) => setData({ ...data, education: e.target.value })}
        />
      </div>

      <div className="editor-field">
        <label className="editor-label">Focus</label>
        <input
          className="admin-input"
          type="text"
          value={data.focus}
          onChange={(e) => setData({ ...data, focus: e.target.value })}
        />
      </div>

      <button
        className="btn btn--primary"
        onClick={handleSave}
        disabled={saving}
        style={{ marginTop: "0.5rem" }}
      >
        {saving ? "Saving…" : saved ? "Saved ✓" : "Save"}
      </button>
    </div>
  );
}
