import * as shapes from './shapes.js';
import ResizeMarkers from './resizeMarkers.js';
import MouseInput from '../engine/input/mouseInput.js';
import TouchInput from '../engine/input/touchInput.js';
import Canvas2DRender from '../engine/renderer/canvas2dRender.js';
import Engine from '../engine/index.js';
import DnD from '../engine/dnd.js';

const shapesListNode = document.querySelector('.shapes');
const canvasNode = document.querySelector('#myCanvas');
const ctx = canvasNode.getContext('2d');
const canvas2DRender = new Canvas2DRender(ctx);
const isTouchDevice = window.hasOwnProperty('ontouchstart');
const input = [isTouchDevice ? new TouchInput(canvasNode) : new MouseInput(canvasNode)];
const engine = new Engine(canvas2DRender, input, { width: canvasNode.clientWidth, height: canvasNode.clientHeight });
const shapesLayer = engine.createLayer('shapes');
const markersLayer = engine.createLayer('markers');
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

engine.start();

document.addEventListener('keydown', e => {
    if (e.keyCode === 27 && currentShape) {
        unselectShape(currentShape);
    }
});

shapesListNode.addEventListener('click', e => {
    const shapeName = e.target.dataset.shape;

    if (shapeName && shapeMap.hasOwnProperty(shapeName)) {
        const shapeClass = shapeMap[shapeName];
        const shape = createShape(shapeClass, 0, 0);

        shapesLayer.add(shape);
        selectShape(shape);
    }
});

engine.stage.on('pointer-start', e => {
    if (e.target === engine.stage) {
        unselectShape(currentShape);
    }
});

engine.stage.on('pointer-scroll', e => {
    if (e.target !== engine.stage && currentShape) {
        const angle = currentShape.angle + e.data.deltaY / 100;

        currentShape.setRotation(angle);
        fitMarkers(currentShape);
    }
});

engine.stage.on('pointer-zoom', e => {
    if (e.target !== engine.stage && currentShape) {
        const width = currentShape.width + e.data.factor;
        const height = currentShape.height + e.data.factor;

        currentShape.setSize(width, height);
        fitMarkers(currentShape);
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

    dnd.on('move', (e) => {
        shape.setPosition(e.data.xWithOffset, e.data.yWithOffset);
        fitMarkers(shape);
    });

    shape.on('dispose', () => dnd.dispose());

    return shape;
}

function onResize() {
    canvasNode.width = window.innerWidth;
    canvasNode.height = window.innerHeight;
}

function selectShape(shape) {
    if (currentShape && currentShape !== shape) {
        const resizeMarkers = resizeMarkersMap.get(currentShape);

        if (resizeMarkers) {
            markersLayer.remove(resizeMarkers);
        }
    }

    const resizeMarkers = engine.create(ResizeMarkers, shape, 7);

    resizeMarkersMap.set(shape, resizeMarkers);
    markersLayer.add(resizeMarkers);

    currentShape = shape;
}

function unselectShape(shape) {
    const resizeMarkers = resizeMarkersMap.get(shape);

    if (resizeMarkers) {
        markersLayer.remove(resizeMarkers);
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
