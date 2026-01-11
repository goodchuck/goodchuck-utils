/**
 * String Manipulation Utilities
 */

/**
 * 문자열을 지정된 길이로 자르고 말줄임표 추가
 * @example truncate('Hello World', 5) // 'Hello...'
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + suffix;
}

/**
 * 문자열 양쪽 공백 제거 및 연속된 공백을 하나로
 * @example normalizeWhitespace('  hello   world  ') // 'hello world'
 */
export function normalizeWhitespace(str: string): string {
  return str.trim().replace(/\s+/g, ' ');
}

/**
 * URL 친화적인 슬러그 생성
 * @example slugify('Hello World!') // 'hello-world'
 * @example slugify('Test123 World') // 'test123-world'
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * 랜덤 문자열 생성
 * @param length - 생성할 문자열 길이
 * @param charset - 사용할 문자 집합 ('alphanumeric', 'alpha', 'numeric', 'hex')
 */
export function randomString(
  length: number,
  charset: 'alphanumeric' | 'alpha' | 'numeric' | 'hex' = 'alphanumeric'
): string {
  const charsets = {
    alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    numeric: '0123456789',
    hex: '0123456789abcdef',
  };

  const chars = charsets[charset];
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

/**
 * 문자열 반복
 * @example repeat('ab', 3) // 'ababab'
 */
export function repeat(str: string, count: number): string {
  return str.repeat(count);
}

/**
 * 문자열 뒤집기
 * @example reverse('hello') // 'olleh'
 */
export function reverse(str: string): string {
  return str.split('').reverse().join('');
}

/**
 * 문자열에서 HTML 태그 제거
 * @example stripHtml('<p>Hello <strong>World</strong></p>') // 'Hello World'
 */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

/**
 * 문자열을 특정 길이로 패딩
 * @example padStart('5', 3, '0') // '005'
 */
export function padStart(str: string, length: number, fillString: string = ' '): string {
  return str.padStart(length, fillString);
}

/**
 * 문자열을 특정 길이로 패딩 (오른쪽)
 * @example padEnd('5', 3, '0') // '500'
 */
export function padEnd(str: string, length: number, fillString: string = ' '): string {
  return str.padEnd(length, fillString);
}

/**
 * 템플릿 문자열 치환
 * @example template('Hello {name}!', { name: 'World' }) // 'Hello World!'
 */
export function template(str: string, values: Record<string, any>): string {
  return str.replace(/\{(\w+)\}/g, (match, key) => {
    return values[key] !== undefined ? String(values[key]) : match;
  });
}

/**
 * 마스킹 (특정 위치의 문자를 *로 변경)
 * @example mask('1234567890', 3, 7) // '123****890'
 */
export function mask(str: string, start: number, end?: number, maskChar: string = '*'): string {
  const endPos = end ?? str.length;
  return (
    str.slice(0, start) +
    maskChar.repeat(endPos - start) +
    str.slice(endPos)
  );
}
