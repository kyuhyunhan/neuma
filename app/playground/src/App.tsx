import { task, useManager } from "neuma";
import { useEffect, useState } from "react";

type CounterState = {
  count: number;
};

// Create a task for our counter
const counterTask = task({ count: 0 });

function App() {
  // Get the manager instance
  const manager = useManager(counterTask);
  // Local state to trigger re-renders
  const [count, setCount] = useState(manager.state.count);

  // Subscribe to state changes
  useEffect(() => {
    const unsubscribe = manager.subscribe((state: CounterState) => {
      setCount(state.count);
    });

    return () => {
      unsubscribe();
    };
  }, [manager]);

  const increment = () => {
    manager.setState({ count: count + 1 });
  };

  const decrement = () => {
    manager.setState({ count: count - 1 });
  };

  return (
    <div className="card">
      <h1>Neuma Counter Example</h1>
      <div className="counter">
        <button onClick={decrement}>-</button>
        <span>Count: {count}</span>
        <button onClick={increment}>+</button>
      </div>
      <p>
        <small>Using neuma state management</small>
      </p>
    </div>
  );
}

export default App;
