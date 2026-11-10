const emailPattern = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;
const phonePattern = /^\+[1-9][0-9]{7,14}$/;
const repeatedCharacter = /(.)\1{3,}/iu;
const repeatedFragment = /^(.{1,3})\1{2,}$/iu;
const consonantRun = /[bcdfghjklmnpqrstvwxyzñ]{6,}/iu;

export const cleanText = (value: string) => value.trim().replace(/\s+/g, ' ');

function isSuspicious(value: string): boolean {
  const compact = cleanText(value);
  if (repeatedCharacter.test(compact) || repeatedFragment.test(compact.replace(/\s/g, ''))) return true;
  return compact.split(/\s+/).some((word) => word.length >= 8 && consonantRun.test(word));
}

function meaningful(value: string, minimum: number, maximum: number, label: string): string | null {
  const text = cleanText(value);
  if (text.length < minimum) return `${label} debe tener al menos ${minimum} caracteres.`;
  if (text.length > maximum) return `${label} no puede superar ${maximum} caracteres.`;
  if (!/\p{L}/u.test(text)) return `${label} debe incluir texto comprensible.`;
  if (isSuspicious(text)) return `${label} parece contener texto repetido o sin sentido.`;
  return null;
}

export function validatePersonName(value: string): string | null {
  const error = meaningful(value, 3, 80, 'El nombre');
  if (error) return error;
  if (!/^[\p{L}][\p{L}\p{M}'’. -]*$/u.test(cleanText(value))) return 'El nombre solo puede contener letras, espacios, apóstrofes y guiones.';
  if (cleanText(value).split(' ').some((part) => part.length === 1)) return 'Escribe el nombre sin iniciales sueltas.';
  return null;
}

export function validateCity(value: string): string | null {
  const error = meaningful(value, 2, 80, 'La ciudad');
  if (error) return error;
  return /^[\p{L}\p{M} .'-]+$/u.test(cleanText(value)) ? null : 'La ciudad solo puede contener letras.';
}

export function validateEmail(value: string): string | null {
  const email = value.trim();
  return email.length <= 254 && emailPattern.test(email) ? null : 'Escribe un correo electrónico válido.';
}

export function validatePhone(value: string): string | null {
  const compact = value.trim().replace(/[\s()-]/g, '');
  const normalized = compact.startsWith('+') ? compact : compact.length === 10 ? `+52${compact}` : `+${compact}`;
  return phonePattern.test(normalized) ? null : 'Usa un número internacional válido, por ejemplo +525512345678.';
}

export const validateTitle = (value: string) => meaningful(value, 4, 100, 'El título');
export const validateDescription = (value: string) => meaningful(value, 10, 500, 'La descripción');

export function validateAddress(value: string): string | null {
  const error = meaningful(value, 6, 160, 'La dirección');
  if (error) return error;
  return /^[\p{L}\p{M}\d .,#'°º\-/]+$/u.test(cleanText(value)) ? null : 'La dirección contiene caracteres no permitidos.';
}

export function validateOptionalNote(value: string, maximum = 300): string | null {
  return cleanText(value) ? meaningful(value, 3, maximum, 'La indicación') : null;
}

export const validateReportDetails = (value: string) => meaningful(value, 15, 1000, 'Los detalles');

export function validateMoney(value: string): string | null {
  const normalized = value.trim().replace(',', '.');
  if (!/^\d{1,5}(?:\.\d{1,2})?$/.test(normalized)) return 'Escribe un importe válido con máximo dos decimales.';
  const amount = Number(normalized);
  return amount > 0 && amount <= 100000 ? null : 'El importe debe estar entre $0.01 y $100,000 MXN.';
}

export function validateInvitationCode(value: string): string | null {
  const code = value.toUpperCase().replace(/[\s-]/g, '');
  return /^(?:[A-F0-9]{10}|[A-F0-9]{36})$/.test(code) ? null : 'El código de invitación no tiene un formato válido.';
}

export function validatePassword(value: string): string | null {
  if (value.length < 8 || value.length > 128) return 'La contraseña debe tener entre 8 y 128 caracteres.';
  if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/[0-9]/.test(value)) return 'Incluye mayúscula, minúscula y número.';
  if (/\s/.test(value)) return 'La contraseña no debe contener espacios.';
  return null;
}
