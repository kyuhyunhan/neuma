import { useDebugValue } from "react";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";

type SetStateInternal<T> = {
  _(
    partial: T | Partial<T> | { _(state: T): T | Partial<T> }["_"],
    replace?: boolean | undefined
  ): void;
}["_"];

interface StoreApi<T> {
  setState: SetStateInternal<T>;
  getState: () => T;
  getInitialState: () => T;
  subscribe: (listener: (state: T, prevState: T) => void) => () => void;
}

type CreateManager = any;
type CreateStore = any;
type StateConfig = any;
type CreateStoreImpl = any;

const createStoreImpl: CreateStoreImpl = (stateConfig: StateConfig) => {
  type TState = any;
  type Listener = any;
  let state: TState;
  const listeners: Set<Listener> = new Set();

  const setState: StoreApi<TState>["setState"] = (partial, replace) => {
    const nextState =
      typeof partial === "function"
        ? (partial as (state: TState) => TState)(state)
        : partial;

    if (!Object.is(nextState, state)) {
      const previousState = state;

      state =
        replace ?? (typeof nextState !== "object" || nextState === null)
          ? (nextState as TState)
          : Object.assign({}, state, nextState);

      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState: StoreApi<TState>["getState"] = () => state;

  const getInitialState: StoreApi<TState>["getInitialState"] = () =>
    initialState;

  const subscribe: StoreApi<TState>["subscribe"] = (listener) => {
    listeners.add(listener);
    // Unsubscribe
    return () => listeners.delete(listener);
  };

  const store = { setState, getState, getInitialState, subscribe };

  const initialState = (state = stateConfig(setState, getState, store));

  return store as any;
};

function useStore(store: any, selector: any) {
  const slice = useSyncExternalStoreWithSelector(
    store.subscribe,
    store.getState,
    store.getServerState || store.getInitialState,
    selector
  );

  useDebugValue(slice);

  return slice;
}

const createStore: CreateStore = (stateConfig: StateConfig) =>
  createStoreImpl(stateConfig);

const createManagerImpl = (stateConfig: StateConfig) => {
  const store = createStore(stateConfig);

  const useManager: any = (selector?: any) => useStore(store, selector);

  Object.assign(useManager, store);

  return useManager;
};

export const createManager: CreateManager = (stateConfig: StateConfig) =>
  createManagerImpl(stateConfig);
