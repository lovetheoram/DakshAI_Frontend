import { motion } from "framer-motion";

export default function GlassCard({
  children,
  className = "",
  hover = false,
  glow = false,
  onClick,
  padding = "p-6",
  ...props
}) {
  const Component = onClick || hover ? motion.div : "div";
  const motionProps = onClick || hover
    ? { whileHover: { y: -2, scale: 1.01 }, whileTap: onClick ? { scale: 0.99 } : {} }
    : {};

  return (
    <Component
      className={`
        glass
        ${hover ? "glass-hover cursor-pointer" : ""}
        ${glow ? "glass-active" : ""}
        ${padding}
        transition-all duration-300
        ${className}
      `}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
}
