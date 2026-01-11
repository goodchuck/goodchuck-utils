import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';

/**
 * sessionStorage와 동기화되는 state hook
 *
 * @param key - sessionStorage 키
 * @param initialValue - 초기값
 * @returns [storedValue, setValue, removeValue]
 *
 * @example
 * const [token, setToken, removeToken] = useSessionStorage('auth-token', '');
 *
 * // 값 설정
 * setToken('abc123');
 *
 * // 값 제거
 * removeToken();
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>, () => void] {
  // SSR 안전성 체크
  const isBrowser = typeof window !== 'undefined';

  // 초기값을 sessionStorage에서 가져오기
  const readValue = useCallback((): T => {
    if (!isBrowser) {
      return initialValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key, isBrowser]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // 값 설정 함수
  const setValue: Dispatch<SetStateAction<T>> = useCallback(
    (value) => {
      if (!isBrowser) {
        console.warn(
          `Tried setting sessionStorage key "${key}" even though environment is not a client`
        );
        return;
      }

      try {
        // useState와 동일하게 함수형 업데이트 지원
        const newValue = value instanceof Function ? value(storedValue) : value;

        // sessionStorage에 저장
        window.sessionStorage.setItem(key, JSON.stringify(newValue));

        // state 업데이트
        setStoredValue(newValue);

        // storage event 발생
        window.dispatchEvent(new Event('session-storage'));
      } catch (error) {
        console.warn(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, storedValue, isBrowser]
  );

  // 값 제거 함수
  const removeValue = useCallback(() => {
    if (!isBrowser) {
      return;
    }

    try {
      window.sessionStorage.removeItem(key);
      setStoredValue(initialValue);
      window.dispatchEvent(new Event('session-storage'));
    } catch (error) {
      console.warn(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue, isBrowser]);

  // 같은 페이지 내의 변경사항 감지
  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    const handleStorageChange = () => {
      setStoredValue(readValue());
    };

    // 같은 페이지 내의 변경사항
    window.addEventListener('session-storage', handleStorageChange);

    return () => {
      window.removeEventListener('session-storage', handleStorageChange);
    };
  }, [key, readValue, isBrowser]);

  return [storedValue, setValue, removeValue];
}
