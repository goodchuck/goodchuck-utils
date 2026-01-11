import { useEffect, RefObject } from 'react';

/**
 * 요소 외부 클릭을 감지하는 hook
 *
 * @param ref - 외부 클릭을 감지할 요소의 ref
 * @param handler - 외부 클릭 시 실행할 콜백 함수
 * @param enabled - hook 활성화 여부 (기본값: true)
 *
 * @example
 * function Dropdown() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const dropdownRef = useRef<HTMLDivElement>(null);
 *
 *   useClickOutside(dropdownRef, () => setIsOpen(false));
 *
 *   return (
 *     <div ref={dropdownRef}>
 *       <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
 *       {isOpen && <div>Dropdown Content</div>}
 *     </div>
 *   );
 * }
 *
 * @example
 * // 조건부 활성화
 * useClickOutside(modalRef, handleClose, isModalOpen);
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const listener = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;

      // ref가 없거나, 클릭한 요소가 ref 내부인 경우 무시
      if (!element || element.contains(event.target as Node)) {
        return;
      }

      // 외부 클릭 시 handler 실행
      handler(event);
    };

    // mousedown과 touchstart 이벤트 모두 처리 (모바일 지원)
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, enabled]);
}

/**
 * 여러 요소의 외부 클릭을 감지하는 hook
 *
 * @param refs - 외부 클릭을 감지할 요소들의 ref 배열
 * @param handler - 외부 클릭 시 실행할 콜백 함수
 * @param enabled - hook 활성화 여부 (기본값: true)
 *
 * @example
 * function Modal() {
 *   const modalRef = useRef<HTMLDivElement>(null);
 *   const triggerRef = useRef<HTMLButtonElement>(null);
 *
 *   // 모달과 트리거 버튼 외부 클릭 시 닫기
 *   useClickOutsideMultiple(
 *     [modalRef, triggerRef],
 *     () => setIsOpen(false)
 *   );
 * }
 */
export function useClickOutsideMultiple<T extends HTMLElement = HTMLElement>(
  refs: RefObject<T>[],
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const listener = (event: MouseEvent | TouchEvent) => {
      // 모든 ref를 확인하여 하나라도 내부 클릭이면 무시
      const isInside = refs.some((ref) => {
        const element = ref.current;
        return element && element.contains(event.target as Node);
      });

      if (isInside) {
        return;
      }

      // 모든 요소 외부 클릭 시 handler 실행
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [refs, handler, enabled]);
}
