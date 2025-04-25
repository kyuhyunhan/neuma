import { useManager, task } from ".";

describe("neuma", () => {
  describe("task", () => {
    test("should create a task with a unique key", () => {
      const task1 = task({ count: 0 });
      const task2 = task({ count: 0 });

      expect(task1.key).not.toBe(task2.key);
      expect(task1.value).toEqual({ count: 0 });
    });
  });

  describe("useManager", () => {
    test("should initialize with task value", () => {
      const countTask = task({ count: 0 });
      const manager = useManager(countTask);

      expect(manager.state).toEqual({ count: 0 });
    });

    test("should update state", () => {
      const countTask = task({ count: 0 });
      const manager = useManager(countTask);

      manager.setState({ count: 1 });
      expect(manager.state).toEqual({ count: 1 });
    });

    test("should notify subscribers of state changes", () => {
      const countTask = task({ count: 0 });
      const manager = useManager(countTask);

      let lastState = manager.state;
      manager.subscribe((state) => {
        lastState = state;
      });

      manager.setState({ count: 1 });
      expect(lastState).toEqual({ count: 1 });
    });
  });
});
