// import { useDebugValue } from "react";
// import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";

// type SetStateInternal<T> = {
//   _(
//     partial: T | Partial<T> | { _(state: T): T | Partial<T> }["_"],
//     replace?: boolean | undefined
//   ): void;
// }["_"];

// interface StoreApi<T> {
//   setState: SetStateInternal<T>;
//   getState: () => T;
//   getInitialState: () => T;
//   subscribe: (listener: (state: T, prevState: T) => void) => () => void;
// }

// type CreateManager = any;
// type CreateStore = any;
// type StateConfig = any;
// type CreateStoreImpl = any;

// const createStoreImpl: CreateStoreImpl = (stateConfig: StateConfig) => {
//   type TState = any;
//   type Listener = any;
//   let state: TState;
//   const listeners: Set<Listener> = new Set();

//   const setState: StoreApi<TState>["setState"] = (partial, replace) => {
//     const nextState =
//       typeof partial === "function"
//         ? (partial as (state: TState) => TState)(state)
//         : partial;

//     if (!Object.is(nextState, state)) {
//       const previousState = state;

//       state =
//         replace ?? (typeof nextState !== "object" || nextState === null)
//           ? (nextState as TState)
//           : Object.assign({}, state, nextState);

//       listeners.forEach((listener) => listener(state, previousState));
//     }
//   };
//   const getState: StoreApi<TState>["getState"] = () => state;

//   const getInitialState: StoreApi<TState>["getInitialState"] = () =>
//     initialState;

//   const subscribe: StoreApi<TState>["subscribe"] = (listener) => {
//     listeners.add(listener);
//     // Unsubscribe
//     return () => listeners.delete(listener);
//   };

//   const store = { setState, getState, getInitialState, subscribe };

//   const initialState = (state = stateConfig(setState, getState, store));

//   return store as any;
// };

// function useStore(store: any, selector: any) {
//   const slice = useSyncExternalStoreWithSelector(
//     store.subscribe,
//     store.getState,
//     store.getServerState || store.getInitialState,
//     selector
//   );

//   useDebugValue(slice);

//   return slice;
// }

// const createStore: CreateStore = (stateConfig: StateConfig) =>
//   createStoreImpl(stateConfig);

// const createManagerImpl = (stateConfig: StateConfig) => {
//   const store = createStore(stateConfig);

//   const useManager: any = (selector?: any) => useStore(store, selector);

//   Object.assign(useManager, store);

//   return useManager;
// };

// export const createManager: CreateManager = (stateConfig: StateConfig) => {
//   return {
//     useManager: createManagerImpl(stateConfig),
//     store: createStore(stateConfig),
//   };
// };

type TaskValue = number | string | object;

type Task<T extends TaskValue = TaskValue> = {
  key: string;
  value: T;
};

type Store<T extends TaskValue> = {
  getState: () => T;
  setState: (newState: Partial<T>) => void;
  subscribe: (observer: (state: T) => void) => () => void;
};

type Manager<T extends TaskValue> = {
  state: T;
  setState: (newState: Partial<T>) => void;
  subscribe: (callback: (state: T) => void) => () => void;
};

// Should implement the store as an Observable
const createStore = <T extends TaskValue>(task: Task<T>): Store<T> => {
  let state: T = task.value as T; // Default to task value
  const observers: ((state: T) => void)[] = [];

  // Notify all observers about state changes
  const notifyObservers = () => {
    observers.forEach((observer) => observer(state));
  };

  // Method to update the state and notify observers
  const setState = (newState: Partial<T>) => {
    if (typeof state === "object" && state !== null) {
      state = { ...state, ...newState } as T;
    } else {
      state = newState as T;
    }
    notifyObservers();
  };

  // Allow components to subscribe to state changes
  const subscribe = (observer: (state: T) => void) => {
    observers.push(observer);
    // Immediately notify the new observer with the current state
    observer(state);

    // Return an unsubscribe function
    return () => {
      const index = observers.indexOf(observer);

      if (index > -1) {
        observers.splice(index, 1); // Unsubscribe the observer
      }
    };
  };

  return {
    getState: () => state,
    setState,
    subscribe,
  };
};

export const useManager = <T extends TaskValue>(task: Task<T>): Manager<T> => {
  const store = createStore(task);

  return {
    get state() {
      return store.getState();
    },
    setState: store.setState,
    subscribe: store.subscribe,
  };
};

type TaskCreator = <T extends TaskValue>(taskValue: T) => Task<T>;

let taskCount = 0;
export const task: TaskCreator = <T extends TaskValue>(
  taskValue: T
): Task<T> => {
  const key = `task-${taskCount++}`;

  return {
    key,
    value: taskValue,
  };
};
