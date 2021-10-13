import { useRef, useCallback, useEffect } from 'react';

function useDebounce(callback, delay) {
    const maxWaitArgs = useRef([]);
    const functionTimeoutHandler = useRef(null);
    const isComponentUnmounted = useRef(false);

    const debouncedFunction = callback;

    useEffect(() => {
        isComponentUnmounted.current = false;
        return(() => {
            isComponentUnmounted.current = true;
        });
    },[]);

    const debouncedCallback = useCallback((...args) => {
        maxWaitArgs.current = args;
        clearTimeout(functionTimeoutHandler.current);

        functionTimeoutHandler.current = setTimeout(() => {
            if (!isComponentUnmounted.current) {
                debouncedFunction(...args);
            }
        }, delay);
    },[debouncedFunction, delay]);

    return [debouncedCallback];
}

export default useDebounce;
