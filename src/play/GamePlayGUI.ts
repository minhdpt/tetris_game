import * as PIXI from 'pixi.js';
import config from '../config';
import { simpleTextStyle } from '../menu/BaseMenu';
import NextTetRenderer from './NextTetRenderer';
import Tetromino from './Tetromino';

export default class GamePlayGUI extends PIXI.Container {
    private scoreInfo: PIXI.Text
    private lineInfo: PIXI.Text
    private nextTetroMino: NextTetRenderer

    constructor()
    {
        super()
        this.addBorder()
        this.addTexts()
        this.addNextTetromino()
    }

    private addBorder()
    {
        let left = new PIXI.Sprite(PIXI.Texture.WHITE);        
        left.width = config.display.blockSize;
        left.height = 800;
        left.tint = 0xff0050;
        this.addChild(left)
        
        let right = new PIXI.Sprite(PIXI.Texture.WHITE);
        right.x = config.display.blockSize * 13
        right.width = config.display.blockSize;
        right.height = 800;
        right.tint = 0xff0050;
        this.addChild(right)

        let top = new PIXI.Sprite(PIXI.Texture.WHITE);
        top.width = config.display.blockSize *13
        top.height = config.display.blockSize;
        top.tint = 0xff0050;
        this.addChild(top)

        let bottom = new PIXI.Sprite(PIXI.Texture.WHITE);
        bottom.y = 800 - config.display.blockSize
        bottom.width = config.display.blockSize *13
        bottom.height = config.display.blockSize;
        bottom.tint = 0xff0050;
        this.addChild(bottom)
    }

    private addTexts()
    {
        this.scoreInfo = new PIXI.Text('Score: 0', simpleTextStyle)
        this.scoreInfo.position = new PIXI.Point(config.display.blockSize * 15, 120)
        this.addChild(this.scoreInfo)

        this.lineInfo = new PIXI.Text('Lines: 0', simpleTextStyle)        
        this.lineInfo.position = new PIXI.Point(config.display.blockSize * 15, 150)
        this.addChild(this.lineInfo)
    }

    addNextTetromino()
    {
        let text = new PIXI.Text('Next: ', simpleTextStyle)
        text.position = new PIXI.Point(config.display.blockSize * 15, 180)
        this.addChild(text)
        this.nextTetroMino = new NextTetRenderer(4, 4, 0, 0, config.display.blockSize)
        this.addChild(this.nextTetroMino)
        
    }

    updateTexts(scores: number, lines: number)
    {
        this.scoreInfo.text = 'Score: ' + scores.toString()
        this.lineInfo.text = 'Lines: ' + lines.toString()
    }

    updateNextTetro(tetro: Tetromino)
    {
        this.nextTetroMino.updateFromTetromino(tetro)
    }
    
}