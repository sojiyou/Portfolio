import useInView from "../hooks/useInView";
import SkillPill from "./SkillPill";
import "./Hero.css";

const skills = [
  { name: "HTML", level: 90 },
  { name: "CSS", level: 88 },
  { name: "JavaScript", level: 85 },
  { name: "React", level: 78 },
  { name: "Java", level: 72 },
  { name: "Python", level: 70 },
  { name: "Tailwind CSS", level: 40 },
  { name: "PHP", level: 55 },
];

export default function Hero() {
  const [ref, inView] = useInView(0.1);
  return (
    <section id="hero" className="hero" ref={ref}>
      <div className={`hero__inner ${inView ? "fade-in" : ""}`}>
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          Available for opportunities
        </div>

        <h1 className="hero__name">
          <span className="hero__name-first">Sojo Sales</span>
          <br />
          <span className="hero__name-last">Ansen Decaran</span>
        </h1>

        <p className="hero__role">
          <span className="hero__role-accent">Frontend Developer</span> —
          crafting clean, purposeful interfaces from Baguio City, PH.
        </p>

        <div className="hero__edu">
          <div className="hero__edu-logo">
            <img src="/uc-logo.png" alt="University of the Cordilleras logo" />
          </div>
          <div>
            <p className="hero__edu-school">University of the Cordilleras</p>
            <p className="hero__edu-detail">
              Bachelor of Science in Information Technology
            </p>
          </div>
        </div>

        <div className="hero__skills-grid">
          {skills.map((sk, i) => (
            <SkillPill
              key={sk.name}
              skill={sk}
              delay={i * 60}
              visible={inView}
            />
          ))}
        </div>

        <div className="hero__cta">
          <a href="#projects" className="btn btn--primary">
            View Projects
          </a>
          <a href="#contact" className="btn btn--ghost">
            Get in Touch
          </a>
        </div>
      </div>

      <div className="hero__bg-glow" />
      <div className="hero__grid-overlay" />
    </section>
  );
}
