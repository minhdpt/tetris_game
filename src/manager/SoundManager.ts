import Singleton from "../base/Singleton"
export enum SOUND_ID
{
    SOUND_MUSIC_GAME_OVER = 'assets/sound/'
}

export default class SoundManager extends Singleton
{
    constructor()
    {
        super()        
    }

    loadAll()
    {
        
    }
}