import React, { useEffect, useState } from "react";

interface AnimatedMProps {
  onComplete: () => void;
  reverse?: boolean;
}

export const AnimatedM: React.FC<AnimatedMProps> = ({
  onComplete,
  reverse = false,
}) => {
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    const path = document.querySelector("#m-path") as SVGPathElement;
    if (path) {
      const length = path.getTotalLength();
      setPathLength(length);
    }

    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <svg
      viewBox="0 0 400 300"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#01b48a" />
          <stop offset="50%" stopColor="#3dd2b8" />
          <stop offset="100%" stopColor="#01b48a" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="3"
            floodColor="#01b48a"
            floodOpacity="0.15"
          />
        </filter>
      </defs>

      {/* Línea guía */}
      <path
        d="M80,240 L80,60 L200,180 L320,60 L320,240"
        fill="none"
        stroke="rgba(1, 180, 138, 0.05)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#shadow)"
      />

      {/* Línea principal animada */}
      <path
        id="m-path"
        d="M80,240 L80,60 L200,180 L320,60 L320,240"
        fill="none"
        stroke="url(#gradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
        style={{
          strokeDasharray: pathLength,
          strokeDashoffset: reverse ? 0 : pathLength,
          animation: reverse
            ? "eraseM 2s ease-in-out forwards"
            : "drawM 2s ease-in-out forwards",
        }}
      />

      {/* Puntos de conexión */}
      <g
        className={`opacity-0 ${reverse ? "animate-fadeOut" : "animate-fadeIn"}`}
        style={{ animationDelay: reverse ? "0s" : "2s" }}
      >
        <circle
          cx="80"
          cy="240"
          r="4"
          fill="url(#gradient)"
          filter="url(#glow)"
        />
        <circle
          cx="80"
          cy="60"
          r="4"
          fill="url(#gradient)"
          filter="url(#glow)"
        />
        <circle
          cx="200"
          cy="180"
          r="4"
          fill="url(#gradient)"
          filter="url(#glow)"
        />
        <circle
          cx="320"
          cy="60"
          r="4"
          fill="url(#gradient)"
          filter="url(#glow)"
        />
        <circle
          cx="320"
          cy="240"
          r="4"
          fill="url(#gradient)"
          filter="url(#glow)"
        />
      </g>

      <style>
        {`
          @keyframes drawM {
            from {
              stroke-dashoffset: ${pathLength};
              filter: brightness(0.5) blur(1px);
            }
            to {
              stroke-dashoffset: 0;
              filter: brightness(1.2) blur(0);
            }
          }
          @keyframes eraseM {
            from {
              stroke-dashoffset: 0;
              filter: brightness(1.2) blur(0);
            }
            to {
              stroke-dashoffset: ${pathLength};
              filter: brightness(0.5) blur(1px);
            }
          }
          @keyframes fadeIn {
            to {
              opacity: 1;
            }
          }
          @keyframes fadeOut {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }
        `}
      </style>
    </svg>
  );
};
