import { Quad } from './shapes.js';

export default class Marker extends Quad {
  init(size) {
    super.init(0, 0, size, size);

    this.setFillColor('white');
    this.setStrokeColor('black');
    this.setStrokeWidth(1);

    this.on('pointer-start', e => {
      e.stop();
    })
  }
}
