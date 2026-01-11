import { useEffect, useRef, RefObject } from 'react';

/**
 * DOM 이벤트 리스너를 안전하게 추가/제거하는 hook
 * 클린업이 자동으로 처리되며, SSR 환경에서도 안전합니다.
 *
 * @param eventName - 이벤트 이름 (예: 'click', 'scroll', 'keydown')
 * @param handler - 이벤트 핸들러 함수
 * @param element - 이벤트를 등록할 요소 (기본값: window)
 * @param options - addEventListener 옵션
 *
 * @example
 * // Window 이벤트 리스너
 * function ScrollIndicator() {
 *   const [scrollY, setScrollY] = useState(0);
 *
 *   useEventListener('scroll', () => {
 *     setScrollY(window.scrollY);
 *   });
 *
 *   return <div>Scroll position: {scrollY}px</div>;
 * }
 *
 * @example
 * // 특정 요소에 이벤트 리스너
 * function CustomButton() {
 *   const buttonRef = useRef<HTMLButtonElement>(null);
 *
 *   useEventListener('click', () => {
 *     console.log('Button clicked!');
 *   }, buttonRef);
 *
 *   return <button ref={buttonRef}>Click me</button>;
 * }
 *
 * @example
 * // Document 이벤트 리스너
 * function KeyboardShortcuts() {
 *   useEventListener('keydown', (e) => {
 *     if (e.key === 'Escape') {
 *       console.log('ESC pressed');
 *     }
 *   }, document);
 *
 *   return <div>Press ESC</div>;
 * }
 *
 * @example
 * // 이벤트 옵션 사용
 * function PassiveScrollListener() {
 *   useEventListener(
 *     'scroll',
 *     () => console.log('Scrolling...'),
 *     window,
 *     { passive: true } // 성능 최적화
 *   );
 *
 *   return <div>Scroll me</div>;
 * }
 *
 * @example
 * // 여러 이벤트 처리
 * function MultiEventHandler() {
 *   const handleInput = (e: Event) => {
 *     console.log('Input changed:', (e.target as HTMLInputElement).value);
 *   };
 *
 *   const inputRef = useRef<HTMLInputElement>(null);
 *
 *   useEventListener('input', handleInput, inputRef);
 *   useEventListener('focus', () => console.log('Focused'), inputRef);
 *   useEventListener('blur', () => console.log('Blurred'), inputRef);
 *
 *   return <input ref={inputRef} />;
 * }
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: undefined,
  options?: boolean | AddEventListenerOptions
): void;

export function useEventListener<K extends keyof HTMLElementEventMap, T extends HTMLElement = HTMLDivElement>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: RefObject<T>,
  options?: boolean | AddEventListenerOptions
): void;

export function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: Document,
  options?: boolean | AddEventListenerOptions
): void;

export function useEventListener<
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap,
  KD extends keyof DocumentEventMap,
  T extends HTMLElement | Document = HTMLElement
>(
  eventName: KW | KH | KD,
  handler: (event: WindowEventMap[KW] | HTMLElementEventMap[KH] | DocumentEventMap[KD] | Event) => void,
  element?: RefObject<T> | T,
  options?: boolean | AddEventListenerOptions
) {
  // handler를 ref에 저장하여 handler가 변경되어도 이벤트 리스너를 재등록하지 않도록 함
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // SSR 환경 체크
    if (typeof window === 'undefined') {
      return;
    }

    // 타겟 요소 결정
    const targetElement: T | Window = element instanceof Document
      ? element
      : (element && 'current' in element && element.current)
      ? element.current
      : window;

    if (!targetElement?.addEventListener) {
      return;
    }

    // 이벤트 핸들러 래퍼 (savedHandler.current를 호출)
    const eventListener = (event: Event) => {
      savedHandler.current(event);
    };

    // 이벤트 리스너 등록
    targetElement.addEventListener(eventName as string, eventListener, options);

    // 클린업: 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      targetElement.removeEventListener(eventName as string, eventListener, options);
    };
  }, [eventName, element, options]);
}
