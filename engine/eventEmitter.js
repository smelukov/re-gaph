export class Event {
    constructor(name, data = {}) {
        this.name = name;
        this.data = data;
        this.target = null;
        this.stopped = false;
        this.disposed = false;
    }

    stop() {
        this.stopped = true;
    }

    dispose() {
        this.target = null;
        this.disposed = true;
    }
}

export default class EventEmitter {
    constructor() {
        this.subscribers = {};
        this.disposed = false;
    }

    on(event, fn) {
        if (!this.subscribers.hasOwnProperty(event)) {
            this.subscribers[event] = [];
        }

        if (!this.subscribers[event].includes(fn)) {
            this.subscribers[event].push(fn);
        }
    }

    off(event, fn) {
        if (event) {
            if (this.subscribers.hasOwnProperty(event)) {
                if (fn) {
                    const index = this.subscribers[event].indexOf(fn);

                    if (index > -1) {
                        this.subscribers[event].splice(index, 1);
                    }
                } else {
                    delete this.subscribers[event];
                }
            }
        } else {
            for (const event in this.subscribers) {
                this.off(event);
            }
        }
    }

    emit(eventName, data) {
        const event = new Event(eventName, data);
        this.dispatch(event);
    }

    dispatch(event, disposeEventAfterDispatch = false) {
        if (!event.disposed) {
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
        if (!this.disposed) {
            this.dispatch(new Event('dispose'));
            this.off();
            this.disposed = true;
        }
    }
}
