/**
 * @vidyafloww/utils — String & Text Utilities
 */

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number = 30): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Capitalize first letter of every word
 */
export function capitalizeWords(text: string): string {
  if (!text) return '';
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Extract initials from a full name (e.g., "Roshan Singh" -> "RS")
 */
export function getInitials(name: string, maxChars: number = 2): string {
  if (!name) return 'VF';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, maxChars).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).slice(0, maxChars).toUpperCase();
}

/**
 * Generate a random short alphanumeric ID
 */
export function generateId(prefix: string = 'id', length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix ? `${prefix}_${result}` : result;
}
