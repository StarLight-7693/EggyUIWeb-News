// ============================================================
// 主题通用工具（前后端共用，勿在此引入 Node API）
// ============================================================

/** 把 frontmatter 中的字符串/数组统一成字符串数组 */
export function toArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item) => item !== null && item !== undefined).map(String);
  }
  if (value === null || value === undefined || value === '') {
    return [];
  }
  return [String(value)];
}

/**
 * 格式化日期为 YYYY-MM-DD。
 * 按 UTC 取值，保证与 frontmatter 中书写的日期一致（不因构建机时区漂移）。
 */
export function formatDate(value: unknown): string {
  const date = value instanceof Date ? value : new Date(value as string | number);
  if (Number.isNaN(date.getTime())) {
    return String(value ?? '');
  }
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** 分类 / 标签目录（不含扩展名），如 /categories/公告 */
export function termDir(kind: 'categories' | 'tags', name: string): string {
  return `/${kind}/${encodeURIComponent(name)}`;
}

/** 分类 / 标签第 1 页地址，如 /categories/公告.html */
export function termPath(kind: 'categories' | 'tags', name: string): string {
  return `${termDir(kind, name)}.html`;
}

/** 分类 / 标签第 n(>=2) 页地址前缀，如 /categories/公告/page/ */
export function termPagePrefix(kind: 'categories' | 'tags', name: string): string {
  return `${termDir(kind, name)}/page/`;
}