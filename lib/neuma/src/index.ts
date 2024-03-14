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

type TaskCreator = any;
type Task = {
  key: string;
  value: TaskValue;
};
type Manager = any;
type TaskValue = number | string | object;

type Store = any;
type State = any;
type Observer = (state: any) => void;

// Should implement the store as an Observable
const createStore = (task: Task): Store => {
  let state: State = task.value || {}; // Default to empty object if no initial state
  const observers: Observer[] = [];

  // Notify all observers about state changes
  const notifyObservers = () => {
    observers.forEach((observer) => observer(state));
  };

  // Method to update the state and notify observers
  const setState = (newState: State) => {
    state = { ...state, ...newState }; // Merge new state with the current state
    notifyObservers();
  };

  // Allow components to subscribe to state changes
  const subscribe = (observer: Observer) => {
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

  // Initial setup or actions based on taskConfig can be added here
  // For example, using taskConfig.value to set initial state or actions

  return {
    getState: () => state,
    setState,
    subscribe,
  };
};

export const useManager = (task: Task): Manager => {
  const store = createStore(task);

  return {};
};

let taskCount = 0;
export const task: TaskCreator = (taskValue: TaskValue): Task => {
  const key = `task-${taskCount++}`;

  const config = {
    key,
    value: taskValue,
  };

  return config;
};
