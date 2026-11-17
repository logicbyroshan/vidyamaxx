/**
 * @vidyafloww/constants — Decoupled Subsystem Gateway & Port Configurations (ADR-012)
 *
 * Centralized registry for all decoupled subsystem micro-frontends and backends.
 * Dynamically resolves URLs across local development, containerized environments,
 * and production ingress subdomains.
 */

export interface SubsystemDefinition {
  id: string;
  name: string;
  subdomain: string;
  localPort: number;
  envKey: string;
}

export const SUBSYSTEMS = {
  TRANSPORT: {
    id: 'transport',
    name: 'Transport & Telematics',
    subdomain: 'transport.vidyafloww.com',
    localPort: 8010,
    envKey: 'VITE_SUBSYSTEM_TRANSPORT_URL',
  },
  ELIBRARY: {
    id: 'elibrary',
    name: 'E-Library & NCERT Repository',
    subdomain: 'elibrary.vidyafloww.com',
    localPort: 8011,
    envKey: 'VITE_SUBSYSTEM_ELIBRARY_URL',
  },
  ECLASS: {
    id: 'eclass',
    name: 'E-Classroom Studio',
    subdomain: 'eclass.vidyafloww.com',
    localPort: 8012,
    envKey: 'VITE_SUBSYSTEM_ECLASS_URL',
  },
  HOSTEL: {
    id: 'hostel',
    name: 'Hostel & Residential',
    subdomain: 'hostel.vidyafloww.com',
    localPort: 8013,
    envKey: 'VITE_SUBSYSTEM_HOSTEL_URL',
  },
  HR_MANAGE: {
    id: 'hr',
    name: 'HR & Biometrics',
    subdomain: 'hr.vidyafloww.com',
    localPort: 8014,
    envKey: 'VITE_SUBSYSTEM_HR_URL',
  },
  DESIGN_LAB: {
    id: 'designlab',
    name: 'Design Lab & Visual Studio',
    subdomain: 'designlab.vidyafloww.com',
    localPort: 8015,
    envKey: 'VITE_SUBSYSTEM_DESIGNLAB_URL',
  },
} as const;

export type SubsystemKey = keyof typeof SUBSYSTEMS;

/**
 * Resolve target URL for a subsystem in local dev, staging, or production.
 * Supports environment variable overrides and automatic domain resolution.
 */
export function getSubsystemUrl(
  subsystem: (typeof SUBSYSTEMS)[SubsystemKey] | SubsystemDefinition,
  path: string = '',
  envOverride?: string
): string {
  if (envOverride && typeof envOverride === 'string') {
    return `${envOverride.replace(/\/$/, '')}${path}`;
  }

  // If in browser, inspect hostname to determine whether to use localhost ports or production subdomains
  if (typeof window !== 'undefined') {
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '0.0.0.0';

    if (isLocalhost) {
      return `http://localhost:${subsystem.localPort}${path}`;
    }

    // In production, route via the configured HTTPS subdomain
    return `https://${subsystem.subdomain}${path}`;
  }

  return `http://localhost:${subsystem.localPort}${path}`;
}
