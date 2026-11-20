import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatPercentage,
  formatNumber,
  formatDate,
  truncate,
  getInitials,
  sanitizeHtml,
} from '@vidyafloww/utils';
import { MODULE_REGISTRY, SUBSYSTEMS, getSubsystemUrl } from '@vidyafloww/constants';

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

  it('sanitizes unsafe HTML strings and eliminates script tags', () => {
    const dirty = '<p>Clean text</p><script>alert("xss")</script><img src="x" onerror="alert(1)" />';
    const clean = sanitizeHtml(dirty);
    expect(clean).not.toContain('<script>');
    expect(clean).not.toContain('onerror');
    expect(clean).toContain('Clean text');
  });

  it('handles empty or non-string inputs safely in sanitizeHtml', () => {
    expect(sanitizeHtml('')).toBe('');
  });
});

describe('VidyaFloww Subsystem Gateway (ADR-012)', () => {
  it('registers all decoupled subsystems with valid ports and domains', () => {
    expect(SUBSYSTEMS.DESIGN_LAB.localPort).toBe(8010);
    expect(SUBSYSTEMS.HOSTEL.localPort).toBe(8011);
    expect(SUBSYSTEMS.TRANSPORT.localPort).toBe(8012);
    expect(SUBSYSTEMS.HR_MANAGE.localPort).toBe(8013);
    expect(SUBSYSTEMS.ELIBRARY.localPort).toBe(8014);
    expect(SUBSYSTEMS.ECLASS.localPort).toBe(8016);
    expect(SUBSYSTEMS.PORTAL.localPort).toBe(8017);
    expect(SUBSYSTEMS.ADMISSIONS.localPort).toBe(8018);
    expect(SUBSYSTEMS.LMS.localPort).toBe(8019);
    expect(SUBSYSTEMS.PAYMENTS.localPort).toBe(8020);
    expect(SUBSYSTEMS.EXAMINATIONS.localPort).toBe(8021);
    expect(SUBSYSTEMS.COMMUNICATION.localPort).toBe(8022);
  });

  it('resolves subsystem URLs correctly with environment override', () => {
    const url = getSubsystemUrl(SUBSYSTEMS.HOSTEL, '/rooms', 'https://custom-hostel.domain.com/');
    expect(url).toBe('https://custom-hostel.domain.com/rooms');
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
