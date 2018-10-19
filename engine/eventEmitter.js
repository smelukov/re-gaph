import Disposable from './disposable.js';

export class Event extends Disposable {
    constructor(name, data = {}) {
        super();

        this.name = name;
        this.data = data;
        this.target = null;
        this.stopped = false;
    }

    stop() {
        this.stopped = true;
    }

    dispose() {
        this.target = null;
        this.data = null;
        super.dispose();
    }
}

export default class EventEmitter extends Disposable {
    constructor() {
        super();
        this.subscribers = {};
    }

    on(eventName, fn) {
        if (!this.subscribers.hasOwnProperty(eventName)) {
            this.subscribers[eventName] = [];
        }

        if (!this.subscribers[eventName].includes(fn)) {
            this.subscribers[eventName].push(fn);
        }
    }

    off(eventName, fn) {
        if (eventName) {
            if (this.subscribers.hasOwnProperty(eventName)) {
                if (fn) {
                    const index = this.subscribers[eventName].indexOf(fn);

                    if (index > -1) {
                        this.subscribers[eventName].splice(index, 1);
                    }
                } else {
                    delete this.subscribers[eventName];
                }
            }
        } else {
            for (const eventName in this.subscribers) {
                this.off(eventName);
            }
        }
    }

    emit(eventName, data) {
        const event = new Event(eventName, data);
        this.dispatch(event);
    }

    dispatch(event, disposeEventAfterDispatch = false) {
        if (!event.isDisposed) {
            event.target = event.target || this;

            if (this.subscribers.hasOwnProperty(event.name)) {

                for (const fn of this.subscribers[event.name]) {
                    fn.call(event.target, event);
                }

                if (disposeEventAfterDispatch) {
                    event.dispose();
                }
            }
        }
    }

    dispose() {
        this.dispatch(new Event('dispose'));
        this.off();
        super.dispose();
    }
}
