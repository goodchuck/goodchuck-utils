import { useState, useCallback } from 'react';

/**
 * useCopyToClipboard의 반환 타입
 */
export interface CopyToClipboardResult {
  /** 복사된 값 (null이면 아직 복사 안됨) */
  copiedText: string | null;
  /** 클립보드에 복사하는 함수 */
  copy: (text: string) => Promise<boolean>;
  /** 복사 상태를 초기화하는 함수 */
  reset: () => void;
}

/**
 * 클립보드에 텍스트를 복사하는 hook
 *
 * @returns {CopyToClipboardResult} 복사된 텍스트, 복사 함수, 리셋 함수
 *
 * @example
 * // 기본 사용
 * function CopyButton() {
 *   const { copiedText, copy } = useCopyToClipboard();
 *
 *   const handleCopy = () => {
 *     copy('Hello, World!');
 *   };
 *
 *   return (
 *     <button onClick={handleCopy}>
 *       {copiedText ? 'Copied!' : 'Copy'}
 *     </button>
 *   );
 * }
 *
 * @example
 * // 코드 블록 복사
 * function CodeBlock({ code }: { code: string }) {
 *   const { copiedText, copy } = useCopyToClipboard();
 *   const isCopied = copiedText === code;
 *
 *   return (
 *     <div>
 *       <pre>{code}</pre>
 *       <button onClick={() => copy(code)}>
 *         {isCopied ? '✓ Copied' : 'Copy Code'}
 *       </button>
 *     </div>
 *   );
 * }
 *
 * @example
 * // 에러 처리
 * function ShareLink({ url }: { url: string }) {
 *   const { copy } = useCopyToClipboard();
 *
 *   const handleShare = async () => {
 *     const success = await copy(url);
 *     if (success) {
 *       alert('Link copied!');
 *     } else {
 *       alert('Failed to copy');
 *     }
 *   };
 *
 *   return <button onClick={handleShare}>Share</button>;
 * }
 */
export function useCopyToClipboard(): CopyToClipboardResult {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    // Clipboard API 지원 확인
    if (!navigator?.clipboard) {
      console.warn('Clipboard API not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopiedText(null);
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setCopiedText(null);
  }, []);

  return { copiedText, copy, reset };
}
