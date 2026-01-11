import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';

/**
 * localStorage와 동기화되는 state hook
 *
 * @param key - localStorage 키
 * @param initialValue - 초기값
 * @returns [storedValue, setValue, removeValue]
 *
 * @example
 * const [name, setName, removeName] = useLocalStorage('username', 'Guest');
 *
 * // 값 설정
 * setName('John');
 *
 * // 값 제거
 * removeName();
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>, () => void] {
  // SSR 안전성 체크
  const isBrowser = typeof window !== 'undefined';

  // 초기값을 localStorage에서 가져오기
  const readValue = useCallback((): T => {
    if (!isBrowser) {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key, isBrowser]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // 값 설정 함수
  const setValue: Dispatch<SetStateAction<T>> = useCallback(
    (value) => {
      if (!isBrowser) {
        console.warn(
          `Tried setting localStorage key "${key}" even though environment is not a client`
        );
        return;
      }

      try {
        // useState와 동일하게 함수형 업데이트 지원
        const newValue = value instanceof Function ? value(storedValue) : value;

        // localStorage에 저장
        window.localStorage.setItem(key, JSON.stringify(newValue));

        // state 업데이트
        setStoredValue(newValue);

        // storage event 발생 (다른 탭/윈도우에 알림)
        window.dispatchEvent(new Event('local-storage'));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
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
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
      window.dispatchEvent(new Event('local-storage'));
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue, isBrowser]);

  // 다른 탭/윈도우의 변경사항 감지
  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    const handleStorageChange = (e: StorageEvent | Event) => {
      if ('key' in e && e.key && e.key !== key) {
        return;
      }
      setStoredValue(readValue());
    };

    // storage event 리스너 (다른 탭의 변경사항)
    window.addEventListener('storage', handleStorageChange);
    // 같은 페이지 내의 변경사항
    window.addEventListener('local-storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, [key, readValue, isBrowser]);

  return [storedValue, setValue, removeValue];
}
