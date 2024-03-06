export class Subscriber {
  fn;

  constructor(fn_when_publisher_changed: any) {
    this.fn = fn_when_publisher_changed;
  }

  subscribe(publisher: any) {
    publisher.register_subscriber(this.fn);
  }
}
