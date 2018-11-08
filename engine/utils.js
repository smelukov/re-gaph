export const rad360Deg = 360 * Math.PI / 180;
export const degToRad = 180 / Math.PI;

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

export function distance(...args) {
    let result = 0;
    let prev = args[0];

    for (let i = 1; i < args.length; i++) {
        const current = args[i];

        result += Math.sqrt((current.x - prev.x) ** 2 + (current.y - prev.y) ** 2);
        prev = current;
    }


    return result;
}

export function midPoint(a, b) {
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

export function distanceSign(a, b, point) {
    point = point || midPoint(a, b);
    return Math.sign((b.x - a.x) * (point.y - a.y) - (b.y - a.y) * (point.x - a.x)) || 1;
}

export function pointAngle(a, b) {
    return Math.atan2(b.y - a.y, b.x - a.x)
}
