import { useRef, useEffect } from 'react';

/**
 * 이전 렌더링의 값을 저장하는 hook
 *
 * @param value - 추적할 값
 * @returns 이전 렌더링의 값 (첫 렌더링에서는 undefined)
 *
 * @example
 * // 값 변경 감지
 * function Counter() {
 *   const [count, setCount] = useState(0);
 *   const prevCount = usePrevious(count);
 *
 *   return (
 *     <div>
 *       <p>Current: {count}</p>
 *       <p>Previous: {prevCount}</p>
 *       <p>Changed: {count !== prevCount ? 'Yes' : 'No'}</p>
 *       <button onClick={() => setCount(count + 1)}>Increment</button>
 *     </div>
 *   );
 * }
 *
 * @example
 * // 증가/감소 방향 표시
 * function PriceDisplay({ price }: { price: number }) {
 *   const prevPrice = usePrevious(price);
 *
 *   const trend = prevPrice === undefined
 *     ? null
 *     : price > prevPrice
 *     ? '📈 Up'
 *     : price < prevPrice
 *     ? '📉 Down'
 *     : '➡️ Same';
 *
 *   return (
 *     <div>
 *       <span>${price}</span>
 *       {trend && <span>{trend}</span>}
 *     </div>
 *   );
 * }
 *
 * @example
 * // 애니메이션 방향 결정
 * function AnimatedList({ items }: { items: string[] }) {
 *   const prevItems = usePrevious(items);
 *   const isAdding = prevItems && items.length > prevItems.length;
 *
 *   return (
 *     <ul className={isAdding ? 'slide-in' : 'slide-out'}>
 *       {items.map(item => <li key={item}>{item}</li>)}
 *     </ul>
 *   );
 * }
 */
export function usePrevious<T>(value: T): T | undefined {
  // ref는 리렌더링 간에 값을 유지
  const ref = useRef<T | undefined>(undefined);

  // 렌더링 후에 현재 값을 ref에 저장
  useEffect(() => {
    ref.current = value;
  }, [value]);

  // 현재 렌더링에서는 이전 값을 반환
  return ref.current;
}
