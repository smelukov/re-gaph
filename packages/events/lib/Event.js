import Disposable from '@regraph/disposable'

export default class Event extends Disposable {
  constructor(name, data = {}) {
    super();

    this.name = name;
    this.data = data;
    this.target = null;
    this.stopped = false;
    this.warnAliveTimout = setTimeout(() => {
      console.warn('The event lives too long', this);
    }, 1000);
  }

  stop() {
    this.stopped = true;
  }

  dispose() {
    clearTimeout(this.warnAliveTimout);
    this.target = null;
    this.data = null;
    super.dispose();
  }
}
