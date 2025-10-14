// "use client";

// import { Button } from "@/components/ui/button";
// import { motion, useAnimation } from "framer-motion";
// import { useRef } from "react";

// interface LetterButtonProps {
//   text: string;
//   className?: string;
//   onClick?: () => void;
// }

// export function LetterButton({ text, className, onClick }: LetterButtonProps) {
//   const controlsRef = useRef(text.split("").map(() => useAnimation()));
//   const timeouts = useRef<NodeJS.Timeout[]>([]);

//     const handleClick = () => {
//     onClick?.();

//     const middle = Math.floor(text.length / 2);

//     // Очистка
//     controlsRef.current.forEach((control) => control.stop());
//     timeouts.current.forEach(clearTimeout);
//     timeouts.current = [];

//     controlsRef.current.forEach((control, i) => {
//         const isLeft = i <= middle - 1;
//         const dir = isLeft ? 1 : -1;
//         let offset = Math.abs(i - middle);
//         if (dir === -1) offset += 1;
//         const finalOffset = offset * 2;

//         // Анимация влево
//         control.start({
//         x: -5 * dir,
//         transition: {
//             duration: 0.2,
//             ease: "easeInOut",
//         },
//         }).then(() => {
//             // Анимация вправо
//             control.start({
//                 x: (10 * finalOffset) * dir,
//                 opacity: [1, 1, 0],
//                 transition: {
//                 duration: 0.1,
//                 ease: "easeInOut",
//                 },
//         }).then(() => {
//             // Возврат в исходную позицию
//             control.start({
//             x: 0,
//             //opacity: [0, 0, 1],
//             transition: {
//                 duration: 1,
//                 ease: "easeOut",
//             },
//             });
//         });
//         });
//     });
//     };

//   return (
//     <Button
//     onClick={handleClick}
//     variant="ghost"
//     className={`p-0 h-auto cursor-pointer bg-transparent hover:bg-transparent focus-visible:ring-0 ${className ?? ""}`}
//     >
//     <span className="relative flex">
//         {/* Левая половина */}
//         <span className="relative overflow-hidden" style={{ width: `${Math.floor(text.length / 2) * 16}px` }}>
//         <span className="flex justify-end gap-[2px]">
//             {text.split("").map((char, i) => {
//             const middle = Math.floor(text.length / 2);
//             if (i < middle) {
//                 return (
//                 <motion.span
//                     key={i}
//                     animate={controlsRef.current[i]}
//                     className="inline-block min-w-[14px]"
//                 >
//                     {char}
//                 </motion.span>
//                 );
//             }
//             })}
//         </span>
//         </span>

//         {/* Правая половина */}
//         <span className="relative overflow-hidden" style={{ width: `${Math.ceil(text.length / 2) * 16}px` }}>
//         <span className="flex justify-start gap-[2px]">
//             {text.split("").map((char, i) => {
//             const middle = Math.floor(text.length / 2);
//             if (i >= middle) {
//                 return (
//                 <motion.span
//                     key={i}
//                     animate={controlsRef.current[i]}
//                     className="inline-block min-w-[14px]"
//                 >
//                     {char}
//                 </motion.span>
//                 );
//             }
//             })}
//         </span>
//         </span>
//     </span>
//     </Button>

//   );
// }
