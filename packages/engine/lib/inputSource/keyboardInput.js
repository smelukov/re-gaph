import { Emitter, Event } from '@regraph/events';

const eventMap = { keypress: 'press', keydown: 'down', keyup: 'up' };

export default class KeyboardInput extends Emitter {
  constructor(node) {
    super();

    this.node = node;
    this.handlers = [];

    for (const nativeEvent in eventMap) {
      let type = eventMap[nativeEvent];
      const handler = e => {
        if (e.target === node) {
          const event = new Event('key-' + type, {
            key: e.key,
            altKey: e.altKey,
            ctrlKey: e.ctrlKey,
            metaKey: e.metaKey,
            shiftKey: e.shiftKey,
            originalEvent: e
          });

          this.dispatch(event, true);
        }
      };

      node.addEventListener(nativeEvent, handler, true);
      this.handlers.push({ nativeEvent, handler });
    }
  }

  getSupportedEvents() {
    return ['key-press', 'key-down', 'key-up'];
  }

  dispose() {
    for (const { nativeEvent, handler } of this.handlers) {
      this.node.removeEventListener(nativeEvent, handler);
    }

    this.handlers = null;
    super.dispose();
  }
}
