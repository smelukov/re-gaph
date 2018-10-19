import Creatable from './creatable.js';

export default class Input extends Creatable {
    init() {
        this.handlerFn = this.handler.bind(this);

        for (const input of this.engine.inputSources) {
            for (const event of input.getSupportedEvents()) {
                input.on(event, this.handlerFn);
            }
        }
    }

    handler(event) {
        if (event.name.startsWith('pointer-')) {
            this.pointerHandler(event);
        } else if (event.name.startsWith('key-')) {
            event.target = null;
        }

        if (!event.stopped && event.target !== this.engine.stage) {
            this.engine.stage.dispatch(event);
        }
    }

    pointerHandler(event) {
        const worldPosition = this.engine.screenToWorld(event.data.x, event.data.y);
        let data = this.engine.boundariesChecker.find(worldPosition.x, worldPosition.y);

        if (!data) {
            data = {
                item: this.engine.stage,
                layer: null,
                offset: {
                    x: this.engine.stage.x - event.data.x,
                    y: this.engine.stage.y - event.data.y
                }
            };
        }

        event.data.item = data.item;
        event.data.layer = data.layer;
        event.data.offset = data.offset;
        event.target = data.item;
        data.item.dispatch(event);
    }

    dispose() {
        for (const input of this.engine.inputSources) {
            for (const event of input.getSupportedEvents()) {
                input.off(event, this.handlerFn);
            }
        }

        super.dispose();
    }
};
