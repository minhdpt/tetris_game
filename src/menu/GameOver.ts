
import {Text} from 'pixi.js';
import SoundManager from '../manager/SoundManager';

import BaseMenu from './BaseMenu';


/**
 * Display Game Over screen
 */
export default class GameOver extends BaseMenu {
    scoreInfo: Text;
    constructor(game) {
        super(game, 'GAME\nOVER', 'Touch to restart');
        
        this.scoreInfo = new Text('Last score', this.info.style);
        this.scoreInfo.anchor.set(0.5);
        this.scoreInfo.x = this.game.app.view.width * 0.5;
        this.scoreInfo.y = this.game.app.renderer.height * 0.50;
        this.addChild(this.scoreInfo);
    }
    
    enter(opts) {
        this.registerTouchEvents()
        let score = this.game.scores.getNewest();
        this.scoreInfo.text = `Score: ${score.points}\nLines: ${score.lines}`;
        (this.game.SoundManager as SoundManager).playSound('sfx_gameover')
    }

    registerTouchEvents()
    {
        this.game.app.stage.interactive = true
        this.game.app.stage
        .once('pointerdown', this.handlePlayTouchStart.bind(this))
    }
    
    update(dt) {
        super.update(dt);
        
        if (this.game.key.space.trigger()) {
            this.game.setState('play', {restart: true});
            (this.game.SoundManager as SoundManager).stopdAllSound()
        }
    }

    handlePlayTouchStart(event)
    {
        (this.game as any).key.space.onPress()
    }
}
