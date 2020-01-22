import Disposable from '@regraph/disposable';

export default class Canvas2DRender extends Disposable {
  constructor(ctx) {
    super();
    this.ctx = ctx;
  }

  beginPath() {
    this.ctx.beginPath();
  }

  closePath() {
    this.ctx.closePath();
  }

  ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
    this.ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);
  }

  setFillStyle(style) {
    this.ctx.fillStyle = style;
  }

  fill() {
    this.ctx.fill();
  }

  setLineWidth(width) {
    this.ctx.lineWidth = width;
  }

  setStrokeStyle(style) {
    this.ctx.strokeStyle = style;
  }

  stroke() {
    this.ctx.stroke();
  }

  rect(x, y, width, height) {
    this.ctx.rect(x, y, width, height);
  }

  moveTo(x, y) {
    this.ctx.moveTo(x, y);
  }

  lineTo(x, y) {
    this.ctx.lineTo(x, y);
  }

  clearRect(x, y, width, height) {
    this.ctx.clearRect(x, y, width, height);
  }

  setTransform(...matrix) {
    this.ctx.setTransform(...matrix);
  }

  save() {
    this.ctx.save();
  }

  translate(x, y) {
    this.ctx.translate(x, y);
  }

  rotate(rad) {
    this.ctx.rotate(rad);
  }

  restore() {
    this.ctx.restore();
  }

  setFont(font) {
    this.ctx.font = font;
  }

  fillText(string, x, y, maxWidth) {
    this.ctx.fillText(string, x, y, maxWidth);
  }

  dispose() {
    this.ctx = null;
    super.dispose();
  }
}
