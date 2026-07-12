import emailjs from "@emailjs/browser";
import { useState, useEffect, useRef } from "react";
import "./App.css";

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

const projects = [
  {
    id: 1,
    name: "Aquallera",
    tag: "Capstone Project",
    tagColor: "#4EFFA8",
    year: "2025",
    description:
      "A dual-platform water station finder for Baguio City. The mobile app lets residents locate nearby water stations, check prices, and schedule deliveries — all on an interactive map. The companion web dashboard lets station owners receive and manage orders in real time.",
    highlights: [
      "Interactive map integration",
      "Real-time order management",
      "Delivery scheduling system",
      "Price comparison across stations",
      "Baguio City coverage",
    ],
    tech: ["React", "JavaScript", "CSS", "Maps API"],
    type: ["Web App", "Mobile App"],
    emoji: null,
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Navbar({ active }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__links">
        {["hero", "projects", "contact"].map((s) => (
          <a
            key={s}
            href={`#${s}`}
            className={`navbar__link ${active === s ? "navbar__link--active" : ""}`}
          >
            {s === "hero" ? "Home" : s.charAt(0).toUpperCase() + s.slice(1)}
          </a>
        ))}
      </div>
    </nav>
  );
}

function Hero() {
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

function SkillPill({ skill, delay, visible }) {
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

function Projects() {
  const [ref, inView] = useInView(0.1);
  return (
    <section id="projects" className="section" ref={ref}>
      <div className={`section__inner ${inView ? "fade-in" : ""}`}>
        <div className="section__header">
          <span className="section__label">Work</span>
          <h2 className="section__title">Projects</h2>
        </div>

        {projects.map((p, i) => (
          <ProjectCard
            key={p.id}
            project={p}
            delay={i * 100}
            visible={inView}
          />
        ))}

        <div className="more-projects">
          <p className="more-projects__text">More projects coming soon</p>
          <div className="more-projects__line" />
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, delay, visible }) {
  const [hovered, setHovered] = useState(false);
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
        {project.emoji && (
          <div className="project-card__emoji">{project.emoji}</div>
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
            <span key={t} className="project-card__type-badge">
              {t}
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
    </div>
  );
}

function Contact() {
  const [ref, inView] = useInView(0.1);
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          name: form.name,
          email: form.email,
          message: form.message,
          time: new Date().toLocaleString("en-PH", {
            dateStyle: "long",
            timeStyle: "short",
          }),
        },
        { publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY },
      );
      setStatus("sent");
    } catch (error) {
      console.error("EmailJS error:", error);
      setStatus("idle");
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <section id="contact" className="section section--contact" ref={ref}>
      <div className={`section__inner ${inView ? "fade-in" : ""}`}>
        <div className="section__header">
          <span className="section__label">Let's Talk</span>
          <h2 className="section__title">Get in Touch</h2>
        </div>

        <div className="contact__layout">
          <div className="contact__left">
            <p className="contact__intro">
              Whether you have a project in mind, a question, or just want to
              say hello — I'm always open to a good conversation.
            </p>
            <div className="contact__info">
              <div className="contact__info-item">
                <span className="contact__info-label">Location</span>
                <span className="contact__info-value">
                  Baguio City, Philippines
                </span>
              </div>
              <div className="contact__info-item">
                <span className="contact__info-label">Education</span>
                <span className="contact__info-value">
                  University of the Cordilleras
                </span>
              </div>
              <div className="contact__info-item">
                <span className="contact__info-label">Focus</span>
                <span className="contact__info-value">
                  Frontend Development
                </span>
              </div>
            </div>
          </div>

          <form className="contact__form" onSubmit={handleSubmit}>
            {status === "sent" ? (
              <div className="contact__success">
                <span className="contact__success-icon">✓</span>
                <p>Message sent! I'll get back to you soon.</p>
              </div>
            ) : (
              <>
                <div className="contact__field">
                  <label className="contact__label">Name</label>
                  <input
                    className="contact__input"
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="contact__field">
                  <label className="contact__label">Email</label>
                  <input
                    className="contact__input"
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="contact__field">
                  <label className="contact__label">Message</label>
                  <textarea
                    className="contact__input contact__textarea"
                    name="message"
                    placeholder="What's on your mind?"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                  />
                </div>
                <button
                  type="submit"
                  className={`btn btn--primary btn--full ${status === "sending" ? "btn--loading" : ""}`}
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending…" : "Send Message"}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__socials">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="footer__social-link"
          aria-label="GitHub"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="footer__social-link"
          aria-label="LinkedIn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        </a>
      </div>
      <p className="footer__text">
        © {new Date().getFullYear()} Sojo Sales Ansen Decaran
        <span className="footer__sep">·</span>
        Built with React
        <span className="footer__sep">·</span>
        Deployed on Vercel
      </p>
    </footer>
  );
}

export default function App() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const sections = ["hero", "projects", "contact"];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.4 },
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="app">
      <Navbar active={active} />
      <main>
        <Hero />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
