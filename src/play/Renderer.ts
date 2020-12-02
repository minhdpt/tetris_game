
import * as PIXI from 'pixi.js';
import Game from '../Game'
/**
 * Render board and avtive teromino using PIXI.js
 */
export default class Renderer extends PIXI.Container {
    rows: any;
    cols: any;
    rowsOffset: any;
    blockSize: any;
    textures: PIXI.ITextureDictionary;
    sprites: PIXI.Sprite[][];
    
    /**
     * Initialize renderer
     * @param {Number} rows       Number of visible rows
     * @param {Number} cols       Number of visible columns
     * @param {Number} rowsOffset Number of rows in model to skip from rendering
     * @param {Number} blockSize  Target block size
     */
    constructor(rows: number, cols: number, rowsOffset: number, blockSize: number) {
        super();
        
        this.rows = rows;
        this.cols = cols;
        this.rowsOffset = rowsOffset;
        this.blockSize = blockSize;
                
        this.textures =  Game.instance.app.loader.resources['assets/sprites.json'].textures
        
        this.sprites = [];
        
        for (let i = 0; i < this.rows; ++i) {
            let row: PIXI.Sprite[] = [];
            for (let j = 0; j < this.cols; ++j) {
                let spr = new PIXI.Sprite(this.textures.background);
                row.push(spr);
                spr.x = j * this.blockSize;
                spr.y = i * this.blockSize;
                (spr as any).blockColor = null;
                this.addChild(spr);
            }
            this.sprites.push(row);
        }
    }
    
    updateColor(row, col, color) {
        if(row < 0) return;
        let sprite = this.sprites[row][col];
        if ((sprite as any).blockColor != color) {
            (sprite as any).blockColor = color;
            sprite.texture = this.textures[color] || this.textures.background;
        }
    }
    
    updateFromBoard(board) {
        for (let i = 0; i < this.rows; ++i) {
            for (let j = 0; j < this.cols; ++j) {
                this.updateColor(i, j, board.get(i + this.rowsOffset, j));
            }
        }
    }
    
    updateFromTetromino(tetromino) {
        if (tetromino) {
            tetromino.absolutePos().forEach(pos => {
                this.updateColor(pos[0] - this.rowsOffset, pos[1], tetromino.color);
            });
        }
    }
}