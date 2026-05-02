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
        background: rgba(0,0,16,0.95);
        z-index: 30;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1.5rem;
        overflow-y: auto;
        font-family: 'Courier New', monospace;
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
        background: transparent;
        border: 1px solid rgba(0,255,200,0.3);
        color: #00ffcc;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.15s;
        -webkit-tap-highlight-color: transparent;
      }
      .ls-back:hover {
        background: rgba(0,255,200,0.1);
        border-color: #00ffcc;
      }
      .ls-title {
        font-size: 1.2rem;
        color: #00ffcc;
        text-shadow: 0 0 12px #00ffcc;
        letter-spacing: 0.2em;
        flex: 1;
        text-align: center;
      }
      .chapter-tabs {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
        justify-content: center;
        max-width: 600px;
        width: 100%;
      }
      .chapter-tab {
        padding: 0.4rem 1rem;
        background: rgba(0,20,40,0.8);
        border: 1px solid rgba(0,255,200,0.2);
        color: rgba(0,255,200,0.5);
        font-family: 'Courier New', monospace;
        font-size: 0.7rem;
        letter-spacing: 0.15em;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.15s;
        -webkit-tap-highlight-color: transparent;
      }
      .chapter-tab.active {
        background: rgba(0,255,200,0.15);
        border-color: #00ffcc;
        color: #00ffcc;
        box-shadow: 0 0 10px rgba(0,255,200,0.3);
      }
      .chapter-tab.locked {
        opacity: 0.3;
        cursor: not-allowed;
      }
      .chapter-tab:hover:not(.locked) {
        border-color: rgba(0,255,200,0.5);
        color: rgba(0,255,200,0.8);
      }
      .levels-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
        gap: 0.75rem;
        max-width: 600px;
        width: 100%;
      }
      .level-card {
        background: rgba(0,15,30,0.9);
        border: 1px solid rgba(0,255,200,0.15);
        border-radius: 10px;
        padding: 1rem;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        position: relative;
        -webkit-tap-highlight-color: transparent;
      }
      .level-card:hover:not(.locked) {
        background: rgba(0,255,200,0.08);
        border-color: rgba(0,255,200,0.4);
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(0,255,200,0.15);
      }
      .level-card.locked {
        opacity: 0.35;
        cursor: not-allowed;
        border-style: dashed;
      }
      .level-card.completed {
        border-color: rgba(0,255,136,0.4);
        background: rgba(0,255,136,0.05);
      }
      .level-number {
        font-size: 0.6rem;
        color: rgba(0,255,200,0.4);
        letter-spacing: 0.2em;
      }
      .level-name {
        font-size: 0.75rem;
        color: #00ffcc;
        font-weight: bold;
        letter-spacing: 0.05em;
        text-shadow: 0 0 8px rgba(0,255,200,0.4);
        line-height: 1.3;
      }
      .level-stars {
        font-size: 0.75rem;
        color: #ffcc00;
        letter-spacing: 0.05em;
        text-shadow: 0 0 6px rgba(255,200,0,0.5);
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
