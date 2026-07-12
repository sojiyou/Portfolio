import { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import BannerEditor from "./BannerEditor";
import SkillsEditor from "./SkillsEditor";
import ContactEditor from "./ContactEditor";
import ProjectForm from "./ProjectForm";
import ExperienceEditor from "./ExperienceEditor";
import "./BackRooms.css";

const TABS = [
  { key: "banner", label: "Banner" },
  { key: "skills", label: "Skills" },
  { key: "experience", label: "Experience" },
  { key: "projects", label: "Projects" },
  { key: "contact", label: "Contact" },
];

const seedData = async () => {
  const generalSnap = await getDoc(doc(db, "settings", "general"));
  if (!generalSnap.exists()) {
    await setDoc(doc(db, "settings", "general"), {
      bannerText: "Available for opportunities",
    });
  }

  const skillsSnap = await getDoc(doc(db, "settings", "skills"));
  if (!skillsSnap.exists()) {
    await setDoc(doc(db, "settings", "skills"), {
      list: [
        { name: "HTML", level: 90 },
        { name: "CSS", level: 88 },
        { name: "JavaScript", level: 85 },
        { name: "React", level: 78 },
        { name: "Java", level: 72 },
        { name: "Python", level: 70 },
        { name: "Tailwind CSS", level: 40 },
        { name: "PHP", level: 55 },
      ],
    });
  }

  const contactSnap = await getDoc(doc(db, "settings", "contact"));
  if (!contactSnap.exists()) {
    await setDoc(doc(db, "settings", "contact"), {
      location: "Baguio City, Philippines",
      education: "University of the Cordilleras",
      focus: "Frontend Development",
    });
  }

  const projectsSnap = await getDoc(doc(db, "settings", "_hasProjects"));
  if (!projectsSnap.exists()) {
    await addDoc(collection(db, "projects"), {
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
      order: 0,
    });
    await setDoc(doc(db, "settings", "_hasProjects"), { seeded: true });
  }

  const expSnap = await getDoc(doc(db, "settings", "_hasExperience"));
  if (!expSnap.exists()) {
    await addDoc(collection(db, "experiences"), {
      title: "Frontend Intern",
      company: "IOL Inc.",
      location: "Baguio City",
      startDate: "June 2025",
      endDate: "Present",
      description:
        "Working on frontend development for internal tools and client projects. Building responsive UIs with React and modern CSS.",
      highlights: [
        "Built reusable UI components",
        "Integrated REST APIs",
        "Collaborated on responsive layouts",
      ],
      order: 0,
    });
    await setDoc(doc(db, "settings", "_hasExperience"), { seeded: true });
  }
};

export default function BackRooms() {
  const [seeding, setSeeding] = useState(true);
  const [activeTab, setActiveTab] = useState("banner");
  const seeded = useRef(false);

  useEffect(() => {
    if (!seeded.current) {
      seeded.current = true;
      seedData().finally(() => setSeeding(false));
    }
  }, []);

  const handleLogout = () => signOut(auth);

  const renderTab = (key) => {
    switch (key) {
      case "banner":
        return <BannerEditor />;
      case "skills":
        return <SkillsEditor />;
      case "experience":
        return <ExperienceEditor />;
      case "projects":
        return <ProjectForm />;
      case "contact":
        return <ContactEditor />;
      default:
        return null;
    }
  };

  if (seeding) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard__body" style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          <div>
            <img src="/favicon.svg" alt="" className="backroom-spinner" />
            <p style={{ color: "var(--text-tertiary)", marginTop: "1rem" }}>Setting up the back room…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard__header">
        <h1 className="admin-dashboard__title">Back Room</h1>
        <button className="btn btn--ghost" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <div className="admin-dashboard__body">
        <nav className="admin-dashboard__tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`admin-dashboard__tab ${activeTab === t.key ? "admin-dashboard__tab--active" : ""}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="admin-dashboard__content">
          {renderTab(activeTab)}
        </div>
      </div>
    </div>
  );
}
