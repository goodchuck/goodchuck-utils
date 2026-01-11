import React, { useState } from 'react';

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
 *       {process.env.NODE_ENV === 'development' && (
 *         <IdSelector onLogin={handleLogin} infos={devAccounts} />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export default function IdSelector({ onLogin, infos }: Props) {
  const [loading, setLoading] = useState<number | null>(null);

  const handleQuickLogin = async (info: LoginInfo, index: number) => {
    setLoading(index);
    try {
      await onLogin(info.id, info.pw);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed top-1/2 right-4 -translate-y-1/2 flex flex-col gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 min-w-[280px] z-50">
      <div className="text-gray-900 dark:text-gray-100 text-sm font-bold pb-2 border-b border-gray-200 dark:border-gray-700">
        🚀 개발용 빠른 로그인
      </div>
      {infos.map((info, index) => (
        <div
          key={index}
          className="flex flex-col gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all">
          <button
            onClick={() => handleQuickLogin(info, index)}
            disabled={loading === index}
            className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed">
            {loading === index ? '로그인 중...' : info.memo}
          </button>
          <div className="flex flex-col gap-1 text-xs text-gray-600 dark:text-gray-400 px-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold min-w-[24px]">ID</span>
              <span className="font-mono text-gray-700 dark:text-gray-300">{info.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold min-w-[24px]">PW</span>
              <span className="font-mono text-gray-700 dark:text-gray-300">{info.pw}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
