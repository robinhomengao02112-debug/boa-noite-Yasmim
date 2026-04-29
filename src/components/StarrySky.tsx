import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

interface Heart {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export default function StarrySky({ children }: { children: React.ReactNode }) {
  const [stars, setStars] = useState<Star[]>([]);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate random stars
    const generatedStars: Star[] = [];
    const starCount = 120;

    for (let i = 0; i < starCount; i++) {
      generatedStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.7 + 0.3,
        duration: Math.random() * 4 + 2,
        delay: Math.random() * 5,
      });
    }

    setStars(generatedStars);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const colors = ['#ff4d6d', '#ff758f', '#ff8fa3', '#ffb3c1', '#f3ccd1', '#ea8c55'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newHeart: Heart = {
      id: Date.now() + Math.random(),
      x,
      y,
      size: Math.random() * 15 + 15,
      color: randomColor,
    };

    setHearts((prev) => [...prev, newHeart]);

    // Remove heart after animation completes
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 2000);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-[#050510] via-[#0b0c20] to-[#1a0f2e] text-white cursor-pointer"
    >
      {/* Background Star Layers */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white shadow-[0_0_4px_1px_rgba(255,255,255,0.4)]"
            style={{
              top: `${star.y}%`,
              left: `${star.x}%`,
              width: star.size,
              height: star.size,
            }}
            animate={{
              opacity: [star.opacity * 0.3, star.opacity, star.opacity * 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Shooting Stars */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={`shooting-${i}`}
            className="absolute h-[1px] w-[60px] bg-gradient-to-r from-transparent via-white to-transparent"
            style={{
              top: `${Math.random() * 40}%`,
              left: `${Math.random() * 50}%`,
              transform: 'rotate(-45deg)',
              opacity: 0,
            }}
            animate={{
              x: [0, 300],
              y: [0, 300],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 1.5 + 1,
              delay: Math.random() * 10 + i * 5,
              repeat: Infinity,
              repeatDelay: Math.random() * 15 + 10,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Interactive Floating Hearts */}
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.svg
            key={heart.id}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={heart.color}
            stroke="none"
            className="absolute pointer-events-none drop-shadow-[0_4px_8px_rgba(255,77,109,0.5)]"
            style={{
              top: heart.y - heart.size / 2,
              left: heart.x - heart.size / 2,
              width: heart.size,
              height: heart.size,
            }}
            initial={{ opacity: 0, scale: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0.8, 0],
              scale: [0.5, 1.3, 1, 0.8],
              y: -150,
              x: Math.sin(heart.id) * 30, // Zigzag path
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: 'easeOut' }}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </motion.svg>
        ))}
      </AnimatePresence>

      {/* Main Content (App Dashboard) */}
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>
    </div>
  );
}
