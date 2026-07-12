import "./SkillPill.css";

export default function SkillPill({ skill, delay, visible }) {
  return (
    <div
      className="skill-pill"
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
      }}
    >
      <span className="skill-pill__name">{skill.name}</span>
      <div className="skill-pill__bar-track">
        <div
          className="skill-pill__bar-fill"
          style={{
            width: visible ? `${skill.level}%` : "0%",
            transitionDelay: `${delay + 200}ms`,
          }}
        />
      </div>
    </div>
  );
}
