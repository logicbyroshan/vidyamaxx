import * as React from 'react';
import { cn } from './utils';

export interface VFStatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  isLoading?: boolean;
  accentColor?: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'cyan' | 'indigo' | 'primary' | 'none';
  showTopBar?: boolean;
}

const ACCENT_STYLES: Record<string, { card: string; topBar: string; icon: string }> = {
  blue: {
    card: "bg-gradient-to-br from-blue-500/10 via-card to-card border-blue-500/30 hover:border-blue-400/60 shadow-xs",
    topBar: "bg-gradient-to-r from-blue-500 via-sky-400 to-transparent",
    icon: "bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-xs",
  },
  emerald: {
    card: "bg-gradient-to-br from-emerald-500/10 via-card to-card border-emerald-500/30 hover:border-emerald-400/60 shadow-xs",
    topBar: "bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent",
    icon: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs",
  },
  amber: {
    card: "bg-gradient-to-br from-amber-500/10 via-card to-card border-amber-500/30 hover:border-amber-400/60 shadow-xs",
    topBar: "bg-gradient-to-r from-amber-500 via-orange-400 to-transparent",
    icon: "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-xs",
  },
  purple: {
    card: "bg-gradient-to-br from-purple-500/10 via-card to-card border-purple-500/30 hover:border-purple-400/60 shadow-xs",
    topBar: "bg-gradient-to-r from-purple-500 via-pink-400 to-transparent",
    icon: "bg-purple-500/15 text-purple-400 border border-purple-500/30 shadow-xs",
  },
  rose: {
    card: "bg-gradient-to-br from-rose-500/10 via-card to-card border-rose-500/30 hover:border-rose-400/60 shadow-xs",
    topBar: "bg-gradient-to-r from-rose-500 via-red-400 to-transparent",
    icon: "bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-xs",
  },
  cyan: {
    card: "bg-gradient-to-br from-cyan-500/10 via-card to-card border-cyan-500/30 hover:border-cyan-400/60 shadow-xs",
    topBar: "bg-gradient-to-r from-cyan-500 via-blue-400 to-transparent",
    icon: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-xs",
  },
  indigo: {
    card: "bg-gradient-to-br from-indigo-500/10 via-card to-card border-indigo-500/30 hover:border-indigo-400/60 shadow-xs",
    topBar: "bg-gradient-to-r from-indigo-500 via-purple-400 to-transparent",
    icon: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shadow-xs",
  },
  primary: {
    card: "bg-gradient-to-br from-primary/10 via-card to-card border-primary/30 hover:border-primary/60 shadow-xs",
    topBar: "bg-gradient-to-r from-primary via-primary/80 to-transparent",
    icon: "bg-primary/15 text-primary border border-primary/30 shadow-xs",
  },
};

const ACCENT_GLOW_COLORS: Record<string, string> = {
  blue: 'rgba(59, 130, 246, 0.04)',
  emerald: 'rgba(16, 185, 129, 0.04)',
  amber: 'rgba(245, 158, 11, 0.04)',
  purple: 'rgba(168, 85, 247, 0.04)',
  rose: 'rgba(244, 63, 94, 0.04)',
  cyan: 'rgba(6, 182, 212, 0.04)',
  indigo: 'rgba(99, 102, 241, 0.04)',
  primary: 'rgba(234, 88, 12, 0.035)',
  none: 'rgba(234, 88, 12, 0.025)',
};

export function VFStatCard({
  title,
  value,
  icon,
  description,
  trend,
  trendLabel,
  isLoading = false,
  accentColor = 'none',
  showTopBar = false,
  className,
  ...props
}: VFStatCardProps) {
  const displayLabel = trendLabel || description;
  const accent = accentColor !== 'none' && accentColor ? (ACCENT_STYLES[accentColor] || ACCENT_STYLES.primary) : null;
  const glowColor = (accentColor && ACCENT_GLOW_COLORS[accentColor]) || 'rgba(234, 88, 12, 0.025)';

  return (
    <div
      className={cn(
        "rounded-[4px] border bg-card p-3 sm:p-3.5 text-card-foreground flex flex-col justify-center relative overflow-hidden transition-all duration-200 group min-w-0 shadow-xs",
        accent ? accent.card : "border-border hover:border-primary/40",
        className
      )}
      {...props}
    >
      {/* Subtle ambient stat card glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 opacity-50 group-hover:opacity-90 z-0"
        style={{
          background: `radial-gradient(ellipse 75% 45% at 50% 0%, ${glowColor} 0%, transparent 100%)`,
        }}
        aria-hidden="true"
      />

      {accent && showTopBar && (
        <div className={cn("absolute top-0 left-0 right-0 h-[3.5px] z-1", accent.topBar)} />
      )}
      
      {/* Top / Main Section: Left has Title & Value, Right has Large Icon Badge */}
      <div className={cn("relative z-1 flex items-center justify-between gap-3 min-w-0", displayLabel ? "mb-2.5" : "my-auto")}>
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          {title && (
            <span className="text-xs font-bold text-muted-foreground tracking-normal truncate" title={title}>
              {title}
            </span>
          )}
          {isLoading ? (
            <div className="h-8 w-24 bg-muted animate-pulse rounded-[4px] mt-1" />
          ) : (
            <div className="text-2xl sm:text-[26px] font-black tracking-tight text-foreground leading-tight truncate">
              {value}
            </div>
          )}
        </div>

        {icon && (
          <div
            className={cn(
              "h-11 w-11 rounded-[4px] flex items-center justify-center shrink-0 transition-all duration-200 shadow-xs group-hover:scale-105",
              accent ? accent.icon : "bg-muted/80 text-foreground border border-border"
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Bottom Section: Trend Badge & Subtitle */}
      {!isLoading && displayLabel && (
        <div className="relative z-1 flex items-center gap-2 flex-wrap min-w-0 text-xs mt-auto">
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-1 font-bold rounded px-2 py-0.5 text-xs truncate max-w-full",
                trend === 'up' && "bg-success/15 text-success border border-success/30",
                trend === 'down' && "bg-destructive/15 text-destructive border border-destructive/30",
                trend === 'neutral' && "bg-muted text-muted-foreground border border-border"
              )}
            >
              {trend === 'up' && (
                <svg className="h-3.5 w-3.5 stroke-[2.5] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              )}
              {trend === 'down' && (
                <svg className="h-3.5 w-3.5 stroke-[2.5] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span className="truncate">{trendLabel || displayLabel}</span>
            </span>
          )}
          {!trend && (
            <span className="text-xs font-semibold text-muted-foreground truncate">{displayLabel}</span>
          )}
          {trend && description && trendLabel && description !== trendLabel && (
            <span className="text-xs text-muted-foreground truncate font-medium">{description}</span>
          )}
        </div>
      )}
    </div>
  );
}
