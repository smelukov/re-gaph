import Disposable from '@regraph/disposable';

export default class Creatable extends Disposable {
  constructor(engine) {
    super();
    this.engine = engine;
  }

  init() {
  }

  dispose() {
    this.engine = null;
  }
}
