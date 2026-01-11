/**
 * String Validation Utilities
 */

/**
 * 빈 문자열 또는 공백만 있는지 확인
 * @example isEmpty('') // true
 * @example isEmpty('  ') // true
 * @example isEmpty('hello') // false
 */
export function isEmpty(str: string): boolean {
  return !str || str.trim().length === 0;
}

/**
 * 문자열이 특정 문자로 시작하는지 확인
 * @example startsWith('hello', 'he') // true
 */
export function startsWith(str: string, searchString: string): boolean {
  return str.startsWith(searchString);
}

/**
 * 문자열이 특정 문자로 끝나는지 확인
 * @example endsWith('hello', 'lo') // true
 */
export function endsWith(str: string, searchString: string): boolean {
  return str.endsWith(searchString);
}

/**
 * 문자열에 특정 문자열이 포함되어 있는지 확인
 * @example contains('hello world', 'world') // true
 */
export function contains(str: string, searchString: string): boolean {
  return str.includes(searchString);
}

/**
 * 알파벳만 포함하는지 확인
 * @example isAlpha('hello') // true
 * @example isAlpha('hello123') // false
 */
export function isAlpha(str: string): boolean {
  return /^[a-zA-Z]+$/.test(str);
}

/**
 * 숫자만 포함하는지 확인
 * @example isNumeric('123') // true
 * @example isNumeric('123.45') // false
 */
export function isNumeric(str: string): boolean {
  return /^[0-9]+$/.test(str);
}

/**
 * 알파벳과 숫자만 포함하는지 확인
 * @example isAlphanumeric('hello123') // true
 * @example isAlphanumeric('hello_123') // false
 */
export function isAlphanumeric(str: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(str);
}

/**
 * 소문자만 포함하는지 확인
 * @example isLowerCase('hello') // true
 * @example isLowerCase('Hello') // false
 */
export function isLowerCase(str: string): boolean {
  return str === str.toLowerCase() && str !== str.toUpperCase();
}

/**
 * 대문자만 포함하는지 확인
 * @example isUpperCase('HELLO') // true
 * @example isUpperCase('Hello') // false
 */
export function isUpperCase(str: string): boolean {
  return str === str.toUpperCase() && str !== str.toLowerCase();
}

/**
 * JSON 형식인지 확인
 * @example isJSON('{"name":"John"}') // true
 * @example isJSON('not json') // false
 */
export function isJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * 16진수 색상 코드인지 확인
 * @example isHexColor('#fff') // true
 * @example isHexColor('#ffffff') // true
 * @example isHexColor('fff') // false
 */
export function isHexColor(str: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(str);
}

/**
 * UUID 형식인지 확인
 * @example isUUID('123e4567-e89b-12d3-a456-426614174000') // true
 */
export function isUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

/**
 * Base64 인코딩된 문자열인지 확인
 * @example isBase64('SGVsbG8gV29ybGQ=') // true
 */
export function isBase64(str: string): boolean {
  try {
    return btoa(atob(str)) === str;
  } catch {
    return false;
  }
}
