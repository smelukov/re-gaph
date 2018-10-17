import EventEmitter from './eventEmitter.js';
import { normalizeAngleRad, applyRotation } from './utils.js';
import TransformationMatrix from './transformationMatrix.js';

export default class Item extends EventEmitter {
    constructor(engine) {
        super();

        this.engine = engine;
        this.children = [];
        this.skipSelfDraw = false;
        this.skipSelfBoundariesCheck = false;
        this.localMatrix = new TransformationMatrix();
        this.localX = 0;
        this.localY = 0;
        this.angle = 0;
        this.setSize(1, 1);
    }

    init(x, y, angle) {
        this.setPosition(x || 0, y || 0);
        this.setRotation(angle || 0);
    }

    get x() {
        return this.worldPosition().x;
    }

    get y() {
        return this.worldPosition().y;
    }

    setSize(width, height) {
        this.setWidth(width);
        this.setHeight(height);
    }

    setWidth(width) {
        this.width = width <= 0 ? 1 : width;
    }

    setHeight(height) {
        this.height = height <= 0 ? 1 : height;
    }

    setPosition(x, y) {
        const worldPosition = this.worldPosition();
        this.setLocalPosition(this.localX + (x - worldPosition.x), this.localY + (y - worldPosition.y));
    }

    setLocalPosition(x, y) {
        this.localX = x;
        this.localY = y;
        this.localMatrix.moveTo(this.localX, this.localY);
    }

    setRotation(rad) {
        rad = normalizeAngleRad(rad);

        this.localMatrix.rotateTo(rad);
        this.angle = rad;
    }

    worldPosition() {
        let cursor = this.parent;
        let x = this.localX;
        let y = this.localY;

        while (cursor) {
            const newXY = applyRotation(x, y, cursor.angle);

            x = newXY.x + cursor.localX;
            y = newXY.y + cursor.localY;
            cursor = cursor.parent;
        }

        return { x, y };
    }

    worldAngle() {
        let cursor = this.parent;
        let angle = this.angle;

        while (cursor) {
            angle += cursor.angle;
            cursor = cursor.parent;
        }

        return angle;
    }

    addChildren(...children) {
        for (let i = 0; i < children.length; i++) {
            const child = children[i];

            child.parent = this;
            this.children.push(child);
        }
    }

    draw(render) {
        // empty
    }
}
