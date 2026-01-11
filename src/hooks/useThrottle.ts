import { useState, useEffect, useRef } from 'react';

/**
 * 값의 업데이트를 일정 시간 간격으로 제한하는 hook
 * debounce와 달리 일정 간격마다 최신 값을 업데이트합니다.
 *
 * @param value - throttle할 값
 * @param interval - 업데이트 간격 (밀리초, 기본값: 500ms)
 * @returns throttle된 값
 *
 * @example
 * // 스크롤 위치 추적 최적화
 * function ScrollTracker() {
 *   const [scrollY, setScrollY] = useState(0);
 *   const throttledScrollY = useThrottle(scrollY, 200);
 *
 *   useEffect(() => {
 *     const handleScroll = () => setScrollY(window.scrollY);
 *     window.addEventListener('scroll', handleScroll);
 *     return () => window.removeEventListener('scroll', handleScroll);
 *   }, []);
 *
 *   return <div>Scroll position: {throttledScrollY}px</div>;
 * }
 *
 * @example
 * // 무한 스크롤
 * function InfiniteScroll() {
 *   const [scrollY, setScrollY] = useState(0);
 *   const throttledScrollY = useThrottle(scrollY, 300);
 *
 *   useEffect(() => {
 *     const bottom = document.documentElement.scrollHeight - window.innerHeight;
 *     if (throttledScrollY >= bottom - 100) {
 *       loadMoreData();
 *     }
 *   }, [throttledScrollY]);
 *
 *   return <div>...</div>;
 * }
 *
 * @example
 * // 검색 입력 (실시간 검색에 적합)
 * function LiveSearch() {
 *   const [query, setQuery] = useState('');
 *   const throttledQuery = useThrottle(query, 500);
 *
 *   useEffect(() => {
 *     // 500ms마다 최대 한 번씩만 API 호출
 *     if (throttledQuery) {
 *       searchAPI(throttledQuery);
 *     }
 *   }, [throttledQuery]);
 *
 *   return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
 * }
 */
export function useThrottle<T>(value: T, interval: number = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    // 마지막 실행으로부터 경과된 시간
    const timeSinceLastExecution = Date.now() - lastExecuted.current;

    if (timeSinceLastExecution >= interval) {
      // 간격이 지났으면 즉시 업데이트
      setThrottledValue(value);
      lastExecuted.current = Date.now();
    } else {
      // 아직 간격이 안 지났으면 남은 시간 후에 업데이트
      const timer = setTimeout(() => {
        setThrottledValue(value);
        lastExecuted.current = Date.now();
      }, interval - timeSinceLastExecution);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [value, interval]);

  return throttledValue;
}
