export function ProjectMark({ name, accent, size = "normal" }: { name: string; accent: string; size?: "normal" | "large" | "small" }) {
  const letters = name.toLowerCase() === "llama.cpp" ? "ll" : name.toLowerCase() === "langgraph" ? "lg" : name.toLowerCase() === "openhands" ? "oh" : name.slice(0, 2).toLowerCase();
  return <span className={`project-mark project-mark-${size}`} style={{ "--mark-color": accent } as React.CSSProperties} aria-hidden="true">{letters}</span>;
}
