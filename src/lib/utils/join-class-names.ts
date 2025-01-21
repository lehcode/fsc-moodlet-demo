/**
 * Joins an array of strings into a single string, ignoring any undefined values.
 *
 * @example
 * cn('a', undefined, 'b') // 'a b'
 */
export const joinClassNames = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};
