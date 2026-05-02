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

    // Camera — top-down perspective
    this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 200)
    this.camera.position.set(3, 14, 5)
    this.camera.lookAt(0, 0, 0)

    // Lights
    const ambient = new THREE.AmbientLight(0x0a1628, 3.0)
    this.scene.add(ambient)
    this.lights.push(ambient)

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
    this.lights.push(dirLight)

    const fillLight = new THREE.PointLight(0x0044ff, 3, 40)
    fillLight.position.set(-5, 8, -5)
    this.scene.add(fillLight)
    this.lights.push(fillLight)

    const rimLight = new THREE.PointLight(0x00ff88, 1.5, 25)
    rimLight.position.set(5, 4, -5)
    this.scene.add(rimLight)
    this.lights.push(rimLight)

    const topLight = new THREE.PointLight(0x6644ff, 2, 35)
    topLight.position.set(0, 15, 0)
    this.scene.add(topLight)
    this.lights.push(topLight)

    // Post-processing
    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    const bloom = new BloomEffect({
      intensity: 2.2,
      luminanceThreshold: 0.1,
      luminanceSmoothing: 0.8,
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
    // Player group — this is the object we move
    this.playerMesh = new THREE.Group()
    this.playerMesh.position.set(0, 0.35, 0)
    this.scene.add(this.playerMesh)

    // Gem body — icosahedron for faceted look
    const bodyGeo = new THREE.IcosahedronGeometry(0.26, 1)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00aaff,
      emissiveIntensity: 2.5,
      roughness: 0.05,
      metalness: 0.95
    })
    this._playerBody = new THREE.Mesh(bodyGeo, bodyMat)
    this._playerBody.castShadow = true
    this.playerMesh.add(this._playerBody)

    // Inner glow core
    const coreGeo = new THREE.SphereGeometry(0.14, 8, 8)
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x88ddff,
      emissive: 0x00ccff,
      emissiveIntensity: 4.0,
      roughness: 0.0,
      metalness: 0.0,
      transparent: true,
      opacity: 0.7
    })
    this._playerCore = new THREE.Mesh(coreGeo, coreMat)
    this.playerMesh.add(this._playerCore)

    // Orbital ring
    const ringGeo = new THREE.TorusGeometry(0.4, 0.025, 8, 40)
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00aaff,
      emissiveIntensity: 3.5,
      roughness: 0.1,
      metalness: 0.8
    })
    this._playerRing = new THREE.Mesh(ringGeo, ringMat)
    this._playerRing.rotation.x = Math.PI / 3
    this.playerMesh.add(this._playerRing)

    // Second thinner ring at different angle
    const ring2Geo = new THREE.TorusGeometry(0.34, 0.015, 8, 32)
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x8866ff,
      emissive: 0x4422ff,
      emissiveIntensity: 2.5,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.8
    })
    this._playerRing2 = new THREE.Mesh(ring2Geo, ring2Mat)
    this._playerRing2.rotation.x = -Math.PI / 5
    this._playerRing2.rotation.y = Math.PI / 4
    this.playerMesh.add(this._playerRing2)

    // Player glow light
    const glow = new THREE.PointLight(0x00aaff, 2.0, 4)
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

    // Adjust camera for grid size — top-down perspective
    const grid = levelData.grid
    const cols = grid[0].length
    const rows = grid.length
    const maxDim = Math.max(cols, rows)
    const dist = maxDim * 1.1
    this.camera.position.set(dist * 0.35, dist * 2.2, dist * 0.65)
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
    this._playerBody.material.emissiveIntensity = 6.0
    this._playerCore.material.emissiveIntensity = 8.0
    setTimeout(() => {
      const wp = this.gridSystem.worldPos(toPos.x, toPos.y)
      this.playerMesh.position.set(wp.x, 0.35, wp.z)
      this._playerBody.material.emissiveIntensity = 2.5
      this._playerCore.material.emissiveIntensity = 4.0
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

    // Player float and ring rotation
    if (this.playerMesh && !this.isAnimating && !this._deathAnim) {
      this.playerMesh.position.y = 0.35 + Math.sin(this.time * 3) * 0.05
    }
    if (this._playerBody) {
      this._playerBody.rotation.y = this.time * 1.2
      this._playerBody.rotation.x = Math.sin(this.time * 0.7) * 0.2
    }
    if (this._playerRing) {
      this._playerRing.rotation.z = this.time * 2.0
    }
    if (this._playerRing2) {
      this._playerRing2.rotation.z = -this.time * 1.5
      this._playerRing2.rotation.x = -Math.PI / 5 + Math.sin(this.time * 0.8) * 0.1
    }
    // Pulse player glow
    if (this._playerGlow) {
      this._playerGlow.intensity = 1.8 + Math.sin(this.time * 4) * 0.4
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
