import React, { useState, CSSProperties } from 'react';

type LoginInfo = {
  id: string;
  pw: string;
  memo: string;
};

type Props = {
  onLogin: (email: string, password: string) => Promise<void>;
  infos: LoginInfo[];
};

/**
 * 개발용 로그인 shortcut 컴포넌트
 *
 * @example
 * ```tsx
 * // Vite 프로젝트
 * import { IdSelector } from 'goodchuck-utils/components/dev';
 *
 * function LoginPage() {
 *   const handleLogin = async (email: string, password: string) => {
 *     await loginAPI(email, password);
 *   };
 *
 *   const devAccounts = [
 *     { id: 'admin@test.com', pw: 'admin123', memo: '관리자' },
 *     { id: 'user@test.com', pw: 'user123', memo: '일반 사용자' },
 *   ];
 *
 *   return (
 *     <div>
 *       <LoginForm />
 *       {import.meta.env.DEV && (
 *         <IdSelector onLogin={handleLogin} infos={devAccounts} />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Create React App 프로젝트
 * {process.env.NODE_ENV === 'development' && (
 *   <IdSelector onLogin={handleLogin} infos={devAccounts} />
 * )}
 * ```
 */
export default function IdSelector({ onLogin, infos }: Props) {
  const [loading, setLoading] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredButton, setHoveredButton] = useState<number | null>(null);

  const handleQuickLogin = async (info: LoginInfo, index: number) => {
    setLoading(index);
    try {
      await onLogin(info.id, info.pw);
    } finally {
      setLoading(null);
    }
  };

  const containerStyle: CSSProperties = {
    position: 'fixed',
    top: '50%',
    right: '16px',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    border: '1px solid #e5e7eb',
    minWidth: '280px',
    zIndex: 9999,
  };

  const headerStyle: CSSProperties = {
    color: '#111827',
    fontSize: '14px',
    fontWeight: 'bold',
    paddingBottom: '8px',
    borderBottom: '1px solid #e5e7eb',
  };

  const getCardStyle = (index: number): CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: hoveredIndex === index ? '1px solid #60a5fa' : '1px solid #e5e7eb',
    transition: 'all 0.2s',
  });

  const getButtonStyle = (index: number): CSSProperties => ({
    width: '100%',
    padding: '8px 16px',
    backgroundColor: loading === index ? '#9ca3af' : hoveredButton === index ? '#2563eb' : '#3b82f6',
    color: 'white',
    fontWeight: 600,
    borderRadius: '8px',
    border: 'none',
    cursor: loading === index ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.2s',
  });

  const infoContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '12px',
    color: '#6b7280',
    paddingLeft: '4px',
    paddingRight: '4px',
  };

  const infoRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const labelStyle: CSSProperties = {
    fontWeight: 600,
    minWidth: '24px',
  };

  const valueStyle: CSSProperties = {
    fontFamily: 'monospace',
    color: '#374151',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>🚀 개발용 빠른 로그인</div>
      {infos.map((info, index) => (
        <div
          key={index}
          style={getCardStyle(index)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}>
          <button
            onClick={() => handleQuickLogin(info, index)}
            disabled={loading === index}
            style={getButtonStyle(index)}
            onMouseEnter={() => setHoveredButton(index)}
            onMouseLeave={() => setHoveredButton(null)}>
            {loading === index ? '로그인 중...' : info.memo}
          </button>
          <div style={infoContainerStyle}>
            <div style={infoRowStyle}>
              <span style={labelStyle}>ID</span>
              <span style={valueStyle}>{info.id}</span>
            </div>
            <div style={infoRowStyle}>
              <span style={labelStyle}>PW</span>
              <span style={valueStyle}>{info.pw}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
