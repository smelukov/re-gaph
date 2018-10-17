export default class Layer {
    constructor() {
        this.items = [];
    }

    add(item) {
        if (!this.items.includes(item)) {
            this.items.push(item);
        }
    }

    remove(item) {
        const index = this.items.indexOf(item);

        if (index > -1) {
            this.items.splice(index, 1);
        }
    }
}
