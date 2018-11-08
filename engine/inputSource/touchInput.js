import EventEmitter, { Event } from '../eventEmitter.js';
import { distance } from '../utils.js';

const eventMap = {
    click: 'click',
    touchstart: 'start',
    touchend: 'end',
    touchcancel: 'end',
    touchmove: ['move', 'zoom']
};

export default class TouchInput extends EventEmitter {
    constructor(node) {
        super();

        this.node = node;
        this.handlers = [];

        const touchData = {};
        let touchAmount = 0;

        for (const nativeEvent in eventMap) {
            let type = eventMap[nativeEvent];
            const handler = e => {
                e.preventDefault();

                const changedTouches = [];

                for (const touch of e.changedTouches) {
                    changedTouches.push({
                        pointerId: touch.identifier,
                        x: touch.clientX,
                        y: touch.clientY
                    });
                }

                for (const touch of changedTouches) {
                    const eventData = { ...touch };

                    if (type === 'start') {
                        touchData[touch.pointerId] = touch;
                        touchAmount++;
                    } else if (type === 'end') {
                        delete touchData[touch.pointerId];
                        touchAmount--;
                    } else if (nativeEvent === 'touchmove') {
                        if (touchAmount === 2) {
                            const oldDistance = distance(...Object.values(touchData));
                            let newDistance;

                            touchData[touch.pointerId] = touch;
                            newDistance = distance(...Object.values(touchData));
                            eventData.factor = newDistance - oldDistance;

                            type = 'zoom';
                        } else {
                            type = 'move';
                        }
                    }

                    this.dispatch(new Event('pointer-' + type, eventData), true);
                }
            };

            node.addEventListener(nativeEvent, handler);
            this.handlers.push({ nativeEvent, handler });
        }
    }

    getSupportedEvents() {
        return ['pointer-click', 'pointer-start', 'pointer-end', 'pointer-move', 'pointer-zoom'];
    }

    dispose() {
        for (const { nativeEvent, handler } of this.handlers) {
            this.node.removeEventListener(nativeEvent, handler);
        }

        this.handlers = null;
        super.dispose();
    }
}
