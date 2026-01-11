import React, { CSSProperties } from 'react';
import { useWindowSize } from '../../hooks/useWindowSize';

type Position = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

type Props = {
  /** 표시 위치 (기본값: 'bottom-right') */
  position?: Position;
  /** 커스텀 스타일 */
  style?: CSSProperties;
};

const positionStyles: Record<Position, CSSProperties> = {
  'top-left': { top: 16, left: 16 },
  'top-right': { top: 16, right: 16 },
  'bottom-left': { bottom: 16, left: 16 },
  'bottom-right': { bottom: 16, right: 16 },
};

/**
 * 현재 윈도우 크기를 화면에 표시하는 개발용 컴포넌트
 * 반응형 디버깅에 유용합니다.
 *
 * @example
 * ```tsx
 * // Vite 프로젝트
 * import { WindowSizeDisplay } from 'goodchuck-utils/components/dev';
 *
 * function App() {
 *   return (
 *     <div>
 *       {import.meta.env.DEV && <WindowSizeDisplay />}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Create React App 프로젝트
 * {process.env.NODE_ENV === 'development' && <WindowSizeDisplay />}
 * ```
 *
 * @example
 * ```tsx
 * // 커스텀 스타일 및 위치
 * <WindowSizeDisplay
 *   position="top-left"
 *   style={{ backgroundColor: 'red', color: 'white' }}
 * />
 * ```
 */
export default function WindowSizeDisplay({ position = 'bottom-right', style }: Props) {
  const { width, height } = useWindowSize();

  const containerStyle: CSSProperties = {
    position: 'fixed',
    ...positionStyles[position],
    padding: '8px 12px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    fontSize: '14px',
    fontFamily: 'monospace',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    zIndex: 9999,
    backdropFilter: 'blur(4px)',
    ...style,
  };

  const innerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  return (
    <div style={containerStyle}>
      <div style={innerStyle}>
        <span style={{ color: '#60a5fa' }}>W:</span>
        <span style={{ fontWeight: 'bold' }}>{width}px</span>
        <span style={{ color: '#9ca3af' }}>×</span>
        <span style={{ color: '#4ade80' }}>H:</span>
        <span style={{ fontWeight: 'bold' }}>{height}px</span>
      </div>
    </div>
  );
}
