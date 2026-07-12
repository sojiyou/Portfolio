import { db } from "./firebase";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

/* ─── Settings ─────────────────────────────────────────────── */

export async function getBanner() {
  try {
    const snap = await getDoc(doc(db, "settings", "general"));
    return snap.exists() ? snap.data().bannerText : "Available for opportunities";
  } catch {
    return "Available for opportunities";
  }
}

export async function updateBanner(text) {
  await setDoc(doc(db, "settings", "general"), { bannerText: text });
}

export async function getSkills() {
  try {
    const snap = await getDoc(doc(db, "settings", "skills"));
    return snap.exists() ? snap.data().list : [];
  } catch {
    return [];
  }
}

export async function updateSkills(list) {
  await setDoc(doc(db, "settings", "skills"), { list });
}

export async function getContact() {
  try {
    const snap = await getDoc(doc(db, "settings", "contact"));
    return snap.exists()
      ? snap.data()
      : {
          location: "Baguio City, Philippines",
          education: "University of the Cordilleras",
          focus: "Frontend Development",
        };
  } catch {
    return {
      location: "Baguio City, Philippines",
      education: "University of the Cordilleras",
      focus: "Frontend Development",
    };
  }
}

export async function updateContact(data) {
  await setDoc(doc(db, "settings", "contact"), data);
}

/* ─── Projects ─────────────────────────────────────────────── */

export async function getProjects() {
  try {
    const snap = await getDocs(collection(db, "projects"));
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch {
    return [];
  }
}

export async function addProject(data) {
  return await addDoc(collection(db, "projects"), data);
}

export async function updateProject(id, data) {
  await updateDoc(doc(db, "projects", id), data);
}

export async function deleteProject(id) {
  await deleteDoc(doc(db, "projects", id));
}

/* ─── Experiences ──────────────────────────────────────────── */

export async function getExperiences() {
  try {
    const snap = await getDocs(collection(db, "experiences"));
    return snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch {
    return [];
  }
}

export async function addExperience(data) {
  return await addDoc(collection(db, "experiences"), data);
}

export async function updateExperience(id, data) {
  await updateDoc(doc(db, "experiences", id), data);
}

export async function deleteExperience(id) {
  await deleteDoc(doc(db, "experiences", id));
}
