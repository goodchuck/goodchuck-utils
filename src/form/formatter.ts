/**
 * Form Formatter Utilities
 */

/**
 * 전화번호 포맷팅 (010-1234-5678)
 */
export function formatPhoneNumber(value: string): string {
  const cleaned = value.replace(/[^0-9]/g, '');

  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 7) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }
  if (cleaned.length <= 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }

  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
}

/**
 * 사업자등록번호 포맷팅 (123-45-67890)
 */
export function formatBusinessNumber(value: string): string {
  const cleaned = value.replace(/[^0-9]/g, '');

  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 5) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }
  if (cleaned.length <= 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5)}`;
  }

  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5, 10)}`;
}

/**
 * 신용카드 번호 포맷팅 (1234-5678-9012-3456)
 */
export function formatCreditCard(value: string): string {
  const cleaned = value.replace(/[^0-9]/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join('-') : cleaned;
}

/**
 * 숫자만 추출
 */
export function extractNumbers(value: string): string {
  return value.replace(/[^0-9]/g, '');
}

/**
 * 통화 포맷팅 (천 단위 콤마)
 * @param value - 숫자 값
 * @param currency - 통화 기호 (기본값: '원')
 */
export function formatCurrency(value: number | string, currency: string = '원'): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0' + currency;

  return num.toLocaleString('ko-KR') + currency;
}

/**
 * 주민등록번호 앞자리만 표시 (123456-*******)
 */
export function maskResidentNumber(value: string): string {
  const cleaned = value.replace(/[^0-9]/g, '');
  if (cleaned.length < 6) return cleaned;

  return `${cleaned.slice(0, 6)}-${'*'.repeat(7)}`;
}

/**
 * 카드번호 마스킹 (1234-****-****-5678)
 */
export function maskCreditCard(value: string): string {
  const cleaned = value.replace(/[^0-9]/g, '');
  if (cleaned.length < 12) return value;

  return `${cleaned.slice(0, 4)}-****-****-${cleaned.slice(-4)}`;
}
