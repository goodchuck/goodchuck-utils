import { describe, it, expect } from 'vitest';
import {
  isEmpty,
  startsWith,
  endsWith,
  contains,
  isAlpha,
  isNumeric,
  isAlphanumeric,
  isLowerCase,
  isUpperCase,
  isJSON,
  isHexColor,
  isUUID,
  isBase64,
} from '../validation';

describe('String Validation', () => {
  describe('isEmpty', () => {
    it('should detect empty strings', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty('hello')).toBe(false);
    });
  });

  describe('startsWith', () => {
    it('should check if string starts with substring', () => {
      expect(startsWith('hello', 'he')).toBe(true);
      expect(startsWith('hello', 'ho')).toBe(false);
    });
  });

  describe('endsWith', () => {
    it('should check if string ends with substring', () => {
      expect(endsWith('hello', 'lo')).toBe(true);
      expect(endsWith('hello', 'he')).toBe(false);
    });
  });

  describe('contains', () => {
    it('should check if string contains substring', () => {
      expect(contains('hello world', 'world')).toBe(true);
      expect(contains('hello world', 'foo')).toBe(false);
    });
  });

  describe('isAlpha', () => {
    it('should validate alphabetic strings', () => {
      expect(isAlpha('hello')).toBe(true);
      expect(isAlpha('Hello')).toBe(true);
      expect(isAlpha('hello123')).toBe(false);
      expect(isAlpha('hello_world')).toBe(false);
    });
  });

  describe('isNumeric', () => {
    it('should validate numeric strings', () => {
      expect(isNumeric('123')).toBe(true);
      expect(isNumeric('123.45')).toBe(false);
      expect(isNumeric('abc')).toBe(false);
    });
  });

  describe('isAlphanumeric', () => {
    it('should validate alphanumeric strings', () => {
      expect(isAlphanumeric('hello123')).toBe(true);
      expect(isAlphanumeric('hello')).toBe(true);
      expect(isAlphanumeric('123')).toBe(true);
      expect(isAlphanumeric('hello_123')).toBe(false);
      expect(isAlphanumeric('hello-123')).toBe(false);
    });
  });

  describe('isLowerCase', () => {
    it('should detect lowercase strings', () => {
      expect(isLowerCase('hello')).toBe(true);
      expect(isLowerCase('Hello')).toBe(false);
      expect(isLowerCase('HELLO')).toBe(false);
    });
  });

  describe('isUpperCase', () => {
    it('should detect uppercase strings', () => {
      expect(isUpperCase('HELLO')).toBe(true);
      expect(isUpperCase('Hello')).toBe(false);
      expect(isUpperCase('hello')).toBe(false);
    });
  });

  describe('isJSON', () => {
    it('should validate JSON strings', () => {
      expect(isJSON('{"name":"John"}')).toBe(true);
      expect(isJSON('[1,2,3]')).toBe(true);
      expect(isJSON('"hello"')).toBe(true);
      expect(isJSON('not json')).toBe(false);
      expect(isJSON('{invalid}')).toBe(false);
    });
  });

  describe('isHexColor', () => {
    it('should validate hex color codes', () => {
      expect(isHexColor('#fff')).toBe(true);
      expect(isHexColor('#ffffff')).toBe(true);
      expect(isHexColor('#FFF')).toBe(true);
      expect(isHexColor('#ABC123')).toBe(true);
      expect(isHexColor('fff')).toBe(false);
      expect(isHexColor('#gggggg')).toBe(false);
    });
  });

  describe('isUUID', () => {
    it('should validate UUID strings', () => {
      expect(isUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
      expect(isUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
      expect(isUUID('not-a-uuid')).toBe(false);
      expect(isUUID('123e4567-e89b-12d3')).toBe(false);
    });
  });

  describe('isBase64', () => {
    it('should validate base64 strings', () => {
      expect(isBase64('SGVsbG8gV29ybGQ=')).toBe(true);
      expect(isBase64('dGVzdA==')).toBe(true);
      expect(isBase64('not base64')).toBe(false);
    });
  });
});
