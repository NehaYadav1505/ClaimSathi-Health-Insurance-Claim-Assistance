import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const healthcareCardVariants = cva(
  "rounded-2xl transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-surface-elevated border border-border/50 shadow-card",
        sage: "bg-card/30 border border-card/50",
        elevated: "bg-surface-elevated shadow-elevated border border-border/30",
        outline: "bg-transparent border-2 border-border",
        success: "bg-success/10 border border-success/30",
        warning: "bg-destructive/10 border border-destructive/30",
        glass: "bg-surface-elevated/80 backdrop-blur-sm border border-border/30 shadow-soft",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
);

export interface HealthcareCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof healthcareCardVariants> {}

const HealthcareCard = React.forwardRef<HTMLDivElement, HealthcareCardProps>(
  ({ className, variant, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(healthcareCardVariants({ variant, padding, className }))}
        {...props}
      />
    );
  }
);
HealthcareCard.displayName = "HealthcareCard";

const HealthcareCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 mb-4", className)}
    {...props}
  />
));
HealthcareCardHeader.displayName = "HealthcareCardHeader";

const HealthcareCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-xl font-semibold text-foreground", className)}
    {...props}
  />
));
HealthcareCardTitle.displayName = "HealthcareCardTitle";

const HealthcareCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-muted-foreground", className)}
    {...props}
  />
));
HealthcareCardDescription.displayName = "HealthcareCardDescription";

const HealthcareCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
HealthcareCardContent.displayName = "HealthcareCardContent";

export {
  HealthcareCard,
  HealthcareCardHeader,
  HealthcareCardTitle,
  HealthcareCardDescription,
  HealthcareCardContent,
  healthcareCardVariants,
};
