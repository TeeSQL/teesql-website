"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type Size = "sm" | "md";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: Size;
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-[0.74rem]",
  md: "px-6 py-3 text-[0.82rem]",
};

const PrimaryButton = forwardRef<HTMLButtonElement, Props>(function PrimaryButton(
  { className = "", size = "md", children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      {...rest}
      className={`font-mono font-semibold rounded-md bg-mint text-page hover:bg-mint-hi transition-all hover:-translate-y-px cursor-pointer ${SIZE_CLASSES[size]} ${className}`}
    >
      {children}
    </button>
  );
});

export default PrimaryButton;
