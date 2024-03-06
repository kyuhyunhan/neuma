let currentObserver: any = null;

export const observe = (fn: any) => {
  currentObserver = fn;
  fn();
  currentObserver = null;
};

export const observable = (obj: any) => {

  // a 대하여 observer 등록 한 번, b 대하여 observer 등록 한 번
  Object.keys(obj).forEach((key) => {
    let _value = obj[key];
    const observers = new Set();

    Object.defineProperty(obj, key, {
      get() {
        if (currentObserver) observers.add(currentObserver);
        return _value;
      },

      set(value) {
        _value = value;
        observers.forEach((fn: any) => fn());
      },
    });
  });
  return obj;
};
