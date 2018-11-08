import { applyRotation } from '../../engine/utils.js';
import Item from '../../engine/item.js';

export class Shape extends Item {
    init(x, y, width, height) {
        super.init(x, y, 0);
        this.setSize(width, height);
    }

    setStrokeColor(color) {
        this.strokeColor = color;
    }

    setFillColor(color) {
        this.fillColor = color;
    }

    setStrokeWidth(width) {
        this.strokeWidth = width;
    }

    getLocalVertices() {
        throw new Error('this is an abstract shape');
    }
}


export class Ellipse extends Shape {
    draw(render) {
        render.beginPath();

        render.ellipse(0, 0, this.width / 2, this.height / 2, 0, 0, 2 * Math.PI);

        render.setFillStyle(this.fillColor);
        render.fill();
        render.setLineWidth(this.strokeWidth);
        render.setStrokeStyle(this.strokeColor);
        render.stroke();
    }

    getLocalVertices() {
        return [];
    }
}

export class Quad extends Shape {
    draw(render) {
        render.beginPath();

        render.rect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );

        render.setFillStyle(this.fillColor);
        render.fill();
        render.setLineWidth(this.strokeWidth);
        render.setStrokeStyle(this.strokeColor);
        render.stroke();
    }

    getLocalVertices() {
        return [
            applyRotation(-this.width / 2, -this.height / 2, this.worldAngle()),
            applyRotation(this.width / 2, -this.height / 2, this.worldAngle()),
            applyRotation(this.width / 2, this.height / 2, this.worldAngle()),
            applyRotation(-this.width / 2, this.height / 2, this.worldAngle())
        ];
    }
}

export class Triangle extends Shape {
    draw(render) {
        render.beginPath();

        render.moveTo(0, -this.height / 2);
        render.lineTo(this.width / 2, this.height / 2);
        render.lineTo(-this.width / 2, this.height / 2);
        render.closePath();

        render.setFillStyle(this.fillColor);
        render.fill();
        render.setLineWidth(this.strokeWidth);
        render.setStrokeStyle(this.strokeColor);
        render.stroke();
    }

    getLocalVertices() {
        return [
            applyRotation(0, -this.height / 2, this.worldAngle()),
            applyRotation(this.width / 2, this.height / 2, this.worldAngle()),
            applyRotation(-this.width / 2, this.height / 2, this.worldAngle())
        ];
    }
}
