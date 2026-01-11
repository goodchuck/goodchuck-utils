/**
 * String Case Conversion Utilities
 */

/**
 * 첫 글자를 대문자로 변환
 * @example capitalize('hello world') // 'Hello world'
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 모든 단어의 첫 글자를 대문자로 변환
 * @example capitalizeWords('hello world') // 'Hello World'
 */
export function capitalizeWords(str: string): string {
  if (!str) return str;
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * camelCase로 변환
 * @example camelCase('hello world') // 'helloWorld'
 * @example camelCase('hello-world') // 'helloWorld'
 */
export function camelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
}

/**
 * PascalCase로 변환
 * @example pascalCase('hello world') // 'HelloWorld'
 */
export function pascalCase(str: string): string {
  return capitalize(camelCase(str));
}

/**
 * snake_case로 변환
 * @example snakeCase('helloWorld') // 'hello_world'
 * @example snakeCase('Hello World') // 'hello_world'
 */
export function snakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .replace(/[\s-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_/, '')
    .toLowerCase();
}

/**
 * kebab-case로 변환
 * @example kebabCase('helloWorld') // 'hello-world'
 * @example kebabCase('Hello World') // 'hello-world'
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-/, '')
    .toLowerCase();
}

/**
 * CONSTANT_CASE로 변환
 * @example constantCase('helloWorld') // 'HELLO_WORLD'
 */
export function constantCase(str: string): string {
  return snakeCase(str).toUpperCase();
}
