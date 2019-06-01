/**
 * Base game configurations
 */
const GAME_CONFIG = {
    CANVAS_SIZE: {
        WIDTH: 400,
        HEIGHT: 400
    },
    MAX_NUMBER_OF_STARTING_CELLS: 100,
    CELL_SIDE_SIZE: 5, // Remember that the cell is a square
    RANDOM_CELL_QUOTA: 10
}

let gameState = {
    currentCanvas: null,
    oldCanvas: null,
    numberOfColumns: null,
    numberOfRows: null,
    aliveCells: 0,
}

function setup() {
    generateCanvasMatrix();
    createCanvas(
        GAME_CONFIG.CANVAS_SIZE.WIDTH,
        GAME_CONFIG.CANVAS_SIZE.HEIGHT
    );
    frameRate(15); // Attempt to refresh at starting FPS
}

function draw() {
    for (let widthIndex = 0; widthIndex < gameState.numberOfColumns; widthIndex++) {
        for (let heightIndex = 0; heightIndex < gameState.numberOfRows; heightIndex++) {
            const width = widthIndex * GAME_CONFIG.CELL_SIDE_SIZE;
            const height = heightIndex * GAME_CONFIG.CELL_SIDE_SIZE;
            if (gameState.currentCanvas[widthIndex][heightIndex] == 1) {
                fill('cyan');
                stroke('cyan');
            } else {
                stroke('purple')
                fill('purple');
            }
            square(width, height, GAME_CONFIG.CELL_SIDE_SIZE);
        }
    }
    iterateCanvas();
}

/**
 * Generates and fills the canvas matrix
 */
function generateCanvasMatrix() {

    gameState.numberOfColumns = GAME_CONFIG.CANVAS_SIZE.WIDTH / GAME_CONFIG.CELL_SIDE_SIZE;
    gameState.numberOfRows = GAME_CONFIG.CANVAS_SIZE.HEIGHT / GAME_CONFIG.CELL_SIDE_SIZE;

    let canvasMatrix = Array.from(Array(gameState.numberOfColumns), () => new Array(gameState.numberOfRows));
    for (let widthIndex = 0; widthIndex < gameState.numberOfColumns; widthIndex++) {
        for (let heightIndex = 0; heightIndex < gameState.numberOfRows; heightIndex++) {
            if (GAME_CONFIG.MAX_NUMBER_OF_STARTING_CELLS > gameState.aliveCells) {
                let randomNumber = Math.floor(random(GAME_CONFIG.RANDOM_CELL_QUOTA));
                if (randomNumber === 1) {
                    gameState.aliveCells++;
                    canvasMatrix[widthIndex][heightIndex] = randomNumber;
                } else {
                    canvasMatrix[widthIndex][heightIndex] = 0;
                }
            } else {
                canvasMatrix[widthIndex][heightIndex] = 0;
            }
        }
    }
    gameState.currentCanvas = canvasMatrix;
    gameState.oldcanvas = canvasMatrix;
}

/**
 * Iterates through the canvas and 
 * verify each cell
 */
function iterateCanvas() {
    for (let columns = 0; columns < gameState.numberOfColumns; columns++) {
        for (let rows = 0; rows < gameState.numberOfRows; rows++) {
            let middleSum = countNeighbors(columns, rows, false);
            let topSum = 0;
            let bottomSum = 0;
            let isCellDead = gameState.oldcanvas[columns][rows] == 0 ? true : false;
            if (rows !== 0 && rows <= gameState.numberOfRows - 1) {
                topSum = countNeighbors(columns, rows - 1, true)
            }
            if (rows < gameState.numberOfRows - 1) {
                bottomSum = countNeighbors(columns, rows + 1, true)
            }
            let totalSum = topSum + middleSum + bottomSum;
            if (isCellDead) {
                if (totalSum === 3) {
                    gameState.currentCanvas[columns][rows] = 1;
                }
            } else {
                if(totalSum < 2 || totalSum > 3){
                    gameState.currentCanvas[columns][rows] = 0;
                }
            }    
        }
    }
    gameState.oldCanvas = gameState.currentCanvas;
}

/**
 * Counts a cell's neighbors
 */
function countNeighbors(column, row, countMiddle) {
    let sum = 0;
    if (column !== 0 && column < gameState.numberOfColumns - 1) {
        sum += gameState.oldcanvas[column - 1][row]
        sum += gameState.oldcanvas[column + 1][row]
    } else if (column == 0) {
        sum += gameState.oldcanvas[column + 1][row]
    }
    else if (column == gameState.numberOfColumns - 1) {
        sum += gameState.oldcanvas[column - 1][row]
    }
    if (countMiddle) {
        sum += gameState.oldcanvas[column][row]
    }
    return sum;
}
