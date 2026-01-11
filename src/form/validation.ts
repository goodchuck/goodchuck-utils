/**
 * Form Validation Utilities
 */

/**
 * 이메일 형식 검증
 */
export function isEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * 한국 전화번호 형식 검증
 * 010-1234-5678, 01012345678, 02-1234-5678 등 허용
 */
export function isPhoneNumber(value: string): boolean {
  const phoneRegex = /^(01[016789]|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
  return phoneRegex.test(value.replace(/\s/g, ''));
}

/**
 * URL 형식 검증
 */
export function isUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * 비밀번호 강도 검증
 * @param value - 검증할 비밀번호
 * @param options - 검증 옵션
 */
export function isStrongPassword(
  value: string,
  options: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  } = {}
): boolean {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
  } = options;

  if (value.length < minLength) return false;
  if (requireUppercase && !/[A-Z]/.test(value)) return false;
  if (requireLowercase && !/[a-z]/.test(value)) return false;
  if (requireNumbers && !/[0-9]/.test(value)) return false;
  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) return false;

  return true;
}

/**
 * 한국 사업자등록번호 형식 검증 (10자리)
 */
export function isBusinessNumber(value: string): boolean {
  const cleaned = value.replace(/[^0-9]/g, '');
  return cleaned.length === 10;
}
