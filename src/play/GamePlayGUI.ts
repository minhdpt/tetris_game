import * as PIXI from 'pixi.js';
export default class GamePlayGUI extends PIXI.Container {
    constructor()
    {
        super()
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
}