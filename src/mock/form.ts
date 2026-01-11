/**
 * Form Mock Data Generator
 *
 * 폼 필드 타입에 맞는 mock 데이터 자동 생성
 */

import {
  generateKoreanName,
  generateEnglishName,
  generateEmail,
  generatePhoneNumber,
  generateAddress,
  generateDate,
  generateNumber,
  generateKoreanText,
  generateEnglishText,
  generateBoolean,
  generateFromArray,
} from './generators';

/**
 * 필드 타입별 mock 데이터 생성 맵핑
 */
const fieldTypeMap: Record<string, (fieldName: string, options?: any) => any> = {
  // 이름 관련
  name: () => generateKoreanName(),
  username: () => generateEnglishName().toLowerCase().replace(/\s/g, ''),
  fullName: () => generateKoreanName(),
  firstName: () => generateKoreanName().substring(1),
  lastName: () => generateKoreanName().substring(0, 1),
  
  // 연락처 관련
  email: (fieldName: string) => generateEmail(),
  phone: () => generatePhoneNumber(),
  phoneNumber: () => generatePhoneNumber(),
  mobile: () => generatePhoneNumber(),
  tel: () => generatePhoneNumber(),
  
  // 주소 관련
  address: () => generateAddress(),
  zipCode: () => String(generateNumber(10000, 99999)),
  postalCode: () => String(generateNumber(10000, 99999)),
  
  // 날짜 관련
  date: () => generateDate(),
  birthDate: () => generateDate('1950-01-01', '2010-12-31'),
  birthday: () => generateDate('1950-01-01', '2010-12-31'),
  
  // 숫자 관련
  age: () => generateNumber(18, 80),
  price: () => generateNumber(1000, 1000000),
  amount: () => generateNumber(1, 1000),
  quantity: () => generateNumber(1, 100),
  count: () => generateNumber(0, 100),
  
  // 텍스트 관련
  title: () => generateKoreanText(10),
  content: () => generateKoreanText(50),
  description: () => generateKoreanText(30),
  message: () => generateKoreanText(20),
  comment: () => generateKoreanText(15),
  note: () => generateKoreanText(20),
  
  // 불린 관련
  isActive: () => generateBoolean(),
  enabled: () => generateBoolean(),
  checked: () => generateBoolean(),
  agree: () => generateBoolean(),
  accept: () => generateBoolean(),
  
  // 기본값
  default: (fieldName: string) => {
    // 필드명에 따라 추론
    const lowerName = fieldName.toLowerCase();
    if (lowerName.includes('email')) return generateEmail();
    if (lowerName.includes('phone') || lowerName.includes('tel') || lowerName.includes('mobile')) return generatePhoneNumber();
    if (lowerName.includes('name')) return generateKoreanName();
    if (lowerName.includes('address')) return generateAddress();
    if (lowerName.includes('date') || lowerName.includes('birth')) return generateDate();
    if (lowerName.includes('age') || lowerName.includes('count') || lowerName.includes('quantity')) return generateNumber(1, 100);
    if (lowerName.includes('price') || lowerName.includes('amount') || lowerName.includes('cost')) return generateNumber(1000, 100000);
    if (lowerName.includes('is') || lowerName.includes('has') || lowerName.includes('can')) return generateBoolean();
    return generateKoreanText(10);
  },
};

/**
 * 필드 타입을 추론하여 mock 데이터 생성
 * @param fieldName - 필드 이름
 * @param fieldType - 필드 타입 (선택)
 * @param options - 추가 옵션
 * @returns 생성된 mock 데이터
 */
function inferAndGenerate(fieldName: string, fieldType?: string, options?: any): any {
  const lowerName = fieldName.toLowerCase();
  const lowerType = fieldType?.toLowerCase() || '';

  // 타입 기반 생성
  if (lowerType.includes('email')) return generateEmail();
  if (lowerType.includes('tel') || lowerType.includes('phone')) return generatePhoneNumber();
  if (lowerType.includes('date')) return generateDate();
  if (lowerType.includes('number') || lowerType.includes('int')) return generateNumber(options?.min, options?.max);
  if (lowerType.includes('boolean') || lowerType.includes('bool')) return generateBoolean();
  if (lowerType.includes('text') || lowerType.includes('string')) {
    return options?.maxLength ? generateKoreanText(Math.min(options.maxLength, 50)) : generateKoreanText(10);
  }

  // 필드명 기반 생성
  const generator = fieldTypeMap[lowerName] || fieldTypeMap.default;
  return generator(fieldName, options);
}

/**
 * 폼 스키마로부터 mock 데이터 생성
 * @param schema - 폼 스키마 (필드명과 타입 정보)
 * @param count - 생성할 데이터 개수 (기본값: 1)
 * @returns 생성된 mock 데이터 배열
 *
 * @example
 * generateFormMockData({
 *   name: { type: 'text' },
 *   email: { type: 'email' },
 *   age: { type: 'number', min: 18, max: 80 }
 * }) // [{ name: "김민수", email: "user123@example.com", age: 25 }]
 *
 * @example
 * generateFormMockData({
 *   username: 'text',
 *   email: 'email',
 *   phone: 'tel'
 * }, 5) // 5개의 mock 데이터 배열
 */
export function generateFormMockData(
  schema: Record<string, any>,
  count: number = 1
): Record<string, any>[] {
  const results: Record<string, any>[] = [];

  for (let i = 0; i < count; i++) {
    const data: Record<string, any> = {};

    for (const [fieldName, fieldConfig] of Object.entries(schema)) {
      if (typeof fieldConfig === 'string') {
        // 간단한 타입 문자열인 경우
        data[fieldName] = inferAndGenerate(fieldName, fieldConfig);
      } else if (typeof fieldConfig === 'object' && fieldConfig !== null) {
        // 객체 형태인 경우
        if (fieldConfig.type) {
          data[fieldName] = inferAndGenerate(fieldName, fieldConfig.type, fieldConfig);
        } else if (fieldConfig.enum) {
          // enum 값이 있는 경우
          data[fieldName] = generateFromArray(fieldConfig.enum);
        } else if (fieldConfig.default !== undefined) {
          // default 값이 있는 경우
          data[fieldName] = fieldConfig.default;
        } else {
          data[fieldName] = inferAndGenerate(fieldName, undefined, fieldConfig);
        }
      } else {
        // 그 외의 경우 필드명으로 추론
        data[fieldName] = inferAndGenerate(fieldName);
      }
    }

    results.push(data);
  }

  return results;
}

/**
 * react-hook-form의 defaultValues로부터 mock 데이터 생성
 * @param defaultValues - react-hook-form의 defaultValues
 * @param count - 생성할 데이터 개수 (기본값: 1)
 * @returns 생성된 mock 데이터 배열
 *
 * @example
 * generateFromDefaultValues({
 *   username: '',
 *   email: '',
 *   age: 0
 * }) // [{ username: "johnsmith", email: "user123@example.com", age: 25 }]
 */
export function generateFromDefaultValues(
  defaultValues: Record<string, any>,
  count: number = 1
): Record<string, any>[] {
  const schema: Record<string, any> = {};

  // defaultValues의 타입을 추론하여 schema 생성
  for (const [fieldName, defaultValue] of Object.entries(defaultValues)) {
    if (typeof defaultValue === 'string') {
      if (defaultValue === '') {
        schema[fieldName] = { type: 'text' };
      } else if (defaultValue.includes('@')) {
        schema[fieldName] = { type: 'email' };
      } else {
        schema[fieldName] = { type: 'text', default: defaultValue };
      }
    } else if (typeof defaultValue === 'number') {
      schema[fieldName] = { type: 'number', default: defaultValue };
    } else if (typeof defaultValue === 'boolean') {
      schema[fieldName] = { type: 'boolean', default: defaultValue };
    } else {
      schema[fieldName] = { type: 'text' };
    }
  }

  return generateFormMockData(schema, count);
}
