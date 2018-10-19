import { degToRad } from './utils.js';

export default class TransformationMatrix {
    static identity() {
        return [1, 0, 0, 1, 0, 0];
    }

    constructor(...args) {
        if (args.length) {
            this.set(...args);
        } else {
            this.setToIdentity();
        }
    }

    setToIdentity() {
        this.set(...TransformationMatrix.identity())
    }

    get() {
        return [this.scaleX, this.skewX, this.skewY, this.scaleY, this.moveX, this.moveY];
    }

    set(...args) {
        this.scaleX = args[0];
        this.skewX = args[1];
        this.skewY = args[2];
        this.scaleY = args[3];
        this.moveX = args[4];
        this.moveY = args[5];
    }

    rotate(rad) {
        this.set(
            this.scaleX + Math.cos(rad),
            this.skewX + Math.sin(rad),
            this.skewY - Math.sin(rad),
            this.scaleY + Math.cos(rad)
        );
    }

    rotateTo(rad) {
        this.scaleX = Math.cos(rad);
        this.skewX = Math.sin(rad);
        this.skewY = -Math.sin(rad);
        this.scaleY = Math.cos(rad);
    }

    rotateDeg(deg) {
        this.rotate(deg * degToRad);
    }

    move(x, y) {
        this.moveX += x;
        this.moveY += y;
    }

    moveTo(x, y) {
        this.moveX = x;
        this.moveY = y;
    }

    scale(x, y) {
        this.scaleX += x;
        this.scaleY += y;
    }

    scaleTo(x, y) {
        this.scaleX = x;
        this.scaleY = y;
    }

    multiply(matrix) {
        /*
        scaleX skewY  moveX
        skewX  scaleY moveY
        0      0      1
        */
        const newMatrix = new TransformationMatrix();

        newMatrix.scaleX = this.scaleX * matrix.scaleX + this.skewY * matrix.skewX + this.moveX * 0;
        newMatrix.skewY = this.scaleX * matrix.skewY + this.skewY * matrix.scaleY + this.moveX * 0;
        newMatrix.moveX = this.scaleX * matrix.moveX + this.skewY * matrix.moveY + this.moveX * 1;
        newMatrix.skewX = this.skewX * matrix.scaleX + this.scaleY * matrix.skewX + this.moveY * 0;
        newMatrix.scaleY = this.skewX * matrix.skewY + this.scaleY * matrix.scaleY + this.moveY * 0;
        newMatrix.moveY = this.skewX * matrix.moveX + this.scaleY * matrix.moveY + this.moveY * 1;

        return newMatrix;
    }
}
