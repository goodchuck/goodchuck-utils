import { describe, it, expect } from 'vitest';
import {
  formatPhoneNumber,
  formatBusinessNumber,
  formatCreditCard,
  extractNumbers,
  formatCurrency,
  maskResidentNumber,
  maskCreditCard,
} from '../formatter';

describe('Form Formatters', () => {
  describe('formatPhoneNumber', () => {
    it('should format phone numbers correctly', () => {
      expect(formatPhoneNumber('01012345678')).toBe('010-1234-5678');
      expect(formatPhoneNumber('0212345678')).toBe('021-2345-678');
      expect(formatPhoneNumber('010')).toBe('010');
      expect(formatPhoneNumber('0101234')).toBe('010-1234');
    });

    it('should handle already formatted numbers', () => {
      expect(formatPhoneNumber('010-1234-5678')).toBe('010-1234-5678');
    });

    it('should limit to 11 digits', () => {
      expect(formatPhoneNumber('010123456789999')).toBe('010-1234-5678');
    });
  });

  describe('formatBusinessNumber', () => {
    it('should format business numbers correctly', () => {
      expect(formatBusinessNumber('1234567890')).toBe('123-45-67890');
      expect(formatBusinessNumber('123')).toBe('123');
      expect(formatBusinessNumber('12345')).toBe('123-45');
    });

    it('should limit to 10 digits', () => {
      expect(formatBusinessNumber('12345678901234')).toBe('123-45-67890');
    });
  });

  describe('formatCreditCard', () => {
    it('should format credit card numbers', () => {
      expect(formatCreditCard('1234567890123456')).toBe('1234-5678-9012-3456');
      expect(formatCreditCard('1234')).toBe('1234');
    });
  });

  describe('extractNumbers', () => {
    it('should extract only numbers', () => {
      expect(extractNumbers('abc123def456')).toBe('123456');
      expect(extractNumbers('010-1234-5678')).toBe('01012345678');
      expect(extractNumbers('no numbers')).toBe('');
    });
  });

  describe('formatCurrency', () => {
    it('should format numbers with commas', () => {
      expect(formatCurrency(1234567)).toBe('1,234,567원');
      expect(formatCurrency(1000)).toBe('1,000원');
      expect(formatCurrency(0)).toBe('0원');
    });

    it('should handle string input', () => {
      expect(formatCurrency('1234567')).toBe('1,234,567원');
    });

    it('should allow custom currency', () => {
      expect(formatCurrency(1000, '달러')).toBe('1,000달러');
    });

    it('should handle invalid input', () => {
      expect(formatCurrency('invalid')).toBe('0원');
    });
  });

  describe('maskResidentNumber', () => {
    it('should mask resident registration number', () => {
      expect(maskResidentNumber('1234561234567')).toBe('123456-*******');
      expect(maskResidentNumber('123456-1234567')).toBe('123456-*******');
    });

    it('should handle partial input', () => {
      expect(maskResidentNumber('12345')).toBe('12345');
    });
  });

  describe('maskCreditCard', () => {
    it('should mask credit card number', () => {
      expect(maskCreditCard('1234567890123456')).toBe('1234-****-****-3456');
    });

    it('should handle partial input', () => {
      expect(maskCreditCard('1234567')).toBe('1234567');
    });
  });
});
