/**
 * @vidyafloww/validation
 *
 * Shared Zod schemas for form validation across all VidyaFloww apps.
 *
 * Ensures consistent validation rules for shared domain entities
 * between web, mobile, and desktop apps.
 *
 * @example
 * import { emailSchema, phoneSchema } from '@vidyafloww/validation';
 */

export { emailSchema, phoneSchema, uuidSchema, passwordSchema, urlSchema } from './src/primitives';
export { paginationSchema } from './src/pagination';

// TODO: Export domain-specific schemas as they are built
// export * from './src/schemas/student';
// export * from './src/schemas/admission';
// export * from './src/schemas/user';
