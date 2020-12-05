import { Application } from 'pixi.js'
import config from './config'
import Game from './Game'
import * as PIXI from "pixi.js";
import SOUND from "pixi-sound";

PIXI["s" + "o" + "u" + "n" + "d"] = SOUND
let app = new Application()
app.renderer.resize(config.display.width, config.display.height);
document.body.appendChild(app.view);

let game = new Game(app);

game.loadResources()
app.loader.add('assets/sprites.json')
            .load(() => game.run())