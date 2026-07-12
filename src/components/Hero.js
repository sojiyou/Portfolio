import { useState, useEffect } from "react";
import useInView from "../hooks/useInView";
import { getBanner } from "../lib/api";
import "./Hero.css";

export default function Hero() {
  const [ref, inView] = useInView(0.1);
  const [bannerText, setBannerText] = useState("Available for opportunities");

  useEffect(() => {
    getBanner().then(setBannerText);
  }, []);

  return (
    <section id="hero" className="hero" ref={ref}>
      <div className={`hero__inner ${inView ? "fade-in" : ""}`}>
        <div className="hero__content">
          <div className="hero__badge">
            <span className="hero__badge-dot" />
            {bannerText}
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

          <div className="hero__cta">
            <a href="#projects" className="btn btn--primary">
              View Projects
            </a>
            <a href="#contact" className="btn btn--ghost">
              Get in Touch
            </a>
          </div>
        </div>

        <div className="hero__image">
          <img src="/sojo-corporate-attire-profile.png" alt="Sojo Decaran" />
        </div>
      </div>

      <div className="hero__bg-glow" />
      <div className="hero__grid-overlay" />
    </section>
  );
}
