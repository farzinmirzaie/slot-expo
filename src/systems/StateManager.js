const SAVE_KEY = 'glide_save'

export class StateManager {
  constructor() {
    this.levelData = null
    this.playerPos = null
    this.collected = new Set()
    this.history = []
    this.moveCount = 0
    this.saveData = {
      currentChapter: 'moon',
      levelsCompleted: { moon: 0, ice: 0, desert: 0, alien: 0 },
      totalMoves: 0,
      stars: {}
    }
  }

  initLevel(levelData) {
    this.levelData = levelData
    this.playerPos = { ...levelData.playerStart }
    this.collected = new Set()
    this.history = []
    this.moveCount = 0
  }

  getState() {
    return {
      playerPos: { ...this.playerPos },
      collected: new Set(this.collected),
      moveCount: this.moveCount
    }
  }

  pushMove(newPlayerPos, collectedItems = []) {
    // Save current state to history
    this.history.push({
      playerPos: { ...this.playerPos },
      collected: new Set(this.collected),
      moveCount: this.moveCount
    })

    this.playerPos = { ...newPlayerPos }
    for (const item of collectedItems) {
      this.collected.add(`${item.x},${item.y}`)
    }
    this.moveCount++
  }

  popMove() {
    if (this.history.length === 0) return null

    const prev = this.history.pop()
    // Figure out what was un-collected
    const prevKeys = prev.collected
    const uncollected = []
    for (const key of this.collected) {
      if (!prevKeys.has(key)) {
        const [x, y] = key.split(',').map(Number)
        uncollected.push({ x, y })
      }
    }

    this.playerPos = { ...prev.playerPos }
    this.collected = new Set(prev.collected)
    this.moveCount = prev.moveCount

    return { playerPos: this.playerPos, uncollected }
  }

  isCollected(x, y) {
    return this.collected.has(`${x},${y}`)
  }

  isLevelComplete() {
    if (!this.levelData) return false

    // Check all collectibles gathered
    const cols = this.levelData.collectibles || []
    for (const col of cols) {
      if (!this.collected.has(`${col.x},${col.y}`)) {
        return false
      }
    }

    // Check player is on goal
    const goal = this.levelData.goal
    return this.playerPos.x === goal.x && this.playerPos.y === goal.y
  }

  getMoveCount() {
    return this.moveCount
  }

  getStars() {
    // 3 stars: under 5 moves. 2 stars: under 10. 1 star: completed
    if (this.moveCount <= 5) return 3
    if (this.moveCount <= 10) return 2
    return 1
  }

  markLevelComplete(chapter, levelIndex) {
    if (!this.saveData.levelsCompleted[chapter]) {
      this.saveData.levelsCompleted[chapter] = 0
    }
    if (levelIndex + 1 > this.saveData.levelsCompleted[chapter]) {
      this.saveData.levelsCompleted[chapter] = levelIndex + 1
    }

    const key = `${chapter}_${levelIndex}`
    const stars = this.getStars()
    if (!this.saveData.stars[key] || stars > this.saveData.stars[key]) {
      this.saveData.stars[key] = stars
    }

    this.saveData.totalMoves += this.moveCount
    this.save()
  }

  getChapterProgress(chapter) {
    return this.saveData.levelsCompleted[chapter] || 0
  }

  getLevelStars(chapter, levelIndex) {
    const key = `${chapter}_${levelIndex}`
    return this.saveData.stars[key] || 0
  }

  isLevelUnlocked(chapter, levelIndex) {
    return levelIndex === 0 || levelIndex <= (this.saveData.levelsCompleted[chapter] || 0)
  }

  isChapterUnlocked(chapter) {
    const order = ['moon', 'ice', 'desert', 'alien']
    const idx = order.indexOf(chapter)
    if (idx === 0) return true
    const prev = order[idx - 1]
    return (this.saveData.levelsCompleted[prev] || 0) >= 1
  }

  save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.saveData))
    } catch (e) {
      console.warn('Failed to save game:', e)
    }
  }

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        this.saveData = {
          currentChapter: parsed.currentChapter || 'moon',
          levelsCompleted: {
            moon: parsed.levelsCompleted?.moon || 0,
            ice: parsed.levelsCompleted?.ice || 0,
            desert: parsed.levelsCompleted?.desert || 0,
            alien: parsed.levelsCompleted?.alien || 0
          },
          totalMoves: parsed.totalMoves || 0,
          stars: parsed.stars || {}
        }
      }
    } catch (e) {
      console.warn('Failed to load save:', e)
    }
  }

  resetProgress() {
    this.saveData = {
      currentChapter: 'moon',
      levelsCompleted: { moon: 0, ice: 0, desert: 0, alien: 0 },
      totalMoves: 0,
      stars: {}
    }
    this.save()
  }
}
