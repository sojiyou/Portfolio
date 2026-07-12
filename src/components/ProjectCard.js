import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import "./ProjectCard.css";

export default function ProjectCard({ project, delay, visible }) {
  const [hovered, setHovered] = useState(false);
  const [modal, setModal] = useState(null);

  return (
    <div
      className={`project-card ${hovered ? "project-card--hovered" : ""}`}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="project-card__top">
        {project.image && (
          <img className="project-card__image" src={project.image} alt={project.name} />
        )}
        <div className="project-card__meta">
          <span
            className="project-card__tag"
            style={{ color: project.tagColor }}
          >
            {project.tag}
          </span>
          <span className="project-card__year">{project.year}</span>
        </div>
      </div>

      <h3 className="project-card__name">{project.name}</h3>
      <p className="project-card__desc">{project.description}</p>

      <ul className="project-card__highlights">
        {project.highlights.map((h) => (
          <li key={h} className="project-card__highlight">
            <span className="project-card__highlight-dot" />
            {h}
          </li>
        ))}
      </ul>

      <div className="project-card__footer">
        <div className="project-card__types">
          {project.type.map((t) => (
            <span
              key={t.label}
              className="project-card__type-badge"
              role="button"
              tabIndex={0}
              onClick={() => setModal(t)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setModal(t);
                }
              }}
            >
              {t.label}
            </span>
          ))}
        </div>
        <div className="project-card__techs">
          {project.tech.map((t) => (
            <span key={t} className="project-card__tech">
              {t}
            </span>
          ))}
        </div>
      </div>

      {modal && (
        <ConfirmModal
          label={modal.label}
          url={modal.url}
          image={modal.image}
          onConfirm={() => {
            window.open(modal.url, "_blank", "noopener,noreferrer");
            setModal(null);
          }}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}
