import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const healthcareButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-pine-light shadow-soft hover:shadow-elevated active:scale-[0.98]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-sage-dark/20 border border-border",
        outline:
          "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
        ghost:
          "text-foreground hover:bg-muted hover:text-foreground",
        success:
          "bg-success text-success-foreground hover:bg-success/90 shadow-soft",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link:
          "text-primary underline-offset-4 hover:underline",
        hero:
          "bg-primary text-primary-foreground text-base px-8 py-6 rounded-2xl shadow-elevated hover:shadow-lg hover:bg-pine-light active:scale-[0.98] font-semibold",
        voice:
          "bg-accent text-accent-foreground hover:bg-accent/80 rounded-full shadow-soft",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-11 w-11",
        iconSm: "h-9 w-9",
        iconLg: "h-14 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface HealthcareButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof healthcareButtonVariants> {
  asChild?: boolean;
}

const HealthcareButton = React.forwardRef<HTMLButtonElement, HealthcareButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(healthcareButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
HealthcareButton.displayName = "HealthcareButton";

export { HealthcareButton, healthcareButtonVariants };
