import { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash.debounce';

/**
 * Hook that alerts when the passed ref reaches the bottom of the vieport.
 * @param ref the reference of the node to control
 * @param onInfiniteScroll the function to execute when the ref reaches the end of the viewport happens
 * @param offset offset of pixels to be used to check if the ref has reached the bottom of the viewport
 */
const useInfiniteScroll = (ref, onInfiniteScroll, offset = 0, containerRef) => {
  const [container, setContainer] = useState(window);

  const handleInfiniteScroll = useCallback(() => {
    const element = ref.current;
    if (containerRef) {
      if (element && container.scrollTop + container.offsetHeight > element.clientHeight + element.offsetTop - offset) {
        onInfiniteScroll();
      }
    } else if (
      element &&
      container.scrollY + container.innerHeight > element.clientHeight + element.offsetTop - offset
    ) {
      onInfiniteScroll();
    }
  }, [ref, onInfiniteScroll, offset, container]);

  useEffect(() => {
    if (containerRef?.current) {
      setContainer(containerRef.current);
    } else {
      setContainer(window);
    }
  }, [containerRef]);

  useEffect(() => {
    const debounceFunction = debounce(() => {
      handleInfiniteScroll();
    }, 100);
    container.addEventListener('scroll', debounceFunction);

    return () => {
      container.removeEventListener('scroll', debounceFunction);
    };
  }, [container, handleInfiniteScroll]);
};

export default useInfiniteScroll;
