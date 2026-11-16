/**
 * @vidyafloww/validation — Primitive Schemas
 *
 * Reusable Zod schemas for common data types.
 *
 * TODO: Add locale-specific phone validation when i18n is implemented.
 */

import { z } from 'zod';

export const emailSchema = z
  .string({ required_error: 'Email is required' })
  .email('Please enter a valid email address')
  .toLowerCase()
  .trim();

export const phoneSchema = z
  .string({ required_error: 'Phone number is required' })
  .regex(/^\+?[1-9]\d{6,14}$/, 'Please enter a valid phone number');

export const uuidSchema = z.string().uuid('Invalid ID format');

export const passwordSchema = z
  .string({ required_error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .optional()
  .or(z.literal(''));

export const nameSchema = z
  .string({ required_error: 'Name is required' })
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must not exceed 100 characters')
  .trim();
