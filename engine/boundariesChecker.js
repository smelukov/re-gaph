import Creatable from './creatable.js';

export default class BoundariesChecker extends Creatable {
    init() {
        this.classMap = new Map();
    }

    register(Classes, fn) {
        Classes = Array.isArray(Classes) ? Classes : [Classes];
        Classes.forEach(Class => this.classMap.set(Class, fn));
    }

    check(x, y, item) {
        if (item.skipSelfBoundariesCheck) {
            return false;
        }

        let cursor = item.constructor;
        let fn;

        while (cursor) {
            fn = this.classMap.get(cursor);

            if (fn) {
                break;
            }

            cursor = Object.getPrototypeOf(cursor);
        }

        if (fn) {
            return fn(item, x, y);
        }

        return false;
    }

    find(worldX, worldY) {
        const item = this.findInItems(this.engine.scene.children, worldX, worldY);
        return item || null;
    }

    findInItems(items, worldX, worldY) {
        for (let i = items.length - 1; i >= 0; i--) {
            const item = items[i];
            const childrenItem = this.findInItems(item.children, worldX, worldY);

            if (childrenItem) {
                return childrenItem;
            }

            const itemWorldPosition = item.worldPosition();
            const worldToLocal = { x: worldX - itemWorldPosition.x, y: worldY - itemWorldPosition.y };

            if (this.check(worldToLocal.x, worldToLocal.y, item)) {
                return { item, offset: { x: item.x - worldX, y: item.y - worldY } };
            }
        }

        return null;
    }

    dispose() {
        this.classMap.clear();
        super.dispose();
    }
}

export function isInsidePoly(x, y, poly) {
    let result = false;
    let j = poly.length - 1;

    for (let i = 0; i < poly.length; i++) {
        if ((poly[i].y < y && poly[j].y >= y || poly[j].y < y && poly[i].y >= y) &&
            (poly[i].x + (y - poly[i].y) / (poly[j].y - poly[i].y) * (poly[j].x - poly[i].x) < x)) {
            result = !result;
        }

        j = i;
    }

    return result;
}

export function isInsideEllipse(x, y, width, height, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const tdx = cos * x + sin * y;
    const tdy = sin * x - cos * y;

    return (tdx * tdx) / (width * width) + (tdy * tdy) / (height * height) <= 1;
}
