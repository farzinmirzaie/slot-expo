import { Game } from './Game.js'

const game = new Game()
game.init().catch(err => {
  console.error('Game initialization failed:', err)
})
