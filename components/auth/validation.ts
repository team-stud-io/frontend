export const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
export const isValidPassword = (value: string) => value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);
