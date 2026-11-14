const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const pad = (n) => String(n).padStart(2, '0');

// "03 out 2026 · 21:40" (exibição nos cards)
export function formatCardDate(date) {
  const d = new Date(date);
  return `${pad(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()} · ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// "22/10/2026 14:30" (valor do campo de formulário)
export function toInputValue(date) {
  const d = new Date(date);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Máscara enquanto a usuária digita: dd/MM/aaaa HH:mm
export function maskDateTime(value) {
  const d = value.replace(/\D/g, '').slice(0, 12);
  let out = d.slice(0, 2);
  if (d.length > 2) out += '/' + d.slice(2, 4);
  if (d.length > 4) out += '/' + d.slice(4, 8);
  if (d.length > 8) out += ' ' + d.slice(8, 10);
  if (d.length > 10) out += ':' + d.slice(10, 12);
  return out;
}

// Converte "dd/MM/aaaa HH:mm" em Date. Devolve null se for inválida.
export function parseInputValue(value) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;

  const [, dd, mm, yyyy, hh, min] = match.map(Number);
  const date = new Date(yyyy, mm - 1, dd, hh, min);

  const valid =
    date.getFullYear() === yyyy &&
    date.getMonth() === mm - 1 &&
    date.getDate() === dd &&
    hh < 24 &&
    min < 60;

  return valid ? date : null;
}

// Nomes alternativos: assim funciona com qualquer um dos dois estilos de import
export const formatDisplay = formatCardDate;
export const toInputString = toInputValue;
export const formatDateTimeInput = maskDateTime;
export const parseDateTime = parseInputValue;

const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export function formatRelativeDate(value) {
  const d = new Date(value);

  if (Number.isNaN(d.getTime())) return '';

  const startOfDay = (date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

  const diffDays = Math.round(
    (startOfDay(new Date()) - startOfDay(d)) / 86400000
  );

  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays > 1 && diffDays < 7) return WEEKDAYS[d.getDay()];

  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

const MONTHS_LONG = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

export function formatLongDate(value) {
  const d = new Date(value);

  if (Number.isNaN(d.getTime())) return '';

  return `${d.getDate()} de ${MONTHS_LONG[d.getMonth()]} de ${d.getFullYear()}`;
}
