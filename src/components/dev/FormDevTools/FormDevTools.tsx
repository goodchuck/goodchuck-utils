import React, { useState, useRef, useEffect } from 'react';
import { useCopyToClipboard } from '../../../hooks/useCopyToClipboard';
import {
  getContainerStyle,
  getToggleButtonStyle,
  getPanelStyle,
  headerStyle,
  headerTitleStyle,
  getStatusBadgeStyle,
  getCopyButtonStyle,
  tabContainerStyle,
  getTabStyle,
  contentStyle,
  sectionTitleStyle,
  codeBlockStyle,
  errorItemStyle,
  errorLabelStyle,
  errorMessageStyle,
  statsContainerStyle,
  statCardStyle,
  statLabelStyle,
  statValueStyle,
  resizeHandleStyle,
  resizeHandleIndicatorStyle,
} from './styles';

export type FormState = {
  values?: Record<string, any>;
  errors?: Record<string, any>;
  dirtyFields?: Record<string, any>;
  touchedFields?: Record<string, any>;
  isValid?: boolean;
  isSubmitting?: boolean;
  submitCount?: number;
};

export type Props = {
  /** react-hook-form의 formState */
  formState: FormState;
  /** 현재 폼 values (watch() 결과) */
  values?: Record<string, any>;
  /** 표시 위치 (기본값: 'bottom-left') */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** 패널 제목 (기본값: 'Form DevTools') */
  title?: string;
};

/**
 * react-hook-form의 상태를 실시간으로 시각화하는 개발용 컴포넌트
 * form의 values, errors, dirtyFields, touchedFields 등을 한눈에 확인할 수 있습니다.
 *
 * @example
 * ```tsx
 * // Vite 프로젝트
 * import { useForm } from 'react-hook-form';
 * import { FormDevTools } from 'goodchuck-utils/components/dev';
 *
 * function MyForm() {
 *   const { register, handleSubmit, formState, watch } = useForm({
 *     defaultValues: {
 *       username: '',
 *       email: '',
 *       age: 0,
 *     }
 *   });
 *
 *   const values = watch(); // 모든 값 watch
 *
 *   const onSubmit = (data) => {
 *     console.log(data);
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit(onSubmit)}>
 *       <input {...register('username', { required: 'Username is required' })} />
 *       <input {...register('email', { required: 'Email is required' })} />
 *       <input type="number" {...register('age', { min: 18 })} />
 *       <button type="submit">Submit</button>
 *
 *       {import.meta.env.DEV && (
 *         <FormDevTools formState={formState} values={values} />
 *       )}
 *     </form>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Create React App 프로젝트
 * {process.env.NODE_ENV === 'development' && (
 *   <FormDevTools
 *     formState={formState}
 *     values={values}
 *     position="top-right"
 *     title="User Form Debug"
 *   />
 * )}
 * ```
 */
export default function FormDevTools({ formState, values, position = 'bottom-left', title = 'Form DevTools' }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'values' | 'errors' | 'state'>('values');
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 });
  const [panelSize, setPanelSize] = useState({ width: 500, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const panelRef = useRef<HTMLDivElement>(null);
  const { copy, copiedText } = useCopyToClipboard();

  const handleCopy = () => {
    const data = {
      values,
      errors: formState.errors,
      dirtyFields: formState.dirtyFields,
      touchedFields: formState.touchedFields,
      isValid: formState.isValid,
      isSubmitting: formState.isSubmitting,
      submitCount: formState.submitCount,
    };
    copy(JSON.stringify(data, null, 2));
  };

  const isCopied = copiedText !== null;
  const errorCount = Object.keys(formState.errors || {}).length;
  const dirtyFieldsCount = Object.keys(formState.dirtyFields || {}).length;
  const touchedFieldsCount = Object.keys(formState.touchedFields || {}).length;

  // 드래그 핸들러
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        setPanelPosition((prev) => ({
          x: prev.x + deltaX,
          y: prev.y + deltaY,
        }));
        setDragStart({ x: e.clientX, y: e.clientY });
      }
      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        setPanelSize({
          width: Math.max(300, resizeStart.width + deltaX),
          height: Math.max(200, resizeStart.height + deltaY),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart]);

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      setIsDragging(true);
      setDragStart({
        x: e.clientX,
        y: e.clientY,
      });
      setPanelPosition({
        x: rect.left,
        y: rect.top,
      });
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: panelSize.width,
      height: panelSize.height,
    });
  };

  const renderErrors = () => {
    if (!formState.errors || Object.keys(formState.errors).length === 0) {
      return (
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '20px', fontSize: '13px' }}>
          No validation errors
        </div>
      );
    }

    return Object.entries(formState.errors).map(([field, error]: [string, any]) => (
      <div key={field} style={errorItemStyle}>
        <div style={errorLabelStyle}>{field}</div>
        <div style={errorMessageStyle}>{error?.message || 'Invalid value'}</div>
      </div>
    ));
  };

  return (
    <div style={getContainerStyle(position)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={getToggleButtonStyle(formState.isValid)}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = formState.isValid === false ? '#dc2626' : '#7c3aed')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = formState.isValid === false ? '#ef4444' : '#8b5cf6')
        }>
        {isOpen ? '✕' : '📝'}
      </button>

      {isOpen && (
        <div ref={panelRef} style={getPanelStyle(position, panelPosition, panelSize, isDragging)}>
          <div style={headerStyle} onMouseDown={handleHeaderMouseDown}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={headerTitleStyle}>📝 {title}</div>
              <div style={getStatusBadgeStyle(formState.isValid)}>
                {formState.isValid ? '✓ Valid' : `✗ ${errorCount} Error${errorCount > 1 ? 's' : ''}`}
              </div>
            </div>
            <button
              onClick={handleCopy}
              style={getCopyButtonStyle(isCopied)}
              onMouseEnter={(e) => {
                if (!isCopied) e.currentTarget.style.backgroundColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                if (!isCopied) e.currentTarget.style.backgroundColor = '#3b82f6';
              }}>
              {isCopied ? '✓ Copied' : 'Copy All'}
            </button>
          </div>

          <div style={tabContainerStyle}>
            <button
              onClick={() => setActiveTab('values')}
              style={getTabStyle(activeTab === 'values')}
              onMouseEnter={(e) => {
                if (activeTab !== 'values') e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'values') e.currentTarget.style.backgroundColor = 'transparent';
              }}>
              Values
            </button>
            <button
              onClick={() => setActiveTab('errors')}
              style={getTabStyle(activeTab === 'errors')}
              onMouseEnter={(e) => {
                if (activeTab !== 'errors') e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'errors') e.currentTarget.style.backgroundColor = 'transparent';
              }}>
              Errors ({errorCount})
            </button>
            <button
              onClick={() => setActiveTab('state')}
              style={getTabStyle(activeTab === 'state')}
              onMouseEnter={(e) => {
                if (activeTab !== 'state') e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'state') e.currentTarget.style.backgroundColor = 'transparent';
              }}>
              State
            </button>
          </div>

          <div style={contentStyle}>
            {activeTab === 'values' && (
              <>
                <div style={sectionTitleStyle}>Form Values</div>
                <pre style={codeBlockStyle}>{JSON.stringify(values || {}, null, 2)}</pre>
              </>
            )}

            {activeTab === 'errors' && (
              <>
                <div style={sectionTitleStyle}>Validation Errors</div>
                {renderErrors()}
              </>
            )}

            {activeTab === 'state' && (
              <>
                <div style={statsContainerStyle}>
                  <div style={statCardStyle}>
                    <div style={statLabelStyle}>Dirty Fields</div>
                    <div style={statValueStyle}>{dirtyFieldsCount}</div>
                  </div>
                  <div style={statCardStyle}>
                    <div style={statLabelStyle}>Touched Fields</div>
                    <div style={statValueStyle}>{touchedFieldsCount}</div>
                  </div>
                  <div style={statCardStyle}>
                    <div style={statLabelStyle}>Submit Count</div>
                    <div style={statValueStyle}>{formState.submitCount || 0}</div>
                  </div>
                  <div style={statCardStyle}>
                    <div style={statLabelStyle}>Submitting</div>
                    <div style={statValueStyle}>{formState.isSubmitting ? 'Yes' : 'No'}</div>
                  </div>
                </div>

                <div style={sectionTitleStyle}>Dirty Fields</div>
                <pre style={codeBlockStyle}>{JSON.stringify(formState.dirtyFields || {}, null, 2)}</pre>

                <div style={sectionTitleStyle}>Touched Fields</div>
                <pre style={codeBlockStyle}>{JSON.stringify(formState.touchedFields || {}, null, 2)}</pre>
              </>
            )}
          </div>
          {/* 리사이즈 핸들 */}
          <div onMouseDown={handleResizeMouseDown} style={resizeHandleStyle} />
          <div onMouseDown={handleResizeMouseDown} style={resizeHandleIndicatorStyle} />
        </div>
      )}
    </div>
  );
}
