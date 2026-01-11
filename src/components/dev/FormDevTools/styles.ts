import { CSSProperties } from 'react';

export type StyleProps = {
  isValid?: boolean;
  isCopied: boolean;
  isActive: boolean;
  isDragging: boolean;
  position: string;
  panelPosition: { x: number; y: number };
  panelSize: { width: number; height: number };
};

export const getPositionStyles = (): Record<string, CSSProperties> => ({
  'top-left': { top: 16, left: 16 },
  'top-right': { top: 16, right: 16 },
  'bottom-left': { bottom: 16, left: 16 },
  'bottom-right': { bottom: 16, right: 16 },
});

export const getContainerStyle = (position: string): CSSProperties => {
  const positionStyles = getPositionStyles();
  return {
    position: 'fixed',
    ...positionStyles[position],
    zIndex: 99999,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };
};

export const getToggleButtonStyle = (isValid: boolean | undefined): CSSProperties => ({
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  backgroundColor: isValid === false ? '#ef4444' : '#8b5cf6',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  fontSize: '20px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.2s',
});

export const getPanelStyle = (
  position: string,
  panelPosition: { x: number; y: number },
  panelSize: { width: number; height: number },
  isDragging: boolean
): CSSProperties => {
  const maxHeight = typeof window !== 'undefined' ? window.innerHeight * 0.85 : 600;
  return {
    position: 'fixed',
    top: panelPosition.y || (position.includes('top') ? 60 : undefined),
    bottom: !panelPosition.y && position.includes('bottom') ? 60 : undefined,
    left: panelPosition.x || (position.includes('left') ? 0 : undefined),
    right: !panelPosition.x && position.includes('right') ? 0 : undefined,
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e5e7eb',
    width: `${panelSize.width}px`,
    height: `${Math.min(panelSize.height, maxHeight)}px`,
    maxHeight: `${maxHeight}px`,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    cursor: isDragging ? 'grabbing' : 'default',
  };
};

export const headerStyle: CSSProperties = {
  padding: '12px 16px',
  borderBottom: '1px solid #e5e7eb',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#f9fafb',
  cursor: 'grab',
  userSelect: 'none',
};

export const headerTitleStyle: CSSProperties = {
  fontWeight: 'bold',
  fontSize: '14px',
  color: '#111827',
};

export const getStatusBadgeStyle = (isValid: boolean | undefined): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 8px',
  backgroundColor: isValid ? '#dcfce7' : '#fee2e2',
  color: isValid ? '#166534' : '#991b1b',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: 600,
});

export const getCopyButtonStyle = (isCopied: boolean): CSSProperties => ({
  padding: '4px 12px',
  backgroundColor: isCopied ? '#10b981' : '#3b82f6',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '11px',
  fontWeight: 600,
  transition: 'background-color 0.2s',
});

export const contentStyle: CSSProperties = {
  flex: 1,
  minHeight: 0, // flexbox에서 스크롤이 제대로 작동하도록 필수
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: '16px',
};

export const sectionTitleStyle: CSSProperties = {
  fontSize: '12px',
  fontWeight: 'bold',
  color: '#6b7280',
  marginBottom: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

export const codeBlockStyle: CSSProperties = {
  backgroundColor: '#f3f4f6',
  borderRadius: '6px',
  padding: '12px',
  fontSize: '12px',
  fontFamily: 'monospace',
  overflow: 'auto',
  maxHeight: '300px',
  marginBottom: '16px',
  color: '#111827', // 검은색 텍스트
};

export const errorItemStyle: CSSProperties = {
  padding: '8px 12px',
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '6px',
  marginBottom: '8px',
};

export const errorLabelStyle: CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  color: '#991b1b',
  marginBottom: '4px',
};

export const errorMessageStyle: CSSProperties = {
  fontSize: '11px',
  color: '#7f1d1d',
};

export const statsContainerStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
  marginBottom: '16px',
};

export const statCardStyle: CSSProperties = {
  padding: '12px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
};

export const statLabelStyle: CSSProperties = {
  fontSize: '11px',
  color: '#6b7280',
  marginBottom: '4px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

export const statValueStyle: CSSProperties = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#111827',
};

export const resizeHandleStyle: CSSProperties = {
  position: 'absolute',
  bottom: 0,
  right: 0,
  width: '20px',
  height: '20px',
  cursor: 'nwse-resize',
  backgroundColor: 'transparent',
  zIndex: 1,
};

export const resizeHandleIndicatorStyle: CSSProperties = {
  position: 'absolute',
  bottom: 0,
  right: 0,
  width: '12px',
  height: '12px',
  cursor: 'nwse-resize',
  borderRight: '3px solid #9ca3af',
  borderBottom: '3px solid #9ca3af',
  borderRadius: '0 0 12px 0',
};
