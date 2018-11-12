import EventEmitter, { Event } from './eventEmitter.js';
import { distance } from './utils.js';

export default class DnD extends EventEmitter {
    constructor(engine, target) {
        super();
        this.engine = engine;
        this.pointerStartHandler = (e) => {
            const worldPosition = engine.screenToWorld(e.data.x, e.data.y);

            this.isDragging = true;
            this.offset = { x: e.data.offset.x, y: e.data.offset.y };
            this.start = worldPosition;
            this.dispatch(new Event('start', {
                x: worldPosition.x,
                y: worldPosition.y,
                xWithOffset: worldPosition.x + this.offset.x,
                yWithOffset: worldPosition.y + this.offset.y
            }), true);
        };
        this.pointerEndHandler = e => {
            if (this.isDragging) {
                const worldPosition = engine.screenToWorld(e.data.x, e.data.y);

                this.isDragging = false;
                this.dispatch(new Event('end', {
                    x: worldPosition.x + this.offset.x,
                    y: worldPosition.y + this.offset.y,
                    xWithOffset: worldPosition.x + this.offset.x,
                    yWithOffset: worldPosition.y + this.offset.y,
                    xDistance: worldPosition.x - this.start.x,
                    yDistance: worldPosition.y - this.start.y,
                    distance: distance(this.start, worldPosition)
                }), true);
                this.offset = this.start = null;
            }
        };
        this.disposeHandler = () => this.setTarget(null);

        this.scenePointerMoveHandler = e => {
            if (this.isDragging) {
                const worldPosition = engine.screenToWorld(e.data.x, e.data.y);

                this.dispatch(new Event('move', {
                    x: worldPosition.x,
                    y: worldPosition.y,
                    xWithOffset: worldPosition.x + this.offset.x,
                    yWithOffset: worldPosition.y + this.offset.y,
                    xDistance: worldPosition.x - this.start.x,
                    yDistance: worldPosition.y - this.start.y,
                    distance: distance(this.start, worldPosition)
                }), true);
            }
        };
        this.engine.scene.on('pointer-move', this.scenePointerMoveHandler);
        this.engine.scene.on('pointer-end', this.pointerEndHandler);

        this.setTarget(target);
    }

    cancel() {
        this.isDragging = false;
    }

    setTarget(target) {
        if (this.target) {
            this.target.off('pointer-start', this.pointerStartHandler);
            this.target.off('pointer-end', this.pointerEndHandler);
            this.target.off('dispose', this.disposeHandler);
        }

        this.target = target;

        if (!target) {
            return;
        }

        target.on('pointer-start', this.pointerStartHandler);
        target.on('pointer-end', this.pointerEndHandler);
        target.on('dispose', this.disposeHandler);
    }

    dispose() {
        this.engine.scene.off('pointer-move', this.scenePointerMoveHandler);
        this.engine.scene.off('pointer-end', this.pointerEndHandler);
        this.engine = null;
        this.setTarget(null);
        super.dispose();
    }
}
