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
        padding: 3rem 3.5rem;
        background: linear-gradient(160deg, rgba(0,5,20,0.92) 0%, rgba(0,0,14,0.95) 100%);
        border: 1px solid rgba(0, 255, 200, 0.14);
        border-radius: 20px;
        box-shadow:
          0 0 60px rgba(0, 150, 255, 0.08),
          0 0 120px rgba(0, 80, 255, 0.04),
          inset 0 0 60px rgba(0, 0, 60, 0.2),
          0 20px 60px rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(12px);
        position: relative;
        overflow: hidden;
      }
      .menu-content::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(0,255,200,0.4), transparent);
      }
      .menu-content::after {
        content: '';
        position: absolute;
        bottom: 0; left: 0; right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(0,100,255,0.3), transparent);
      }
      .menu-title {
        display: flex;
        gap: 0.08em;
        font-family: 'Orbitron', monospace;
        font-size: clamp(3.5rem, 11vw, 7.5rem);
        font-weight: 900;
        letter-spacing: 0.25em;
        position: relative;
      }
      .title-letter {
        color: #00ffcc;
        text-shadow:
          0 0 12px #00ffcc,
          0 0 25px #00ffcc,
          0 0 50px rgba(0,170,255,0.7),
          0 0 90px rgba(0,60,255,0.4);
        animation: letterFloat 2s ease-in-out infinite;
        animation-delay: calc(var(--d) * 0.12s);
        display: inline-block;
      }
      @keyframes letterFloat {
        0%, 100% { transform: translateY(0) scaleY(1); }
        50% { transform: translateY(-10px) scaleY(1.02); }
      }
      .menu-subtitle {
        font-family: 'Exo 2', sans-serif;
        font-size: clamp(0.6rem, 2vw, 0.78rem);
        font-weight: 300;
        letter-spacing: 0.45em;
        color: rgba(0, 255, 200, 0.38);
        margin-top: -1.8rem;
        text-transform: uppercase;
      }
      .menu-buttons {
        display: flex;
        flex-direction: column;
        gap: 0.7rem;
        width: 270px;
      }
      .menu-btn {
        padding: 0.9rem 2rem;
        font-family: 'Orbitron', monospace;
        font-size: 0.72rem;
        letter-spacing: 0.22em;
        font-weight: 700;
        cursor: pointer;
        border-radius: 10px;
        transition: all 0.2s ease;
        border: 1px solid rgba(0, 255, 200, 0.25);
        background: rgba(0, 15, 35, 0.8);
        color: #00ffcc;
        -webkit-tap-highlight-color: transparent;
        position: relative;
        overflow: hidden;
      }
      .menu-btn::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(0,255,200,0.04) 0%, transparent 60%);
        pointer-events: none;
      }
      .menu-btn:hover {
        background: rgba(0, 255, 200, 0.1);
        border-color: rgba(0, 255, 200, 0.7);
        box-shadow: 0 0 22px rgba(0, 255, 200, 0.3), inset 0 0 12px rgba(0, 255, 200, 0.06);
        transform: translateY(-2px);
        color: #ffffff;
      }
      .menu-btn:active {
        transform: translateY(0) scale(0.97);
      }
      .menu-btn.primary {
        background: rgba(0, 255, 200, 0.1);
        border-color: rgba(0, 255, 200, 0.55);
        box-shadow: 0 0 18px rgba(0, 255, 200, 0.18);
        font-size: 0.82rem;
        letter-spacing: 0.2em;
      }
      .menu-btn.primary:hover {
        background: rgba(0, 255, 200, 0.18);
        box-shadow: 0 0 35px rgba(0, 255, 200, 0.45), inset 0 0 18px rgba(0, 255, 200, 0.1);
      }
      .menu-btn.danger {
        border-color: rgba(255, 50, 50, 0.22);
        color: rgba(255, 80, 80, 0.6);
        font-size: 0.65rem;
        letter-spacing: 0.18em;
      }
      .menu-btn.danger:hover {
        background: rgba(255, 50, 50, 0.12);
        border-color: rgba(255, 80, 80, 0.55);
        color: #ff6060;
        box-shadow: 0 0 18px rgba(255, 50, 50, 0.25);
        transform: translateY(-1px);
      }
      .menu-footer {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.3rem;
        font-family: 'Exo 2', sans-serif;
        font-size: 0.58rem;
        font-weight: 300;
        letter-spacing: 0.18em;
        color: rgba(0, 255, 200, 0.22);
        text-transform: uppercase;
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
