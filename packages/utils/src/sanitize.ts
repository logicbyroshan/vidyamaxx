/**
 * @vidyafloww/utils — HTML & Content Sanitization
 * Protects against XSS injection when rendering user/staff formatted HTML notices and circulars.
 */

import DOMPurify from 'dompurify';

/**
 * Sanitize an HTML string to eliminate malicious scripts, event handlers, and unsafe protocols.
 * Safe for use with React's dangerouslySetInnerHTML.
 */
export function sanitizeHtml(dirtyHtml: string): string {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') return '';

  // In browser environments, use DOMPurify directly
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(dirtyHtml, {
      USE_PROFILES: { html: true },
      ALLOWED_ATTR: ['class', 'id', 'href', 'target', 'rel', 'title', 'alt', 'src', 'style'],
    });
  }

  // Fallback if rendered outside browser context
  return dirtyHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:[^"']*/gi, '');
}
