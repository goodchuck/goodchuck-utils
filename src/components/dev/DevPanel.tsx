import React, { useState, CSSProperties, useRef } from 'react';
import { useWindowSize } from '../../hooks/useWindowSize';

type Props = {
  /** 패널 초기 위치 (기본값: 'bottom-right') */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
};

/**
 * 개발자 도구 패널
 * 여러 개발용 도구를 하나의 패널에서 관리할 수 있습니다.
 *
 * @example
 * ```tsx
 * // Vite 프로젝트
 * import { DevPanel } from 'goodchuck-utils/components/dev';
 *
 * function App() {
 *   return (
 *     <div>
 *       {import.meta.env.DEV && <DevPanel />}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Create React App 프로젝트
 * {process.env.NODE_ENV === 'development' && <DevPanel position="top-left" />}
 * ```
 */
export default function DevPanel({ position = 'bottom-right' }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [showWindowSize, setShowWindowSize] = useState(false);
  const [showRenderCount, setShowRenderCount] = useState(false);
  const renderCount = useRef(0);

  const { width, height } = useWindowSize();

  // 렌더 카운트 증가
  renderCount.current += 1;

  const positionStyles: Record<string, CSSProperties> = {
    'top-left': { top: 16, left: 16 },
    'top-right': { top: 16, right: 16 },
    'bottom-left': { bottom: 16, left: 16 },
    'bottom-right': { bottom: 16, right: 16 },
  };

  const containerStyle: CSSProperties = {
    position: 'fixed',
    ...positionStyles[position],
    zIndex: 99999,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  const toggleButtonStyle: CSSProperties = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '20px',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  };

  const panelStyle: CSSProperties = {
    position: 'absolute',
    bottom: position.includes('bottom') ? '60px' : undefined,
    top: position.includes('top') ? '60px' : undefined,
    right: position.includes('right') ? '0' : undefined,
    left: position.includes('left') ? '0' : undefined,
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e5e7eb',
    minWidth: '280px',
    overflow: 'hidden',
    color: '#111827',
  };

  const headerStyle: CSSProperties = {
    padding: '12px 16px',
    borderBottom: '1px solid #e5e7eb',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#111827',
    backgroundColor: '#f9fafb',
  };

  const contentStyle: CSSProperties = {
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const toggleItemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
    backgroundColor: 'transparent',
  };

  const getSwitchStyle = (isOn: boolean): CSSProperties => ({
    width: '36px',
    height: '20px',
    backgroundColor: isOn ? '#3b82f6' : '#d1d5db',
    borderRadius: '10px',
    position: 'relative',
    transition: 'background-color 0.2s',
    cursor: 'pointer',
  });

  const getSwitchKnobStyle = (isOn: boolean): CSSProperties => ({
    width: '16px',
    height: '16px',
    backgroundColor: 'white',
    borderRadius: '50%',
    position: 'absolute',
    top: '2px',
    left: isOn ? '18px' : '2px',
    transition: 'left 0.2s',
  });

  const overlayStyle: CSSProperties = {
    position: 'fixed',
    padding: '8px 12px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    fontSize: '14px',
    fontFamily: 'monospace',
    borderRadius: '8px',
    zIndex: 99998,
  };

  const handleClearLocalStorage = () => {
    if (confirm('LocalStorage를 모두 삭제하시겠습니까?')) {
      localStorage.clear();
      alert('LocalStorage가 삭제되었습니다.');
    }
  };

  const handleClearSessionStorage = () => {
    if (confirm('SessionStorage를 모두 삭제하시겠습니까?')) {
      sessionStorage.clear();
      alert('SessionStorage가 삭제되었습니다.');
    }
  };

  return (
    <>
      <div style={containerStyle}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={toggleButtonStyle}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}>
          {isOpen ? '✕' : '🛠'}
        </button>

        {isOpen && (
          <div style={panelStyle}>
            <div style={headerStyle}>⚙️ 개발자 도구</div>
            <div style={contentStyle}>
              {/* Window Size Toggle */}
              <div
                style={toggleItemStyle}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                onClick={() => setShowWindowSize(!showWindowSize)}>
                <span>윈도우 크기 표시</span>
                <div style={getSwitchStyle(showWindowSize)}>
                  <div style={getSwitchKnobStyle(showWindowSize)} />
                </div>
              </div>

              {/* Render Count Toggle */}
              <div
                style={toggleItemStyle}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                onClick={() => setShowRenderCount(!showRenderCount)}>
                <span>렌더 카운트 표시</span>
                <div style={getSwitchStyle(showRenderCount)}>
                  <div style={getSwitchKnobStyle(showRenderCount)} />
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '8px 0' }} />

              {/* Clear LocalStorage Button */}
              <button
                onClick={handleClearLocalStorage}
                style={{
                  ...toggleItemStyle,
                  border: '1px solid #e5e7eb',
                  backgroundColor: 'white',
                  color: '#dc2626',
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}>
                🗑️ LocalStorage 삭제
              </button>

              {/* Clear SessionStorage Button */}
              <button
                onClick={handleClearSessionStorage}
                style={{
                  ...toggleItemStyle,
                  border: '1px solid #e5e7eb',
                  backgroundColor: 'white',
                  color: '#dc2626',
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}>
                🗑️ SessionStorage 삭제
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Window Size Overlay */}
      {showWindowSize && (
        <div
          style={{
            ...overlayStyle,
            top: 16,
            left: 16,
          }}>
          <span style={{ color: '#60a5fa' }}>W:</span>{' '}
          <span style={{ fontWeight: 'bold' }}>{width}px</span>
          <span style={{ color: '#9ca3af', margin: '0 4px' }}>×</span>
          <span style={{ color: '#4ade80' }}>H:</span>{' '}
          <span style={{ fontWeight: 'bold' }}>{height}px</span>
        </div>
      )}

      {/* Render Count Overlay */}
      {showRenderCount && (
        <div
          style={{
            ...overlayStyle,
            top: 16,
            right: 16,
          }}>
          <span style={{ color: '#fbbf24' }}>Renders:</span>{' '}
          <span style={{ fontWeight: 'bold' }}>{renderCount.current}</span>
        </div>
      )}
    </>
  );
}
