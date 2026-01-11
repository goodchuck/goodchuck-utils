/**
 * Number Formatting Utilities
 *
 * 숫자 및 가격 포맷팅 관련 유틸리티 함수들
 */

/**
 * 숫자를 천 단위 구분자로 포맷팅
 * @param value - 포맷팅할 숫자
 * @param decimals - 소수점 자릿수 (기본값: 0)
 * @param separator - 천 단위 구분자 (기본값: ',')
 * @returns 포맷팅된 문자열
 *
 * @example
 * formatNumber(1234567) // "1,234,567"
 * formatNumber(1234.56, 2) // "1,234.56"
 * formatNumber(1234.56, 2, '.') // "1.234.56"
 */
export function formatNumber(
  value: number | string,
  decimals: number = 0,
  separator: string = ','
): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return '0';
  }

  const fixed = num.toFixed(decimals);
  const parts = fixed.split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  const decimalPart = parts[1] ? `.${parts[1]}` : '';

  return integerPart + decimalPart;
}

/**
 * 가격을 포맷팅 (천 단위 구분자 + 통화 기호)
 * @param value - 포맷팅할 가격
 * @param currency - 통화 기호 (기본값: '₩')
 * @param decimals - 소수점 자릿수 (기본값: 0)
 * @param separator - 천 단위 구분자 (기본값: ',')
 * @param position - 통화 기호 위치 (기본값: 'before')
 * @returns 포맷팅된 가격 문자열
 *
 * @example
 * formatPrice(1234567) // "₩1,234,567"
 * formatPrice(1234.56, '₩', 2) // "₩1,234.56"
 * formatPrice(1234, '$', 0, ',', 'after') // "1,234$"
 */
export function formatPrice(
  value: number | string,
  currency: string = '₩',
  decimals: number = 0,
  separator: string = ',',
  position: 'before' | 'after' = 'before'
): string {
  const formatted = formatNumber(value, decimals, separator);

  return position === 'before' ? `${currency}${formatted}` : `${formatted}${currency}`;
}

/**
 * 국제화 통화 포맷팅 (Intl.NumberFormat 사용)
 * @param value - 포맷팅할 금액
 * @param locale - 로케일 (기본값: 'ko-KR')
 * @param currency - 통화 코드 (기본값: 'KRW')
 * @param style - 표시 스타일 (기본값: 'currency')
 * @returns 포맷팅된 통화 문자열
 *
 * @example
 * formatCurrencyIntl(1234567) // "₩1,234,567"
 * formatCurrencyIntl(1234.56, 'en-US', 'USD') // "$1,234.56"
 * formatCurrencyIntl(1234.56, 'ja-JP', 'JPY') // "¥1,235"
 */
export function formatCurrencyIntl(
  value: number | string,
  locale: string = 'ko-KR',
  currency: string = 'KRW',
  style: 'currency' | 'decimal' = 'currency'
): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return '0';
  }

  return new Intl.NumberFormat(locale, {
    style,
    currency,
    minimumFractionDigits: currency === 'KRW' || currency === 'JPY' ? 0 : 2,
    maximumFractionDigits: currency === 'KRW' || currency === 'JPY' ? 0 : 2,
  }).format(num);
}

/**
 * 가격 문자열을 숫자로 변환
 * @param priceString - 가격 문자열 (예: "₩1,234,567" 또는 "1,234.56")
 * @returns 변환된 숫자
 *
 * @example
 * parsePrice("₩1,234,567") // 1234567
 * parsePrice("1,234.56") // 1234.56
 * parsePrice("$1,234.56") // 1234.56
 */
export function parsePrice(priceString: string): number {
  if (!priceString || typeof priceString !== 'string') {
    return 0;
  }

  // 통화 기호, 공백, 쉼표 제거
  const cleaned = priceString.replace(/[₩$€£¥,\s]/g, '');

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * 할인율 계산
 * @param originalPrice - 원래 가격
 * @param discountedPrice - 할인된 가격
 * @returns 할인율 (퍼센트)
 *
 * @example
 * calculateDiscount(10000, 8000) // 20
 * calculateDiscount(100, 75) // 25
 */
export function calculateDiscount(originalPrice: number, discountedPrice: number): number {
  if (originalPrice <= 0) {
    return 0;
  }

  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return Math.round(discount * 100) / 100; // 소수점 2자리까지
}

/**
 * 할인 가격 계산
 * @param originalPrice - 원래 가격
 * @param discountPercent - 할인율 (퍼센트)
 * @returns 할인된 가격
 *
 * @example
 * calculateDiscountedPrice(10000, 20) // 8000
 * calculateDiscountedPrice(100, 25) // 75
 */
export function calculateDiscountedPrice(originalPrice: number, discountPercent: number): number {
  const discount = (originalPrice * discountPercent) / 100;
  return Math.round((originalPrice - discount) * 100) / 100;
}

/**
 * 세금 포함 가격 계산
 * @param price - 세전 가격
 * @param taxRate - 세율 (퍼센트, 기본값: 10)
 * @returns 세금 포함 가격
 *
 * @example
 * calculatePriceWithTax(10000, 10) // 11000
 * calculatePriceWithTax(100, 20) // 120
 */
export function calculatePriceWithTax(price: number, taxRate: number = 10): number {
  const tax = (price * taxRate) / 100;
  return Math.round((price + tax) * 100) / 100;
}

/**
 * 세금 제외 가격 계산
 * @param priceWithTax - 세금 포함 가격
 * @param taxRate - 세율 (퍼센트, 기본값: 10)
 * @returns 세전 가격
 *
 * @example
 * calculatePriceWithoutTax(11000, 10) // 10000
 * calculatePriceWithoutTax(120, 20) // 100
 */
export function calculatePriceWithoutTax(priceWithTax: number, taxRate: number = 10): number {
  const price = priceWithTax / (1 + taxRate / 100);
  return Math.round(price * 100) / 100;
}

/**
 * 백분율 포맷팅
 * @param value - 포맷팅할 값 (0-1 또는 0-100)
 * @param decimals - 소수점 자릿수 (기본값: 1)
 * @param isDecimal - 값이 0-1 범위인지 여부 (기본값: false, 0-100 범위)
 * @returns 포맷팅된 퍼센트 문자열
 *
 * @example
 * formatPercent(0.1234, 1, true) // "12.3%"
 * formatPercent(12.34, 1, false) // "12.3%"
 * formatPercent(50) // "50.0%"
 */
export function formatPercent(
  value: number,
  decimals: number = 1,
  isDecimal: boolean = false
): string {
  const percent = isDecimal ? value * 100 : value;
  return `${percent.toFixed(decimals)}%`;
}
