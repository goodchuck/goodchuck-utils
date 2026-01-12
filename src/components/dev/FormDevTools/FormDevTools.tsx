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

// react-hook-form의 UseFormReturn 타입 (간소화된 버전)
export type UseFormReturn<TFieldValues extends Record<string, any> = Record<string, any>> = {
  watch: (name?: any) => any;
  getValues: (name?: any) => any;
  setValue: (
    name: any,
    value: any,
    options?: {
      shouldValidate?: boolean;
      shouldDirty?: boolean;
      shouldTouch?: boolean;
    }
  ) => void;
  trigger?: (name?: any) => Promise<boolean>;
  formState: {
    errors?: Record<string, any>;
    dirtyFields?: Record<string, any>;
    touchedFields?: Record<string, any>;
    isValid?: boolean;
    isSubmitting?: boolean;
    submitCount?: number;
    defaultValues?: TFieldValues;
  };
  handleSubmit?: (...args: any[]) => any;
  register?: (...args: any[]) => any;
  reset?: (...args: any[]) => any;
  [key: string]: any; // react-hook-form의 다른 메서드들도 허용
};

export type Props = {
  /** react-hook-form의 useForm() 반환값을 그대로 전달 */
  form: UseFormReturn;
  /** Mock 데이터 생성 함수 (비동기 가능) */
  generateMock?: (params: {
    values?: Record<string, any>;
    originalValues?: Record<string, any>;
  }) => Promise<Record<string, any>> | Record<string, any>;
  /** Validation 스키마 정보 (zod, yup 등) - 선택사항 */
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
 * // Vite 프로젝트 - 간단한 사용법
 * import { useForm } from 'react-hook-form';
 * import { FormDevTools } from 'goodchuck-utils/components/dev';
 *
 * function MyForm() {
 *   const form = useForm({
 *     defaultValues: {
 *       username: '',
 *       email: '',
 *       age: 0,
 *     }
 *   });
 *
 *   return (
 *     <form onSubmit={form.handleSubmit(onSubmit)}>
 *       <input {...form.register('username')} />
 *       <input {...form.register('email')} />
 *       <button type="submit">Submit</button>
 *
 *       {import.meta.env.DEV && <FormDevTools form={form} />}
 *     </form>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Mock 데이터 생성 기능 포함
 * function MyForm() {
 *   const form = useForm({
 *     defaultValues: {
 *       username: '',
 *       email: '',
 *       age: 0,
 *     }
 *   });
 *
 *   return (
 *     <form onSubmit={form.handleSubmit(onSubmit)}>
 *       <input {...form.register('username')} />
 *       <input {...form.register('email')} />
 *       <button type="submit">Submit</button>
 *
 *       {import.meta.env.DEV && (
 *         <FormDevTools
 *           form={form}
 *           generateMock={async ({ values, originalValues }) => {
 *             // Mock 데이터 생성 로직
 *             return {
 *               username: 'test_user',
 *               email: 'test@example.com',
 *               age: 25,
 *             };
 *           }}
 *         />
 *       )}
 *     </form>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // 수정 폼 예시
 * function EditForm({ userData }) {
 *   const form = useForm();
 *
 *   useEffect(() => {
 *     form.reset(userData);
 *   }, [userData]);
 *
 *   return (
 *     <form onSubmit={form.handleSubmit(onSubmit)}>
 *       <input {...form.register('username')} />
 *       <input {...form.register('email')} />
 *       <button type="submit">Update</button>
 *
 *       {process.env.NODE_ENV === 'development' && (
 *         <FormDevTools
 *           form={form}
 *           position="top-right"
 *           title="Edit Form Debug"
 *         />
 *       )}
 *     </form>
 *   );
 * }
 * ```
 */
export default function FormDevTools({ form, validationSchema, generateMock, position = 'bottom-left', title = 'Form DevTools' }: Props) {
  // form 객체에서 필요한 값들 추출
  const { formState, watch, setValue, trigger } = form;
  const values = watch(); // 모든 값을 watch
  const originalValues = formState.defaultValues; // defaultValues를 원본 값으로 사용

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'values' | 'errors' | 'changed' | 'state' | 'validation'>('all');
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 });
  const [panelSize, setPanelSize] = useState({ width: 500, height: 400 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

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

  // Mock 데이터 생성 핸들러
  const handleGenerateMock = async () => {
    if (!generateMock) {
      setGenerateError('generateMock 함수가 필요합니다');
      return;
    }

    setIsGenerating(true);
    setGenerateError(null);

    try {
      // 사용자가 제공한 generateMock 함수 사용
      const mockData = await generateMock({
        values,
        originalValues,
      });

      // setValue를 사용하여 각 필드를 설정
      // reset을 사용하면 defaultValues가 업데이트되어 changedFields 계산이 부정확해짐
      // setValue만 사용하면 originalValues와의 비교가 정확하게 유지됨
      const setNestedValue = (data: Record<string, any>, prefix = '') => {
        Object.keys(data).forEach((key) => {
          const fullPath = prefix ? `${prefix}.${key}` : key;
          const value = data[key];

          if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            // 중첩된 객체인 경우 재귀적으로 처리
            setNestedValue(value, fullPath);
          } else {
            // 최종 필드인 경우 setValue 호출
            setValue(fullPath, value, {
              shouldDirty: true,      // dirty를 true로 설정 (changedFields에 반영됨)
              shouldValidate: true,   // validation 실행
            });
          }
        });
      };

      setNestedValue(mockData);

      // 전체 validation 실행
      if (trigger) {
        await trigger();
      }
    } catch (error: any) {
      setGenerateError(error.message || 'Mock 데이터 생성 실패');
    } finally {
      setIsGenerating(false);
    }
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
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {generateMock && (
                <button
                  onClick={handleGenerateMock}
                  disabled={isGenerating}
                  style={{
                    ...getCopyButtonStyle(false),
                    backgroundColor: isGenerating ? '#9ca3af' : '#10b981',
                    opacity: isGenerating ? 0.6 : 1,
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!isGenerating) e.currentTarget.style.backgroundColor = '#059669';
                  }}
                  onMouseLeave={(e) => {
                    if (!isGenerating) e.currentTarget.style.backgroundColor = '#10b981';
                  }}>
                  {isGenerating ? '⏳ Generating...' : '🤖 Generate Mock'}
                </button>
              )}
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
          </div>

          {/* 에러 메시지 표시 */}
          {generateError && (
            <div style={{
              padding: '8px 16px',
              backgroundColor: '#fef2f2',
              borderBottom: '1px solid #fecaca',
              fontSize: '12px',
              color: '#991b1b',
            }}>
              {generateError}
            </div>
          )}

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
