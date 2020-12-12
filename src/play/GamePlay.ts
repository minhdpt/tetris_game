import Constant from '../common/Constants';
import config from '../config';
import SoundManager from '../manager/SoundManager';
import State from '../utils/State';
import Board from './Board';
import GamePlayGUI from './GamePlayGUI';
import Renderer from './Renderer';
import Tetromino from './Tetromino';
import TetronimoSpawner from './TetronimoSpawner';
var Victor = require('victor');
/**
 * GamePlay state provides main game logic
 */
export default class GamePlay extends State {
    game: any;
    board: any;
    spawner: TetronimoSpawner;
    tetromino: Tetromino;
    renderer: Renderer;
    gui: GamePlayGUI;
    tetrominoFallSpeed: number;
    tetrominoFallSpeedMin: number;
    tetrominoFallSpeedupStep: number;
    tetrominoFallSpeedupDelay: number;
    tetrominoDropModifier: number;
    tetrominoFallTimer: any;
    tetrominoFallSpeedupTimer: any;
    rowsCleared: number;
    score: number;
    dragging: boolean = false
    touchStart = null
    isSpeedUp: boolean = false

    constructor(game) {
        super();
        
        this.game = game;
        
        this.board = null;
        this.spawner = null;
        this.tetromino = null;
        
        this.renderer = new Renderer(config.game.rows, config.game.cols, config.game.hiddenRows, config.game.hiddenCols, config.display.blockSize);
        this.addChild(this.renderer);

        this.gui = new GamePlayGUI()
        this.addChild(this.gui)

        this.registerTouchEvents()
    }

    registerTouchEvents()
    {
        this.game.app.stage.interactive = true
        this.game.app.stage
        .on('pointerdown', this.handlePlayTouchStart.bind(this))
        .on('pointerup', this.handlePlayTouchEnd.bind(this))
        .on('pointerupoutside', this.handlePlayTouchEnd.bind(this))
        .on('pointermove', this.handlePlayTouchMove.bind(this));
    }
    
    /**
     * Reset game
     */
    enter(opts) {
        if (opts.restart || this.board == null) {
            this.board = new Board(config.game.rows + config.game.hiddenRows, config.game.cols);
            this.spawner = new TetronimoSpawner();

            this.tetromino = null;
            this.tetrominoFallSpeed = config.game.fallSpeed;
            this.tetrominoFallSpeedMin = config.game.fallSpeedMin;
            this.tetrominoFallSpeedupStep = config.game.fallSpeedupStep;
            this.tetrominoFallSpeedupDelay = config.game.fallSpeedupDelay;
            this.tetrominoDropModifier = config.game.dropModifier;

            this.tetrominoFallTimer = this.tetrominoFallSpeed;
            this.tetrominoFallSpeedupTimer = this.tetrominoFallSpeedupDelay;

            this.rowsCleared = 0;
            this.score = 0;

            this.spawnTetromino();
            (this.game.SoundManager as SoundManager).playSound('bgm_gameplay', !true)
        }
    }
    
    /**
     * Main update funcion
     * @param {Number} dt pixi timer deltaTime
     */
    update(dt) {
        
        if (this.tetromino) {
            this.updateTetromino();
        }
        
        this.renderer.updateFromBoard(this.board);
        this.renderer.updateFromTetromino(this.tetromino);
        this.gui.updateNextTetro(this.spawner.next())
    }
    
    /**
     * Spawn new active tetromino and test for end game condition
     */
    spawnTetromino() {
        this.tetromino = this.spawner.spawn();
        this.tetromino.row = 0;
        this.tetromino.col = this.board.cols / 2 - 2;
        
        if (this.board.collides(this.tetromino.absolutePos(0, 0))) {
            this.lockTetromino();
            this.gameOver();
            (this.game.SoundManager as SoundManager).playSound('sfx_clear')
        }        
    }
    
    /**
     * merge active tetromino with board
     */
    lockTetromino() {
        let fullRows = this.board.setAll(this.tetromino.absolutePos(), this.tetromino.color);
        this.tetromino = null;
        
        if (fullRows.length > 0) {
            this.updateScore(fullRows.length);
            this.board.cleanRows(fullRows);
            (this.game.SoundManager as SoundManager).playSound('sfx_clear')
        }else
        {
            (this.game.SoundManager as SoundManager).playSound('sfx_landing')
        }
        this.game.key.down.onRelease()
        this.isSpeedUp = false
    }
    
    /**
     * handle game ending
     */
    gameOver() {
        this.game.scores.add(this.rowsCleared, this.score);
        this.game.setState('gameover', {keepVisible: true});
        (this.game.SoundManager as SoundManager).stopdSound('bgm_gameplay')

    }
    
    /**
     * Update terominos falling and handle user input
     */
    updateTetromino() {
        if (this.game.key.up.trigger()) {
            if (!this.board.collides(this.tetromino.absolutePos(0, 0, true))) {                
                this.tetromino.rotate();
                (this.game.SoundManager as SoundManager).playSound('sfx_selection')
            } else if (!this.board.collides(this.tetromino.absolutePos(0, -1, true))) {
                --this.tetromino.col;
                this.tetromino.rotate();
                (this.game.SoundManager as SoundManager).playSound('sfx_selection')
            } else if (!this.board.collides(this.tetromino.absolutePos(0, 1, true))) {
                ++this.tetromino.col;
                this.tetromino.rotate();
                (this.game.SoundManager as SoundManager).playSound('sfx_selection')
            }
        }
        
        if (this.game.key.left.trigger() && !this.board.collides(this.tetromino.absolutePos(0, -1))) {
            --this.tetromino.col;
            this.game.key.left.onRelease()
        }
        if (this.game.key.right.trigger() && !this.board.collides(this.tetromino.absolutePos(0, 1))) {
            ++this.tetromino.col;
            this.game.key.right.onRelease()
        }
         
        let tickMod = this.game.key.down.pressed ? this.tetrominoDropModifier : 1;
        if ((--this.tetrominoFallSpeedupTimer) <= 0) {
            this.tetrominoFallSpeed = Math.max(this.tetrominoFallSpeedMin, this.tetrominoFallSpeed - this.tetrominoFallSpeedupStep);
            this.tetrominoFallSpeedupTimer = this.tetrominoFallSpeedupDelay;
            
        }
        if ((this.tetrominoFallTimer -= tickMod) <= 0) {
            if (this.board.collides(this.tetromino.absolutePos(1, 0))) {
                this.lockTetromino();
                this.spawnTetromino();
            } else {
                ++this.tetromino.row;
                this.tetrominoFallTimer = this.tetrominoFallSpeed;
            }
        }
    }
    
    /**
     * Update score based on number of cleared rows
     * @param {Number} rows count of rows cleared in one move
     */
    updateScore(rows) {
        this.rowsCleared += rows;
        this.score += Math.pow(2, rows - 1);
        this.gui.updateTexts(this.score, this.rowsCleared)
    }

    handlePlayTouchStart(event)
    {
        let startPos = event.data.getLocalPosition(this.game.app.stage);
        this.touchStart = new Victor(startPos.x, startPos.y)
    }

    handlePlayTouchEnd(event)
    {
        if(this.dragging)
        {
            
        }else
        {
            if(!this.isSpeedUp)
            {
                this.game.key.up.onPress()
            }            
        }        
        this.dragging = false
        this.touchStart = null        
    }

    handlePlayTouchMove(event)
    {
        if(this.touchStart && !this.isSpeedUp)
        {
            let endPos = event.data.getLocalPosition(this.game.app.stage);
            let touchEnd = new Victor(endPos.x, endPos.y)
            let dir = touchEnd.clone()
            dir.subtract(this.touchStart)
            if(dir.y > Constant.TOUCH_DRAGGING_OFF_X || dir.x > Constant.TOUCH_DRAGGING_OFF_Y)
            {
                this.dragging = true
            }

            if(dir.x < -config.display.blockSize)
            {
                this.game.key.left.onPress()
                this.touchStart = touchEnd
            }

            if(dir.x > config.display.blockSize)
            {
                this.game.key.right.onPress()
                this.touchStart = touchEnd
            }

            if(dir.y > Constant.TOUCH_DRAGGING_DOWN)
            {
                this.isSpeedUp = true
                this.game.key.down.onPress()
            }
        }
    }
}
