import { useState, useCallback } from 'react';

/**
 * boolean 상태를 쉽게 토글할 수 있는 hook
 *
 * @param initialValue - 초기값 (기본값: false)
 * @returns [현재 값, 토글 함수, 값 설정 함수]
 *
 * @example
 * // 기본 사용
 * function Modal() {
 *   const [isOpen, toggleOpen, setIsOpen] = useToggle(false);
 *
 *   return (
 *     <>
 *       <button onClick={toggleOpen}>Toggle Modal</button>
 *       <button onClick={() => setIsOpen(true)}>Open Modal</button>
 *       <button onClick={() => setIsOpen(false)}>Close Modal</button>
 *       {isOpen && <div>Modal Content</div>}
 *     </>
 *   );
 * }
 *
 * @example
 * // 다크모드 토글
 * function ThemeToggle() {
 *   const [isDark, toggleTheme] = useToggle(false);
 *
 *   return (
 *     <button onClick={toggleTheme}>
 *       {isDark ? '🌙 Dark' : '☀️ Light'}
 *     </button>
 *   );
 * }
 *
 * @example
 * // 메뉴 열기/닫기
 * function Sidebar() {
 *   const [isExpanded, toggleExpanded] = useToggle(true);
 *
 *   return (
 *     <aside className={isExpanded ? 'expanded' : 'collapsed'}>
 *       <button onClick={toggleExpanded}>
 *         {isExpanded ? '◀' : '▶'}
 *       </button>
 *     </aside>
 *   );
 * }
 */
export function useToggle(
  initialValue: boolean = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState<boolean>(initialValue);

  // 토글 함수는 리렌더링 시에도 동일한 참조를 유지
  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, toggle, setValue];
}
