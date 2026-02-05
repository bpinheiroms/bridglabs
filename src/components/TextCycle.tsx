"use client";

import { useEffect, useState, useCallback } from "react";

const words = ["Descubra.", "Organize.", "Compartilhe."];

export default function TextCycle() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const typeSpeed = 80;
  const deleteSpeed = 50;
  const pauseTime = 1500;

  const tick = useCallback(() => {
    const currentWord = words[currentIndex];

    if (!isDeleting) {
      // Typing
      setDisplayText(currentWord.substring(0, displayText.length + 1));

      if (displayText === currentWord) {
        // Finished typing, pause then start deleting
        setTimeout(() => setIsDeleting(true), pauseTime);
        return;
      }
    } else {
      // Deleting
      setDisplayText(currentWord.substring(0, displayText.length - 1));

      if (displayText === "") {
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % words.length);
        return;
      }
    }
  }, [currentIndex, displayText, isDeleting]);

  useEffect(() => {
    const speed = isDeleting ? deleteSpeed : typeSpeed;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting]);

  return (
    <span className="inline-block">
      <span
        className="inline-block"
        style={{
          background: "linear-gradient(to right, #a855f7, #7c3aed)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {displayText}
        <span
          className="inline-block w-[3px] h-[1em] ml-1 bg-purple-500 animate-pulse"
          style={{ verticalAlign: "text-bottom" }}
        />
      </span>
    </span>
  );
}
