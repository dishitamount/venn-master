import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-display",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow hover:shadow-[0_0_30px_hsl(var(--primary)/0.6)]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        neon: "bg-transparent border-2 border-primary text-primary hover:bg-primary/20 shadow-glow hover:shadow-[0_0_40px_hsl(var(--primary)/0.8)] dark:neon-text-subtle",
        pastel: "bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-soft",
        circle: "rounded-full aspect-square p-0 border-2 hover:scale-110",
        circleA: "rounded-full aspect-square p-0 border-2 border-circle-a bg-circle-a/20 hover:bg-circle-a/40 text-foreground circle-glow-a hover:scale-110",
        circleB: "rounded-full aspect-square p-0 border-2 border-circle-b bg-circle-b/20 hover:bg-circle-b/40 text-foreground circle-glow-b hover:scale-110",
        circleC: "rounded-full aspect-square p-0 border-2 border-circle-c bg-circle-c/20 hover:bg-circle-c/40 text-foreground circle-glow-c hover:scale-110",
        game: "bg-card border-2 border-primary/50 text-foreground hover:border-primary hover:bg-primary/10 shadow-soft",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 px-4",
        lg: "h-14 px-8 text-lg",
        xl: "h-16 px-10 text-xl",
        icon: "h-10 w-10",
        circle: "h-14 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
