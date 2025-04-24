import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface UseVirtualScrollProps<T> {
  items: T[];
  pageSize?: number;
  threshold?: number;
}

export function useVirtualScroll<T>({ 
  items, 
  pageSize = 10,
  threshold = 0.5 
}: UseVirtualScrollProps<T>) {
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const loadedAll = useRef(false);

  const { ref, inView } = useInView({
    threshold,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && !loadedAll.current) {
      const nextItems = items.slice(0, page * pageSize);
      setVisibleItems(nextItems);
      setPage(prev => prev + 1);
      
      if (nextItems.length >= items.length) {
        loadedAll.current = true;
      }
    }
  }, [inView, items, page, pageSize]);

  const reset = () => {
    setPage(1);
    setVisibleItems([]);
    loadedAll.current = false;
  };

  return {
    visibleItems,
    loadMoreRef: ref,
    hasMore: !loadedAll.current,
    reset,
  };
}
