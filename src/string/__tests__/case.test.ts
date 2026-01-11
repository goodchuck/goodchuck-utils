import { describe, it, expect } from 'vitest';
import {
  capitalize,
  capitalizeWords,
  camelCase,
  pascalCase,
  snakeCase,
  kebabCase,
  constantCase,
} from '../case';

describe('String Case Conversion', () => {
  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('hello world')).toBe('Hello world');
      expect(capitalize('HELLO')).toBe('HELLO');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('capitalizeWords', () => {
    it('should capitalize each word', () => {
      expect(capitalizeWords('hello world')).toBe('Hello World');
      expect(capitalizeWords('the quick brown fox')).toBe('The Quick Brown Fox');
    });
  });

  describe('camelCase', () => {
    it('should convert to camelCase', () => {
      expect(camelCase('hello world')).toBe('helloWorld');
      expect(camelCase('hello-world')).toBe('helloWorld');
      expect(camelCase('hello_world')).toBe('helloWorld');
      expect(camelCase('Hello World')).toBe('helloWorld');
    });

    it('should handle already camelCase strings', () => {
      expect(camelCase('helloWorld')).toBe('helloworld');
    });
  });

  describe('pascalCase', () => {
    it('should convert to PascalCase', () => {
      expect(pascalCase('hello world')).toBe('HelloWorld');
      expect(pascalCase('hello-world')).toBe('HelloWorld');
      expect(pascalCase('hello_world')).toBe('HelloWorld');
    });
  });

  describe('snakeCase', () => {
    it('should convert to snake_case', () => {
      expect(snakeCase('helloWorld')).toBe('hello_world');
      expect(snakeCase('Hello World')).toBe('hello_world');
      expect(snakeCase('hello-world')).toBe('hello_world');
      expect(snakeCase('HelloWorld')).toBe('hello_world');
    });
  });

  describe('kebabCase', () => {
    it('should convert to kebab-case', () => {
      expect(kebabCase('helloWorld')).toBe('hello-world');
      expect(kebabCase('Hello World')).toBe('hello-world');
      expect(kebabCase('hello_world')).toBe('hello-world');
      expect(kebabCase('HelloWorld')).toBe('hello-world');
    });
  });

  describe('constantCase', () => {
    it('should convert to CONSTANT_CASE', () => {
      expect(constantCase('helloWorld')).toBe('HELLO_WORLD');
      expect(constantCase('Hello World')).toBe('HELLO_WORLD');
      expect(constantCase('hello-world')).toBe('HELLO_WORLD');
    });
  });
});
