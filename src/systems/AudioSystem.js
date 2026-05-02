export class AudioSystem {
  constructor() {
    this.ctx = null
    this.masterGain = null
    this.ambientOsc = null
    this.ambientGain = null
    this.enabled = true
    this._initialized = false
  }

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = 0.7
      this.masterGain.connect(this.ctx.destination)
      this._initialized = true
    } catch (e) {
      console.warn('AudioSystem: Web Audio API not available', e)
      this.enabled = false
    }
  }

  _ensure() {
    if (!this._initialized) this.init()
    if (!this.enabled || !this.ctx) return false
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return true
  }

  _createOsc(type, freq, startTime, duration, gainVal = 0.3) {
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, startTime)
    gain.gain.setValueAtTime(gainVal, startTime)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
    osc.connect(gain)
    gain.connect(this.masterGain)
    osc.start(startTime)
    osc.stop(startTime + duration + 0.05)
    return { osc, gain }
  }

  playGlide() {
    if (!this._ensure()) return
    const t = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(300, t)
    osc.frequency.exponentialRampToValueAtTime(150, t + 0.3)
    gain.gain.setValueAtTime(0.2, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35)
    osc.connect(gain)
    gain.connect(this.masterGain)
    osc.start(t)
    osc.stop(t + 0.4)

    // Add a high whoosh layer
    const osc2 = this.ctx.createOscillator()
    const gain2 = this.ctx.createGain()
    osc2.type = 'sawtooth'
    osc2.frequency.setValueAtTime(800, t)
    osc2.frequency.exponentialRampToValueAtTime(200, t + 0.25)
    gain2.gain.setValueAtTime(0.05, t)
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
    osc2.connect(gain2)
    gain2.connect(this.masterGain)
    osc2.start(t)
    osc2.stop(t + 0.35)
  }

  playCollect() {
    if (!this._ensure()) return
    const t = this.ctx.currentTime
    const notes = [523, 659, 784, 1047] // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const dt = i * 0.07
      this._createOsc('sine', freq, t + dt, 0.25, 0.15)
    })
  }

  playGoal() {
    if (!this._ensure()) return
    const t = this.ctx.currentTime
    // Fanfare chord
    const chord = [261, 329, 392, 523, 659]
    chord.forEach((freq, i) => {
      const dt = i * 0.05
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t + dt)
      gain.gain.setValueAtTime(0.0, t + dt)
      gain.gain.linearRampToValueAtTime(0.18, t + dt + 0.05)
      gain.gain.exponentialRampToValueAtTime(0.001, t + dt + 0.7)
      osc.connect(gain)
      gain.connect(this.masterGain)
      osc.start(t + dt)
      osc.stop(t + dt + 0.8)
    })
    // Extra sparkle
    setTimeout(() => {
      if (!this._ensure()) return
      const t2 = this.ctx.currentTime
      const sparkle = [1046, 1318, 1568]
      sparkle.forEach((freq, i) => {
        const dt = i * 0.1
        this._createOsc('sine', freq, t2 + dt, 0.3, 0.12)
      })
    }, 300)
  }

  playFail() {
    if (!this._ensure()) return
    const t = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(200, t)
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.4)
    gain.gain.setValueAtTime(0.4, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5)
    osc.connect(gain)
    gain.connect(this.masterGain)
    osc.start(t)
    osc.stop(t + 0.55)

    // Distortion rumble
    const osc2 = this.ctx.createOscillator()
    const gain2 = this.ctx.createGain()
    osc2.type = 'square'
    osc2.frequency.setValueAtTime(60, t)
    osc2.frequency.exponentialRampToValueAtTime(20, t + 0.35)
    gain2.gain.setValueAtTime(0.2, t)
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
    osc2.connect(gain2)
    gain2.connect(this.masterGain)
    osc2.start(t)
    osc2.stop(t + 0.45)
  }

  playUndo() {
    if (!this._ensure()) return
    const t = this.ctx.currentTime
    this._createOsc('square', 440, t, 0.08, 0.1)
    this._createOsc('square', 330, t + 0.06, 0.08, 0.1)
  }

  playUIClick() {
    if (!this._ensure()) return
    const t = this.ctx.currentTime
    this._createOsc('square', 880, t, 0.05, 0.08)
  }

  startAmbient() {
    if (!this._ensure()) return
    if (this.ambientOsc) return

    // Space drone: two layered oscillators
    this.ambientGain = this.ctx.createGain()
    this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime)
    this.ambientGain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 2)
    this.ambientGain.connect(this.masterGain)

    this.ambientOsc = this.ctx.createOscillator()
    this.ambientOsc.type = 'sine'
    this.ambientOsc.frequency.value = 55
    this.ambientOsc.connect(this.ambientGain)
    this.ambientOsc.start()

    const osc2 = this.ctx.createOscillator()
    osc2.type = 'sine'
    osc2.frequency.value = 82.5
    const gain2 = this.ctx.createGain()
    gain2.gain.value = 0.5
    osc2.connect(gain2)
    gain2.connect(this.ambientGain)
    osc2.start()
    this._ambientOsc2 = osc2
    this._ambientGain2 = gain2

    // Slow LFO for breathing effect
    const lfo = this.ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = 0.1
    const lfoGain = this.ctx.createGain()
    lfoGain.gain.value = 0.02
    lfo.connect(lfoGain)
    lfoGain.connect(this.ambientGain.gain)
    lfo.start()
    this._lfo = lfo
  }

  stopAmbient() {
    if (!this.ambientOsc) return
    const t = this.ctx.currentTime
    this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, t)
    this.ambientGain.gain.linearRampToValueAtTime(0, t + 1.5)
    setTimeout(() => {
      try {
        this.ambientOsc && this.ambientOsc.stop()
        this._ambientOsc2 && this._ambientOsc2.stop()
        this._lfo && this._lfo.stop()
      } catch (e) { /* ignore */ }
      this.ambientOsc = null
      this._ambientOsc2 = null
      this._lfo = null
    }, 2000)
  }

  setVolume(v) {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, v)), this.ctx.currentTime)
    }
  }
}
