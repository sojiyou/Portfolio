import { useState, useEffect } from "react";
import { getSkills, updateSkills } from "../lib/api";

export default function SkillsEditor() {
  const [skills, setSkills] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSkills().then(setSkills);
  }, []);

  const update = (index, field, value) => {
    setSkills((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const add = () => {
    setSkills((prev) => [...prev, { name: "", level: 50 }]);
  };

  const remove = (index) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    await updateSkills(skills.filter((s) => s.name.trim()));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="editor-section">
      <h2 className="editor-section__title">Skills</h2>
      <p className="editor-section__desc">
        Update your skills and proficiency levels.
      </p>

      {skills.map((sk, i) => (
        <div key={i} className="editor-skill-row">
          <input
            className="admin-input"
            style={{ width: 180, flexShrink: 0 }}
            type="text"
            value={sk.name}
            onChange={(e) => update(i, "name", e.target.value)}
            placeholder="Skill name"
          />
          <div className="editor-skill-level">
            <input
              type="range"
              min={0}
              max={100}
              value={sk.level}
              onChange={(e) => update(i, "level", Number(e.target.value))}
            />
            <span className="editor-skill-value">{sk.level}%</span>
          </div>
          <button
            className="btn btn--ghost"
            style={{ color: "#ff6b6b", flexShrink: 0, padding: "0.4rem 0.8rem" }}
            onClick={() => remove(i)}
          >
            Delete
          </button>
        </div>
      ))}

      <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
        <button className="btn btn--ghost" onClick={add}>
          + Add Skill
        </button>
        <button
          className="btn btn--primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving…" : saved ? "Saved ✓" : "Save"}
        </button>
      </div>
    </div>
  );
}
