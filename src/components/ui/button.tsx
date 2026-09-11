import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none min-h-11 px-5",
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-fg hover:bg-accent-2",
        secondary:
          "border border-border bg-surface-2 text-fg hover:bg-surface-3",
        ghost: "text-fg hover:bg-surface-2",
        link: "text-fg underline-offset-4 hover:underline px-0 min-h-0",
      },
      size: {
        default: "text-sm tracking-wide",
        sm: "min-h-9 px-3 text-xs",
        lg: "min-h-12 px-7 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = "Button";

export { buttonVariants };
