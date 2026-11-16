/**
 * @vidyafloww/types — Utility Types
 *
 * Generic TypeScript utility types to reduce boilerplate.
 *
 * TODO: Expand as patterns emerge during development.
 */

/** Make selected keys required */
export type RequireFields<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/** Make selected keys optional */
export type PartialFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Deep partial - recursively makes all properties optional */
export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

/** Extract promise value type */
export type Awaited<T> = T extends Promise<infer U> ? U : T;

/** Non-empty array */
export type NonEmptyArray<T> = [T, ...T[]];

/** Nullable type */
export type Nullable<T> = T | null;

/** Optional type */
export type Optional<T> = T | undefined;

/** Dictionary type */
export type Dict<V = unknown> = Record<string, V>;

/** Function with no arguments returning T */
export type Getter<T> = () => T;

/** Generic event handler */
export type EventHandler<T = Event> = (event: T) => void;
