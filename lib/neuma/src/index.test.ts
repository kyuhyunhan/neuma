import { observable, observe } from "./core/observer";

describe("neuma", () => {
  test("should work", () => {
    const 상태 = observable({ a: 10, b: 20 });

    observe(() => console.log(`a = ${상태.a}`));
    observe(() => console.log(`b = ${상태.b}`));
    observe(() => console.log(`a + b = ${상태.a} + ${상태.b}`));
    observe(() => console.log(`a * b = ${상태.a} + ${상태.b}`));
    observe(() => console.log(`a - b = ${상태.a} + ${상태.b}`));

    상태.a = 100;
    상태.b = 200;
  });
});
