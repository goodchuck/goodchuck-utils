import React, { useState, useEffect, CSSProperties } from 'react';

type Props = {
  /** 표시 위치 (기본값: 'bottom-left') */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
};

type ElementInfo = {
  element: HTMLElement;
  zIndex: string;
  tagName: string;
  id?: string;
  className?: string;
};

/**
 * z-index 값을 시각화하는 개발용 컴포넌트
 * 페이지의 모든 요소의 z-index를 하이라이트하고 목록으로 표시합니다.
 *
 * @example
 * ```tsx
 * // Vite 프로젝트
 * import { ZIndexDebugger } from 'goodchuck-utils/components/dev';
 *
 * function App() {
 *   return (
 *     <div>
 *       {import.meta.env.DEV && <ZIndexDebugger />}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Create React App 프로젝트
 * {process.env.NODE_ENV === 'development' && <ZIndexDebugger position="top-right" />}
 * ```
 */
export default function ZIndexDebugger({ position = 'bottom-left' }: Props) {
  const [isActive, setIsActive] = useState(false);
  const [elements, setElements] = useState<ElementInfo[]>([]);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) {
      setElements([]);
      setHoveredElement(null);
      return;
    }

    const scanElements = () => {
      const allElements = document.querySelectorAll('*');
      const elementsWithZIndex: ElementInfo[] = [];

      allElements.forEach((el) => {
        if (!(el instanceof HTMLElement)) return;

        const computedStyle = window.getComputedStyle(el);
        const zIndex = computedStyle.zIndex;

        // z-index가 설정된 요소만 수집 (auto가 아닌 경우)
        if (zIndex !== 'auto' && zIndex !== '0') {
          elementsWithZIndex.push({
            element: el,
            zIndex,
            tagName: el.tagName.toLowerCase(),
            id: el.id || undefined,
            className: el.className || undefined,
          });
        }
      });

      // z-index 값으로 정렬 (높은 순)
      elementsWithZIndex.sort((a, b) => {
        const zA = parseInt(a.zIndex) || 0;
        const zB = parseInt(b.zIndex) || 0;
        return zB - zA;
      });

      setElements(elementsWithZIndex);
    };

    scanElements();

    // DOM 변경 감지
    const observer = new MutationObserver(scanElements);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    return () => observer.disconnect();
  }, [isActive]);

  // 호버된 요소 하이라이트
  useEffect(() => {
    if (!hoveredElement) return;

    const originalOutline = hoveredElement.style.outline;
    const originalOutlineOffset = hoveredElement.style.outlineOffset;

    hoveredElement.style.outline = '3px solid #f59e0b';
    hoveredElement.style.outlineOffset = '2px';

    return () => {
      hoveredElement.style.outline = originalOutline;
      hoveredElement.style.outlineOffset = originalOutlineOffset;
    };
  }, [hoveredElement]);

  const positionStyles: Record<string, CSSProperties> = {
    'top-left': { top: 16, left: 16 },
    'top-right': { top: 16, right: 16 },
    'bottom-left': { bottom: 16, left: 16 },
    'bottom-right': { bottom: 16, right: 16 },
  };

  const containerStyle: CSSProperties = {
    position: 'fixed',
    ...positionStyles[position],
    zIndex: 999999,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  const buttonStyle: CSSProperties = {
    padding: '8px 16px',
    backgroundColor: isActive ? '#ef4444' : '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 600,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.2s',
  };

  const panelStyle: CSSProperties = {
    marginTop: '8px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e5e7eb',
    width: '320px',
    maxHeight: '400px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle: CSSProperties = {
    padding: '12px 16px',
    borderBottom: '1px solid #e5e7eb',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#111827',
    backgroundColor: '#f9fafb',
  };

  const listContainerStyle: CSSProperties = {
    overflowY: 'auto',
    maxHeight: '350px',
  };

  const itemStyle = (isHovered: boolean): CSSProperties => ({
    padding: '10px 16px',
    borderBottom: '1px solid #f3f4f6',
    cursor: 'pointer',
    backgroundColor: isHovered ? '#fef3c7' : 'white',
    transition: 'background-color 0.15s',
  });

  const zIndexBadgeStyle: CSSProperties = {
    display: 'inline-block',
    padding: '2px 8px',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginRight: '8px',
  };

  const tagStyle: CSSProperties = {
    fontSize: '12px',
    color: '#6b7280',
    fontFamily: 'monospace',
  };

  const getElementLabel = (info: ElementInfo): string => {
    let label = info.tagName;
    if (info.id) label += `#${info.id}`;
    if (info.className && typeof info.className === 'string') {
      const classes = info.className.split(' ').filter(Boolean).slice(0, 2);
      if (classes.length > 0) {
        label += `.${classes.join('.')}`;
      }
    }
    return label.length > 40 ? label.slice(0, 40) + '...' : label;
  };

  const handleElementClick = (element: HTMLElement) => {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div style={containerStyle}>
      <button
        onClick={() => setIsActive(!isActive)}
        style={buttonStyle}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = isActive ? '#dc2626' : '#2563eb')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = isActive ? '#ef4444' : '#3b82f6')
        }>
        {isActive ? '🔴 Z-Index 디버거 종료' : '🔍 Z-Index 디버거'}
      </button>

      {isActive && (
        <div style={panelStyle}>
          <div style={headerStyle}>
            📊 Z-Index 목록 ({elements.length}개)
          </div>
          <div style={listContainerStyle}>
            {elements.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
                z-index가 설정된 요소가 없습니다.
              </div>
            ) : (
              elements.map((info, index) => (
                <div
                  key={index}
                  style={itemStyle(hoveredElement === info.element)}
                  onMouseEnter={() => setHoveredElement(info.element)}
                  onMouseLeave={() => setHoveredElement(null)}
                  onClick={() => handleElementClick(info.element)}>
                  <div>
                    <span style={zIndexBadgeStyle}>{info.zIndex}</span>
                    <span style={tagStyle}>{getElementLabel(info)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
