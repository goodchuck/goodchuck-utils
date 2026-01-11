/**
 * Form State Helpers
 */

/**
 * 폼 에러가 있는지 확인
 */
export function hasFormErrors(errors: Record<string, any>): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * 변경된 필드만 추출
 */
export function getChangedFields<T extends Record<string, any>>(
  original: T,
  current: T
): Partial<T> {
  const changed: Partial<T> = {};

  for (const key in current) {
    if (current[key] !== original[key]) {
      changed[key] = current[key];
    }
  }

  return changed;
}

/**
 * 빈 값 제거 (null, undefined, 빈 문자열)
 */
export function removeEmptyValues<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {};

  for (const key in obj) {
    const value = obj[key];
    if (value !== null && value !== undefined && value !== '') {
      result[key] = value;
    }
  }

  return result;
}
