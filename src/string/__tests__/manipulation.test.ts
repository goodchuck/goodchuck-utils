import { describe, it, expect } from 'vitest';
import {
  truncate,
  normalizeWhitespace,
  slugify,
  randomString,
  repeat,
  reverse,
  stripHtml,
  padStart,
  padEnd,
  template,
  mask,
} from '../manipulation';

describe('String Manipulation', () => {
  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');
      expect(truncate('Hello World', 20)).toBe('Hello World');
    });

    it('should use custom suffix', () => {
      expect(truncate('Hello World', 5, '---')).toBe('Hello---');
    });
  });

  describe('normalizeWhitespace', () => {
    it('should normalize whitespace', () => {
      expect(normalizeWhitespace('  hello   world  ')).toBe('hello world');
      expect(normalizeWhitespace('hello\n\nworld')).toBe('hello world');
    });
  });

  describe('slugify', () => {
    it('should create URL-friendly slugs', () => {
      expect(slugify('Hello World!')).toBe('hello-world');
      expect(slugify('Hello   World')).toBe('hello-world');
      expect(slugify('Hello_World')).toBe('hello-world');
    });

    it('should preserve alphanumeric characters', () => {
      expect(slugify('Test123 World')).toBe('test123-world');
    });

    it('should remove special characters', () => {
      expect(slugify('Hello @#$ World!')).toBe('hello-world');
    });
  });

  describe('randomString', () => {
    it('should generate random alphanumeric string', () => {
      const result = randomString(10);
      expect(result).toHaveLength(10);
      expect(/^[a-zA-Z0-9]+$/.test(result)).toBe(true);
    });

    it('should generate numeric only string', () => {
      const result = randomString(10, 'numeric');
      expect(result).toHaveLength(10);
      expect(/^[0-9]+$/.test(result)).toBe(true);
    });

    it('should generate alpha only string', () => {
      const result = randomString(10, 'alpha');
      expect(result).toHaveLength(10);
      expect(/^[a-zA-Z]+$/.test(result)).toBe(true);
    });

    it('should generate hex string', () => {
      const result = randomString(10, 'hex');
      expect(result).toHaveLength(10);
      expect(/^[0-9a-f]+$/.test(result)).toBe(true);
    });
  });

  describe('repeat', () => {
    it('should repeat string', () => {
      expect(repeat('ab', 3)).toBe('ababab');
      expect(repeat('x', 5)).toBe('xxxxx');
    });
  });

  describe('reverse', () => {
    it('should reverse string', () => {
      expect(reverse('hello')).toBe('olleh');
      expect(reverse('12345')).toBe('54321');
    });
  });

  describe('stripHtml', () => {
    it('should remove HTML tags', () => {
      expect(stripHtml('<p>Hello</p>')).toBe('Hello');
      expect(stripHtml('<p>Hello <strong>World</strong></p>')).toBe('Hello World');
      expect(stripHtml('No tags here')).toBe('No tags here');
    });
  });

  describe('padStart', () => {
    it('should pad string at start', () => {
      expect(padStart('5', 3, '0')).toBe('005');
      expect(padStart('abc', 5, 'x')).toBe('xxabc');
    });
  });

  describe('padEnd', () => {
    it('should pad string at end', () => {
      expect(padEnd('5', 3, '0')).toBe('500');
      expect(padEnd('abc', 5, 'x')).toBe('abcxx');
    });
  });

  describe('template', () => {
    it('should replace placeholders', () => {
      expect(template('Hello {name}!', { name: 'World' })).toBe('Hello World!');
      expect(template('I am {age} years old', { age: 25 })).toBe('I am 25 years old');
    });

    it('should keep unreplaced placeholders', () => {
      expect(template('Hello {name}!', {})).toBe('Hello {name}!');
    });

    it('should handle multiple placeholders', () => {
      expect(template('{greeting} {name}!', { greeting: 'Hi', name: 'John' })).toBe('Hi John!');
    });
  });

  describe('mask', () => {
    it('should mask characters', () => {
      expect(mask('1234567890', 3, 7)).toBe('123****890');
      expect(mask('password', 2, 6)).toBe('pa****rd');
    });

    it('should use custom mask character', () => {
      expect(mask('1234567890', 3, 7, 'x')).toBe('123xxxx890');
    });

    it('should mask to end if end not specified', () => {
      expect(mask('1234567890', 5)).toBe('12345*****');
    });
  });
});
