import { check as isPointInside } from './boundariesCheck.js';

export const rad360Deg = 360 * Math.PI / 180;

export function applyRotation(x, y, angle) {
    return {
        x: x * Math.cos(angle) - y * Math.sin(angle),
        y: x * Math.sin(angle) + y * Math.cos(angle)
    }
}

export function normalizeAngleRad(rad) {
    if (rad < 0) {
        rad = rad360Deg + rad;
    } else if (rad > rad360Deg) {
        rad = rad - rad360Deg;
    }

    return rad;
}

export function distance(a, b) {
    return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}

export function distanceSign(a, b, point) {
    return Math.sign((b.x - a.x) * (point.y - a.y) - (b.y - a.y) * (point.x - a.x)) || 1;
}

export function pointAngle(a, b) {
    return Math.atan2(b.y - a.y, b.x - a.x)
}

export function itemByScreenCoordinates(screenX, screenY, engine) {
    for (let i = engine.orderedLayers.length - 1; i >= 0; i--) {
        const layer = engine.orderedLayers[i];
        const item = findItemByScreenCoordinates(layer.items, screenX, screenY);

        if (item) {
            item.layer = layer;

            return item;
        }
    }

    return null;
}

export function findItemByScreenCoordinates(items, screenX, screenY) {
    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        const childrenItem = findItemByScreenCoordinates(item.children, screenX, screenY);

        if (childrenItem) {
            return childrenItem;
        }

        const itemWorldPosition = item.worldPosition();
        const screenLocalPosition = { x: screenX - itemWorldPosition.x, y: screenY - itemWorldPosition.y };

        if (isPointInside(screenLocalPosition.x, screenLocalPosition.y, item)) {
            return { item, offset: { x: item.x - screenX, y: item.y - screenY } };
        }
    }

    return null;
}
