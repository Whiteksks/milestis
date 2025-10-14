// "use client";

// import { motion } from "framer-motion";

// interface Particle {
//   id: number;
//   char: string;
//   x: number;
//   y: number;
// }

// interface LetterParticlesProps {
//   particles: Particle[];
//   type?: "mixed" | "char" | "dot";
// }

// export function LetterParticles({ particles, type = "mixed" }: LetterParticlesProps) {
//   const getContent = (char: string) => {
//     if (type === "dot") return "•";
//     if (type === "char") return char;
//     if (type === "mixed") return Math.random() > 0.3 ? char : "•";
//   };

//   return (
//     <>
//       {particles.map((p) => (
//         <motion.span
//           key={p.id}
//           initial={{
//             x: p.x,
//             y: p.y,
//             opacity: 1,
//             scale: 1,
//           }}
//           animate={{
//             x: p.x + (Math.random() - 0.5) * 80,
//             y: p.y + (Math.random() - 0.5) * 80,
//             opacity: 0,
//             scale: 0.5,
//             rotate: (Math.random() - 0.5) * 360,
//           }}
//           transition={{
//             duration: 0.6,
//             ease: "easeOut",
//           }}
//           className="absolute pointer-events-none text-xs text-foreground select-none"
//         >
//           {getContent(p.char)}
//         </motion.span>
//       ))}
//     </>
//   );
// }
