export class LevelSelect {
  constructor() {
    this.el = null
    this._onSelectLevel = null
    this._onBack = null
    this._stateManager = null
    this._allLevels = null
    this._currentChapter = 'moon'
  }

  init(container, callbacks = {}, stateManager, allLevels) {
    this._onSelectLevel = callbacks.onSelectLevel
    this._onBack = callbacks.onBack
    this._stateManager = stateManager
    this._allLevels = allLevels

    this._injectStyles()

    this.el = document.createElement('div')
    this.el.id = 'level-select'
    this.el.style.display = 'none'
    container.appendChild(this.el)
  }

  _injectStyles() {
    if (document.getElementById('ls-styles')) return
    const style = document.createElement('style')
    style.id = 'ls-styles'
    style.textContent = `
      #level-select {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: radial-gradient(ellipse at center, rgba(0,5,20,0.97) 0%, rgba(0,0,14,0.99) 100%);
        z-index: 30;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1.5rem;
        overflow-y: auto;
        font-family: 'Orbitron', 'Courier New', monospace;
      }
      .ls-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
        width: 100%;
        max-width: 600px;
      }
      .ls-back {
        background: rgba(0,10,28,0.8);
        border: 1px solid rgba(0,255,200,0.22);
        color: #00ffcc;
        font-family: 'Orbitron', monospace;
        font-size: 0.7rem;
        letter-spacing: 0.15em;
        padding: 0.55rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.15s;
        -webkit-tap-highlight-color: transparent;
        backdrop-filter: blur(4px);
      }
      .ls-back:hover {
        background: rgba(0,255,200,0.1);
        border-color: rgba(0,255,200,0.6);
        box-shadow: 0 0 12px rgba(0,255,200,0.25);
      }
      .ls-title {
        font-family: 'Orbitron', monospace;
        font-size: 1rem;
        font-weight: 700;
        color: #00ffcc;
        text-shadow: 0 0 12px rgba(0,255,200,0.5);
        letter-spacing: 0.25em;
        flex: 1;
        text-align: center;
      }
      .chapter-tabs {
        display: flex;
        gap: 0.4rem;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
        justify-content: center;
        max-width: 600px;
        width: 100%;
      }
      .chapter-tab {
        padding: 0.45rem 1rem;
        background: rgba(0,10,28,0.8);
        border: 1px solid rgba(0,255,200,0.16);
        color: rgba(0,255,200,0.45);
        font-family: 'Orbitron', monospace;
        font-size: 0.62rem;
        letter-spacing: 0.15em;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.15s;
        -webkit-tap-highlight-color: transparent;
      }
      .chapter-tab.active {
        background: rgba(0,255,200,0.1);
        border-color: rgba(0,255,200,0.7);
        color: #00ffcc;
        box-shadow: 0 0 12px rgba(0,255,200,0.25);
      }
      .chapter-tab.locked {
        opacity: 0.28;
        cursor: not-allowed;
      }
      .chapter-tab:hover:not(.locked) {
        border-color: rgba(0,255,200,0.45);
        color: rgba(0,255,200,0.75);
      }
      .levels-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
        gap: 0.7rem;
        max-width: 600px;
        width: 100%;
      }
      .level-card {
        background: rgba(0,8,22,0.9);
        border: 1px solid rgba(0,255,200,0.12);
        border-radius: 12px;
        padding: 1rem;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        position: relative;
        -webkit-tap-highlight-color: transparent;
        backdrop-filter: blur(4px);
      }
      .level-card:hover:not(.locked) {
        background: rgba(0,255,200,0.07);
        border-color: rgba(0,255,200,0.38);
        transform: translateY(-2px);
        box-shadow: 0 6px 22px rgba(0,255,200,0.12);
      }
      .level-card.locked {
        opacity: 0.32;
        cursor: not-allowed;
        border-style: dashed;
      }
      .level-card.completed {
        border-color: rgba(0,255,136,0.32);
        background: rgba(0,255,136,0.04);
      }
      .level-number {
        font-family: 'Exo 2', sans-serif;
        font-size: 0.58rem;
        font-weight: 300;
        color: rgba(0,255,200,0.35);
        letter-spacing: 0.2em;
        text-transform: uppercase;
      }
      .level-name {
        font-family: 'Orbitron', monospace;
        font-size: 0.68rem;
        font-weight: 700;
        color: #00ffcc;
        letter-spacing: 0.04em;
        text-shadow: 0 0 8px rgba(0,255,200,0.35);
        line-height: 1.35;
      }
      .level-stars {
        font-size: 0.72rem;
        color: #ffcc00;
        letter-spacing: 0.08em;
        text-shadow: 0 0 6px rgba(255,200,0,0.5);
        margin-top: 0.1rem;
      }
      .lock-icon {
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        font-size: 1.5rem;
        opacity: 0.5;
      }
    `
    document.head.appendChild(style)
  }

  _renderContent() {
    const chapters = [
      { id: 'moon', label: '🌑 MOON' },
      { id: 'ice', label: '❄️ ICE' },
      { id: 'desert', label: '🌵 DESERT' },
      { id: 'alien', label: '👽 ALIEN' }
    ]

    const levels = this._allLevels[this._currentChapter] || []

    const tabsHtml = chapters.map(ch => {
      const unlocked = this._stateManager.isChapterUnlocked(ch.id)
      const active = ch.id === this._currentChapter ? 'active' : ''
      const locked = !unlocked ? 'locked' : ''
      return `<button class="chapter-tab ${active} ${locked}" data-chapter="${ch.id}">${ch.label}</button>`
    }).join('')

    const levelsHtml = levels.map((level, i) => {
      const unlocked = this._stateManager.isLevelUnlocked(this._currentChapter, i)
      const stars = this._stateManager.getLevelStars(this._currentChapter, i)
      const completed = stars > 0
      const lockedClass = !unlocked ? 'locked' : ''
      const completedClass = completed ? 'completed' : ''
      const starsHtml = completed ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : '☆☆☆'

      return `
        <div class="level-card ${lockedClass} ${completedClass}" data-index="${i}">
          ${!unlocked ? '<div class="lock-icon">🔒</div>' : ''}
          <div class="level-number">LVL ${level.id}</div>
          <div class="level-name">${level.name}</div>
          ${unlocked ? `<div class="level-stars">${starsHtml}</div>` : ''}
        </div>
      `
    }).join('')

    this.el.innerHTML = `
      <div class="ls-header">
        <button class="ls-back" id="ls-back">← BACK</button>
        <div class="ls-title">SELECT LEVEL</div>
      </div>
      <div class="chapter-tabs">${tabsHtml}</div>
      <div class="levels-grid">${levelsHtml}</div>
    `

    // Attach events
    this.el.querySelector('#ls-back').addEventListener('click', () => {
      this._onBack && this._onBack()
    })

    this.el.querySelectorAll('.chapter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const chapter = tab.dataset.chapter
        if (!this._stateManager.isChapterUnlocked(chapter)) return
        this._currentChapter = chapter
        this._renderContent()
      })
    })

    this.el.querySelectorAll('.level-card').forEach(card => {
      card.addEventListener('click', () => {
        const index = parseInt(card.dataset.index)
        if (!this._stateManager.isLevelUnlocked(this._currentChapter, index)) return
        this._onSelectLevel && this._onSelectLevel(this._currentChapter, index)
      })
    })
  }

  show(chapter = null) {
    if (chapter) this._currentChapter = chapter
    this._renderContent()
    this.el.style.display = 'flex'
    this.el.style.opacity = '0'
    requestAnimationFrame(() => {
      this.el.style.transition = 'opacity 0.3s ease'
      this.el.style.opacity = '1'
    })
  }

  hide() {
    this.el.style.transition = 'opacity 0.3s ease'
    this.el.style.opacity = '0'
    setTimeout(() => {
      if (this.el) this.el.style.display = 'none'
    }, 300)
  }

  destroy() {
    if (this.el) this.el.remove()
    this.el = null
  }
}
