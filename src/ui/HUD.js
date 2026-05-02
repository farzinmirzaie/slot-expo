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
        font-family: 'Orbitron', 'Courier New', monospace;
        z-index: 20;
      }
      .hud-top {
        position: absolute;
        top: 1rem; left: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        pointer-events: none;
        background: rgba(0, 8, 24, 0.65);
        border: 1px solid rgba(0, 255, 200, 0.12);
        border-radius: 10px;
        padding: 0.6rem 0.9rem;
        backdrop-filter: blur(6px);
      }
      .hud-chapter {
        font-family: 'Exo 2', 'Orbitron', monospace;
        font-size: 0.6rem;
        letter-spacing: 0.3em;
        color: rgba(0, 255, 200, 0.45);
        font-weight: 300;
        text-transform: uppercase;
      }
      .hud-level-name {
        font-family: 'Orbitron', monospace;
        font-size: 0.95rem;
        font-weight: 700;
        color: #00ffcc;
        text-shadow: 0 0 10px #00ffcc, 0 0 20px rgba(0,170,255,0.5);
        letter-spacing: 0.08em;
      }
      .hud-moves {
        font-size: 0.75rem;
        color: rgba(0, 255, 200, 0.6);
        display: flex;
        gap: 0.5rem;
        align-items: center;
        margin-top: 0.1rem;
      }
      .moves-label {
        font-family: 'Exo 2', monospace;
        letter-spacing: 0.2em;
        opacity: 0.5;
        font-size: 0.6rem;
        font-weight: 300;
      }
      .moves-count {
        font-family: 'Orbitron', monospace;
        color: #00ffcc;
        text-shadow: 0 0 8px #00ffcc;
        font-size: 1rem;
        font-weight: 700;
      }
      .hud-actions {
        position: absolute;
        top: 1rem; right: 1rem;
        display: flex;
        gap: 0.4rem;
        pointer-events: all;
      }
      .hud-btn {
        background: rgba(0, 10, 28, 0.82);
        border: 1px solid rgba(0, 255, 200, 0.22);
        color: #00ffcc;
        font-size: 1rem;
        width: 44px; height: 44px;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.15s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        -webkit-tap-highlight-color: transparent;
        backdrop-filter: blur(4px);
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      }
      .hud-btn:hover {
        background: rgba(0, 255, 200, 0.12);
        border-color: rgba(0, 255, 200, 0.7);
        box-shadow: 0 0 14px rgba(0, 255, 200, 0.35), 0 2px 8px rgba(0,0,0,0.4);
      }
      .hud-btn:active {
        transform: scale(0.9);
        background: rgba(0, 255, 200, 0.2);
      }
      .hud-narrative {
        position: absolute;
        bottom: 7rem; left: 50%;
        transform: translateX(-50%);
        width: min(500px, 90vw);
        text-align: center;
        font-family: 'Exo 2', sans-serif;
        font-size: 0.75rem;
        font-weight: 300;
        color: rgba(0, 255, 200, 0.5);
        letter-spacing: 0.04em;
        line-height: 1.6;
        pointer-events: none;
        text-shadow: 0 0 10px rgba(0, 255, 200, 0.25);
        padding: 0 1rem;
      }
      .hud-dpad {
        position: absolute;
        bottom: 1.5rem; right: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.12rem;
        pointer-events: all;
      }
      .dpad-row {
        display: flex;
        gap: 0.12rem;
        align-items: center;
      }
      .dpad-btn {
        width: 54px; height: 54px;
        background: rgba(0, 8, 28, 0.88);
        border: 1px solid rgba(0, 255, 200, 0.2);
        color: #00ffcc;
        font-size: 1.1rem;
        border-radius: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.1s ease;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
        backdrop-filter: blur(4px);
        box-shadow: 0 3px 10px rgba(0,0,0,0.5);
      }
      .dpad-btn:hover {
        background: rgba(0, 255, 200, 0.12);
        border-color: rgba(0, 255, 200, 0.55);
        box-shadow: 0 0 12px rgba(0, 255, 200, 0.3), 0 3px 10px rgba(0,0,0,0.5);
      }
      .dpad-btn:active {
        transform: scale(0.86);
        background: rgba(0, 255, 200, 0.22);
        box-shadow: 0 0 18px rgba(0, 255, 200, 0.5);
      }
      .dpad-center {
        width: 54px; height: 54px;
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
