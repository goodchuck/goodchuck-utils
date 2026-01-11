/**
 * Mock Data Generators
 *
 * 폼 필드 타입에 맞는 mock 데이터 생성 유틸리티
 */

/**
 * 한국어 이름 생성
 * @param gender - 성별 ('male' | 'female' | 'random', 기본값: 'random')
 * @returns 한국어 이름
 *
 * @example
 * generateKoreanName() // "김민수"
 * generateKoreanName('female') // "이지은"
 */
export function generateKoreanName(gender: 'male' | 'female' | 'random' = 'random'): string {
  const surnames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '전', '홍'];
  const maleNames = ['민수', '준호', '성호', '지훈', '현우', '동현', '민준', '건우', '준영', '상우', '영수', '성민', '준혁', '태현', '승현'];
  const femaleNames = ['지은', '수진', '미영', '혜진', '은지', '서연', '민지', '예은', '지원', '유진', '소영', '지현', '수빈', '하은', '서윤'];

  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  const selectedGender = gender === 'random' ? (Math.random() > 0.5 ? 'male' : 'female') : gender;
  const name = selectedGender === 'male'
    ? maleNames[Math.floor(Math.random() * maleNames.length)]
    : femaleNames[Math.floor(Math.random() * femaleNames.length)];

  return `${surname}${name}`;
}

/**
 * 영어 이름 생성
 * @param gender - 성별 ('male' | 'female' | 'random', 기본값: 'random')
 * @returns 영어 이름
 *
 * @example
 * generateEnglishName() // "John Smith"
 * generateEnglishName('female') // "Emily Johnson"
 */
export function generateEnglishName(gender: 'male' | 'female' | 'random' = 'random'): string {
  const maleFirstNames = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Christopher'];
  const femaleFirstNames = ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

  const selectedGender = gender === 'random' ? (Math.random() > 0.5 ? 'male' : 'female') : gender;
  const firstName = selectedGender === 'male'
    ? maleFirstNames[Math.floor(Math.random() * maleFirstNames.length)]
    : femaleFirstNames[Math.floor(Math.random() * femaleFirstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${firstName} ${lastName}`;
}

/**
 * 이메일 생성
 * @param name - 이름 (선택, 없으면 랜덤 생성)
 * @param domain - 도메인 (기본값: 'example.com')
 * @returns 이메일 주소
 *
 * @example
 * generateEmail() // "user123@example.com"
 * generateEmail('홍길동') // "honggildong@example.com"
 */
export function generateEmail(name?: string, domain: string = 'example.com'): string {
  if (name) {
    // 한글 이름을 영문으로 변환 (간단한 변환)
    const nameMap: Record<string, string> = {
      '김': 'kim', '이': 'lee', '박': 'park', '최': 'choi', '정': 'jung',
      '강': 'kang', '조': 'cho', '윤': 'yoon', '장': 'jang', '임': 'lim'
    };
    let emailName = name.toLowerCase()
      .replace(/[가-힣]/g, (char) => {
        // 간단한 로마자 변환 (실제로는 더 복잡한 변환이 필요)
        return nameMap[char] || 'user';
      })
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 20) || 'user';
    
    if (emailName.length < 3) emailName = 'user';
    return `${emailName}${Math.floor(Math.random() * 1000)}@${domain}`;
  }

  const randomString = Math.random().toString(36).substring(2, 10);
  return `${randomString}@${domain}`;
}

/**
 * 전화번호 생성 (한국 형식)
 * @returns 전화번호 (010-1234-5678 형식)
 *
 * @example
 * generatePhoneNumber() // "010-1234-5678"
 */
export function generatePhoneNumber(): string {
  const prefixes = ['010', '011', '016', '017', '018', '019'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const middle = Math.floor(Math.random() * 9000) + 1000;
  const last = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${middle}-${last}`;
}

/**
 * 주소 생성 (한국 형식)
 * @returns 한국 주소
 *
 * @example
 * generateAddress() // "서울특별시 강남구 테헤란로 123"
 */
export function generateAddress(): string {
  const cities = ['서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시', '울산광역시'];
  const districts = ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구'];
  const streets = ['테헤란로', '강남대로', '서초대로', '올림픽대로', '반포대로', '한강대로', '을지로', '종로', '명동길', '이태원로'];
  
  const city = cities[Math.floor(Math.random() * cities.length)];
  const district = districts[Math.floor(Math.random() * districts.length)];
  const street = streets[Math.floor(Math.random() * streets.length)];
  const number = Math.floor(Math.random() * 999) + 1;

  return `${city} ${district} ${street} ${number}`;
}

/**
 * 날짜 생성 (범위 내)
 * @param startDate - 시작 날짜 (기본값: 1년 전)
 * @param endDate - 종료 날짜 (기본값: 오늘)
 * @returns 날짜 문자열 (YYYY-MM-DD)
 *
 * @example
 * generateDate() // "2023-06-15"
 * generateDate('2024-01-01', '2024-12-31') // "2024-08-20"
 */
export function generateDate(startDate?: string, endDate?: string): string {
  const start = startDate ? new Date(startDate).getTime() : Date.now() - 365 * 24 * 60 * 60 * 1000;
  const end = endDate ? new Date(endDate).getTime() : Date.now();
  const randomTime = start + Math.random() * (end - start);
  const date = new Date(randomTime);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * 숫자 생성 (범위 내)
 * @param min - 최소값 (기본값: 0)
 * @param max - 최대값 (기본값: 100)
 * @returns 랜덤 숫자
 *
 * @example
 * generateNumber() // 42
 * generateNumber(1, 10) // 7
 */
export function generateNumber(min: number = 0, max: number = 100): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 텍스트 생성 (한글)
 * @param length - 길이 (기본값: 10)
 * @returns 랜덤 한글 텍스트
 *
 * @example
 * generateKoreanText() // "안녕하세요반갑습니다"
 * generateKoreanText(5) // "테스트데이터"
 */
export function generateKoreanText(length: number = 10): string {
  const chars = '가나다라마바사아자차카타파하거너더러머버서어저처커터퍼허고노도로모보소오조초코토포호구누두루무부수우주추쿠투푸후그느드르므브스으즈츠크트프흐기니디리미비시이지치키티피히';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

/**
 * 텍스트 생성 (영문)
 * @param length - 길이 (기본값: 10)
 * @returns 랜덤 영문 텍스트
 *
 * @example
 * generateEnglishText() // "loremipsum"
 * generateEnglishText(5) // "testd"
 */
export function generateEnglishText(length: number = 10): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

/**
 * 불린 값 생성
 * @returns 랜덤 boolean
 *
 * @example
 * generateBoolean() // true
 */
export function generateBoolean(): boolean {
  return Math.random() > 0.5;
}

/**
 * 배열에서 랜덤 선택
 * @param array - 선택할 배열
 * @returns 랜덤으로 선택된 요소
 *
 * @example
 * generateFromArray(['red', 'blue', 'green']) // "blue"
 */
export function generateFromArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
