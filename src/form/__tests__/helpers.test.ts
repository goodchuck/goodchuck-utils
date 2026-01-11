import { describe, it, expect } from 'vitest';
import {
  hasFormErrors,
  getChangedFields,
  removeEmptyValues,
} from '../helpers';

describe('Form State Helpers', () => {
  describe('hasFormErrors', () => {
    it('should detect errors', () => {
      expect(hasFormErrors({ email: 'error' })).toBe(true);
      expect(hasFormErrors({})).toBe(false);
    });
  });

  describe('getChangedFields', () => {
    it('should return only changed fields', () => {
      const original = { name: 'John', email: 'john@example.com', age: 30 };
      const current = { name: 'Jane', email: 'john@example.com', age: 31 };
      const changed = getChangedFields(original, current);

      expect(changed).toEqual({ name: 'Jane', age: 31 });
    });

    it('should return empty object when nothing changed', () => {
      const original = { name: 'John' };
      const current = { name: 'John' };
      expect(getChangedFields(original, current)).toEqual({});
    });
  });

  describe('removeEmptyValues', () => {
    it('should remove null, undefined, and empty strings', () => {
      const input = {
        name: 'John',
        email: '',
        age: null,
        phone: undefined,
        address: 'Seoul',
      };

      expect(removeEmptyValues(input)).toEqual({
        name: 'John',
        address: 'Seoul',
      });
    });

    it('should keep zero values', () => {
      const input = { count: 0, active: false };
      expect(removeEmptyValues(input)).toEqual({ count: 0, active: false });
    });
  });
});
