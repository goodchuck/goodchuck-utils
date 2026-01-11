import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

/**
 * 날짜를 지정된 포맷으로 변환
 * @param date - 변환할 날짜 (Date, string, number)
 * @param format - 포맷 문자열 (기본값: 'YYYY-MM-DD HH:mm:ss')
 */
export function formatDate(
  date: Date | string | number = new Date(),
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string {
  return dayjs(date).format(format);
}

/**
 * 현재 날짜/시간 반환
 * @param format - 포맷 문자열 (선택)
 */
export function now(format?: string): string | Date {
  const current = dayjs();
  return format ? current.format(format) : current.toDate();
}

/**
 * 상대 시간 반환 (예: "3시간 전")
 * @param date - 기준 날짜
 * @param locale - 로케일 (기본값: 'ko')
 */
export function fromNow(date: Date | string | number, locale: string = 'ko'): string {
  return dayjs(date).locale(locale).fromNow();
}

/**
 * 두 날짜 사이의 차이 계산
 * @param date1 - 첫 번째 날짜
 * @param date2 - 두 번째 날짜
 * @param unit - 단위 ('day', 'hour', 'minute' 등)
 */
export function diffDate(
  date1: Date | string | number,
  date2: Date | string | number,
  unit: dayjs.OpUnitType = 'day'
): number {
  return dayjs(date1).diff(dayjs(date2), unit);
}

/**
 * 날짜에 시간 더하기
 * @param date - 기준 날짜
 * @param value - 더할 값
 * @param unit - 단위 ('day', 'hour', 'minute' 등)
 */
export function addDate(
  date: Date | string | number,
  value: number,
  unit: dayjs.ManipulateType = 'day'
): Date {
  return dayjs(date).add(value, unit).toDate();
}

/**
 * 날짜에 시간 빼기
 * @param date - 기준 날짜
 * @param value - 뺄 값
 * @param unit - 단위 ('day', 'hour', 'minute' 등)
 */
export function subtractDate(
  date: Date | string | number,
  value: number,
  unit: dayjs.ManipulateType = 'day'
): Date {
  return dayjs(date).subtract(value, unit).toDate();
}

/**
 * 날짜가 특정 날짜보다 이전인지 확인
 */
export function isBefore(date1: Date | string | number, date2: Date | string | number): boolean {
  return dayjs(date1).isBefore(dayjs(date2));
}

/**
 * 날짜가 특정 날짜보다 이후인지 확인
 */
export function isAfter(date1: Date | string | number, date2: Date | string | number): boolean {
  return dayjs(date1).isAfter(dayjs(date2));
}

/**
 * 두 날짜가 같은지 확인
 * @param unit - 비교 단위 (기본값: 'millisecond')
 */
export function isSame(
  date1: Date | string | number,
  date2: Date | string | number,
  unit: dayjs.OpUnitType = 'millisecond'
): boolean {
  return dayjs(date1).isSame(dayjs(date2), unit);
}

/**
 * 날짜가 유효한지 확인
 */
export function isValidDate(date: any): boolean {
  return dayjs(date).isValid();
}

/**
 * 타임존 변환
 * @param date - 변환할 날짜
 * @param tz - 타임존 (예: 'Asia/Seoul')
 */
export function toTimezone(date: Date | string | number, tz: string): Date {
  return dayjs(date).tz(tz).toDate();
}
