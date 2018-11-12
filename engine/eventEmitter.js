import Disposable from './disposable.js';

export class Event extends Disposable {
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

export default class EventEmitter extends Disposable {
    constructor() {
        super();
        this.subscribers = {};
    }

    on(eventName, fn) {
        const { subscribers } = this;

        if (!subscribers.hasOwnProperty(eventName)) {
            subscribers[eventName] = [];
        }

        if (!subscribers[eventName].includes(fn)) {
            subscribers[eventName].push(fn);
        }
    }

    off(eventName, fn) {
        const { subscribers } = this;

        if (eventName) {
            if (subscribers.hasOwnProperty(eventName)) {
                if (fn) {
                    const index = subscribers[eventName].indexOf(fn);

                    if (index > -1) {
                        subscribers[eventName].splice(index, 1);

                        if (!subscribers[eventName].length) {
                            delete subscribers[eventName];
                        }
                    }
                } else {
                    delete subscribers[eventName];
                }
            }
        } else {
            for (const eventName in subscribers) {
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
            const { subscribers } = this;

            event.target = event.target || this;

            if (subscribers.hasOwnProperty(event.name)) {
                for (const fn of subscribers[event.name]) {
                    fn.call(event.target, event);
                }
            }

            if (disposeEventAfterDispatch) {
                event.dispose();
            }
        }
    }

    dispose() {
        this.dispatch(new Event('dispose'), true);
        this.off();
        super.dispose();
    }
}
