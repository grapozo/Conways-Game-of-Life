/**
 * Base game configurations
 */
const GAME_CONFIG = {
    CANVAS_SIZE: [5, 10],
    NUMBER_OF_CELLS: 5, // Has to be lower than the canvas size.
}

let GLOBAL_STATE = {
    currentCanvas: [],
    canvasContext: null,
}

/**
 * Sets up the canvas with the defined
 * configurations
 */
setupCanvas = () => {
    createCanvas(GAME_CONFIG.CANVAS_SIZE);

    GLOBAL_STATE.currentCanvas = generateCanvasMatrix(GAME_CONFIG.CANVAS_SIZE[0], GAME_CONFIG.CANVAS_SIZE[1]);

    const randomWidths = generateArrayWithRandomValues(
        GAME_CONFIG.NUMBER_OF_CELLS,
        GAME_CONFIG.CANVAS_SIZE[0] - 2
    );
    const randomHeights = generateArrayWithRandomValues(
        GAME_CONFIG.NUMBER_OF_CELLS,
        GAME_CONFIG.CANVAS_SIZE[1] - 2
    );

    drawPixelsOnCavas(
        "canvas",
        {
            widths: randomWidths,
            heights: randomHeights
        },
        GAME_CONFIG.NUMBER_OF_CELLS
    );
}

/**
 * Creates the canvas and appends it to the body element
 */
createCanvas = (canvasSize) => {
    let canvas = document.createElement('canvas');
    canvas.id = "canvas";
    canvas.width = canvasSize[0];
    canvas.height = canvasSize[1];
    let body = document.getElementsByTagName("body")[0];
    body.appendChild(canvas);
    GLOBAL_STATE.canvasContext = document.getElementById("canvas").getContext("2d")
}

/**
 * Given an array of positions and a max number of pixels, draw those
 * as pixels on a given canvas
 */
drawPixelsOnCavas = (canvasId, positions, numberOfPixels) => {
    let canvas = document.getElementById(canvasId);
    let ctx = canvas.getContext("2d");
    for (let index = 0; index < numberOfPixels; index++) {
        ctx.fillRect(positions.widths[index], positions.heights[index], 2, 2);
        GLOBAL_STATE.currentCanvas[positions.widths[index]][positions.heights[index]] = 1;
    }
    ctx.stroke();
}

/**
 * Generates and fills the canvas matrix, which is 
 * the max_width -1 per max_height - 1
 */
generateCanvasMatrix = (width, height) => {
    let canvasMatrix = Array.from(Array(width), () => new Array(height - 1));
    for (let widthIndex = 0; widthIndex < width - 1; widthIndex++) {
        for (let heightIndex = 0; heightIndex < height - 1; heightIndex++) {
            canvasMatrix[widthIndex][heightIndex] = 0;
        }
    }
    return canvasMatrix;
}

/**
 * Generates an Array with random numbers
 */
generateArrayWithRandomValues = (numberOfValues, maxValue) => {
    let arrayWithValues = []
    // Fills array with n values
    for (let index = 0; index < maxValue; index++) {
        arrayWithValues[index] = index;
    }
    // Shuffles it
    arrayWithValues = arrayWithValues.sort(() => Math.random() - 0.5);

    return arrayWithValues.slice(0, numberOfValues);
}

runGame = () => {
    function start() {
        verifyCells();
        setTimeout(start, 30000);
    }
    start();
}

verifyCells = () => {
    for (let widthIndex = 0; widthIndex < GLOBAL_STATE.currentCanvas.length - 1; widthIndex++) {
        for (let heightIndex = 0; heightIndex < GLOBAL_STATE.currentCanvas[0].length - 1; heightIndex++) {
            GLOBAL_STATE.currentCanvas[widthIndex][heightIndex] = 0;
            updateCanvas(widthIndex, heightIndex)
        }
    }
    GLOBAL_STATE.canvasContext.stroke();
}

updateCanvas = (width, height) => {
    GLOBAL_STATE.canvasContext.fillRect(width, height, 2, 2);
    GLOBAL_STATE.canvasContext.fillStyle = "white";
}
