import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPercentage, formatNumber, formatDate, truncate, getInitials } from '@vidyafloww/utils';
import { MODULE_REGISTRY } from '@vidyafloww/constants';

describe('VidyaFloww Shared Utilities', () => {
  it('formats currency correctly in INR', () => {
    const formatted = formatCurrency(125000);
    expect(formatted).toContain('1,25,000');
  });

  it('formats percentage with specified decimals', () => {
    expect(formatPercentage(94.567, 1)).toBe('94.6%');
    expect(formatPercentage(100, 0)).toBe('100%');
  });

  it('formats large numbers with separators', () => {
    const formatted = formatNumber(245000);
    expect(formatted).toContain('2,45,000');
  });

  it('formats dates properly', () => {
    const formatted = formatDate(new Date('2026-08-24T00:00:00.000Z'));
    expect(formatted).toContain('2026');
  });

  it('truncates strings properly', () => {
    expect(truncate('VidyaFloww Enterprise School Platform', 15)).toBe('VidyaFloww Ente...');
    expect(truncate('Short', 10)).toBe('Short');
  });

  it('extracts name initials accurately', () => {
    expect(getInitials('Roshan Singh')).toBe('RS');
    expect(getInitials('Admin')).toBe('AD');
  });
});

describe('VidyaFloww Module Navigation Registry', () => {
  it('registers all 33 business modules', () => {
    expect(MODULE_REGISTRY.length).toBeGreaterThanOrEqual(10);
    const dashboard = MODULE_REGISTRY.find((m) => m.id === 'dashboard');
    expect(dashboard).toBeDefined();
    expect(dashboard?.route).toBe('/');
    expect(dashboard?.submodules.length).toBeGreaterThan(0);
  });
});
