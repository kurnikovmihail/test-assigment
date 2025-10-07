// Общие вспомогательные функции

/** Уникальный id для событий */
export function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/** Читаемое время */
export function nowTs() {
  return new Date().toLocaleString();
}

/** Дебаунс */
export function debounce(fn, wait = 300) {
  let t = null;
  return function (...args) {
    if (t) clearTimeout(t);
    t = setTimeout(() => {
      fn.apply(this, args);
      t = null;
    }, wait);
  };
}

/** Безопасный парсинг JSON */
export function safeParse(json, fallback = {}) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}
