import { useEffect, useRef } from "react";
import { Maximize2 } from "lucide-react";

const SIZE = 64;

/**
 * Global follow-mouse cursor: hidden by default, appears as a circular
 * gradient badge whenever the pointer is over an element tagged
 * data-cursor="view" (e.g. project preview images).
 *
 * Both position and visibility are applied via direct DOM mutation (no
 * React state / re-render on mousemove) so every update is immediate and
 * never depends on React's render cycle.
 */
const CustomCursor = () => {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const activeRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(hover: none)").matches) {
      return;
    }

    const move = (e) => {
      if (outerRef.current) {
        outerRef.current.style.transform = `translate3d(${e.clientX - SIZE / 2}px, ${e.clientY - SIZE / 2}px, 0)`;
      }

      const isOver = !!e.target.closest('[data-cursor="view"]');
      if (isOver !== activeRef.current) {
        activeRef.current = isOver;
        if (innerRef.current) {
          innerRef.current.style.opacity = isOver ? "1" : "0";
          innerRef.current.style.transform = isOver ? "scale(1)" : "scale(0)";
        }
      }
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={outerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: SIZE,
        height: SIZE,
        zIndex: 200,
        pointerEvents: "none",
        transform: "translate3d(-200px, -200px, 0)",
        transition: "transform 0.12s ease-out",
      }}
    >
      <div
        ref={innerRef}
        style={{
          width: "100%",
          height: "100%",
          opacity: 0,
          transform: "scale(0)",
          transition: "opacity 0.25s ease-out, transform 0.25s ease-out",
        }}
        className="rounded-full bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600 flex items-center justify-center shadow-xl"
      >
        <Maximize2 size={20} className="text-white" strokeWidth={2.5} />
      </div>
    </div>
  );
};

export default CustomCursor;
