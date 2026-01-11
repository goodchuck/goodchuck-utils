import React, { useState, useEffect, CSSProperties } from 'react';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

export type ApiLogEntry = {
  id: string;
  timestamp: Date;
  method: string;
  url: string;
  status?: number;
  statusText?: string;
  duration?: number;
  requestBody?: unknown;
  responseBody?: unknown;
  error?: string;
};

type Props = {
  /** 표시 위치 (기본값: 'bottom-right') */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** 최대 로그 개수 (기본값: 50) */
  maxLogs?: number;
};

// 전역 로그 저장소
let globalLogs: ApiLogEntry[] = [];
let logListeners: Array<(logs: ApiLogEntry[]) => void> = [];

/**
 * API 로그를 추가하는 함수
 * fetch나 axios interceptor에서 호출하여 사용합니다.
 */
export function addApiLog(log: Omit<ApiLogEntry, 'id' | 'timestamp'>) {
  const newLog: ApiLogEntry = {
    ...log,
    id: `${Date.now()}-${Math.random()}`,
    timestamp: new Date(),
  };

  globalLogs = [newLog, ...globalLogs].slice(0, 100);
  logListeners.forEach((listener) => listener([...globalLogs]));
}

/**
 * 모든 API 로그를 초기화하는 함수
 */
export function clearApiLogs() {
  globalLogs = [];
  logListeners.forEach((listener) => listener([]));
}

/**
 * API 요청/응답을 로깅하는 개발용 컴포넌트
 * Axios interceptor 또는 fetch wrapper와 함께 사용하여 API 호출을 모니터링합니다.
 *
 * @example
 * ```tsx
 * // Axios interceptor 사용 (가장 일반적)
 * import axios from 'axios';
 * import { ApiLogger, addApiLog } from 'goodchuck-utils/components/dev';
 *
 * // Request interceptor
 * axios.interceptors.request.use(
 *   (config) => {
 *     config.metadata = { startTime: Date.now() };
 *     return config;
 *   },
 *   (error) => Promise.reject(error)
 * );
 *
 * // Response interceptor
 * axios.interceptors.response.use(
 *   (response) => {
 *     const duration = Date.now() - response.config.metadata?.startTime;
 *
 *     addApiLog({
 *       method: response.config.method?.toUpperCase() || 'GET',
 *       url: response.config.url || '',
 *       status: response.status,
 *       statusText: response.statusText,
 *       duration,
 *       requestBody: response.config.data,
 *       responseBody: response.data,
 *     });
 *
 *     return response;
 *   },
 *   (error) => {
 *     const duration = Date.now() - error.config?.metadata?.startTime;
 *
 *     addApiLog({
 *       method: error.config?.method?.toUpperCase() || 'GET',
 *       url: error.config?.url || '',
 *       status: error.response?.status,
 *       statusText: error.response?.statusText,
 *       duration,
 *       requestBody: error.config?.data,
 *       responseBody: error.response?.data,
 *       error: error.message,
 *     });
 *
 *     return Promise.reject(error);
 *   }
 * );
 *
 * function App() {
 *   return (
 *     <div>
 *       {import.meta.env.DEV && <ApiLogger />}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // fetch wrapper 사용
 * import { addApiLog } from 'goodchuck-utils/components/dev';
 *
 * const originalFetch = window.fetch;
 * window.fetch = async (...args) => {
 *   const startTime = Date.now();
 *   const [url, options] = args;
 *
 *   try {
 *     const response = await originalFetch(...args);
 *     const duration = Date.now() - startTime;
 *
 *     addApiLog({
 *       method: options?.method || 'GET',
 *       url: url.toString(),
 *       status: response.status,
 *       statusText: response.statusText,
 *       duration,
 *       requestBody: options?.body,
 *     });
 *
 *     return response;
 *   } catch (error) {
 *     addApiLog({
 *       method: options?.method || 'GET',
 *       url: url.toString(),
 *       error: (error as Error).message,
 *       duration: Date.now() - startTime,
 *     });
 *     throw error;
 *   }
 * };
 * ```
 *
 * @example
 * ```tsx
 * // Create React App 프로젝트
 * {process.env.NODE_ENV === 'development' && <ApiLogger position="bottom-left" />}
 * ```
 */
export default function ApiLogger({ position = 'bottom-right', maxLogs = 50 }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<ApiLogEntry[]>([]);
  const [selectedLog, setSelectedLog] = useState<ApiLogEntry | null>(null);
  const { copy, copiedText } = useCopyToClipboard();

  useEffect(() => {
    const listener = (newLogs: ApiLogEntry[]) => {
      setLogs(newLogs.slice(0, maxLogs));
    };

    logListeners.push(listener);
    listener([...globalLogs]);

    return () => {
      logListeners = logListeners.filter((l) => l !== listener);
    };
  }, [maxLogs]);

  const handleClearLogs = () => {
    if (confirm('모든 API 로그를 삭제하시겠습니까?')) {
      clearApiLogs();
      setSelectedLog(null);
    }
  };

  const handleCopyLog = (log: ApiLogEntry) => {
    const logText = JSON.stringify(log, null, 2);
    copy(logText);
  };

  const isCopied = copiedText !== null;

  const getStatusColor = (status?: number): string => {
    if (!status) return '#6b7280';
    if (status >= 200 && status < 300) return '#10b981';
    if (status >= 300 && status < 400) return '#3b82f6';
    if (status >= 400 && status < 500) return '#f59e0b';
    return '#ef4444';
  };

  const getMethodColor = (method: string): string => {
    switch (method.toUpperCase()) {
      case 'GET':
        return '#10b981';
      case 'POST':
        return '#3b82f6';
      case 'PUT':
        return '#f59e0b';
      case 'PATCH':
        return '#8b5cf6';
      case 'DELETE':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('ko-KR', { hour12: false });
  };

  const formatUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname + urlObj.search;
    } catch {
      return url;
    }
  };

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
    backgroundColor: logs.length > 0 ? '#10b981' : '#6b7280',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    transition: 'background-color 0.2s',
  };

  const badgeStyle: CSSProperties = {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    backgroundColor: '#ef4444',
    color: 'white',
    borderRadius: '10px',
    padding: '2px 6px',
    fontSize: '11px',
    fontWeight: 'bold',
    minWidth: '20px',
    textAlign: 'center',
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
    width: '600px',
    maxHeight: '500px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle: CSSProperties = {
    padding: '12px 16px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  };

  const headerTitleStyle: CSSProperties = {
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#111827',
  };

  const clearButtonStyle: CSSProperties = {
    padding: '4px 12px',
    backgroundColor: 'white',
    color: '#ef4444',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 600,
    transition: 'background-color 0.15s',
  };

  const contentStyle: CSSProperties = {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  };

  const logListStyle: CSSProperties = {
    flex: selectedLog ? '0 0 300px' : '1',
    overflowY: 'auto',
    borderRight: selectedLog ? '1px solid #e5e7eb' : 'none',
  };

  const logItemStyle = (isSelected: boolean): CSSProperties => ({
    padding: '12px 16px',
    borderBottom: '1px solid #f3f4f6',
    cursor: 'pointer',
    backgroundColor: isSelected ? '#eff6ff' : 'white',
    transition: 'background-color 0.15s',
  });

  const detailStyle: CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    fontSize: '13px',
  };

  const methodBadgeStyle = (method: string): CSSProperties => ({
    display: 'inline-block',
    padding: '2px 6px',
    backgroundColor: getMethodColor(method),
    color: 'white',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 'bold',
    marginRight: '8px',
  });

  const statusBadgeStyle = (status?: number): CSSProperties => ({
    display: 'inline-block',
    padding: '2px 6px',
    backgroundColor: getStatusColor(status),
    color: 'white',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 'bold',
    marginLeft: '8px',
  });

  return (
    <div style={containerStyle}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={toggleButtonStyle}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = logs.length > 0 ? '#059669' : '#4b5563')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = logs.length > 0 ? '#10b981' : '#6b7280')
        }>
        {isOpen ? '✕' : '📡'}
        {logs.length > 0 && <div style={badgeStyle}>{logs.length}</div>}
      </button>

      {isOpen && (
        <div style={panelStyle}>
          <div style={headerStyle}>
            <div style={headerTitleStyle}>📡 API Logger ({logs.length})</div>
            <button
              onClick={handleClearLogs}
              style={clearButtonStyle}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}>
              Clear
            </button>
          </div>

          <div style={contentStyle}>
            <div style={logListStyle}>
              {logs.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
                  API 로그가 없습니다.
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    style={logItemStyle(selectedLog?.id === log.id)}
                    onClick={() => setSelectedLog(log)}
                    onMouseEnter={(e) => {
                      if (selectedLog?.id !== log.id) {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedLog?.id !== log.id) {
                        e.currentTarget.style.backgroundColor = 'white';
                      }
                    }}>
                    <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                      {formatTime(log.timestamp)}
                      {log.duration && <span style={{ marginLeft: '8px' }}>{log.duration}ms</span>}
                    </div>
                    <div>
                      <span style={methodBadgeStyle(log.method)}>{log.method}</span>
                      {log.status && <span style={statusBadgeStyle(log.status)}>{log.status}</span>}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#374151',
                        marginTop: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                      {formatUrl(log.url)}
                    </div>
                    {log.error && (
                      <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>
                        Error: {log.error}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {selectedLog && (
              <div style={detailStyle}>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>상세 정보</h3>
                  <button
                    onClick={() => handleCopyLog(selectedLog)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: isCopied ? '#10b981' : '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      transition: 'background-color 0.2s',
                    }}>
                    {isCopied ? '✓ Copied' : 'Copy JSON'}
                  </button>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <strong>URL:</strong>
                  <div
                    style={{
                      marginTop: '4px',
                      padding: '8px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      wordBreak: 'break-all',
                    }}>
                    {selectedLog.url}
                  </div>
                </div>

                {selectedLog.requestBody !== undefined && (
                  <div style={{ marginBottom: '12px' }}>
                    <strong>Request Body:</strong>
                    <pre
                      style={{
                        marginTop: '4px',
                        padding: '8px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        overflow: 'auto',
                        maxHeight: '150px',
                      }}>
                      {JSON.stringify(selectedLog.requestBody as any, null, 2)}
                    </pre>
                  </div>
                )}

                {selectedLog.responseBody !== undefined && (
                  <div style={{ marginBottom: '12px' }}>
                    <strong>Response Body:</strong>
                    <pre
                      style={{
                        marginTop: '4px',
                        padding: '8px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        overflow: 'auto',
                        maxHeight: '150px',
                      }}>
                      {JSON.stringify(selectedLog.responseBody as any, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
