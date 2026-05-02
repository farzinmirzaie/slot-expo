import { GameScene } from './scenes/GameScene.js'
import { MenuScene } from './scenes/MenuScene.js'
import { GridSystem } from './systems/GridSystem.js'
import { MovementSystem } from './systems/MovementSystem.js'
import { AudioSystem } from './systems/AudioSystem.js'
import { StateManager } from './systems/StateManager.js'
import { HUD } from './ui/HUD.js'
import { MainMenu } from './ui/MainMenu.js'
import { LevelSelect } from './ui/LevelSelect.js'
import { Transitions } from './ui/Transitions.js'
import { moonLevels } from './levels/moon.js'
import { iceLevels } from './levels/ice.js'
import { desertLevels } from './levels/desert.js'
import { alienLevels } from './levels/alien.js'

const CHAPTERS = {
  moon: moonLevels,
  ice: iceLevels,
  desert: desertLevels,
  alien: alienLevels
}

const CHAPTER_ORDER = ['moon', 'ice', 'desert', 'alien']

export class Game {
  constructor() {
    this.gameScene = new GameScene()
    this.menuScene = new MenuScene()
    this.movementSystem = new MovementSystem()
    this.audio = new AudioSystem()
    this.stateManager = new StateManager()
    this.hud = new HUD()
    this.mainMenu = new MainMenu()
    this.levelSelect = new LevelSelect()
    this.transitions = new Transitions()

    this.currentScene = 'menu' // 'menu' | 'game' | 'levelSelect'
    this.currentChapter = 'moon'
    this.currentLevelIndex = 0
    this.inputLocked = false

    this._lastTime = 0
    this._rafId = null

    // Swipe tracking
    this._touchStart = null
    this._touchEnd = null
  }

  async init() {
    const container = document.getElementById('canvas-container')
    const uiOverlay = document.getElementById('ui-overlay')

    // Load save data
    this.stateManager.load()

    // Init scenes
    this.menuScene.init(container)
    this.gameScene.init(container)

    // Init UI
    this.mainMenu.init(uiOverlay, {
      onStart: () => this._handleStartGame(),
      onLevelSelect: () => this._showLevelSelect(),
      onReset: () => {
        this.stateManager.resetProgress()
      }
    })

    this.levelSelect.init(uiOverlay, {
      onSelectLevel: (chapter, index) => this._selectLevel(chapter, index),
      onBack: () => this._showMainMenu()
    }, this.stateManager, CHAPTERS)

    this.hud.init(uiOverlay, {
      onUndo: () => this._handleUndo(),
      onRestart: () => this._handleRestart(),
      onMenu: () => this._showLevelSelect(),
      onUp: () => this._handleMove('up'),
      onDown: () => this._handleMove('down'),
      onLeft: () => this._handleMove('left'),
      onRight: () => this._handleMove('right')
    })

    this.transitions.init(uiOverlay)

    // Audio (lazy init on first user interaction)
    document.addEventListener('keydown', () => this.audio.init(), { once: true })
    document.addEventListener('touchstart', () => this.audio.init(), { once: true })
    document.addEventListener('click', () => this.audio.init(), { once: true })

    // Input
    this._setupKeyboard()
    this._setupTouch()

    // Initial state
    this.gameScene.hide()
    this.menuScene.show()
    this.mainMenu.show()

    // Simulate loading
    await this._fakeLoad()

    // Start loop
    this._lastTime = performance.now()
    this._loop(this._lastTime)
  }

  async _fakeLoad() {
    const bar = document.getElementById('loading-bar')
    const text = document.getElementById('loading-text')
    const screen = document.getElementById('loading-screen')

    const steps = [
      [20, 'LOADING ASSETS...'],
      [50, 'BUILDING LEVELS...'],
      [80, 'INITIALIZING PHYSICS...'],
      [100, 'READY']
    ]

    for (const [pct, msg] of steps) {
      bar.style.width = pct + '%'
      text.textContent = msg
      await new Promise(r => setTimeout(r, 250))
    }

    await new Promise(r => setTimeout(r, 200))
    screen.style.opacity = '0'
    setTimeout(() => { screen.style.display = 'none' }, 500)
  }

  _loop(timestamp) {
    this._rafId = requestAnimationFrame((t) => this._loop(t))
    const delta = Math.min((timestamp - this._lastTime) / 1000, 0.05)
    this._lastTime = timestamp

    if (this.currentScene === 'menu') {
      this.menuScene.update(delta)
      this.menuScene.render()
    } else if (this.currentScene === 'game') {
      this.gameScene.update(delta)
      this.gameScene.render()
    }
  }

  _setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (this.currentScene !== 'game') return

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault()
          this._handleMove('up')
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault()
          this._handleMove('down')
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault()
          this._handleMove('left')
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault()
          this._handleMove('right')
          break
        case 'z':
        case 'Z':
          this._handleUndo()
          break
        case 'r':
        case 'R':
          this._handleRestart()
          break
        case 'Escape':
          this._showLevelSelect()
          break
      }
    })
  }

  _setupTouch() {
    const canvas = document.getElementById('canvas-container')
    canvas.addEventListener('touchstart', (e) => {
      this._touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }, { passive: true })

    canvas.addEventListener('touchend', (e) => {
      if (!this._touchStart) return
      this._touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }

      const dx = this._touchEnd.x - this._touchStart.x
      const dy = this._touchEnd.y - this._touchStart.y
      const minSwipe = 40

      if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > minSwipe) {
          this._handleMove(dx > 0 ? 'right' : 'left')
        }
      } else {
        if (Math.abs(dy) > minSwipe) {
          this._handleMove(dy > 0 ? 'down' : 'up')
        }
      }

      this._touchStart = null
      this._touchEnd = null
    }, { passive: true })
  }

  async _handleStartGame() {
    this.audio.init()
    this.audio.playUIClick()

    const chapter = this.stateManager.saveData.currentChapter || 'moon'
    const progress = this.stateManager.getChapterProgress(chapter)

    await this._goToGame(chapter, progress)
  }

  async _showLevelSelect() {
    this.audio.playUIClick()

    if (this.currentScene === 'game') {
      this.hud.hide()
    }

    await this._switchToMenuView()
    this.levelSelect.show(this.currentChapter)
    this.mainMenu.hide()
    this.currentScene = 'levelSelect'
  }

  async _showMainMenu() {
    this.audio.playUIClick()
    this.levelSelect.hide()

    if (this.currentScene === 'game') {
      this.hud.hide()
      this.gameScene.hide()
      this.menuScene.show()
    }

    this.mainMenu.show()
    this.currentScene = 'menu'
  }

  async _selectLevel(chapter, index) {
    this.audio.playUIClick()
    this.levelSelect.hide()
    await this._goToGame(chapter, index)
  }

  async _goToGame(chapter, levelIndex) {
    this.currentChapter = chapter
    this.currentLevelIndex = levelIndex

    const levels = CHAPTERS[chapter]
    if (!levels || levelIndex >= levels.length) {
      console.warn('Invalid level', chapter, levelIndex)
      this._showMainMenu()
      return
    }

    const levelData = levels[levelIndex]

    // Transition
    await this.transitions.fadeOut()

    if (this.currentScene === 'menu' || this.currentScene === 'levelSelect') {
      this.menuScene.hide()
      this.mainMenu.hide()
      this.levelSelect.hide()
      this.gameScene.show()
    }

    this.currentScene = 'game'
    this.gameScene.loadLevel(levelData)
    this.stateManager.initLevel(levelData)

    this.hud.show()
    this.hud.updateLevel(levelData)
    this.hud.updateMoves(0)

    this.audio.startAmbient()

    await this.transitions.fadeIn()
  }

  _handleMove(direction) {
    if (this.currentScene !== 'game') return
    if (this.inputLocked || this.gameScene.isAnimating) return

    const state = this.stateManager.getState()
    const levelData = this.stateManager.levelData
    if (!levelData) return

    const result = this.movementSystem.computeGlide(
      levelData.grid,
      state.playerPos,
      direction,
      levelData.teleports || [],
      state.collected,
      levelData.goal
    )

    // Check if player actually moved
    if (result.newPos.x === state.playerPos.x && result.newPos.y === state.playerPos.y) {
      // No movement — still animate a bump
      return
    }

    this.audio.playGlide()
    this.inputLocked = true

    // Filter newly collected to actual collectibles
    const actuallyCollected = (result.newlyCollected || []).filter(pos => {
      const collectibles = levelData.collectibles || []
      return collectibles.some(c => c.x === pos.x && c.y === pos.y) &&
             !state.collected.has(`${pos.x},${pos.y}`)
    })

    // Update state
    this.stateManager.pushMove(result.newPos, actuallyCollected)
    this.hud.updateMoves(this.stateManager.getMoveCount())

    // Animate movement
    const path = result.path || [result.newPos]
    this.gameScene.movePlayer(state.playerPos, result.newPos, path, () => {
      // Collect items along path
      for (const item of actuallyCollected) {
        this.gameScene.collectItem(item)
        this.audio.playCollect()
      }

      if (result.fellInCrater) {
        this.audio.playFail()
        this.gameScene.craterFall(result.newPos, () => {
          this.inputLocked = false
          // Reset position after fail
          setTimeout(() => {
            this._handleRestart()
          }, 600)
        })
        return
      }

      // Check level complete
      if (this.stateManager.isLevelComplete()) {
        this._handleLevelComplete()
        return
      }

      this.inputLocked = false
    })
  }

  _handleUndo() {
    if (this.currentScene !== 'game') return
    if (this.inputLocked) return

    const result = this.stateManager.popMove()
    if (!result) return

    this.audio.playUndo()
    this.hud.flashUndo()
    this.hud.updateMoves(this.stateManager.getMoveCount())

    // Restore uncollected items
    for (const item of result.uncollected || []) {
      this.gameScene.restoreCollectible(item.x, item.y)
    }

    this.gameScene.setPlayerPosition(result.playerPos.x, result.playerPos.y)
  }

  _handleRestart() {
    if (this.currentScene !== 'game') return

    this.audio.playUndo()
    const levelData = this.stateManager.levelData
    if (!levelData) return

    this.stateManager.initLevel(levelData)
    this.hud.updateMoves(0)
    this.gameScene.loadLevel(levelData)
    this.inputLocked = false
  }

  async _handleLevelComplete() {
    this.inputLocked = true
    this.audio.playGoal()

    const stars = this.stateManager.getStars()
    const moves = this.stateManager.getMoveCount()

    this.stateManager.markLevelComplete(this.currentChapter, this.currentLevelIndex)

    this.gameScene.goalReached(() => {
      // Show complete screen
      this.transitions.showLevelComplete(
        stars,
        moves,
        () => this._nextLevel(),
        () => this._showLevelSelect()
      )
    })
  }

  async _nextLevel() {
    const chapters = CHAPTER_ORDER
    const levels = CHAPTERS[this.currentChapter]
    const nextIndex = this.currentLevelIndex + 1

    if (nextIndex < levels.length) {
      // Next level in same chapter
      this.inputLocked = false
      await this._goToGame(this.currentChapter, nextIndex)
    } else {
      // Next chapter
      const chapterIdx = chapters.indexOf(this.currentChapter)
      if (chapterIdx < chapters.length - 1) {
        const nextChapter = chapters[chapterIdx + 1]
        this.inputLocked = false
        await this.transitions.fadeOut()
        await this.transitions.showChapterBanner(nextChapter)
        await this._goToGame(nextChapter, 0)
      } else {
        // All chapters done
        this._showMainMenu()
      }
    }
  }

  async _switchToMenuView() {
    if (this.currentScene === 'game') {
      this.hud.hide()
      await this.transitions.fadeOut(300)
      this.gameScene.hide()
      this.menuScene.show()
      this.audio.stopAmbient()
      await this.transitions.fadeIn(300)
    }
  }
}
