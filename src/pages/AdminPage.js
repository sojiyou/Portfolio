import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import BackRoomLogin from "../components/BackRoomLogin";
import BackRooms from "../components/BackRooms";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <p style={{ color: "var(--text-tertiary)" }}>Loading…</p>
      </div>
    );
  }

  return user ? <BackRooms /> : <BackRoomLogin />;
}
