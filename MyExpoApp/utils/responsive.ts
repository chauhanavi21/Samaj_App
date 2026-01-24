import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Base dimensions (iPhone 12/13/14)
const baseWidth = 390;
const baseHeight = 844;

/**
 * Responsive width - scales based on screen width
 */
export const wp = (percentage: number) => {
  return (width * percentage) / 100;
};

/**
 * Responsive height - scales based on screen height
 */
export const hp = (percentage: number) => {
  return (height * percentage) / 100;
};

/**
 * Responsive font size - scales based on screen width
 */
export const fontScale = (size: number) => {
  const scale = width / baseWidth;
  const newSize = size * scale;
  // Ensure minimum readable size
  if (newSize < 12) return 12;
  // Ensure maximum reasonable size
  if (newSize > 40) return 40;
  return Math.round(newSize);
};

/**
 * Get screen dimensions
 */
export const screenWidth = width;
export const screenHeight = height;

/**
 * Check if device is tablet
 */
export const isTablet = () => {
  return width >= 768;
};

/**
 * Check if device is small
 */
export const isSmallDevice = () => {
  return width < 360;
};

/**
 * Responsive padding
 */
export const padding = {
  xs: wp(2),
  sm: wp(4),
  md: wp(5),
  lg: wp(8),
  xl: wp(10),
};

/**
 * Responsive margins
 */
export const margin = {
  xs: hp(0.5),
  sm: hp(1),
  md: hp(2),
  lg: hp(3),
  xl: hp(4),
};
