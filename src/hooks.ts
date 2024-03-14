import { useEffect, useRef } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, AppState } from '@app/state/store';
import { CallbackFuncAny } from '@app/types';

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export const useInterval = (callback: CallbackFuncAny, delay: number) => {
  const savedCallback = useRef<CallbackFuncAny>();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    const handler = (...args: any) => savedCallback.current?.apply(null, args);
    if (delay !== null) {
      const id = setInterval(handler, delay);
      return () => clearInterval(id);
    }
    return undefined;
  }, [delay]);
};

// Use throughout app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
