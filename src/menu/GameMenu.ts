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
    
    registerTouchEvents()
    {
        this.game.app.stage.interactive = true
        this.game.app.stage
        .once('pointerdown', this.handlePlayTouchStart.bind(this))
    }

    enter(opts) {
        this.registerTouchEvents()
    }

    handlePlayTouchStart(event)
    {
        (this.game as any).key.space.onPress()
    }
    
    update(dt) {
        super.update(dt);
        
        if ((this.game as any).key.space.trigger()) {            
            this.game.setState('play', {restart: true});
        }
    }
}