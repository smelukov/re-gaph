import Creatable from './creatable.js';

export default class Input extends Creatable {
  init(sources) {
    this.sources = sources;
    this.handlerFn = this.handler.bind(this);

    for (const input of this.sources) {
      for (const event of input.getSupportedEvents()) {
        input.on(event, this.handlerFn);
      }
    }
  }

  handler(event) {
    if (event.name.startsWith('pointer-')) {
      this.handlePointer(event);
    } else if (event.name.startsWith('key-')) {
      this.handleKey(event);
    }
  }

  handlePointer(event) {
    const worldPosition = this.engine.screenToWorld(event.data.x, event.data.y);
    let data = this.engine.boundariesChecker.find(worldPosition.x, worldPosition.y);

    if (!data) {
      data = {
        item: this.engine.scene,
        offset: {
          x: this.engine.scene.x - event.data.x,
          y: this.engine.scene.y - event.data.y
        }
      }
    }

    event.target = data.item;
    event.data.item = data.item;
    event.data.offset = data.offset;

    let cursor = data.item;

    while (cursor && !event.stopped) {
      cursor.dispatch(event);
      cursor = cursor.parent;
    }
  }

  handleKey(event) {
    event.target = this.engine.scene;
    this.engine.scene.dispatch(event);
  }

  dispose() {
    for (const input of this.sources) {
      for (const event of input.getSupportedEvents()) {
        input.off(event, this.handlerFn);
      }
    }

    super.dispose();
  }
};
