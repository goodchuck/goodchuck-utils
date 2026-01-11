import { describe, it, expect } from 'vitest';
import {
  isEmail,
  isPhoneNumber,
  isUrl,
  isStrongPassword,
  isBusinessNumber,
} from '../validation';

describe('Form Validation', () => {
  describe('isEmail', () => {
    it('should validate correct email formats', () => {
      expect(isEmail('test@example.com')).toBe(true);
      expect(isEmail('user.name@domain.co.kr')).toBe(true);
      expect(isEmail('test+tag@example.com')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(isEmail('invalid')).toBe(false);
      expect(isEmail('test@')).toBe(false);
      expect(isEmail('@example.com')).toBe(false);
      expect(isEmail('test @example.com')).toBe(false);
    });
  });

  describe('isPhoneNumber', () => {
    it('should validate Korean phone numbers', () => {
      expect(isPhoneNumber('010-1234-5678')).toBe(true);
      expect(isPhoneNumber('01012345678')).toBe(true);
      expect(isPhoneNumber('02-1234-5678')).toBe(true);
      expect(isPhoneNumber('031-123-4567')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isPhoneNumber('123-456-7890')).toBe(false);
      expect(isPhoneNumber('010-12-3456')).toBe(false);
    });
  });

  describe('isUrl', () => {
    it('should validate URLs', () => {
      expect(isUrl('https://example.com')).toBe(true);
      expect(isUrl('http://test.co.kr')).toBe(true);
      expect(isUrl('https://example.com/path?query=1')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isUrl('not-a-url')).toBe(false);
      expect(isUrl('example.com')).toBe(false);
    });
  });

  describe('isStrongPassword', () => {
    it('should validate strong passwords', () => {
      expect(isStrongPassword('Password123!')).toBe(true);
      expect(isStrongPassword('Str0ng#Pass')).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(isStrongPassword('short')).toBe(false);
      expect(isStrongPassword('NoNumbers!')).toBe(false);
      expect(isStrongPassword('nouppercas3!')).toBe(false);
      expect(isStrongPassword('NOLOWERCASE1!')).toBe(false);
      expect(isStrongPassword('NoSpecialChar1')).toBe(false);
    });

    it('should respect custom options', () => {
      expect(isStrongPassword('simple', { minLength: 6, requireUppercase: false, requireNumbers: false, requireSpecialChars: false })).toBe(true);
      expect(isStrongPassword('PASSWORD', { requireLowercase: false, requireNumbers: false, requireSpecialChars: false })).toBe(true);
    });
  });

  describe('isBusinessNumber', () => {
    it('should validate 10-digit business numbers', () => {
      expect(isBusinessNumber('1234567890')).toBe(true);
      expect(isBusinessNumber('123-45-67890')).toBe(true);
    });

    it('should reject invalid business numbers', () => {
      expect(isBusinessNumber('123456789')).toBe(false);
      expect(isBusinessNumber('12345678901')).toBe(false);
    });
  });
});
