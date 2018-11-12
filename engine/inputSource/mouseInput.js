import EventEmitter, { Event } from '../eventEmitter.js';

const eventMap = { click: 'click', mousedown: 'start', mouseup: 'end', mousemove: 'move', wheel: ['zoom', 'scroll'] };

export default class MouseInput extends EventEmitter {
    constructor(node) {
        super();

        this.node = node;
        this.handlers = [];

        for (const nativeEvent in eventMap) {
            let type = eventMap[nativeEvent];
            const handler = e => {
                if (nativeEvent === 'wheel') {
                    e.preventDefault();
                    type = e.ctrlKey ? 'zoom' : 'scroll'
                }

                const event = new Event('pointer-' + type, {
                    originalEvent: e,
                    x: e.clientX,
                    y: e.clientY,
                    pointerId: 0
                });

                if (type === 'zoom') {
                    event.data.factor = -e.deltaY;
                } else if (type === 'scroll') {
                    event.data.deltaX = e.deltaX;
                    event.data.deltaY = e.deltaY;
                }

                this.dispatch(event, true);
            };

            node.addEventListener(nativeEvent, handler);
            this.handlers.push({ nativeEvent, handler });
        }
    }

    getSupportedEvents() {
        return ['pointer-click', 'pointer-start', 'pointer-end', 'pointer-move', 'pointer-zoom', 'pointer-scroll'];
    }

    dispose() {
        for (const { nativeEvent, handler } of this.handlers) {
            this.node.removeEventListener(nativeEvent, handler);
        }

        this.handlers = null;
        super.dispose();
    }
}
