import * as PIXI from 'pixi.js';
import { simpleTextStyle } from '../menu/BaseMenu';

export default class GamePlayGUI extends PIXI.Container {
    private scoreInfo: PIXI.Text
    private lineInfo: PIXI.Text

    constructor()
    {
        super()
        this.addBorder()
        this.addTexts()
    }

    private addBorder()
    {
        let left = new PIXI.Sprite(PIXI.Texture.WHITE);        
        left.width = 32;
        left.height = 800;
        left.tint = 0xff0050;
        this.addChild(left)
        
        let right = new PIXI.Sprite(PIXI.Texture.WHITE);
        right.x = 32 * 13
        right.width = 32;
        right.height = 800;
        right.tint = 0xff0050;
        this.addChild(right)

        let top = new PIXI.Sprite(PIXI.Texture.WHITE);
        top.width = 32 *13
        top.height = 32;
        top.tint = 0xff0050;
        this.addChild(top)

        let bottom = new PIXI.Sprite(PIXI.Texture.WHITE);
        bottom.y = 800 - 32
        bottom.width = 32 *13
        bottom.height = 32;
        bottom.tint = 0xff0050;
        this.addChild(bottom)
    }

    private addTexts()
    {
        this.scoreInfo = new PIXI.Text('Score: 0', simpleTextStyle)        
        this.scoreInfo.position = new PIXI.Point(32 * 15, 120)
        this.addChild(this.scoreInfo)

        this.lineInfo = new PIXI.Text('Lines: 0', simpleTextStyle)        
        this.lineInfo.position = new PIXI.Point(32 * 15, 150)
        this.addChild(this.lineInfo)
    }

    updateTexts(scores: number, lines: number)
    {
        this.scoreInfo.text = 'Score: ' + scores.toString()
        this.lineInfo.text = 'Lines: ' + lines.toString()
    }
    
}