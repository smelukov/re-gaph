import EventEmitter, { Event } from '../eventEmitter.js';

const eventMap = { click: 'click', touchstart: 'start', touchend: 'end', touchcancel: 'end', touchmove: 'move' };

export default class MouseInput extends EventEmitter {
    constructor(node) {
        super();

        this.node = node;
        this.handlers = [];

        for (const nativeEvent in eventMap) {
            const type = eventMap[nativeEvent];
            const handler = e => {
                for (const touch of e.changedTouches) {
                    const event = new Event('pointer-' + type, {
                        x: touch.clientX,
                        y: touch.clientY,
                        pointerId: touch.identifier
                    });
                    this.dispatch(event, true);
                }
            };

            node.addEventListener(nativeEvent, handler);
            this.handlers.push({ nativeEvent, handler });
        }
    }

    getSupportedEvents() {
        return ['pointer-click', 'pointer-start', 'pointer-end', 'pointer-move'];
    }

    dispose() {
        for (const { nativeEvent, handler } of this.handlers) {
            this.node.removeEventListener(nativeEvent, handler);
        }

        this.handlers = null;
        super.dispose();
    }
}
