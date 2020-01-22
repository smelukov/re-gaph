export default class Disposable {
  constructor() {
    this.isDisposed = false;
  }

  dispose() {
    if (this.isDisposed) {
      throw new Error('Already disposed');
    }

    this.isDisposed = true;
  }
}
