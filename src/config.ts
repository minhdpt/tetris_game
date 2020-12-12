
export const game = {
    // board dimensions
    cols: 12,
    rows: 25 ,
    hiddenRows: 0,
    hiddenCols: 1,
    // number of frames between block falls one row
    fallSpeed: 30,
    fallSpeedMin: 3,
    fallSpeedupStep: 1,
    fallSpeedupDelay: 1800,
    // block will fall this time faster when drop key pressed
    dropModifier: 60
}

const SPRITE_SIZE = 32;

export const display = {
    // currently hardcoded block sprite size
    blockSize: SPRITE_SIZE,
    width: 640,//game.cols * SPRITE_SIZE,
    height: 800//game.rows * SPRITE_SIZE
}

export const controls = {
    // controls key repeat speed
    repeatDelay: 2,
    initialRepeatDelay: 10
}

export default {game, display, controls};
