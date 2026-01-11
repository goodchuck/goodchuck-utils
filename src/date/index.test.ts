import { describe, it, expect } from 'vitest';
import {
  formatDate,
  now,
  fromNow,
  diffDate,
  addDate,
  subtractDate,
  isBefore,
  isAfter,
  isSame,
  isValidDate,
  toTimezone,
} from './index';

describe('Date Utils', () => {
  describe('formatDate', () => {
    it('should format date with default format', () => {
      const date = new Date('2024-01-15 10:30:45');
      const result = formatDate(date);
      expect(result).toBe('2024-01-15 10:30:45');
    });

    it('should format date with custom format', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date, 'YYYY년 MM월 DD일');
      expect(result).toBe('2024년 01월 15일');
    });

    it('should format string date', () => {
      const result = formatDate('2024-01-15', 'YYYY-MM-DD');
      expect(result).toBe('2024-01-15');
    });

    it('should format timestamp', () => {
      const timestamp = new Date('2024-01-15').getTime();
      const result = formatDate(timestamp, 'YYYY-MM-DD');
      expect(result).toBe('2024-01-15');
    });
  });

  describe('now', () => {
    it('should return formatted current date when format is provided', () => {
      const result = now('YYYY-MM-DD');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should return Date object when no format is provided', () => {
      const result = now();
      expect(result).toBeInstanceOf(Date);
    });
  });

  describe('fromNow', () => {
    it('should return relative time in Korean', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const result = fromNow(yesterday, 'ko');
      expect(result).toContain('전');
    });

    it('should return relative time in English', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const result = fromNow(yesterday, 'en');
      expect(result).toContain('ago');
    });
  });

  describe('diffDate', () => {
    it('should calculate difference in days', () => {
      const date1 = new Date('2024-01-20');
      const date2 = new Date('2024-01-15');
      const result = diffDate(date1, date2, 'day');
      expect(result).toBe(5);
    });

    it('should calculate difference in hours', () => {
      const date1 = new Date('2024-01-15 15:00:00');
      const date2 = new Date('2024-01-15 12:00:00');
      const result = diffDate(date1, date2, 'hour');
      expect(result).toBe(3);
    });

    it('should handle negative differences', () => {
      const date1 = new Date('2024-01-15');
      const date2 = new Date('2024-01-20');
      const result = diffDate(date1, date2, 'day');
      expect(result).toBe(-5);
    });
  });

  describe('addDate', () => {
    it('should add days to date', () => {
      const date = new Date('2024-01-15');
      const result = addDate(date, 5, 'day');
      expect(formatDate(result, 'YYYY-MM-DD')).toBe('2024-01-20');
    });

    it('should add hours to date', () => {
      const date = new Date('2024-01-15 10:00:00');
      const result = addDate(date, 3, 'hour');
      expect(formatDate(result, 'YYYY-MM-DD HH:mm:ss')).toBe('2024-01-15 13:00:00');
    });

    it('should add months to date', () => {
      const date = new Date('2024-01-15');
      const result = addDate(date, 2, 'month');
      expect(formatDate(result, 'YYYY-MM-DD')).toBe('2024-03-15');
    });
  });

  describe('subtractDate', () => {
    it('should subtract days from date', () => {
      const date = new Date('2024-01-20');
      const result = subtractDate(date, 5, 'day');
      expect(formatDate(result, 'YYYY-MM-DD')).toBe('2024-01-15');
    });

    it('should subtract hours from date', () => {
      const date = new Date('2024-01-15 13:00:00');
      const result = subtractDate(date, 3, 'hour');
      expect(formatDate(result, 'YYYY-MM-DD HH:mm:ss')).toBe('2024-01-15 10:00:00');
    });
  });

  describe('isBefore', () => {
    it('should return true if first date is before second', () => {
      const date1 = new Date('2024-01-15');
      const date2 = new Date('2024-01-20');
      expect(isBefore(date1, date2)).toBe(true);
    });

    it('should return false if first date is after second', () => {
      const date1 = new Date('2024-01-20');
      const date2 = new Date('2024-01-15');
      expect(isBefore(date1, date2)).toBe(false);
    });
  });

  describe('isAfter', () => {
    it('should return true if first date is after second', () => {
      const date1 = new Date('2024-01-20');
      const date2 = new Date('2024-01-15');
      expect(isAfter(date1, date2)).toBe(true);
    });

    it('should return false if first date is before second', () => {
      const date1 = new Date('2024-01-15');
      const date2 = new Date('2024-01-20');
      expect(isAfter(date1, date2)).toBe(false);
    });
  });

  describe('isSame', () => {
    it('should return true for exact same dates', () => {
      const date1 = new Date('2024-01-15 10:30:45');
      const date2 = new Date('2024-01-15 10:30:45');
      expect(isSame(date1, date2)).toBe(true);
    });

    it('should return true for same day (ignoring time)', () => {
      const date1 = new Date('2024-01-15 10:00:00');
      const date2 = new Date('2024-01-15 15:00:00');
      expect(isSame(date1, date2, 'day')).toBe(true);
    });

    it('should return false for different days', () => {
      const date1 = new Date('2024-01-15');
      const date2 = new Date('2024-01-16');
      expect(isSame(date1, date2, 'day')).toBe(false);
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid dates', () => {
      expect(isValidDate(new Date('2024-01-15'))).toBe(true);
      expect(isValidDate('2024-01-15')).toBe(true);
      expect(isValidDate(1705276800000)).toBe(true);
    });

    it('should return false for invalid dates', () => {
      expect(isValidDate('invalid-date')).toBe(false);
      expect(isValidDate(NaN)).toBe(false);
      expect(isValidDate(null)).toBe(false);
    });
  });

  describe('toTimezone', () => {
    it('should convert to specific timezone', () => {
      const date = new Date('2024-01-15T00:00:00Z');
      const result = toTimezone(date, 'Asia/Seoul');
      expect(result).toBeInstanceOf(Date);
    });

    it('should handle different timezones', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      const nyTime = toTimezone(date, 'America/New_York');
      const seoulTime = toTimezone(date, 'Asia/Seoul');

      expect(nyTime).toBeInstanceOf(Date);
      expect(seoulTime).toBeInstanceOf(Date);
      expect(nyTime.getTime()).toBe(seoulTime.getTime());
    });
  });
});
