import { itemByScreenCoordinates } from './utils.js';

export default function handlePointerInputEvent(engine) {
    for (const input of engine.input) {
        for (const event of input.getSupportedEvents()) {
            input.on(event, inputHandler);
        }
    }

    function inputHandler(event) {
        const worldPosition = engine.screenToWorld(event.data.x, event.data.y);
        let data = itemByScreenCoordinates(worldPosition.x, worldPosition.y, engine);

        if (!data) {
            data = {
                item: engine.stage,
                layer: null,
                offset: {
                    x: engine.stage.x - event.data.x,
                    y: engine.stage.y - event.data.y
                }
            };
        }

        event.data.item = data.item;
        event.data.layer = data.layer;
        event.data.offset = data.offset;
        event.target = data.item;
        data.item.dispatch(event);

        if (!event.stopped && event.target !== event.stage) {
            engine.stage.dispatch(event);
        }
    }

};
