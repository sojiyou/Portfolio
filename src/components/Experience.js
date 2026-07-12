import { useState, useEffect } from "react";
import useInView from "../hooks/useInView";
import SkillPill from "./SkillPill";
import { getSkills, getExperiences } from "../lib/api";
import "./Experience.css";

const fallbackSkills = [
  { name: "HTML", level: 90 },
  { name: "CSS", level: 88 },
  { name: "JavaScript", level: 85 },
  { name: "React", level: 77 },
  { name: "Java", level: 72 },
  { name: "Python", level: 70 },
  { name: "Tailwind CSS", level: 40 },
  { name: "PHP", level: 55 },
];

export default function Experience() {
  const [ref, inView] = useInView(0.1);
  const [skills, setSkills] = useState(fallbackSkills);
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    getSkills().then((s) => { if (s.length > 0) setSkills(s); });
    getExperiences().then(setExperiences);
  }, []);

  return (
    <section id="experience" className="section section--experience" ref={ref}>
      <div className={`section__inner ${inView ? "fade-in" : ""}`}>
        <div className="section__header">
          <span className="section__label">Experience</span>
          <h2 className="section__title">Skills &amp; Background</h2>
        </div>

        <div className="experience__skills">
          <div className="experience__skills-grid">
            {skills.map((sk, i) => (
              <SkillPill
                key={sk.name}
                skill={sk}
                delay={i * 60}
                visible={inView}
              />
            ))}
          </div>
        </div>

        {experiences.length > 0 && (
          <div className="timeline">
            {experiences.map((exp, i) => (
              <div key={exp.id} className="timeline__item">
                <div className="timeline__separator">
                  <div className="timeline__dot" />
                  {i < experiences.length - 1 && <div className="timeline__connector" />}
                </div>
                <div className="timeline__content">
                  <div className="timeline__header">
                    <h3 className="timeline__title">{exp.title}</h3>
                    <span className="timeline__date">{exp.startDate}{exp.endDate ? ` — ${exp.endDate}` : ""}</span>
                  </div>
                  <p className="timeline__company">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                  {exp.description && <p className="timeline__desc">{exp.description}</p>}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="timeline__highlights">
                      {exp.highlights.map((h, j) => <li key={j}>{h}</li>)}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
