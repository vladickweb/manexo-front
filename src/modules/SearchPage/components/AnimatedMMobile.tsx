import { motion } from "framer-motion";

interface AnimatedMMobileProps {
  onComplete?: () => void;
  reverse?: boolean;
}

export const AnimatedMMobile = ({
  onComplete,
  reverse,
}: AnimatedMMobileProps) => {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transform scale-[3.3]"
    >
      <motion.path
        d="M 100 300 L 100 100 L 200 200 L 300 100 L 300 300"
        stroke="#01b48a"
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: reverse ? 0 : 1 }}
        transition={{
          duration: 1,
          ease: "easeInOut",
        }}
        onAnimationComplete={onComplete}
      />
      <motion.g>
        {[
          { cx: 100, cy: 100 },
          { cx: 200, cy: 200 },
          { cx: 300, cy: 100 },
          { cx: 100, cy: 300 },
          { cx: 300, cy: 300 },
        ].map((point, index) => (
          <motion.circle
            key={index}
            cx={point.cx}
            cy={point.cy}
            r="8"
            fill="#01b48a"
            initial={{ scale: 0 }}
            animate={{ scale: reverse ? 0 : 1 }}
            transition={{
              delay: 1 + index * 0.1,
              duration: 0.2,
              ease: "easeOut",
            }}
          />
        ))}
      </motion.g>
    </svg>
  );
};
