export class Transitions {
  constructor() {
    this.el = null
    this.overlay = null
  }

  init(container) {
    this._injectStyles()

    this.el = document.createElement('div')
    this.el.id = 'transitions'
    this.el.innerHTML = `
      <div id="fade-overlay"></div>
      <div id="level-complete-screen" style="display:none">
        <div class="lc-content">
          <div class="lc-title">LEVEL COMPLETE</div>
          <div class="lc-stars" id="lc-stars"></div>
          <div class="lc-moves" id="lc-moves"></div>
          <div class="lc-buttons">
            <button class="lc-btn" id="lc-next">NEXT LEVEL</button>
            <button class="lc-btn secondary" id="lc-menu">LEVEL SELECT</button>
          </div>
        </div>
      </div>
      <div id="chapter-banner" style="display:none">
        <div class="banner-content">
          <div class="banner-entering">ENTERING</div>
          <div class="banner-chapter" id="banner-chapter-name"></div>
        </div>
      </div>
    `
    container.appendChild(this.el)

    this.fadeOverlay = this.el.querySelector('#fade-overlay')
    this.levelCompleteScreen = this.el.querySelector('#level-complete-screen')
    this.chapterBanner = this.el.querySelector('#chapter-banner')
  }

  _injectStyles() {
    if (document.getElementById('transition-styles')) return
    const style = document.createElement('style')
    style.id = 'transition-styles'
    style.textContent = `
      #transitions {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        pointer-events: none;
        z-index: 50;
        font-family: 'Courier New', monospace;
      }
      #fade-overlay {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: #000010;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.4s ease;
      }
      #fade-overlay.active {
        pointer-events: all;
      }
      #level-complete-screen {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: all;
        background: rgba(0,0,16,0.7);
        backdrop-filter: blur(4px);
      }
      .lc-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        background: rgba(0,0,20,0.9);
        border: 1px solid rgba(0,255,136,0.4);
        border-radius: 16px;
        padding: 3rem;
        box-shadow: 0 0 40px rgba(0,255,136,0.2), 0 0 80px rgba(0,200,255,0.1);
        animation: lcAppear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
      }
      @keyframes lcAppear {
        from { transform: scale(0.7); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      .lc-title {
        font-size: clamp(1.5rem, 5vw, 2.5rem);
        font-weight: 900;
        letter-spacing: 0.3em;
        color: #00ff88;
        text-shadow: 0 0 20px #00ff88, 0 0 40px #00aaff;
      }
      .lc-stars {
        font-size: 2.5rem;
        letter-spacing: 0.3em;
        color: #ffcc00;
        text-shadow: 0 0 15px rgba(255,200,0,0.6);
      }
      .lc-moves {
        font-size: 0.8rem;
        letter-spacing: 0.2em;
        color: rgba(0,255,200,0.6);
      }
      .lc-buttons {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
      }
      .lc-btn {
        padding: 0.75rem 2rem;
        font-family: 'Courier New', monospace;
        font-size: 0.8rem;
        letter-spacing: 0.2em;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.2s;
        border: 1px solid rgba(0,255,200,0.4);
        background: rgba(0,255,200,0.15);
        color: #00ffcc;
        -webkit-tap-highlight-color: transparent;
      }
      .lc-btn:hover {
        background: rgba(0,255,200,0.25);
        border-color: #00ffcc;
        box-shadow: 0 0 20px rgba(0,255,200,0.4);
        transform: translateY(-2px);
      }
      .lc-btn.secondary {
        background: transparent;
        border-color: rgba(0,255,200,0.2);
        color: rgba(0,255,200,0.6);
      }
      #chapter-banner {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,16,0.95);
        pointer-events: all;
      }
      .banner-content {
        text-align: center;
        animation: bannerAnim 2.5s ease forwards;
      }
      @keyframes bannerAnim {
        0% { opacity: 0; transform: scale(0.8); }
        20% { opacity: 1; transform: scale(1); }
        80% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(1.1); }
      }
      .banner-entering {
        font-size: 0.8rem;
        letter-spacing: 0.5em;
        color: rgba(0,255,200,0.5);
        margin-bottom: 0.5rem;
      }
      .banner-chapter {
        font-size: clamp(2rem, 8vw, 5rem);
        font-weight: 900;
        letter-spacing: 0.3em;
        color: #00ffcc;
        text-shadow: 0 0 20px #00ffcc, 0 0 60px #00aaff, 0 0 100px #0044ff;
      }
    `
    document.head.appendChild(style)
  }

  fadeIn(duration = 400) {
    return new Promise(resolve => {
      this.fadeOverlay.style.transition = `opacity ${duration}ms ease`
      this.fadeOverlay.style.opacity = '0'
      this.fadeOverlay.classList.remove('active')
      setTimeout(resolve, duration)
    })
  }

  fadeOut(duration = 400) {
    return new Promise(resolve => {
      this.fadeOverlay.style.transition = `opacity ${duration}ms ease`
      this.fadeOverlay.style.opacity = '1'
      this.fadeOverlay.classList.add('active')
      setTimeout(resolve, duration)
    })
  }

  showLevelComplete(stars, moves, onNext, onMenu) {
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars)
    this.el.querySelector('#lc-stars').textContent = starStr
    this.el.querySelector('#lc-moves').textContent = `COMPLETED IN ${moves} MOVE${moves !== 1 ? 'S' : ''}`

    const nextBtn = this.el.querySelector('#lc-next')
    const menuBtn = this.el.querySelector('#lc-menu')

    const nextClone = nextBtn.cloneNode(true)
    const menuClone = menuBtn.cloneNode(true)
    nextBtn.replaceWith(nextClone)
    menuBtn.replaceWith(menuClone)

    nextClone.addEventListener('click', () => {
      this.hideLevelComplete()
      onNext && onNext()
    })
    menuClone.addEventListener('click', () => {
      this.hideLevelComplete()
      onMenu && onMenu()
    })

    this.levelCompleteScreen.style.display = 'flex'
  }

  hideLevelComplete() {
    this.levelCompleteScreen.style.display = 'none'
  }

  showChapterBanner(chapterName) {
    return new Promise(resolve => {
      const names = {
        moon: '🌑 MOON',
        ice: '❄️ ICE PLANET',
        desert: '🌵 DESERT WORLD',
        alien: '👽 ALIEN TECH'
      }
      this.el.querySelector('#banner-chapter-name').textContent = names[chapterName] || chapterName.toUpperCase()
      this.chapterBanner.style.display = 'flex'

      setTimeout(() => {
        this.chapterBanner.style.display = 'none'
        resolve()
      }, 2600)
    })
  }

  destroy() {
    if (this.el) this.el.remove()
    this.el = null
  }
}
