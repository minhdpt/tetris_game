import * as PIXI from 'pixi.js';

import ScoreTable from './utils/ScoreTable';
import Keyboard from './utils/Keyboard';
import GamePlay from './play/GamePlay';
import GameMenu from './menu/GameMenu';
import GameOver from './menu/GameOver';
import GamePaused from './menu/GamePaused';
import SoundManager from './manager/SoundManager';
import config from './config';
import CustomEventListener from './base/CustomEventListener';
var Victor = require('victor');

/**
 * Represent whole game and handles state changes
 */
export default class Game{
    public static instance: Game
    app: PIXI.Application
    gameStates: {}
    state: any = null
    key: Keyboard
    scores: ScoreTable

    bgSprite: PIXI.Sprite
    dragging: boolean = false
    touchStart
    constructor(app) {
        Game.instance = this
        this.app = app        
        this.gameStates = {}
        this.state = null
        this.dragging = false        
    }

    loadResources()
    {
        Game.SoundManager.loadAll()
    }
    
    /**
     * start game, execute after all assets are loaded
     */
    run() {
        let resources = this.app.loader.resources        
        let background = new PIXI.TilingSprite(
            resources['assets/sprites.json'].textures["background"],
            this.app.renderer.width,
            this.app.renderer.height);
        this.app.stage.addChild(background);
        this.bgSprite = background

        
        this.app.stage.interactive = true
        background.interactive = true
        background.buttonMode = true;
        // this.app.stage.once('pointerdown', () =>{
        //     console.log('pointer down!')
        // })

        this.app.stage
        .on('pointerdown', this.onDragStart.bind(this))
        .on('pointerup', this.onDragEnd.bind(this))
        .on('pointerupoutside', this.onDragEnd.bind(this))
        .on('pointermove', this.onDragMove.bind(this));
        
        // window.document.addEventListener('pointermove', () =>{
        //     console.log('pointer down 2!')
        // })
        this.key = new Keyboard();
        this.scores = new ScoreTable();
        
        // define available game states
        this.addState('play', new GamePlay(this));
        this.addState('pause', new GamePaused(this));
        this.addState('menu', new GameMenu(this));
        this.addState('gameover', new GameOver(this));
        
        // set initial state
        this.setState('menu');
        
        // start the updates
        this.app.ticker.add(this.update, this);
    }
    
    /**
     * Add new state
     * @param {String} stateName
     * @param {State} state     new state instance
     */
    addState(stateName, state) {
        this.gameStates[stateName] = state;
        this.app.stage.addChild(state);
    }
    
    /**
     * Handle game update 
     * @param {Number} dt PIXI timer deltaTime
     */
    update(dt) {
        if (this.state) {
            this.state.update(dt);
        }
    }
    
    /**
     * changes current state
     * @param {String} stateName
     * @param {Object} opts additional options passed by previous state                    
     */
    setState(stateName: string, opts?) {
        let oldState = this.state;
        
        this.state = null;
        
        if (oldState) {
            if (!opts.keepVisible) {
                oldState.visible = false;
            }
            oldState.exit(opts);
        }
        
        let newState = this.gameStates[stateName];
        newState.enter(opts);
        newState.visible = true;
        this.state = newState;
    }

    public static get SoundManager(): SoundManager {
        return SoundManager.getInstance<SoundManager>();
    }

    onDragStart(event)    
    {
        
        let startPos = event.data.getLocalPosition(this.app.stage);
        this.touchStart = new Victor(startPos.x, startPos.y)
        //console.log('touch draging start' + this.touchStart)
        
    }

    onDragMove(event)    
    {
        // this.dragging = true
        // if(this.dragging)
        {
            
            let endPos = event.data.getLocalPosition(this.app.stage);
            
            let touchEnd = new Victor(endPos.x, endPos.y)
            console.log('points  ' + this.touchStart + '---' + touchEnd)
            // let distance = touchEnd.distance(this.touchStart)
            let dir = touchEnd.clone()
            dir.subtract(this.touchStart)
            if(dir.y > 5 || dir.x > 5)
            {
                this.dragging = true
            }
            // let colNum = distance / config.display.blockSize
            // console.log('touch move with ' + colNum)
            // console.log('touch move with x ' + dir)
            if(dir.x < -config.display.blockSize)
            {
                CustomEventListener.dispatchEvent('move left')
                this.touchStart = touchEnd
            }

            if(dir.x > config.display.blockSize)
            {
                CustomEventListener.dispatchEvent('move right')
                this.touchStart = touchEnd
            }

            if(dir.y > 20)
            {
                CustomEventListener.dispatchEvent('down')
            }
            // console.log('dir.x ' + dir.x )
            // CustomEventListener.dispatchEvent('touch end')

            
        }
        
    }    
    onDragEnd(event)    
    {        
        this.touchStart = 0
        if(this.dragging)
        {
            CustomEventListener.dispatchEvent('touch end')
        }else
        {
            CustomEventListener.dispatchEvent('tap')
        }

        
        this.dragging = false
    }
}
