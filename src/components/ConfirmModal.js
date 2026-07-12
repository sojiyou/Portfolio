import { useEffect } from "react";
import "./ConfirmModal.css";

export default function ConfirmModal({ label, url, image, onConfirm, onCancel }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {image && (
          <img className="modal-card__preview" src={image} alt={label} />
        )}
        <h3 className="modal-card__title">Open Link</h3>
        <p className="modal-card__message">
          Open the <strong>{label}</strong> project?<br />
          You'll be taken to an external page.
        </p>
        <div className="modal-card__actions">
          <button className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn--primary" onClick={onConfirm}>
            Open
          </button>
        </div>
      </div>
    </div>
  );
}
