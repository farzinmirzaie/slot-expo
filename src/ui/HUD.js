export class HUD {
  constructor() {
    this.container = null
    this.el = null
    this.visible = false
    this._onUndo = null
    this._onRestart = null
    this._onMenu = null
    this._onUp = null
    this._onDown = null
    this._onLeft = null
    this._onRight = null
  }

  init(container, callbacks = {}) {
    this.container = container
    this._onUndo = callbacks.onUndo
    this._onRestart = callbacks.onRestart
    this._onMenu = callbacks.onMenu
    this._onUp = callbacks.onUp
    this._onDown = callbacks.onDown
    this._onLeft = callbacks.onLeft
    this._onRight = callbacks.onRight

    this.el = document.createElement('div')
    this.el.id = 'hud'
    this.el.innerHTML = this._template()
    this.el.style.display = 'none'
    container.appendChild(this.el)

    this._attachEvents()
    this._injectStyles()
  }

  _template() {
    return `
      <div class="hud-top">
        <div class="hud-chapter" id="hud-chapter">MOON</div>
        <div class="hud-level-name" id="hud-level-name">First Steps</div>
        <div class="hud-moves">
          <span class="moves-label">MOVES</span>
          <span class="moves-count" id="hud-moves">0</span>
        </div>
      </div>
      <div class="hud-actions">
        <button class="hud-btn" id="btn-menu" title="Menu">☰</button>
        <button class="hud-btn" id="btn-undo" title="Undo (Z)">↩</button>
        <button class="hud-btn" id="btn-restart" title="Restart (R)">↺</button>
      </div>
      <div class="hud-narrative" id="hud-narrative"></div>
      <div class="hud-dpad" id="hud-dpad">
        <div class="dpad-row">
          <button class="dpad-btn" id="dpad-up">▲</button>
        </div>
        <div class="dpad-row">
          <button class="dpad-btn" id="dpad-left">◄</button>
          <div class="dpad-center"></div>
          <button class="dpad-btn" id="dpad-right">►</button>
        </div>
        <div class="dpad-row">
          <button class="dpad-btn" id="dpad-down">▼</button>
        </div>
      </div>
    `
  }

  _attachEvents() {
    const get = (id) => this.el.querySelector(`#${id}`)

    get('btn-undo').addEventListener('click', () => this._onUndo && this._onUndo())
    get('btn-restart').addEventListener('click', () => this._onRestart && this._onRestart())
    get('btn-menu').addEventListener('click', () => this._onMenu && this._onMenu())
    get('dpad-up').addEventListener('click', () => this._onUp && this._onUp())
    get('dpad-down').addEventListener('click', () => this._onDown && this._onDown())
    get('dpad-left').addEventListener('click', () => this._onLeft && this._onLeft())
    get('dpad-right').addEventListener('click', () => this._onRight && this._onRight())

    // Touch support for dpad
    const dpadHandler = (id, cb) => {
      const btn = get(id)
      if (!btn) return
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault()
        cb && cb()
      }, { passive: false })
    }
    dpadHandler('dpad-up', this._onUp)
    dpadHandler('dpad-down', this._onDown)
    dpadHandler('dpad-left', this._onLeft)
    dpadHandler('dpad-right', this._onRight)
  }

  _injectStyles() {
    if (document.getElementById('hud-styles')) return
    const style = document.createElement('style')
    style.id = 'hud-styles'
    style.textContent = `
      #hud {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        pointer-events: none;
        font-family: 'Courier New', monospace;
        z-index: 20;
      }
      .hud-top {
        position: absolute;
        top: 1rem; left: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        pointer-events: none;
      }
      .hud-chapter {
        font-size: 0.65rem;
        letter-spacing: 0.25em;
        color: rgba(0,255,200,0.5);
      }
      .hud-level-name {
        font-size: 1.1rem;
        font-weight: bold;
        color: #00ffcc;
        text-shadow: 0 0 12px #00ffcc, 0 0 24px #00aaff;
        letter-spacing: 0.1em;
      }
      .hud-moves {
        font-size: 0.8rem;
        color: rgba(0,255,200,0.7);
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }
      .moves-label {
        letter-spacing: 0.15em;
        opacity: 0.6;
        font-size: 0.65rem;
      }
      .moves-count {
        color: #00ffcc;
        text-shadow: 0 0 8px #00ffcc;
        font-size: 1.1rem;
        font-weight: bold;
      }
      .hud-actions {
        position: absolute;
        top: 1rem; right: 1rem;
        display: flex;
        gap: 0.5rem;
        pointer-events: all;
      }
      .hud-btn {
        background: rgba(0,20,40,0.85);
        border: 1px solid rgba(0,255,200,0.3);
        color: #00ffcc;
        font-size: 1.1rem;
        width: 42px; height: 42px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.15s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        -webkit-tap-highlight-color: transparent;
      }
      .hud-btn:hover {
        background: rgba(0,255,200,0.15);
        border-color: #00ffcc;
        box-shadow: 0 0 12px rgba(0,255,200,0.4);
      }
      .hud-btn:active {
        transform: scale(0.92);
      }
      .hud-narrative {
        position: absolute;
        bottom: 7rem; left: 50%;
        transform: translateX(-50%);
        width: min(500px, 90vw);
        text-align: center;
        font-size: 0.75rem;
        color: rgba(0,255,200,0.55);
        letter-spacing: 0.05em;
        line-height: 1.5;
        pointer-events: none;
        text-shadow: 0 0 10px rgba(0,255,200,0.3);
        padding: 0 1rem;
      }
      .hud-dpad {
        position: absolute;
        bottom: 1.5rem; right: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.15rem;
        pointer-events: all;
      }
      .dpad-row {
        display: flex;
        gap: 0.15rem;
        align-items: center;
      }
      .dpad-btn {
        width: 52px; height: 52px;
        background: rgba(0,20,40,0.9);
        border: 1px solid rgba(0,255,200,0.25);
        color: #00ffcc;
        font-size: 1.2rem;
        border-radius: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.1s ease;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
      }
      .dpad-btn:hover {
        background: rgba(0,255,200,0.15);
        border-color: rgba(0,255,200,0.6);
        box-shadow: 0 0 10px rgba(0,255,200,0.3);
      }
      .dpad-btn:active {
        transform: scale(0.88);
        background: rgba(0,255,200,0.25);
      }
      .dpad-center {
        width: 52px; height: 52px;
      }
      @media (min-width: 768px) {
        .hud-dpad { display: none; }
      }
    `
    document.head.appendChild(style)
  }

  show() {
    if (this.el) this.el.style.display = 'block'
    this.visible = true
  }

  hide() {
    if (this.el) this.el.style.display = 'none'
    this.visible = false
  }

  updateLevel(levelData) {
    if (!this.el) return
    const chapterNames = {
      moon: '🌑 MOON',
      ice: '❄️ ICE',
      desert: '🌵 DESERT',
      alien: '👽 ALIEN'
    }
    this.el.querySelector('#hud-chapter').textContent = chapterNames[levelData.chapter] || levelData.chapter.toUpperCase()
    this.el.querySelector('#hud-level-name').textContent = levelData.name
    this.el.querySelector('#hud-narrative').textContent = levelData.narrative || ''
    this.el.querySelector('#hud-moves').textContent = '0'
  }

  updateMoves(count) {
    if (this.el) {
      this.el.querySelector('#hud-moves').textContent = count
    }
  }

  flashUndo() {
    const btn = this.el && this.el.querySelector('#btn-undo')
    if (btn) {
      btn.style.color = '#ffffff'
      btn.style.boxShadow = '0 0 15px #ffffff'
      setTimeout(() => {
        btn.style.color = '#00ffcc'
        btn.style.boxShadow = ''
      }, 150)
    }
  }

  destroy() {
    if (this.el) this.el.remove()
    this.el = null
  }
}
