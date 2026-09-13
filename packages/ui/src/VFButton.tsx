import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-[4px] text-sm font-semibold tracking-normal transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98] border border-transparent cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-xs",
        outline: "border-border bg-card text-foreground hover:bg-muted hover:border-zinc-700 shadow-xs",
        ghost: "hover:bg-muted text-muted-foreground hover:text-foreground border-transparent",
        link: "text-primary underline-offset-4 hover:underline bg-transparent p-0 h-auto border-none",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xs",
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-xs",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 shadow-xs",
      },
      size: {
        sm: "h-8 px-3 text-xs font-bold rounded-[4px] gap-1.5",
        md: "h-9 px-4 text-sm font-semibold rounded-[4px] gap-2",
        lg: "h-10 px-5 text-sm font-bold rounded-[4px] gap-2.5",
        icon: "h-8 w-8 p-0 rounded-[4px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface VFButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const VFButton = React.forwardRef<HTMLButtonElement, VFButtonProps>(
  ({ className, variant, size, isLoading, leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }), isLoading && "opacity-75 cursor-not-allowed")}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin mr-1.5 h-3.5 w-3.5 text-current shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="inline-flex items-center justify-center shrink-0">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="inline-flex items-center justify-center shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

VFButton.displayName = "VFButton";
