export class MainMenu {
  constructor() {
    this.el = null
    this._onStart = null
    this._onLevelSelect = null
    this._onReset = null
    this.container = null
  }

  init(container, callbacks = {}) {
    this.container = container
    this._onStart = callbacks.onStart
    this._onLevelSelect = callbacks.onLevelSelect
    this._onReset = callbacks.onReset

    this._injectStyles()

    this.el = document.createElement('div')
    this.el.id = 'main-menu'
    this.el.innerHTML = this._template()
    this.el.style.display = 'none'
    container.appendChild(this.el)

    this._attachEvents()
  }

  _template() {
    return `
      <div class="menu-content">
        <div class="menu-title">
          <span class="title-letter" style="--d:0">G</span>
          <span class="title-letter" style="--d:1">L</span>
          <span class="title-letter" style="--d:2">I</span>
          <span class="title-letter" style="--d:3">D</span>
          <span class="title-letter" style="--d:4">E</span>
        </div>
        <div class="menu-subtitle">A NEON PUZZLE ADVENTURE</div>
        <div class="menu-buttons">
          <button class="menu-btn primary" id="menu-start">START GAME</button>
          <button class="menu-btn" id="menu-levels">CHAPTER SELECT</button>
          <button class="menu-btn danger" id="menu-reset">RESET SAVE</button>
        </div>
        <div class="menu-footer">
          <span>ARROW KEYS / SWIPE TO MOVE</span>
          <span>Z = UNDO · R = RESTART</span>
        </div>
      </div>
    `
  }

  _attachEvents() {
    this.el.querySelector('#menu-start').addEventListener('click', () => {
      this._onStart && this._onStart()
    })
    this.el.querySelector('#menu-levels').addEventListener('click', () => {
      this._onLevelSelect && this._onLevelSelect()
    })
    this.el.querySelector('#menu-reset').addEventListener('click', () => {
      if (confirm('Reset all progress?')) {
        this._onReset && this._onReset()
      }
    })
  }

  _injectStyles() {
    if (document.getElementById('main-menu-styles')) return
    const style = document.createElement('style')
    style.id = 'main-menu-styles'
    style.textContent = `
      #main-menu {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 30;
        pointer-events: all;
      }
      .menu-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        padding: 3rem;
        background: rgba(0,0,16,0.85);
        border: 1px solid rgba(0,255,200,0.15);
        border-radius: 16px;
        box-shadow:
          0 0 40px rgba(0,170,255,0.1),
          0 0 80px rgba(0,100,255,0.05),
          inset 0 0 40px rgba(0,0,60,0.3);
        backdrop-filter: blur(10px);
      }
      .menu-title {
        display: flex;
        gap: 0.1em;
        font-family: 'Courier New', monospace;
        font-size: clamp(4rem, 12vw, 8rem);
        font-weight: 900;
        letter-spacing: 0.2em;
      }
      .title-letter {
        color: #00ffcc;
        text-shadow:
          0 0 15px #00ffcc,
          0 0 30px #00ffcc,
          0 0 60px #00aaff,
          0 0 100px #0044ff;
        animation: letterFloat 2s ease-in-out infinite;
        animation-delay: calc(var(--d) * 0.15s);
        display: inline-block;
      }
      @keyframes letterFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
      .menu-subtitle {
        font-family: 'Courier New', monospace;
        font-size: 0.75rem;
        letter-spacing: 0.3em;
        color: rgba(0,255,200,0.5);
        margin-top: -1.5rem;
      }
      .menu-buttons {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        width: 260px;
      }
      .menu-btn {
        padding: 0.85rem 2rem;
        font-family: 'Courier New', monospace;
        font-size: 0.85rem;
        letter-spacing: 0.2em;
        font-weight: bold;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.2s ease;
        border: 1px solid rgba(0,255,200,0.3);
        background: rgba(0,20,40,0.8);
        color: #00ffcc;
        -webkit-tap-highlight-color: transparent;
      }
      .menu-btn:hover {
        background: rgba(0,255,200,0.15);
        border-color: #00ffcc;
        box-shadow: 0 0 20px rgba(0,255,200,0.4), inset 0 0 10px rgba(0,255,200,0.1);
        transform: translateY(-2px);
      }
      .menu-btn:active {
        transform: translateY(0) scale(0.97);
      }
      .menu-btn.primary {
        background: rgba(0,255,200,0.15);
        border-color: #00ffcc;
        box-shadow: 0 0 15px rgba(0,255,200,0.25);
        font-size: 0.9rem;
      }
      .menu-btn.primary:hover {
        background: rgba(0,255,200,0.25);
        box-shadow: 0 0 30px rgba(0,255,200,0.5), inset 0 0 15px rgba(0,255,200,0.15);
      }
      .menu-btn.danger {
        border-color: rgba(255,50,50,0.3);
        color: rgba(255,80,80,0.7);
        font-size: 0.7rem;
      }
      .menu-btn.danger:hover {
        background: rgba(255,50,50,0.15);
        border-color: rgba(255,80,80,0.6);
        color: #ff5050;
        box-shadow: 0 0 15px rgba(255,50,50,0.3);
      }
      .menu-footer {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.3rem;
        font-family: 'Courier New', monospace;
        font-size: 0.6rem;
        letter-spacing: 0.15em;
        color: rgba(0,255,200,0.3);
      }
    `
    document.head.appendChild(style)
  }

  show() {
    if (this.el) {
      this.el.style.display = 'flex'
      this.el.style.opacity = '0'
      requestAnimationFrame(() => {
        this.el.style.transition = 'opacity 0.4s ease'
        this.el.style.opacity = '1'
      })
    }
  }

  hide() {
    if (this.el) {
      this.el.style.transition = 'opacity 0.3s ease'
      this.el.style.opacity = '0'
      setTimeout(() => {
        if (this.el) this.el.style.display = 'none'
      }, 300)
    }
  }

  destroy() {
    if (this.el) this.el.remove()
    this.el = null
  }
}
