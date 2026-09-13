import * as React from 'react';
import { cn } from './utils';

export interface VFCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  headerClassName?: string;
  headerBgClassName?: string;
  bodyClassName?: string;
  topBarClassName?: string;
  accentColor?: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'cyan' | 'indigo' | 'primary' | 'none';
  showAmbientGlow?: boolean;
}

const ACCENT_GLOW_COLORS: Record<string, string> = {
  blue: 'rgba(59, 130, 246, 0.035)',
  emerald: 'rgba(16, 185, 129, 0.035)',
  amber: 'rgba(245, 158, 11, 0.035)',
  purple: 'rgba(168, 85, 247, 0.035)',
  rose: 'rgba(244, 63, 94, 0.035)',
  cyan: 'rgba(6, 182, 212, 0.035)',
  indigo: 'rgba(99, 102, 241, 0.035)',
  primary: 'rgba(255, 255, 255, 0.02)',
  none: 'rgba(255, 255, 255, 0.015)',
};

export function VFCard({
  title,
  description,
  actions,
  children,
  className,
  headerClassName,
  headerBgClassName,
  bodyClassName,
  topBarClassName,
  accentColor,
  showAmbientGlow = true,
  ...props
}: VFCardProps) {
  const glowColor = (accentColor && ACCENT_GLOW_COLORS[accentColor]) || 'rgba(255, 255, 255, 0.015)';

  return (
    <div
      className={cn(
        "rounded-[4px] border border-border/80 bg-card text-card-foreground shadow-xs transition-all duration-200 relative overflow-hidden flex flex-col group/vfcard hover:border-zinc-700/80",
        className
      )}
      {...props}
    >
      {/* Subtle ambient card glow across the whole website */}
      {showAmbientGlow && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 opacity-60 group-hover/vfcard:opacity-90 z-0"
          style={{
            background: `radial-gradient(ellipse 70% 35% at 50% 0%, ${glowColor} 0%, transparent 100%)`,
          }}
          aria-hidden="true"
        />
      )}

      {(title || description || actions) && (
        <div className={cn(
          "relative z-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-border/80 shrink-0",
          headerBgClassName,
          headerClassName
        )}>
          <div>
            {title && <h3 className="text-base font-extrabold text-foreground tracking-tight">{title}</h3>}
            {description && <p className="text-xs text-muted-foreground font-medium mt-0.5">{description}</p>}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}
      {children && (
        <div className={cn("relative z-1 p-3 sm:p-3.5 lg:p-4 flex-1 min-h-0", bodyClassName)}>
          {children}
        </div>
      )}
    </div>
  );
}

export function VFCardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center justify-between p-5 border-b border-border", className)} {...props} />;
}

export function VFCardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-base font-bold leading-none tracking-tight text-foreground", className)} {...props}>
      {children}
    </h3>
  );
}

export function VFCardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground leading-normal", className)} {...props} />;
}

export function VFCardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 text-sm text-foreground space-y-3", className)} {...props} />;
}

export function VFCardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center gap-2 p-5 pt-4 border-t border-border bg-muted/20", className)} {...props} />;
}
