import * as PIXI from 'pixi.js';
import Renderer from './Renderer';
import Tetromino from './Tetromino';
/**
 * Render board and avtive teromino using PIXI.js
 */
export default class NextTetRenderer extends Renderer {
    rows: any;
    cols: any;
    rowsOffset: any;
    blockSize: any;
    textures: PIXI.ITextureDictionary;
    sprites: PIXI.Sprite[][];

    constructor(rows: number, cols: number, rowsOffset: number, colOffset: number, blockSize: number) {
        super(rows, cols, rowsOffset, colOffset, blockSize, 32 * 15, 32 * 7);
    }    
    
    updateFromTetromino(tetromino:Tetromino) {        
        if (tetromino) {
            this.reset()
            tetromino.shape.forEach(pos => {
                this.updateColor(pos[0], pos[1], tetromino.color);
            });
        }
    }

    reset()
    {
        for (let i = 0; i < this.rows; ++i) {            
            for (let j = 0; j < this.cols; ++j) {
                this.updateColor(i, j, this.textures.background)
            }
        }
    }
}