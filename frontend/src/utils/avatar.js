/**
 * DiceBear Initials Avatar Generator
 * Generates clean, colorful SVG initials avatars based on user full name or username.
 */
export const getDiceBearAvatar = (name = 'User') => {
  const cleanSeed = encodeURIComponent(name || 'User');
  return `https://api.dicebear.com/7.x/initials/svg?seed=${cleanSeed}&backgroundColor=0284c7,4f46e5,059669,d97706,dc2626,7c3aed,db2777`;
};
