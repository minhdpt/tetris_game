import { Application } from 'pixi.js';

import config from './config';
import Game from './Game';

// create PIXI application
let app = new Application()
app.renderer.resize(config.display.width, config.display.height);
document.body.appendChild(app.view);

let game = new Game(app);

// load sprites and run game when done
app.loader.add('assets/sprites.json')
            .load(() => game.run())
