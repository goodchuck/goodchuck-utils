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
  /** 초기값 (defaultValues 또는 reset()으로 설정한 원본 값, changedFields 계산에 사용) */
  originalValues?: Record<string, any>;
  /** Validation 스키마 정보 (zod, yup 등) - refine 조건 표시에 사용 */
  validationSchema?: Record<string, any>;
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
 *   // 신규 폼: defaultValues 사용
 *   const defaultValues = {
 *     username: '',
 *     email: '',
 *     age: 0,
 *   };
 *
 *   const { register, handleSubmit, formState, watch } = useForm({
 *     defaultValues,
 *   });
 *
 *   const values = watch();
 *
 *   return (
 *     <form onSubmit={handleSubmit(onSubmit)}>
 *       <input {...register('username')} />
 *       <input {...register('email')} />
 *       <button type="submit">Submit</button>
 *
 *       {import.meta.env.DEV && (
 *         <FormDevTools 
 *           formState={formState} 
 *           values={values}
 *           originalValues={defaultValues}
 *         />
 *       )}
 *     </form>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // 수정 폼: reset()으로 초기값 설정
 * function EditForm({ userData }) {
 *   const { register, handleSubmit, formState, watch, reset } = useForm();
 *
 *   useEffect(() => {
 *     // 서버에서 가져온 데이터로 폼 초기화
 *     reset(userData);
 *   }, [userData, reset]);
 *
 *   const values = watch();
 *
 *   return (
 *     <form onSubmit={handleSubmit(onSubmit)}>
 *       <input {...register('username')} />
 *       <input {...register('email')} />
 *       <button type="submit">Update</button>
 *
 *       {process.env.NODE_ENV === 'development' && (
 *         <FormDevTools
 *           formState={formState}
 *           values={values}
 *           originalValues={userData} // reset()으로 설정한 원본 값
 *           position="top-right"
 *           title="Edit Form Debug"
 *         />
 *       )}
 *     </form>
 *   );
 * }
 * ```
 */
export default function FormDevTools({ formState, values, originalValues, validationSchema, position = 'bottom-left', title = 'Form DevTools' }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'values' | 'errors' | 'changed' | 'state' | 'validation'>('all');
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 });
  const [panelSize, setPanelSize] = useState({ width: 500, height: 400 });
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
      changedFields,
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

  // Changed Fields 계산: dirtyFields를 기반으로 실제 변경된 값들을 추출
  const getChangedFields = () => {
    if (!formState.dirtyFields || !values) return {};
    
    const changed: Record<string, any> = {};
    const getNestedValue = (obj: Record<string, any>, path: string) => {
      return path.split('.').reduce((acc, key) => acc?.[key], obj);
    };

    const processDirtyFields = (dirty: Record<string, any>, prefix = '') => {
      Object.keys(dirty).forEach((key) => {
        const fullPath = prefix ? `${prefix}.${key}` : key;
        const dirtyValue = dirty[key];
        
        if (dirtyValue === true) {
          // 최종 필드인 경우
          const currentValue = getNestedValue(values, fullPath);
          const originalValue = originalValues ? getNestedValue(originalValues, fullPath) : undefined;
          
          if (JSON.stringify(currentValue) !== JSON.stringify(originalValue)) {
            changed[fullPath] = {
              from: originalValue,
              to: currentValue,
            };
          }
        } else if (typeof dirtyValue === 'object' && dirtyValue !== null) {
          // 중첩된 객체인 경우 재귀적으로 처리
          processDirtyFields(dirtyValue, fullPath);
        }
      });
    };

    processDirtyFields(formState.dirtyFields);
    return changed;
  };

  const changedFields = getChangedFields();
  const changedFieldsCount = Object.keys(changedFields).length;

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
        const maxHeight = window.innerHeight * 0.85; // 화면 높이의 85%를 최대값으로
        setPanelSize({
          width: Math.max(300, resizeStart.width + deltaX),
          height: Math.min(maxHeight, Math.max(200, resizeStart.height + deltaY)),
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

          {/* 탭 메뉴 */}
          <div style={tabContainerStyle}>
            <button
              onClick={() => setActiveTab('all')}
              style={getTabStyle(activeTab === 'all')}
              onMouseEnter={(e) => {
                if (activeTab !== 'all') e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'all') e.currentTarget.style.backgroundColor = 'transparent';
              }}>
              All
            </button>
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
              Errors {errorCount > 0 && `(${errorCount})`}
            </button>
            <button
              onClick={() => setActiveTab('changed')}
              style={getTabStyle(activeTab === 'changed')}
              onMouseEnter={(e) => {
                if (activeTab !== 'changed') e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'changed') e.currentTarget.style.backgroundColor = 'transparent';
              }}>
              Changed {changedFieldsCount > 0 && `(${changedFieldsCount})`}
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
            {validationSchema && (
              <button
                onClick={() => setActiveTab('validation')}
                style={getTabStyle(activeTab === 'validation')}
                onMouseEnter={(e) => {
                  if (activeTab !== 'validation') e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'validation') e.currentTarget.style.backgroundColor = 'transparent';
                }}>
                Validation
              </button>
            )}
          </div>

          <div style={contentStyle}>
            {/* All 탭 - 전체 보기 */}
            {activeTab === 'all' && (
              <>
                {/* Stats 섹션 */}
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

                {/* Form Values */}
                <div style={sectionTitleStyle}>Form Values</div>
                <pre style={codeBlockStyle}>{JSON.stringify(values || {}, null, 2)}</pre>

                {/* Errors */}
                {errorCount > 0 && (
                  <>
                    <div style={sectionTitleStyle}>Validation Errors ({errorCount})</div>
                    {renderErrors()}
                  </>
                )}

                {/* Changed Fields */}
                {changedFieldsCount > 0 && (
                  <>
                    <div style={sectionTitleStyle}>Changed Fields ({changedFieldsCount})</div>
                    <pre style={codeBlockStyle}>{JSON.stringify(changedFields, null, 2)}</pre>
                  </>
                )}

                {/* Dirty Fields */}
                {dirtyFieldsCount > 0 && (
                  <>
                    <div style={sectionTitleStyle}>Dirty Fields</div>
                    <pre style={codeBlockStyle}>{JSON.stringify(formState.dirtyFields || {}, null, 2)}</pre>
                  </>
                )}

                {/* Touched Fields */}
                {touchedFieldsCount > 0 && (
                  <>
                    <div style={sectionTitleStyle}>Touched Fields</div>
                    <pre style={codeBlockStyle}>{JSON.stringify(formState.touchedFields || {}, null, 2)}</pre>
                  </>
                )}
              </>
            )}

            {/* Values 탭 */}
            {activeTab === 'values' && (
              <>
                {values && Object.keys(values).length > 0 ? (
                  <>
                    <div style={sectionTitleStyle}>Form Values</div>
                    <pre style={codeBlockStyle}>{JSON.stringify(values, null, 2)}</pre>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', color: '#9ca3af', padding: '40px 20px', fontSize: '13px' }}>
                    <div style={{ marginBottom: '8px' }}>No form values</div>
                    <div style={{ fontSize: '11px', color: '#d1d5db' }}>
                      Form values will appear here
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Errors 탭 */}
            {activeTab === 'errors' && (
              <>
                <div style={sectionTitleStyle}>Validation Errors {errorCount > 0 && `(${errorCount})`}</div>
                {errorCount > 0 ? renderErrors() : (
                  <div style={{ textAlign: 'center', color: '#9ca3af', padding: '20px', fontSize: '13px' }}>
                    No validation errors
                  </div>
                )}
              </>
            )}

            {/* Changed 탭 */}
            {activeTab === 'changed' && (
              <>
                {changedFieldsCount > 0 ? (
                  <>
                    <div style={sectionTitleStyle}>Changed Fields ({changedFieldsCount})</div>
                    <pre style={codeBlockStyle}>{JSON.stringify(changedFields, null, 2)}</pre>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', color: '#9ca3af', padding: '40px 20px', fontSize: '13px' }}>
                    <div style={{ marginBottom: '8px' }}>No changed fields</div>
                    <div style={{ fontSize: '11px', color: '#d1d5db' }}>
                      Fields will appear here when you modify form values
                    </div>
                  </div>
                )}
              </>
            )}

            {/* State 탭 */}
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

                {dirtyFieldsCount > 0 && (
                  <>
                    <div style={sectionTitleStyle}>Dirty Fields</div>
                    <pre style={codeBlockStyle}>{JSON.stringify(formState.dirtyFields || {}, null, 2)}</pre>
                  </>
                )}

                {touchedFieldsCount > 0 && (
                  <>
                    <div style={sectionTitleStyle}>Touched Fields</div>
                    <pre style={codeBlockStyle}>{JSON.stringify(formState.touchedFields || {}, null, 2)}</pre>
                  </>
                )}
              </>
            )}

            {/* Validation 탭 - refine 조건 및 스키마 정보 */}
            {activeTab === 'validation' && validationSchema && (
              <>
                <div style={sectionTitleStyle}>Validation Schema</div>
                <pre style={codeBlockStyle}>{JSON.stringify(validationSchema, null, 2)}</pre>
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
