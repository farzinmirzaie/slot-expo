import * as THREE from 'three'
import { EffectComposer, RenderPass, BloomEffect, EffectPass } from 'postprocessing'
import { GridSystem } from '../systems/GridSystem.js'
import { ParticleSystem } from '../systems/ParticleSystem.js'

// Per-chapter visual theme definitions
const CHAPTER_THEMES = {
  moon: {
    background: 0x000812,
    fog: 0x000812, fogDensity: 0.04,
    ambient: 0x061822, ambientIntensity: 3.0,
    dirColor: 0xaaccdd, dirIntensity: 4.0,
    fill1Color: 0x001133, fill1Intensity: 2.5,
    fill2Color: 0x00ffcc, fill2Intensity: 1.5,
    topColor: 0x004466, topIntensity: 1.5,
    playerGlow: 0x00aaff, playerEmissive: 0x00aaff,
    bloomIntensity: 2.2
  },
  ice: {
    background: 0x000e1f,
    fog: 0x000e1f, fogDensity: 0.03,
    ambient: 0x0a1e35, ambientIntensity: 3.5,
    dirColor: 0xccddff, dirIntensity: 5.0,
    fill1Color: 0x002255, fill1Intensity: 3.0,
    fill2Color: 0x88ccff, fill2Intensity: 2.0,
    topColor: 0x003388, topIntensity: 2.0,
    playerGlow: 0x44aaff, playerEmissive: 0x2288ff,
    bloomIntensity: 2.8
  },
  desert: {
    background: 0x1a0800,
    fog: 0x180600, fogDensity: 0.035,
    ambient: 0x2a1005, ambientIntensity: 3.0,
    dirColor: 0xffcc66, dirIntensity: 5.5,
    fill1Color: 0x441100, fill1Intensity: 2.0,
    fill2Color: 0xff6600, fill2Intensity: 1.5,
    topColor: 0x662200, topIntensity: 2.0,
    playerGlow: 0xff8800, playerEmissive: 0xff6600,
    bloomIntensity: 1.8
  },
  jungle: {
    background: 0x010e04,
    fog: 0x010e04, fogDensity: 0.055,
    ambient: 0x051a09, ambientIntensity: 2.5,
    dirColor: 0x88ddaa, dirIntensity: 3.5,
    fill1Color: 0x002200, fill1Intensity: 2.0,
    fill2Color: 0x00ff44, fill2Intensity: 2.5,
    topColor: 0x004422, topIntensity: 2.0,
    playerGlow: 0x00cc44, playerEmissive: 0x00aa33,
    bloomIntensity: 2.5
  },
  volcanic: {
    background: 0x0d0200,
    fog: 0x0d0200, fogDensity: 0.05,
    ambient: 0x1a0500, ambientIntensity: 2.0,
    dirColor: 0xff4400, dirIntensity: 4.0,
    fill1Color: 0x440000, fill1Intensity: 3.0,
    fill2Color: 0xff2200, fill2Intensity: 2.5,
    topColor: 0x661100, topIntensity: 2.5,
    playerGlow: 0xff4400, playerEmissive: 0xff3300,
    bloomIntensity: 3.0
  },
  alien: {
    background: 0x000d14,
    fog: 0x000d14, fogDensity: 0.03,
    ambient: 0x061218, ambientIntensity: 3.0,
    dirColor: 0x88ffcc, dirIntensity: 4.0,
    fill1Color: 0x003322, fill1Intensity: 2.5,
    fill2Color: 0x00ff88, fill2Intensity: 2.0,
    topColor: 0x004433, topIntensity: 2.0,
    playerGlow: 0x00ffcc, playerEmissive: 0x00ffaa,
    bloomIntensity: 2.4
  },
  station: {
    background: 0x000008,
    fog: 0x000008, fogDensity: 0.02,
    ambient: 0x0d1020, ambientIntensity: 4.0,
    dirColor: 0xffffff, dirIntensity: 5.0,
    fill1Color: 0x001166, fill1Intensity: 2.5,
    fill2Color: 0x4488ff, fill2Intensity: 2.0,
    topColor: 0x2244aa, topIntensity: 2.0,
    playerGlow: 0x8888ff, playerEmissive: 0x6666ff,
    bloomIntensity: 2.0
  }
}

export class GameScene {
  constructor() {
    this.renderer = null
    this.scene = null
    this.camera = null
    this.composer = null
    this.gridSystem = new GridSystem()
    this.particleSystem = new ParticleSystem()
    this.playerMesh = null
    this.starField = null
    this.lights = {}
    this.time = 0
    this.isAnimating = false
    this._animQueue = []
    this._onAnimDone = null
    this.levelData = null
    this._bloomEffect = null
    this._currentTheme = null
  }

  init(container) {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.2
    container.appendChild(this.renderer.domElement)

    // Scene
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x000010)
    this.scene.fog = new THREE.FogExp2(0x000010, 0.03)

    // Camera — top-down perspective
    this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 200)
    this.camera.position.set(3, 14, 5)
    this.camera.lookAt(0, 0, 0)

    // Named lights for runtime theming
    const ambient = new THREE.AmbientLight(0x0a1628, 3.0)
    this.scene.add(ambient)
    this.lights.ambient = ambient

    const dirLight = new THREE.DirectionalLight(0xffffff, 4)
    dirLight.position.set(3, 12, 5)
    dirLight.castShadow = true
    dirLight.shadow.mapSize.width = 2048
    dirLight.shadow.mapSize.height = 2048
    dirLight.shadow.camera.near = 0.1
    dirLight.shadow.camera.far = 60
    dirLight.shadow.camera.left = -12
    dirLight.shadow.camera.right = 12
    dirLight.shadow.camera.top = 12
    dirLight.shadow.camera.bottom = -12
    dirLight.shadow.bias = -0.001
    this.scene.add(dirLight)
    this.lights.dir = dirLight

    const fillLight = new THREE.PointLight(0x0044ff, 3, 40)
    fillLight.position.set(-5, 8, -5)
    this.scene.add(fillLight)
    this.lights.fill = fillLight

    const rimLight = new THREE.PointLight(0x00ff88, 1.5, 25)
    rimLight.position.set(5, 4, -5)
    this.scene.add(rimLight)
    this.lights.rim = rimLight

    const topLight = new THREE.PointLight(0x6644ff, 2, 35)
    topLight.position.set(0, 15, 0)
    this.scene.add(topLight)
    this.lights.top = topLight

    // Post-processing
    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this._bloomEffect = new BloomEffect({
      intensity: 2.2,
      luminanceThreshold: 0.1,
      luminanceSmoothing: 0.8,
      mipmapBlur: true
    })
    this.composer.addPass(new EffectPass(this.camera, this._bloomEffect))

    // Star field
    this._createStarField()

    // Systems
    this.particleSystem.init(this.scene)

    // Player mesh (astronaut)
    this._createPlayer()

    window.addEventListener('resize', this._onResize.bind(this))
  }

  _createStarField() {
    const count = 1500
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200

      const brightness = 0.5 + Math.random() * 0.5
      const colorChoice = Math.random()
      if (colorChoice < 0.7) {
        colors[i * 3] = brightness
        colors[i * 3 + 1] = brightness
        colors[i * 3 + 2] = brightness
      } else if (colorChoice < 0.85) {
        colors[i * 3] = brightness * 0.6
        colors[i * 3 + 1] = brightness * 0.8
        colors[i * 3 + 2] = brightness
      } else {
        colors[i * 3] = brightness
        colors[i * 3 + 1] = brightness * 0.6
        colors[i * 3 + 2] = brightness * 0.4
      }
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const mat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9
    })

    this.starField = new THREE.Points(geo, mat)
    this.scene.add(this.starField)
  }

  _createPlayer() {
    // Astronaut capsule group
    this.playerMesh = new THREE.Group()
    this.playerMesh.position.set(0, 0.4, 0)
    this.scene.add(this.playerMesh)

    // Space suit body — rounded capsule shape
    const bodyGeo = new THREE.CapsuleGeometry(0.22, 0.18, 8, 16)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xdce8f0,
      emissive: 0x002244,
      emissiveIntensity: 0.4,
      roughness: 0.25,
      metalness: 0.5
    })
    this._playerBody = new THREE.Mesh(bodyGeo, bodyMat)
    this._playerBody.castShadow = true
    this._playerBody.rotation.x = Math.PI / 2
    this.playerMesh.add(this._playerBody)

    // Helmet visor — dark reflective dome on top
    const visorGeo = new THREE.SphereGeometry(0.17, 12, 8)
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x001122,
      emissive: 0x0066ff,
      emissiveIntensity: 2.5,
      roughness: 0.0,
      metalness: 1.0,
      transparent: true,
      opacity: 0.88
    })
    this._visor = new THREE.Mesh(visorGeo, visorMat)
    this._visor.position.set(0, 0.16, 0)
    this._visor.scale.set(1, 0.65, 1)
    this.playerMesh.add(this._visor)

    // Life support pack (small box on back)
    const packGeo = new THREE.BoxGeometry(0.18, 0.18, 0.08)
    const packMat = new THREE.MeshStandardMaterial({
      color: 0xaabbcc,
      emissive: 0x001122,
      emissiveIntensity: 0.3,
      roughness: 0.6,
      metalness: 0.6
    })
    this._lifePack = new THREE.Mesh(packGeo, packMat)
    this._lifePack.position.set(0, 0.05, -0.24)
    this.playerMesh.add(this._lifePack)

    // Thruster nozzle left
    const thrGeo = new THREE.CylinderGeometry(0.04, 0.06, 0.1, 6)
    const thrMat = new THREE.MeshStandardMaterial({
      color: 0x334455,
      emissive: 0x00aaff,
      emissiveIntensity: 1.5,
      roughness: 0.3,
      metalness: 0.8
    })
    this._thrL = new THREE.Mesh(thrGeo, thrMat)
    this._thrL.position.set(-0.22, -0.1, 0)
    this._thrL.rotation.z = Math.PI / 2
    this.playerMesh.add(this._thrL)

    // Thruster nozzle right
    this._thrR = new THREE.Mesh(thrGeo.clone(), thrMat.clone())
    this._thrR.position.set(0.22, -0.1, 0)
    this._thrR.rotation.z = -Math.PI / 2
    this.playerMesh.add(this._thrR)

    // Thruster exhaust glow particles (inner glow discs)
    const exhaustGeo = new THREE.CircleGeometry(0.04, 8)
    const exhaustMat = new THREE.MeshStandardMaterial({
      color: 0x00ccff,
      emissive: 0x00aaff,
      emissiveIntensity: 4.0,
      transparent: true,
      opacity: 0.8
    })
    this._exhaustL = new THREE.Mesh(exhaustGeo, exhaustMat)
    this._exhaustL.position.set(-0.28, -0.1, 0)
    this._exhaustL.rotation.y = Math.PI / 2
    this.playerMesh.add(this._exhaustL)

    this._exhaustR = new THREE.Mesh(exhaustGeo.clone(), exhaustMat.clone())
    this._exhaustR.position.set(0.28, -0.1, 0)
    this._exhaustR.rotation.y = -Math.PI / 2
    this.playerMesh.add(this._exhaustR)

    // Player glow light
    const glow = new THREE.PointLight(0x00aaff, 2.0, 4)
    glow.position.set(0, 0, 0)
    this.playerMesh.add(glow)
    this._playerGlow = glow
  }

  _applyChapterTheme(chapter) {
    const theme = CHAPTER_THEMES[chapter] || CHAPTER_THEMES.moon
    this._currentTheme = theme

    // Background & fog
    this.scene.background.setHex(theme.background)
    this.scene.fog.color.setHex(theme.fog)
    this.scene.fog.density = theme.fogDensity

    // Lights
    this.lights.ambient.color.setHex(theme.ambient)
    this.lights.ambient.intensity = theme.ambientIntensity
    this.lights.dir.color.setHex(theme.dirColor)
    this.lights.dir.intensity = theme.dirIntensity
    this.lights.fill.color.setHex(theme.fill1Color)
    this.lights.fill.intensity = theme.fill1Intensity
    this.lights.rim.color.setHex(theme.fill2Color)
    this.lights.rim.intensity = theme.fill2Intensity
    this.lights.top.color.setHex(theme.topColor)
    this.lights.top.intensity = theme.topIntensity

    // Bloom
    if (this._bloomEffect) {
      this._bloomEffect.intensity = theme.bloomIntensity
    }

    // Player visor & glow per chapter
    if (this._visor) {
      this._visor.material.emissive.setHex(theme.playerEmissive)
    }
    if (this._playerGlow) {
      this._playerGlow.color.setHex(theme.playerGlow)
    }
    if (this._thrL && this._thrR) {
      this._thrL.material.emissive.setHex(theme.playerGlow)
      this._thrR.material.emissive.setHex(theme.playerGlow)
    }
    if (this._exhaustL && this._exhaustR) {
      this._exhaustL.material.color.setHex(theme.playerGlow)
      this._exhaustL.material.emissive.setHex(theme.playerGlow)
      this._exhaustR.material.color.setHex(theme.playerGlow)
      this._exhaustR.material.emissive.setHex(theme.playerGlow)
    }

    // Star field color tint
    if (this.starField) {
      const c = new THREE.Color(theme.fill2Color)
      this.starField.material.color.setRGB(
        0.7 + c.r * 0.3,
        0.7 + c.g * 0.3,
        0.7 + c.b * 0.3
      )
    }
  }

  loadLevel(levelData) {
    this.levelData = levelData
    this._applyChapterTheme(levelData.chapter || 'moon')
    this.gridSystem.init(this.scene, levelData)

    // Position player
    const wp = this.gridSystem.worldPos(levelData.playerStart.x, levelData.playerStart.y)
    this.playerMesh.position.set(wp.x, 0.4, wp.z)

    // Adjust camera for grid size and screen orientation
    const grid = levelData.grid
    const cols = grid[0].length
    const rows = grid.length
    const maxDim = Math.max(cols, rows)
    const isPortrait = window.innerHeight > window.innerWidth
    const distMult = isPortrait ? 2.8 : 2.2
    const dist = maxDim * 1.1
    this.camera.position.set(dist * 0.35, dist * distMult, dist * 0.65)
    this.camera.lookAt(0, 0, 0)
  }

  movePlayer(fromPos, toPos, path, onComplete) {
    if (this.isAnimating) return

    const worldPositions = path.map(p => ({
      wx: this.gridSystem.worldPos(p.x, p.y).x,
      wy: 0.4,
      wz: this.gridSystem.worldPos(p.x, p.y).z,
      gx: p.x,
      gy: p.y
    }))

    // Emit trail
    this.particleSystem.movementTrail(worldPositions)

    this.isAnimating = true
    this._animateAlongPath(worldPositions, 0, () => {
      this.isAnimating = false
      if (onComplete) onComplete()
    })
  }

  _animateAlongPath(worldPositions, index, onComplete) {
    if (index >= worldPositions.length) {
      onComplete && onComplete()
      return
    }

    const target = worldPositions[index]
    const duration = 0.04 // seconds per step
    const startPos = this.playerMesh.position.clone()
    const endPos = new THREE.Vector3(target.wx, target.wy, target.wz)
    let elapsed = 0

    const animate = (delta) => {
      elapsed += delta
      const t = Math.min(elapsed / duration, 1)
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t // ease in-out
      this.playerMesh.position.lerpVectors(startPos, endPos, eased)

      if (t >= 1) {
        this._currentStepAnim = null
        this._animateAlongPath(worldPositions, index + 1, onComplete)
      } else {
        this._currentStepAnim = animate
      }
    }

    this._currentStepAnim = animate
  }

  craterFall(position, onComplete) {
    const wp = this.gridSystem.worldPos(position.x, position.y)
    this.particleSystem.craterDeath(new THREE.Vector3(wp.x, 0.4, wp.z))

    // Animate player falling
    const startY = this.playerMesh.position.y
    let elapsed = 0
    const duration = 0.5

    this._deathAnim = (delta) => {
      elapsed += delta
      const t = Math.min(elapsed / duration, 1)
      this.playerMesh.position.y = startY - t * 0.8
      this._playerBody.material.opacity = 1 - t
      this._playerBody.material.transparent = true

      if (t >= 1) {
        this._deathAnim = null
        this._playerBody.material.opacity = 1
        this._playerBody.material.transparent = false
        onComplete && onComplete()
      }
    }
  }

  goalReached(onComplete) {
    const wp = this.gridSystem.worldPos(this.levelData.goal.x, this.levelData.goal.y)
    this.particleSystem.goalExplosion(new THREE.Vector3(wp.x, 0.5, wp.z))

    // Camera zoom out
    const startCamPos = this.camera.position.clone()
    const endCamPos = startCamPos.clone().multiplyScalar(1.4)
    let elapsed = 0
    const duration = 1.0

    this._goalAnim = (delta) => {
      elapsed += delta
      const t = Math.min(elapsed / duration, 1)
      this.camera.position.lerpVectors(startCamPos, endCamPos, t)
      this.camera.lookAt(0, 0, 0)
      if (t >= 1) {
        this._goalAnim = null
        onComplete && onComplete()
      }
    }
  }

  collectItem(position) {
    const wp = this.gridSystem.worldPos(position.x, position.y)
    this.particleSystem.collectBurst(new THREE.Vector3(wp.x, 0.4, wp.z))
    this.gridSystem.collectItem(position.x, position.y)
  }

  restoreCollectible(gx, gy) {
    this.gridSystem.restoreCollectible(gx, gy)
  }

  teleportPlayer(fromPos, toPos, onComplete) {
    // Flash effect
    if (this._visor) {
      this._visor.material.emissiveIntensity = 8.0
    }
    setTimeout(() => {
      const wp = this.gridSystem.worldPos(toPos.x, toPos.y)
      this.playerMesh.position.set(wp.x, 0.4, wp.z)
      if (this._visor && this._currentTheme) {
        this._visor.material.emissiveIntensity = 2.5
      }
      onComplete && onComplete()
    }, 150)
  }

  setPlayerPosition(gx, gy) {
    const wp = this.gridSystem.worldPos(gx, gy)
    this.playerMesh.position.set(wp.x, 0.4, wp.z)
  }

  update(delta) {
    this.time += delta

    // Step animations
    if (this._currentStepAnim) {
      this._currentStepAnim(delta)
    }
    if (this._deathAnim) {
      this._deathAnim(delta)
    }
    if (this._goalAnim) {
      this._goalAnim(delta)
    }

    // Astronaut idle animations — gentle float and sway
    if (this.playerMesh && !this.isAnimating && !this._deathAnim) {
      this.playerMesh.position.y = 0.4 + Math.sin(this.time * 2.5) * 0.04
      // Slight sway side to side
      this.playerMesh.rotation.z = Math.sin(this.time * 1.8) * 0.06
      this.playerMesh.rotation.x = Math.sin(this.time * 1.2) * 0.04
    }

    // Visor glow pulse
    if (this._visor) {
      this._visor.material.emissiveIntensity = 2.0 + Math.sin(this.time * 3.5) * 0.5
    }

    // Thruster exhaust flicker
    if (this._exhaustL && this._exhaustR) {
      const flicker = 3.5 + Math.sin(this.time * 12) * 1.5
      this._exhaustL.material.emissiveIntensity = flicker
      this._exhaustR.material.emissiveIntensity = flicker
      this._exhaustL.material.opacity = 0.6 + Math.sin(this.time * 15) * 0.2
      this._exhaustR.material.opacity = 0.6 + Math.sin(this.time * 13) * 0.2
    }

    // Pulse player glow
    if (this._playerGlow) {
      this._playerGlow.intensity = 1.8 + Math.sin(this.time * 4) * 0.5
    }

    // Star field slow rotation
    if (this.starField) {
      this.starField.rotation.y = this.time * 0.005
      this.starField.rotation.x = this.time * 0.003
    }

    this.gridSystem.update(delta)
    this.particleSystem.update(delta)
  }

  render() {
    this.composer.render()
  }

  _onResize() {
    const w = window.innerWidth
    const h = window.innerHeight
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
    this.composer.setSize(w, h)

    // Recompute camera for portrait/landscape
    if (this.levelData) {
      const grid = this.levelData.grid
      const cols = grid[0].length
      const rows = grid.length
      const maxDim = Math.max(cols, rows)
      const isPortrait = h > w
      const distMult = isPortrait ? 2.8 : 2.2
      const dist = maxDim * 1.1
      this.camera.position.set(dist * 0.35, dist * distMult, dist * 0.65)
      this.camera.lookAt(0, 0, 0)
    }
  }

  dispose() {
    window.removeEventListener('resize', this._onResize.bind(this))
    this.gridSystem.dispose()
    this.particleSystem.dispose()
    if (this.renderer) {
      this.renderer.dispose()
    }
  }

  show() {
    if (this.renderer) this.renderer.domElement.style.display = 'block'
  }

  hide() {
    if (this.renderer) this.renderer.domElement.style.display = 'none'
  }
}
