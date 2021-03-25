import {useCallback, useEffect, useRef, useState} from 'react';

function useStateCallback(initVal) {
    var [val, setVal] = useState(initVal);
    var cbRef = useRef(null);
    var first = useRef(true);

    useEffect(() => {
        if (first.current) {
            first.current = false;
            return;
        }

        if (typeof cbRef.current === 'function') {
            cbRef.current(val);
        }
    }, [val]);

    var setValCB = useCallback((newVal, cb) => {
        cbRef.current = cb;
        setVal(newVal);
    }, []);

    return [val, setValCB];
}

export default useStateCallback;