import * as PIXI from "pixi.js";
import sound from "pixi-sound";
import Singleton from "../base/Singleton"
import Constant from "../common/Constants"

export default class SoundManager extends Singleton
{
    constructor()
    {
        super()
    }

    loadAll()
    {
        PIXI.sound.add(Constant.ASSETS_SOUND)
    }

    playSound(soundId: string, loop = false)
    {
        PIXI.sound.play(soundId, {loop: loop})
    }

    stopdSound(soundId: string)
    {
        PIXI.sound.stop(soundId)
    }

    stopdAllSound()
    {
        PIXI.sound.stopAll()
    }
}