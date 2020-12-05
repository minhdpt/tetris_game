import Game from '../Game'
import BaseMenu from './BaseMenu';


/**
 * Display Main Menu screen
 */
export default class GameMenu extends BaseMenu {
    game: Game
    constructor(game: Game) {
        super(game, 'PIXTRIS');        
        this.game = game;
    }
    
    update(dt) {
        super.update(dt);
        
        if ((this.game as any).key.space.trigger()) {
            // this.game.SoundManager.playSound('sfx_click')
            this.game.setState('play', {restart: true});
        }
    }
}