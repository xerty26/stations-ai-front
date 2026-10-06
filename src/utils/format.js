export const SITE_URL = 'https://www.gasoneclick.es';

// "coruña (a)" -> "Coruña (A)"
export const formatName = (value) =>
    (value || '').replace(/(^|[\s(/-])(\p{L})/gu, (_, sep, letter) => sep + letter.toUpperCase());

export const formatPrice = (value) =>
    value.toLocaleString('es-ES', { minimumFractionDigits: 3, maximumFractionDigits: 3 });

export const formatEuros = (value) =>
    value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
