export class Publisher {
  state: any;
  observers: any = new Set();

  constructor(state: any) {
    this.state = state;

    Object.keys(state).forEach((key) =>
      Object.defineProperty(this, key, {
        get: () => this.state[key],
      })
    );
  }

  state_changed(newState: any) {
    this.state = { ...this.state, ...newState };

    this.notify_to_subscribers();
  }

  register_subscriber(subscriber: any) {
    this.observers.add(subscriber);
  }

  notify_to_subscribers() {
    this.observers.forEach((fn: any) => fn());
  }
}
