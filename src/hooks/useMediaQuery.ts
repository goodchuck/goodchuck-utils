import { useState, useEffect } from 'react';

/**
 * 미디어 쿼리 매칭 여부를 반환하는 hook
 *
 * @param query - CSS 미디어 쿼리 문자열
 * @returns 미디어 쿼리 매칭 여부
 *
 * @example
 * // 모바일 체크
 * const isMobile = useMediaQuery('(max-width: 768px)');
 *
 * @example
 * // 태블릿 체크
 * const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
 *
 * @example
 * // 데스크톱 체크
 * const isDesktop = useMediaQuery('(min-width: 1025px)');
 *
 * @example
 * // 다크모드 체크
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 *
 * @example
 * // 가로 모드 체크
 * const isLandscape = useMediaQuery('(orientation: landscape)');
 */
export function useMediaQuery(query: string): boolean {
  // SSR 안전성을 위한 초기값 설정
  const getMatches = (query: string): boolean => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);

    // 초기 상태 설정
    setMatches(mediaQuery.matches);

    // 미디어 쿼리 변경 감지 (최신 API)
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 이벤트 리스너 등록
    // addEventListener를 지원하는 브라우저
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // 구형 브라우저 지원 (deprecated)
      mediaQuery.addListener(handleChange);
    }

    // 클린업
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
}

/**
 * 일반적인 브레이크포인트를 위한 헬퍼 hook들
 */

/**
 * 모바일 디바이스 체크 (768px 이하)
 * @example
 * const isMobile = useIsMobile();
 * if (isMobile) return <MobileView />;
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}

/**
 * 태블릿 디바이스 체크 (769px ~ 1024px)
 * @example
 * const isTablet = useIsTablet();
 */
export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
}

/**
 * 데스크톱 디바이스 체크 (1025px 이상)
 * @example
 * const isDesktop = useIsDesktop();
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1025px)');
}

/**
 * 다크모드 체크
 * @example
 * const isDarkMode = useIsDarkMode();
 */
export function useIsDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)');
}
