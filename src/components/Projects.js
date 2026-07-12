import { useState, useEffect } from "react";
import useInView from "../hooks/useInView";
import ProjectCard from "./ProjectCard";
import { getProjects } from "../lib/api";
import "./Projects.css";

const fallbackProjects = [
  {
    id: "fallback",
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
    tech: ["React", "JavaScript", "CSS", "Mapbox", "Firebase", "EmailJS"],
    type: [
      { label: "Mobile App", url: "https://aquallera-pwa.vercel.app", image: "/aquallera-pwa.png" },
      { label: "Web App", url: "https://aquallera-website.vercel.app", image: "/aquallera-web.png" },
    ],
  },
];

export default function Projects() {
  const [ref, inView] = useInView(0.1);
  const [projects, setProjects] = useState(fallbackProjects);

  useEffect(() => {
    getProjects().then((p) => {
      if (p.length > 0) setProjects(p);
    });
  }, []);

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
