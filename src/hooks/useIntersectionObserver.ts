import { useEffect, useState, RefObject } from 'react';

/**
 * Intersection Observer 옵션
 */
export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /** 한 번만 감지하고 observer를 해제할지 여부 (기본값: false) */
  freezeOnceVisible?: boolean;
}

/**
 * Intersection Observer를 사용하여 요소의 가시성을 감지하는 hook
 *
 * @param ref - 관찰할 요소의 ref
 * @param options - Intersection Observer 옵션
 * @returns IntersectionObserverEntry 또는 undefined
 *
 * @example
 * // 기본 사용 - 요소가 화면에 보이는지 감지
 * function LazyImage({ src }: { src: string }) {
 *   const imageRef = useRef<HTMLImageElement>(null);
 *   const entry = useIntersectionObserver(imageRef, {
 *     threshold: 0.1,
 *     freezeOnceVisible: true
 *   });
 *   const isVisible = entry?.isIntersecting;
 *
 *   return (
 *     <img
 *       ref={imageRef}
 *       src={isVisible ? src : undefined}
 *       alt="lazy loaded"
 *     />
 *   );
 * }
 *
 * @example
 * // 무한 스크롤
 * function InfiniteScrollList() {
 *   const loadMoreRef = useRef<HTMLDivElement>(null);
 *   const entry = useIntersectionObserver(loadMoreRef, {
 *     threshold: 1.0
 *   });
 *
 *   useEffect(() => {
 *     if (entry?.isIntersecting) {
 *       loadMoreItems();
 *     }
 *   }, [entry?.isIntersecting]);
 *
 *   return (
 *     <div>
 *       {items.map(item => <Item key={item.id} {...item} />)}
 *       <div ref={loadMoreRef}>Loading...</div>
 *     </div>
 *   );
 * }
 *
 * @example
 * // 애니메이션 트리거
 * function AnimatedSection() {
 *   const sectionRef = useRef<HTMLElement>(null);
 *   const entry = useIntersectionObserver(sectionRef, {
 *     threshold: 0.5,
 *     freezeOnceVisible: true
 *   });
 *
 *   return (
 *     <section
 *       ref={sectionRef}
 *       className={entry?.isIntersecting ? 'fade-in' : 'fade-out'}
 *     >
 *       Content
 *     </section>
 *   );
 * }
 *
 * @example
 * // rootMargin 사용 (요소가 화면에 들어오기 전에 미리 감지)
 * function PreloadImage({ src }: { src: string }) {
 *   const imageRef = useRef<HTMLImageElement>(null);
 *   const entry = useIntersectionObserver(imageRef, {
 *     rootMargin: '200px', // 화면 기준 200px 전에 감지
 *     freezeOnceVisible: true
 *   });
 *
 *   return <img ref={imageRef} src={entry?.isIntersecting ? src : undefined} />;
 * }
 */
export function useIntersectionObserver(
  ref: RefObject<Element>,
  options: UseIntersectionObserverOptions = {}
): IntersectionObserverEntry | undefined {
  const { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  useEffect(() => {
    const element = ref.current;

    // 요소가 없거나, 이미 frozen 상태면 observer 생성하지 않음
    if (!element || frozen) {
      return;
    }

    // Intersection Observer가 지원되지 않는 환경 체크
    if (!window.IntersectionObserver) {
      console.warn('IntersectionObserver is not supported in this browser');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, root, rootMargin, frozen]);

  return entry;
}

/**
 * 요소가 화면에 보이는지 여부만 반환하는 간단한 버전
 *
 * @param ref - 관찰할 요소의 ref
 * @param options - Intersection Observer 옵션
 * @returns 요소가 화면에 보이는지 여부
 *
 * @example
 * function Section() {
 *   const ref = useRef<HTMLDivElement>(null);
 *   const isVisible = useIsVisible(ref);
 *
 *   return (
 *     <div ref={ref}>
 *       {isVisible ? 'I am visible!' : 'I am hidden'}
 *     </div>
 *   );
 * }
 */
export function useIsVisible(
  ref: RefObject<Element>,
  options?: UseIntersectionObserverOptions
): boolean {
  const entry = useIntersectionObserver(ref, options);
  return entry?.isIntersecting ?? false;
}
