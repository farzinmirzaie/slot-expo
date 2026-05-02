import * as THREE from 'three'
import { EffectComposer, RenderPass, BloomEffect, EffectPass } from 'postprocessing'
import { GridSystem } from '../systems/GridSystem.js'
import { ParticleSystem } from '../systems/ParticleSystem.js'

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
    this.lights = []
    this.time = 0
    this.isAnimating = false
    this._animQueue = []
    this._onAnimDone = null
    this.levelData = null
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

    // Camera — isometric-ish perspective
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200)
    this.camera.position.set(7, 10, 7)
    this.camera.lookAt(0, 0, 0)

    // Lights
    const ambient = new THREE.AmbientLight(0x112233, 2.0)
    this.scene.add(ambient)
    this.lights.push(ambient)

    const dirLight = new THREE.DirectionalLight(0xffffff, 3)
    dirLight.position.set(5, 10, 5)
    dirLight.castShadow = true
    dirLight.shadow.mapSize.width = 1024
    dirLight.shadow.mapSize.height = 1024
    dirLight.shadow.camera.near = 0.1
    dirLight.shadow.camera.far = 50
    dirLight.shadow.camera.left = -10
    dirLight.shadow.camera.right = 10
    dirLight.shadow.camera.top = 10
    dirLight.shadow.camera.bottom = -10
    this.scene.add(dirLight)
    this.lights.push(dirLight)

    const fillLight = new THREE.PointLight(0x0044ff, 2, 30)
    fillLight.position.set(-5, 5, -5)
    this.scene.add(fillLight)
    this.lights.push(fillLight)

    const rimLight = new THREE.PointLight(0x00ff88, 1, 20)
    rimLight.position.set(5, 3, -5)
    this.scene.add(rimLight)
    this.lights.push(rimLight)

    // Post-processing
    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    const bloom = new BloomEffect({
      intensity: 1.8,
      luminanceThreshold: 0.15,
      luminanceSmoothing: 0.9,
      mipmapBlur: true
    })
    this.composer.addPass(new EffectPass(this.camera, bloom))

    // Star field
    this._createStarField()

    // Systems
    this.particleSystem.init(this.scene)

    // Player mesh
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
    const geo = new THREE.SphereGeometry(0.28, 16, 16)
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00aaff,
      emissiveIntensity: 2.0,
      roughness: 0.1,
      metalness: 0.8
    })
    this.playerMesh = new THREE.Mesh(geo, mat)
    this.playerMesh.castShadow = true
    this.playerMesh.position.set(0, 0.35, 0)
    this.scene.add(this.playerMesh)

    // Player glow light
    const glow = new THREE.PointLight(0x00aaff, 1.5, 3)
    glow.position.set(0, 0, 0)
    this.playerMesh.add(glow)
    this._playerGlow = glow
  }

  loadLevel(levelData) {
    this.levelData = levelData
    this.gridSystem.init(this.scene, levelData)

    // Position player
    const wp = this.gridSystem.worldPos(levelData.playerStart.x, levelData.playerStart.y)
    this.playerMesh.position.set(wp.x, 0.35, wp.z)

    // Adjust camera for grid size
    const grid = levelData.grid
    const cols = grid[0].length
    const rows = grid.length
    const maxDim = Math.max(cols, rows)
    const dist = maxDim * 1.1
    this.camera.position.set(dist, dist * 1.3, dist)
    this.camera.lookAt(0, 0, 0)
  }

  movePlayer(fromPos, toPos, path, onComplete) {
    if (this.isAnimating) return

    const worldPositions = path.map(p => ({
      wx: this.gridSystem.worldPos(p.x, p.y).x,
      wy: 0.35,
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
    this.particleSystem.craterDeath(new THREE.Vector3(wp.x, 0.35, wp.z))

    // Animate player falling
    const startY = this.playerMesh.position.y
    let elapsed = 0
    const duration = 0.5

    this._deathAnim = (delta) => {
      elapsed += delta
      const t = Math.min(elapsed / duration, 1)
      this.playerMesh.position.y = startY - t * 0.8
      this.playerMesh.material.opacity = 1 - t
      this.playerMesh.material.transparent = true

      if (t >= 1) {
        this._deathAnim = null
        this.playerMesh.material.opacity = 1
        this.playerMesh.material.transparent = false
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
    this.playerMesh.material.emissiveIntensity = 5.0
    setTimeout(() => {
      const wp = this.gridSystem.worldPos(toPos.x, toPos.y)
      this.playerMesh.position.set(wp.x, 0.35, wp.z)
      this.playerMesh.material.emissiveIntensity = 2.0
      onComplete && onComplete()
    }, 150)
  }

  setPlayerPosition(gx, gy) {
    const wp = this.gridSystem.worldPos(gx, gy)
    this.playerMesh.position.set(wp.x, 0.35, wp.z)
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

    // Player float
    if (this.playerMesh && !this.isAnimating && !this._deathAnim) {
      this.playerMesh.position.y = 0.35 + Math.sin(this.time * 3) * 0.04
      this.playerMesh.rotation.y = this.time * 1.5
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
