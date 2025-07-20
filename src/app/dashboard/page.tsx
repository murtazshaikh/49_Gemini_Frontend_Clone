"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import styles from "./dashboard.module.scss";
import Link from "next/link";

type Chatroom = {
  id: string;
  title: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const auth = useAuthStore();

  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (!auth.isLoggedIn && !saved) router.push("/auth");
    if (saved && !auth.isLoggedIn) {
      const parsed = JSON.parse(saved);
      auth.login(parsed.phone, parsed.countryCode);
    }
  }, []);

  // Add new chatroom
  const handleAdd = () => {
    const newChat = {
      id: Date.now().toString(),
      title,
    };
    const updated = [...chatrooms, newChat];
    setChatrooms(updated);
    setTitle("");
    localStorage.setItem("chatrooms", JSON.stringify(updated));
  };

  // Delete chatroom
  const handleDelete = (id: string) => {
    const updated = chatrooms.filter((c) => c.id !== id);
    setChatrooms(updated);
    localStorage.setItem("chatrooms", JSON.stringify(updated));
  };

  // Load from localStorage on mount
  useEffect(() => {
    const savedRooms = localStorage.getItem("chatrooms");
    if (savedRooms) setChatrooms(JSON.parse(savedRooms));
  }, []);

  // Filter chatrooms
  const filtered = chatrooms.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.dashboard}>
      <h2>Welcome, {auth.phone}</h2>

      <input
        placeholder="Search chatroom..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className={styles.create}>
        <input
          placeholder="New chatroom title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={handleAdd}>Create Chatroom</button>
      </div>

      <ul>
        {filtered.map((c) => (
          <Link key={c.id} href={`/dashboard/${c.id}`}>
            <li className={styles.chatroomItem}>
              <span style={{ cursor: "pointer", fontWeight: "bold" }}>
                {c.title}
              </span>
              <button onClick={() => handleDelete(c.id)}>🗑</button>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
