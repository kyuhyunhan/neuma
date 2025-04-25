# Neuma

A lightweight, task-based state management library for React.

## Installation

```bash
npm install neuma
# or
yarn add neuma
# or
pnpm add neuma
```

## Quick Start

```tsx
import { task, useManager } from "neuma";

// Create a task
const counterTask = task({ count: 0 });

function Counter() {
  // Get the manager instance
  const manager = useManager(counterTask);
  const [count, setCount] = useState(manager.state.count);

  // Subscribe to state changes
  useEffect(() => {
    const unsubscribe = manager.subscribe((state) => {
      setCount(state.count);
    });

    return () => unsubscribe();
  }, [manager]);

  return (
    <div>
      <button onClick={() => manager.setState({ count: count - 1 })}>-</button>
      <span>{count}</span>
      <button onClick={() => manager.setState({ count: count + 1 })}>+</button>
    </div>
  );
}
```

## Features

- Task-based state management
- TypeScript support
- Simple and intuitive API
- Observable pattern for state updates
- React integration

## API Reference

### `task<T>(value: T): Task<T>`

Creates a new task with the given initial value.

### `useManager<T>(task: Task<T>): Manager<T>`

Returns a manager instance for the given task.

#### Manager API

- `state: T` - Current state
- `setState(partial: Partial<T>)` - Update state
- `subscribe(callback: (state: T) => void)` - Subscribe to state changes

## License

MIT
