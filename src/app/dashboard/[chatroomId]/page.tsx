"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./chatroom.module.scss";
import toast from "react-hot-toast";
import { useThemeStore } from "@/store/useThemeStore";

type Message = {
  id: string;
  sender: "user" | "ai";
  text?: string;
  image?: string;
  time: string;
};

export default function ChatroomPage() {
  const { chatroomId } = useParams();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const MESSAGES_PER_PAGE = 20;
  const [page, setPage] = useState(1);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);

  const toggle = useThemeStore((s) => s.toggle);
  const darkMode = useThemeStore((s) => s.darkMode);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [visibleMessages]);

  useEffect(() => {
    const saved = localStorage.getItem(`chat-${chatroomId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setAllMessages(parsed);
      setVisibleMessages(parsed.slice(-MESSAGES_PER_PAGE));
    }
  }, [chatroomId]);

  useEffect(() => {
    return () => setIsTyping(false);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (el.scrollTop === 0 && visibleMessages.length < allMessages.length) {
        const nextPage = page + 1;
        const start = allMessages.length - nextPage * MESSAGES_PER_PAGE;
        const end = allMessages.length - page * MESSAGES_PER_PAGE;
        const nextChunk = allMessages.slice(Math.max(0, start), end);

        setVisibleMessages((prev) => [...nextChunk, ...prev]);
        setPage(nextPage);
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [visibleMessages, page, allMessages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input.trim(),
      time: new Date().toLocaleTimeString(),
    };

    setAllMessages((prev) => {
      const updated = [...prev, newMessage];
      localStorage.setItem(`chat-${chatroomId}`, JSON.stringify(updated));
      return updated;
    });
    setVisibleMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    // Simulated Gemini reply
    setTimeout(() => {
      const reply: Message = {
        id: Date.now().toString() + "-ai",
        sender: "ai",
        text: `🤖 Gemini says: "${newMessage.text}" (echo reply)`,
        time: new Date().toLocaleTimeString(),
      };
      setAllMessages((prev) => {
        const updated = [...prev, reply];
        localStorage.setItem(`chat-${chatroomId}`, JSON.stringify(updated));
        return updated;
      });
      setVisibleMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className={styles.chatroom}>
        <button onClick={toggle}>
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
        <h2>Chatroom: {chatroomId}</h2>

        <div ref={containerRef} className={styles.messages}>
          {visibleMessages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.message} ${styles[msg.sender]}`}
              onClick={() => {
                const textToCopy = msg.text || msg.image;
                if (textToCopy) {
                  navigator.clipboard.writeText(textToCopy);
                  toast.success("Copied to clipboard!");
                }
              }}
              title="Click to copy"
              style={{ cursor: "pointer" }}
            >
              {msg.text && <span>{msg.text}</span>}
              {msg.image && (
                <img
                  src={msg.image}
                  alt="uploaded"
                  style={{
                    maxWidth: "200px",
                    borderRadius: "8px",
                    marginTop: "8px",
                  }}
                />
              )}
              <span className={styles.time}>{msg.time}</span>
            </div>
          ))}

          {isTyping && (
            <div className={styles.message}>
              <em>Gemini is typing...</em>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div className={styles.inputBar}>
          <input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  const newMessage: Message = {
                    id: Date.now().toString(),
                    sender: "user",
                    image: reader.result as string,
                    time: new Date().toLocaleTimeString(),
                  };
                  setAllMessages((prev) => {
                    const updated = [...prev, newMessage];
                    localStorage.setItem(
                      `chat-${chatroomId}`,
                      JSON.stringify(updated)
                    );
                    return updated;
                  });
                  setVisibleMessages((prev) => [...prev, newMessage]);

                  setIsTyping(true);

                  setTimeout(() => {
                    const reply: Message = {
                      id: Date.now().toString() + "-ai",
                      sender: "ai",
                      text: `That's a cool image!`,
                      time: new Date().toLocaleTimeString(),
                    };
                    setAllMessages((prev) => {
                      const updated = [...prev, reply];
                      localStorage.setItem(
                        `chat-${chatroomId}`,
                        JSON.stringify(updated)
                      );
                      return updated;
                    });
                    setVisibleMessages((prev) => [...prev, reply]);
                    setIsTyping(false);
                  }, 1500);
                };
                reader.readAsDataURL(file);
              }
            }}
          />

          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}
