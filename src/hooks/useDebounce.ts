import { useState, useEffect } from 'react';

/**
 * 값의 업데이트를 지연시키는 hook
 * 사용자 입력이 멈춘 후 일정 시간이 지나면 값을 업데이트합니다.
 *
 * @param value - debounce할 값
 * @param delay - 지연 시간 (밀리초, 기본값: 500ms)
 * @returns debounce된 값
 *
 * @example
 * // 검색 입력 최적화
 * function SearchComponent() {
 *   const [searchTerm, setSearchTerm] = useState('');
 *   const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 *   useEffect(() => {
 *     if (debouncedSearchTerm) {
 *       // API 호출은 사용자가 타이핑을 멈춘 후 500ms 뒤에 실행
 *       searchAPI(debouncedSearchTerm);
 *     }
 *   }, [debouncedSearchTerm]);
 *
 *   return (
 *     <input
 *       value={searchTerm}
 *       onChange={(e) => setSearchTerm(e.target.value)}
 *       placeholder="Search..."
 *     />
 *   );
 * }
 *
 * @example
 * // 윈도우 리사이즈 최적화
 * function ResponsiveComponent() {
 *   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
 *   const debouncedWidth = useDebounce(windowWidth, 200);
 *
 *   useEffect(() => {
 *     const handleResize = () => setWindowWidth(window.innerWidth);
 *     window.addEventListener('resize', handleResize);
 *     return () => window.removeEventListener('resize', handleResize);
 *   }, []);
 *
 *   return <div>Debounced width: {debouncedWidth}px</div>;
 * }
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // delay 후에 값을 업데이트하는 타이머 설정
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // value나 delay가 변경되면 이전 타이머를 클리어
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
