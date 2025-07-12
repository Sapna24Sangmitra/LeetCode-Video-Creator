import React, { useMemo } from 'react';

const EMOJIS = ['💻', '🚀', '💡', '⚙️', '🧠', '⚡️', '🔗', '📊', '🛠️', '🔬', '📡', '🧪'];
const NUM_EMOJIS_TO_DISPLAY = 15; // Adjust for density

const FloatingEmojisBackground: React.FC = () => {
  const selectedEmojis = useMemo(() => {
    const emojis = [];
    for (let i = 0; i < NUM_EMOJIS_TO_DISPLAY; i++) {
      emojis.push({
        id: i,
        char: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        style: {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          fontSize: `${Math.random() * 1.5 + 0.75}rem`, // 0.75rem to 2.25rem
          animationDuration: `${Math.random() * 15 + 10}s`, // 10s to 25s
          animationDelay: `${Math.random() * 5}s`,
        },
      });
    }
    return emojis;
  }, []);

  return (
    <div
      className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {selectedEmojis.map((emoji) => (
        <span
          key={emoji.id}
          className="emoji-float"
          style={emoji.style}
        >
          {emoji.char}
        </span>
      ))}
    </div>
  );
};

export default FloatingEmojisBackground;