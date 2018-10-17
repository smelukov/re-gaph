const classMap = new Map();

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

export function register(shapeClass, fn) {
    shapeClass = Array.isArray(shapeClass) ? shapeClass : [shapeClass];
    shapeClass.forEach(shapeClass => classMap.set(shapeClass, fn));
}

export function check(x, y, shape) {
    if (shape.skipSelfBoundariesCheck) {
        return false;
    }

    let cursor = shape.constructor;
    let fn;

    while (cursor) {
        fn = classMap.get(cursor);

        if (fn) {
            break;
        }

        cursor = Object.getPrototypeOf(cursor);
    }

    if (fn) {
        return fn(shape, x, y);
    }

    return false;
}
