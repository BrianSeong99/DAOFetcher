/**
 * Capitalize first letter of a string
 *
 * @param e string to capitalize
 * @returns capitalized string
 */
export const capitalizeFirst = (e: string): string =>
  e.charAt(0).toUpperCase() + e.slice(1);

export const obscureAddress = (address: string): string =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;
