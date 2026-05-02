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
        font-family: 'Orbitron', 'Courier New', monospace;
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
        background: radial-gradient(ellipse at center, rgba(0,20,40,0.75) 0%, rgba(0,0,16,0.8) 100%);
        backdrop-filter: blur(6px);
      }
      .lc-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.6rem;
        background: linear-gradient(160deg, rgba(0,8,25,0.95) 0%, rgba(0,0,18,0.98) 100%);
        border: 1px solid rgba(0, 255, 136, 0.25);
        border-radius: 20px;
        padding: 3rem 3.5rem;
        box-shadow:
          0 0 50px rgba(0, 255, 136, 0.12),
          0 0 100px rgba(0, 200, 255, 0.06),
          0 20px 60px rgba(0,0,0,0.8);
        animation: lcAppear 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        position: relative;
        overflow: hidden;
      }
      .lc-content::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(0,255,136,0.5), transparent);
      }
      @keyframes lcAppear {
        from { transform: scale(0.65) translateY(20px); opacity: 0; }
        to { transform: scale(1) translateY(0); opacity: 1; }
      }
      .lc-title {
        font-family: 'Orbitron', monospace;
        font-size: clamp(1.3rem, 4.5vw, 2.2rem);
        font-weight: 900;
        letter-spacing: 0.3em;
        color: #00ff88;
        text-shadow: 0 0 18px #00ff88, 0 0 36px rgba(0,170,255,0.5);
      }
      .lc-stars {
        font-size: 2.8rem;
        letter-spacing: 0.25em;
        animation: starsAppear 0.6s 0.3s ease both;
      }
      @keyframes starsAppear {
        from { transform: scale(0.5) rotate(-15deg); opacity: 0; }
        to { transform: scale(1) rotate(0deg); opacity: 1; }
      }
      .lc-moves {
        font-family: 'Exo 2', sans-serif;
        font-size: 0.75rem;
        font-weight: 300;
        letter-spacing: 0.25em;
        color: rgba(0, 255, 200, 0.55);
        text-transform: uppercase;
      }
      .lc-buttons {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 0.3rem;
      }
      .lc-btn {
        padding: 0.8rem 2rem;
        font-family: 'Orbitron', monospace;
        font-size: 0.7rem;
        letter-spacing: 0.2em;
        cursor: pointer;
        border-radius: 10px;
        transition: all 0.2s;
        border: 1px solid rgba(0, 255, 200, 0.35);
        background: rgba(0, 255, 200, 0.1);
        color: #00ffcc;
        -webkit-tap-highlight-color: transparent;
      }
      .lc-btn:hover {
        background: rgba(0, 255, 200, 0.2);
        border-color: #00ffcc;
        box-shadow: 0 0 22px rgba(0, 255, 200, 0.4);
        transform: translateY(-2px);
        color: #ffffff;
      }
      .lc-btn:active {
        transform: scale(0.96);
      }
      .lc-btn.secondary {
        background: transparent;
        border-color: rgba(0, 255, 200, 0.18);
        color: rgba(0, 255, 200, 0.55);
      }
      .lc-btn.secondary:hover {
        background: rgba(0, 255, 200, 0.08);
        color: rgba(0, 255, 200, 0.85);
      }
      #chapter-banner {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: radial-gradient(ellipse at center, rgba(0,10,30,0.98) 0%, rgba(0,0,16,0.99) 100%);
        pointer-events: all;
      }
      .banner-content {
        text-align: center;
        animation: bannerAnim 2.6s ease forwards;
      }
      @keyframes bannerAnim {
        0% { opacity: 0; transform: scale(0.85) translateY(10px); }
        18% { opacity: 1; transform: scale(1) translateY(0); }
        75% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(1.08); }
      }
      .banner-entering {
        font-family: 'Exo 2', sans-serif;
        font-size: 0.75rem;
        font-weight: 300;
        letter-spacing: 0.6em;
        color: rgba(0, 255, 200, 0.45);
        margin-bottom: 0.6rem;
        text-transform: uppercase;
      }
      .banner-chapter {
        font-family: 'Orbitron', monospace;
        font-size: clamp(1.5rem, 6vw, 4rem);
        font-weight: 900;
        letter-spacing: 0.25em;
        color: #00ffcc;
        text-shadow: 0 0 20px #00ffcc, 0 0 55px rgba(0,170,255,0.6), 0 0 100px rgba(0,60,255,0.3);
      }
      .banner-subtitle {
        font-family: 'Exo 2', sans-serif;
        font-size: clamp(0.7rem, 2vw, 1rem);
        font-weight: 300;
        letter-spacing: 0.2em;
        color: rgba(0, 255, 200, 0.5);
        margin-top: 0.75rem;
        font-style: italic;
      }
      @media (max-width: 480px) {
        .lc-content { padding: 2rem 1.75rem; gap: 1.2rem; }
        .lc-buttons { gap: 0.7rem; }
        .lc-btn { padding: 0.7rem 1.4rem; font-size: 0.65rem; }
        .lc-stars { font-size: 2.2rem; }
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
    const gold = '⭐'
    const empty = '✦'
    const starStr = gold.repeat(stars) + empty.repeat(3 - stars)
    const starsEl = this.el.querySelector('#lc-stars')
    starsEl.textContent = starStr
    starsEl.style.color = stars > 0 ? '#ffcc00' : 'rgba(255,200,0,0.3)'
    starsEl.style.textShadow = stars > 0 ? '0 0 18px rgba(255,200,0,0.7)' : 'none'
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
        moon:     '🌑 UNKNOWN PLANET',
        ice:      '❄️ ICE PLANET',
        desert:   '🌵 DESERT PLANET',
        jungle:   '🌿 JUNGLE PLANET',
        volcanic: '🔥 VOLCANIC PLANET',
        alien:    '👽 ALIEN TECH',
        station:  '🛰️ SPACE STATION'
      }
      const subtitles = {
        moon:     'Where am I?',
        ice:      'Surface unstable…',
        desert:   'Energy levels dropping…',
        jungle:   'Environment reacting…',
        volcanic: 'Hazard levels critical.',
        alien:    'Structures detected. Artificial.',
        station:  'Station operational.'
      }
      const name = names[chapterName] || chapterName.toUpperCase()
      const sub = subtitles[chapterName] || ''
      const bannerEl = this.el.querySelector('#banner-chapter-name')
      bannerEl.innerHTML = name + '<div class="banner-subtitle">' + sub + '</div>'
      this.chapterBanner.style.display = 'flex'

      setTimeout(() => {
        this.chapterBanner.style.display = 'none'
        resolve()
      }, 2800)
    })
  }

  destroy() {
    if (this.el) this.el.remove()
    this.el = null
  }
}
