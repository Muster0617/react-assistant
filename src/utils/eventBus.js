class EventBus {
  constructor() {
    this.map = {};
  }

  on(key, callback) {
    if (callback && callback instanceof Function) {
      this.map[key] = [...(this.map[key] || []), callback];
    }
  }

  emit(key, ...args) {
    let callbacks = this.map[key] || [];
    callbacks.forEach((cb) => {
      cb.call(this, ...args);
    });
  }

  off(key) {
    this.map[key] && delete this.map[key];
  }
}

export default new EventBus();
