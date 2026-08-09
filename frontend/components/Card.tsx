import { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  strong?: boolean;
};

export default function Card({ strong = false, className = "", ...rest }: CardProps) {
  return (
    <div
      className={`rounded-[20px] border border-card-border backdrop-blur-lg backdrop-saturate-150 shadow-[0_12px_32px_-16px_rgba(20,32,51,0.18)] ${
        strong ? "bg-card-strong" : "bg-card"
      } ${className}`}
      {...rest}
    />
  );
}
