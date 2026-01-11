import { useState, useEffect } from 'react';

/**
 * 윈도우 크기 정보
 */
export interface WindowSize {
  /** 윈도우 너비 (픽셀) */
  width: number;
  /** 윈도우 높이 (픽셀) */
  height: number;
}

/**
 * 윈도우 크기를 추적하는 hook
 *
 * @returns 윈도우의 현재 너비와 높이
 *
 * @example
 * // 기본 사용
 * function ResponsiveComponent() {
 *   const { width, height } = useWindowSize();
 *
 *   return (
 *     <div>
 *       Window size: {width} x {height}
 *     </div>
 *   );
 * }
 *
 * @example
 * // 반응형 레이아웃
 * function AdaptiveLayout() {
 *   const { width } = useWindowSize();
 *
 *   if (width < 768) {
 *     return <MobileLayout />;
 *   } else if (width < 1024) {
 *     return <TabletLayout />;
 *   } else {
 *     return <DesktopLayout />;
 *   }
 * }
 *
 * @example
 * // 캔버스 크기 조정
 * function Canvas() {
 *   const { width, height } = useWindowSize();
 *   const canvasRef = useRef<HTMLCanvasElement>(null);
 *
 *   useEffect(() => {
 *     if (canvasRef.current) {
 *       canvasRef.current.width = width;
 *       canvasRef.current.height = height;
 *     }
 *   }, [width, height]);
 *
 *   return <canvas ref={canvasRef} />;
 * }
 */
export function useWindowSize(): WindowSize {
  // SSR 환경에서는 기본값 사용
  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    if (typeof window === 'undefined') {
      return { width: 0, height: 0 };
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  });

  useEffect(() => {
    // SSR 환경에서는 이벤트 리스너 추가하지 않음
    if (typeof window === 'undefined') {
      return;
    }

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // 초기 크기 설정
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return windowSize;
}
