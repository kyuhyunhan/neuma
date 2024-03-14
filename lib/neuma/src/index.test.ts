import { useManager, task } from ".";

describe("neuma", () => {
  test("should work", () => {
    const countTask = task();
    const manager = useManager(countTask);

    // useManager();
    // const { useManager, store } = createManager(() => ({}));
    // expect(useManager).toBeDefined();
    // expect(store).toBeDefined();
  });
});
