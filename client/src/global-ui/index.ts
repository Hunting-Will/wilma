import { GameAction } from "@wilma/types"
import poisonImg from '../assets/poison.svg'
import sickleImg from '../assets/sickle.svg'
import seedsImg from '../assets/seeds.svg'
import mouseImg from '../assets/mouse.svg'
import snakeImg from '../assets/snake.svg'

export const actions: { action: GameAction, img: string }[] = [{ action: 'Seed', img: seedsImg }, { action: 'Harvest', img: sickleImg }, { action: 'Poison', img: poisonImg }, { action: 'PutMouse', img: mouseImg }];
