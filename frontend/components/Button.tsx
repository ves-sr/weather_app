import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export default function Button({
  variant = "primary",
  className = "",
  ...rest
}: ButtonProps) {
  const base =
    "rounded-xl px-5 py-3 text-sm font-bold transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-97 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-accent text-white hover:shadow-[0_10px_24px_-10px_rgba(255,90,31,0.6)]",
    ghost: "bg-white/50 border border-card-border text-text hover:border-accent",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest} />
  );
}
