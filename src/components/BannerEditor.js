import { useState, useEffect } from "react";
import { getBanner, updateBanner } from "../lib/api";

export default function BannerEditor() {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getBanner().then(setText);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await updateBanner(text);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="editor-section">
      <h2 className="editor-section__title">Banner Text</h2>
      <p className="editor-section__desc">
        The green badge text shown below your name on the hero section.
      </p>
      <input
        className="admin-input"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="btn btn--primary"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving…" : saved ? "Saved ✓" : "Save"}
      </button>
    </div>
  );
}
