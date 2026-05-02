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

    // Main whoosh — sine sweep down
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(400, t)
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.28)
    gain.gain.setValueAtTime(0.0, t)
    gain.gain.linearRampToValueAtTime(0.22, t + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32)
    osc.connect(gain)
    gain.connect(this.masterGain)
    osc.start(t)
    osc.stop(t + 0.35)

    // Sawtooth layer — higher whoosh
    const osc2 = this.ctx.createOscillator()
    const gain2 = this.ctx.createGain()
    const filter2 = this.ctx.createBiquadFilter()
    filter2.type = 'lowpass'
    filter2.frequency.setValueAtTime(1800, t)
    filter2.frequency.exponentialRampToValueAtTime(400, t + 0.25)
    osc2.type = 'sawtooth'
    osc2.frequency.setValueAtTime(900, t)
    osc2.frequency.exponentialRampToValueAtTime(180, t + 0.22)
    gain2.gain.setValueAtTime(0.04, t)
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.28)
    osc2.connect(filter2)
    filter2.connect(gain2)
    gain2.connect(this.masterGain)
    osc2.start(t)
    osc2.stop(t + 0.32)

    // Bright click at start
    const clickOsc = this.ctx.createOscillator()
    const clickGain = this.ctx.createGain()
    clickOsc.type = 'square'
    clickOsc.frequency.setValueAtTime(1200, t)
    clickGain.gain.setValueAtTime(0.06, t)
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05)
    clickOsc.connect(clickGain)
    clickGain.connect(this.masterGain)
    clickOsc.start(t)
    clickOsc.stop(t + 0.06)
  }

  playCollect() {
    if (!this._ensure()) return
    const t = this.ctx.currentTime
    // Bright arpeggio — ascending sparkle
    const notes = [659, 784, 988, 1319, 1568] // E5 G5 B5 E6 G6
    notes.forEach((freq, i) => {
      const dt = i * 0.055
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t + dt)
      gain.gain.setValueAtTime(0.0, t + dt)
      gain.gain.linearRampToValueAtTime(0.14, t + dt + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, t + dt + 0.2)
      osc.connect(gain)
      gain.connect(this.masterGain)
      osc.start(t + dt)
      osc.stop(t + dt + 0.25)
    })
    // Shimmer layer
    const shimOsc = this.ctx.createOscillator()
    const shimGain = this.ctx.createGain()
    shimOsc.type = 'triangle'
    shimOsc.frequency.setValueAtTime(2093, t)
    shimGain.gain.setValueAtTime(0.08, t)
    shimGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35)
    shimOsc.connect(shimGain)
    shimGain.connect(this.masterGain)
    shimOsc.start(t)
    shimOsc.stop(t + 0.38)
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

    this.ambientGain = this.ctx.createGain()
    this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime)
    this.ambientGain.gain.linearRampToValueAtTime(0.045, this.ctx.currentTime + 2.5)
    this.ambientGain.connect(this.masterGain)

    // Sub bass drone
    this.ambientOsc = this.ctx.createOscillator()
    this.ambientOsc.type = 'sine'
    this.ambientOsc.frequency.value = 55
    this.ambientOsc.connect(this.ambientGain)
    this.ambientOsc.start()

    // Fifth above
    const osc2 = this.ctx.createOscillator()
    osc2.type = 'sine'
    osc2.frequency.value = 82.5
    const gain2 = this.ctx.createGain()
    gain2.gain.value = 0.45
    osc2.connect(gain2)
    gain2.connect(this.ambientGain)
    osc2.start()
    this._ambientOsc2 = osc2
    this._ambientGain2 = gain2

    // High shimmer — an octave up
    const osc3 = this.ctx.createOscillator()
    osc3.type = 'triangle'
    osc3.frequency.value = 220
    const gain3 = this.ctx.createGain()
    gain3.gain.value = 0.15
    const filter3 = this.ctx.createBiquadFilter()
    filter3.type = 'highpass'
    filter3.frequency.value = 180
    osc3.connect(filter3)
    filter3.connect(gain3)
    gain3.connect(this.ambientGain)
    osc3.start()
    this._ambientOsc3 = osc3

    // Slow LFO for breathing effect
    const lfo = this.ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = 0.08
    const lfoGain = this.ctx.createGain()
    lfoGain.gain.value = 0.018
    lfo.connect(lfoGain)
    lfoGain.connect(this.ambientGain.gain)
    lfo.start()
    this._lfo = lfo

    // Second slower LFO for wobble
    const lfo2 = this.ctx.createOscillator()
    lfo2.type = 'sine'
    lfo2.frequency.value = 0.15
    const lfoGain2 = this.ctx.createGain()
    lfoGain2.gain.value = 3
    lfo2.connect(lfoGain2)
    lfoGain2.connect(osc2.frequency)
    lfo2.start()
    this._lfo2 = lfo2
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
        this._ambientOsc3 && this._ambientOsc3.stop()
        this._lfo && this._lfo.stop()
        this._lfo2 && this._lfo2.stop()
      } catch (e) { /* ignore */ }
      this.ambientOsc = null
      this._ambientOsc2 = null
      this._ambientOsc3 = null
      this._lfo = null
      this._lfo2 = null
    }, 2000)
  }

  setVolume(v) {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, v)), this.ctx.currentTime)
    }
  }
}
