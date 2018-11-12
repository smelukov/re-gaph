import * as shapes from './shapes.js';
import ResizeMarkers from './resizeMarkers.js';
import MouseInput from '../../engine/inputSource/mouseInput.js';
import TouchInput from '../../engine/inputSource/touchInput.js';
import KeyboardInput from '../../engine/inputSource/keyboardInput.js';
import Canvas2DRender from '../../engine/renderer/canvas2dRender.js';
import Engine from '../../engine/index.js';
import DnD from '../../engine/dnd.js';
import { isInsideEllipse, isInsidePoly } from '../../engine/boundariesChecker.js';

const shapesListNode = document.querySelector('.shapes');
const canvasNode = document.querySelector('#myCanvas');
const ctx = canvasNode.getContext('2d');
const canvas2DRender = new Canvas2DRender(ctx);
const isTouchDevice = window.hasOwnProperty('ontouchstart');
const input = [new KeyboardInput(canvasNode.parentNode), isTouchDevice ? new TouchInput(canvasNode) : new MouseInput(canvasNode)];
const engine = new Engine(canvas2DRender, input, { width: canvasNode.clientWidth, height: canvasNode.clientHeight });
const shapesLayer = engine.create.item();
const markersLayer = engine.create.item();
const shapeMap = {
    ellipse: shapes.Ellipse,
    quad: shapes.Quad,
    triangle: shapes.Triangle
};
let currentShape;
let currentFillColor = '#C6BAEE';
let currentStrokeColor = '#9D8CD7';
let currentStrokeWidth = 2;
const defaultWidth = 100;
const defaultHeight = 100;
const resizeMarkersMap = new Map();

engine.boundariesChecker.register([shapes.Quad, shapes.Triangle], (shape, x, y) => {
    return isInsidePoly(x, y, shape.getLocalVertices());
});
engine.boundariesChecker.register(shapes.Ellipse, (shape, x, y) => {
    return isInsideEllipse(x, y, shape.width / 2, shape.height / 2, shape.angle);
});


engine.scene.setChildren([shapesLayer, markersLayer]);
engine.start();

engine.scene.on('key-down', e => {
    if (e.data.key === 'Escape' && currentShape) {
        unselectShape(currentShape);
    } else if (e.data.key.toLowerCase() === 's' && e.data.metaKey) {
        e.originalEvent.preventDefault();
        saveImage();
    }
});

engine.scene.on('pointer-start', e => {
    if (e.target === engine.scene && currentShape) {
        unselectShape(currentShape);
    }
});

engine.scene.on('pointer-scroll', e => {
    if (currentShape) {
        const angle = currentShape.angle + e.data.deltaY / 100;

        currentShape.setRotation(angle);
        fitMarkers(currentShape);
    }
});

engine.scene.on('pointer-zoom', e => {
    if (currentShape) {
        const width = currentShape.width + e.data.factor;
        const height = currentShape.height + e.data.factor;

        currentShape.setSize(width, height);
        fitMarkers(currentShape);
    }
});

shapesListNode.addEventListener('click', e => {
    const shapeName = e.target.dataset.shape;

    if (shapeName && shapeMap.hasOwnProperty(shapeName)) {
        const shapeClass = shapeMap[shapeName];
        const shape = createShape(shapeClass, 0, 0);

        shapesLayer.addChild(shape);
        selectShape(shape);
    }
});

window.addEventListener('load', onResize);
window.addEventListener('resize', onResize);

function createShape(Class, x, y) {
    const shape = engine.create(Class, x, y, defaultWidth, defaultHeight);

    shape.setFillColor(currentFillColor);
    shape.setStrokeColor(currentStrokeColor);
    shape.setStrokeWidth(currentStrokeWidth);
    shape.on('pointer-start', () => {
        if (shape !== currentShape) {
            selectShape(shape);
        }
    });

    const dnd = new DnD(engine, shape);

    shape.dnd = dnd;
    shape.dnd.on('move', (e) => {
        shape.setPosition(e.data.xWithOffset, e.data.yWithOffset);
        fitMarkers(shape);
    });
    shape.on('dispose', () => dnd.dispose());

    return shape;
}

function onResize() {
    canvasNode.width = window.innerWidth;
    canvasNode.height = window.innerHeight;
    engine.setViewport({ width: window.innerWidth, height: window.innerHeight });
}

function selectShape(shape) {
    if (currentShape && currentShape !== shape) {
        const resizeMarkers = resizeMarkersMap.get(currentShape);

        if (resizeMarkers) {
            markersLayer.removeChild(resizeMarkers);
        }
    }

    const resizeMarkers = engine.create(ResizeMarkers, shape, 7);

    resizeMarkersMap.set(shape, resizeMarkers);
    markersLayer.addChild(resizeMarkers);

    currentShape = shape;
}

function unselectShape(shape) {
    const resizeMarkers = resizeMarkersMap.get(shape);

    shape.dnd.cancel();

    if (resizeMarkers) {
        markersLayer.removeChild(resizeMarkers);
        resizeMarkers.dispose();
        resizeMarkersMap.delete(shape);
    }

    currentShape = null;
}


function fitMarkers(shape) {
    const resizeMarkers = resizeMarkersMap.get(shape);

    if (resizeMarkers) {
        resizeMarkers.fitToShape();
    }
}

function saveImage() {
    const element = document.createElement('a');
    const image = canvasNode.toDataURL();

    element.setAttribute('href', image);
    element.setAttribute('download', 'image.png');
    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
