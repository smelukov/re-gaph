import { Quad } from './shapes.js';
import Marker from './resizeMarker.js';
import DnD from '../../engine/dnd.js';
import { distance as getDistance } from '../../engine/utils.js';

export default class ResizeMarkers extends Quad {
    init(shape, markerSize) {
        super.init(shape.x, shape.y, shape.angle);

        this.markerSize = markerSize;
        this.skipSelfBoundariesCheck = true;
        this.skipSelfDraw = true;
        this.targetShape = shape;
        this.markers = {
            topLeft: this.createMarker(true, true),
            topMiddle: this.createMarker(false, true),
            topRight: this.createMarker(true, true),

            middleRight: this.createMarker(true),

            bottomRight: this.createMarker(true, true),
            bottomMiddle: this.createMarker(false, true),
            bottomLeft: this.createMarker(true, true),

            middleLeft: this.createMarker(true)
        };

        this.addChildren(
            this.markers.topLeft,
            this.markers.topMiddle,
            this.markers.topRight,
            this.markers.middleRight,
            this.markers.bottomRight,
            this.markers.bottomMiddle,
            this.markers.bottomLeft,
            this.markers.middleLeft
        );

        this.fitToShape();
    }

    createMarker(changeWidth, changeHeight) {
        const marker = this.engine.create(Marker, this.markerSize);

        marker.dnd = new DnD(this.engine, marker);
        marker.dnd.on('start', e => {
            marker.start = {
                x: this.targetShape.x,
                y: this.targetShape.y,
                width: this.targetShape.width,
                height: this.targetShape.height
            };
            marker.start.distance = getDistance(marker.start, e.data);
        });

        marker.dnd.on('move', e => {
            const distance = getDistance(marker.start, e.data);
            let diff = distance - marker.start.distance;

            if (changeWidth) {
                this.targetShape.setWidth(marker.start.width + diff * 2);
            }

            if (changeHeight) {
                this.targetShape.setHeight(marker.start.height + diff * 2);
            }

            this.fitToShape();
        });

        return marker;
    }

    fitToShape() {
        this.setPosition(this.targetShape.x, this.targetShape.y);
        this.setRotation(this.targetShape.angle);
        this.setSize(this.targetShape.width, this.targetShape.height);

        this.markers.topLeft.setLocalPosition(-this.width / 2, -this.height / 2);
        this.markers.topLeft.setRotation(-this.angle);
        this.markers.topMiddle.setLocalPosition(0, -this.height / 2);
        this.markers.topMiddle.setRotation(-this.angle);
        this.markers.topRight.setLocalPosition(this.width / 2, -this.height / 2);
        this.markers.topRight.setRotation(-this.angle);

        this.markers.middleRight.setLocalPosition(this.width / 2, 0);
        this.markers.middleRight.setRotation(-this.angle);

        this.markers.bottomRight.setLocalPosition(this.width / 2, this.height / 2);
        this.markers.bottomRight.setRotation(-this.angle);
        this.markers.bottomMiddle.setLocalPosition(0, this.height / 2);
        this.markers.bottomMiddle.setRotation(-this.angle);
        this.markers.bottomLeft.setLocalPosition(-this.width / 2, this.height / 2);
        this.markers.bottomLeft.setRotation(-this.angle);

        this.markers.middleLeft.setLocalPosition(-this.width / 2, 0);
        this.markers.middleLeft.setRotation(-this.angle);
    }

    dispose() {
        this.markers.topLeft.dnd.dispose();
        this.markers.topLeft.dispose();
        this.markers.topMiddle.dnd.dispose();
        this.markers.topMiddle.dispose();
        this.markers.topRight.dnd.dispose();
        this.markers.topRight.dispose();
        this.markers.middleRight.dnd.dispose();
        this.markers.middleRight.dispose();
        this.markers.bottomRight.dnd.dispose();
        this.markers.bottomRight.dispose();
        this.markers.bottomMiddle.dnd.dispose();
        this.markers.bottomMiddle.dispose();
        this.markers.bottomLeft.dnd.dispose();
        this.markers.bottomLeft.dispose();
        this.markers.middleLeft.dnd.dispose();
        this.markers.middleLeft.dispose();
        this.targetShape = null;
        super.dispose();
    }
}
