/**
 * Returns the correct Image source prop for both:
 *  - Local require() assets  (object with numeric id)
 *  - Remote URI strings      (https://...)
 *  - null / undefined        (returns null so caller can show fallback)
 */
export function imgSrc(image) {
  if (!image) return null;
  if (typeof image === 'string') return { uri: image };
  return image; // already a require() module reference
}