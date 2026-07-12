import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import "./Navbar.css";

export default function Navbar({ active }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__links">
          {["hero", "experience", "projects", "contact"].map((s) => (
          <a
            key={s}
            href={`#${s}`}
            className={`navbar__link ${active === s ? "navbar__link--active" : ""}`}
          >
            {s === "hero" ? "Home" : s.charAt(0).toUpperCase() + s.slice(1)}
          </a>
        ))}
      </div>
      <ThemeToggle />
    </nav>
  );
}
