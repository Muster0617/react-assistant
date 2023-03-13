class MyPromise {
  constructor(executor) {
    this.status = 'PENDING';
    this.value = undefined;
    this.reason = undefined;

    // 存放成功状态下的回调函数
    this.resolveCallbacks = [];
    // 存放失败状态下的回调函数
    this.rejectCallbacks = [];

    const resolve = (value) => {
      if (this.status === 'PENDING') {
        this.status = 'FULFILLED';
        this.value = value;
        // 执行成功状态下的回调函数
        this.resolveCallbacks.forEach((fn) => fn());
      }
    };

    const reject = (value) => {
      if (this.status === 'PENDING') {
        this.status = 'REJECTED';
        this.reason = value;
        // 执行失败状态下的回调函数
        this.rejectCallbacks.forEach((fn) => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(resolveCallback, rejectCallback) {
    // 同步情况，立即调用回调函数
    if (this.status === 'FULFILLED') resolveCallback(this.value);
    if (this.status === 'REJECTED') rejectCallback(this.reason);
    // 异步情况，存放回调函数到对应的调用栈中，当状态变更时分别调用对应的回调函数
    if (this.status === 'PENDING') {
      this.resolveCallbacks.push(() => resolveCallback(this.value));
      this.rejectCallbacks.push(() => rejectCallback(this.reason));
    }
  }
}

const promise1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    reject(1);
    // reject(1)
  }, 1000);
}).then(
  (value) => {
    console.log(value, '成功的回调');
  },
  (value) => {
    console.log(value, '失败的回调');
  },
);
