import { Platform } from 'react-native';

/**
 * Returns a safe React Native <Image /> source for:
 * - local require() assets
 * - remote/local URI strings
 * - already-shaped { uri } objects
 * - null / undefined fallback cases
 */
export function imgSrc(image) {
  if (!image) return null;
  if (typeof image === 'number') return image;
  
  let uriStr = null;
  if (typeof image === 'string') {
    uriStr = image;
  } else if (typeof image === 'object' && image.uri) {
    uriStr = image.uri;
  }

  if (uriStr) {
    // If it's a test-image.jpg or placeholder that does not exist in local assets, use a beautiful unsplash marketplace placeholder
    if (uriStr.includes('test-image.jpg') || uriStr.includes('placeholder')) {
      uriStr = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500';
    } else if (uriStr.startsWith('file:///assets/')) {
      // If it's a file:///assets/... URI, rewrite to /assets/... for web compatibility
      uriStr = uriStr.replace('file:///assets/', '/assets/');
    } else if (uriStr.startsWith('file://') && Platform.OS === 'web') {
      uriStr = uriStr.replace('file://', '');
    }

    if (typeof image === 'string') {
      return { uri: uriStr };
    } else {
      return { ...image, uri: uriStr };
    }
  }

  return image;
}
