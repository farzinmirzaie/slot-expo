import * as THREE from 'three'

export class MenuScene {
  constructor() {
    this.renderer = null
    this.scene = null
    this.camera = null
    this.time = 0
    this.shapes = []
    this.starField = null
    this._resizeBound = null
    this._astronaut = null
    this._planet = null
    this._planet2 = null
    this._signalRings = []
  }

  init(container) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor(0x000008, 1)
    container.appendChild(this.renderer.domElement)

    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2(0x000008, 0.01)
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
    this.camera.position.set(0, 0, 15)

    // Ambient deep space light
    const ambient = new THREE.AmbientLight(0x050812, 4)
    this.scene.add(ambient)

    // Distant star (sun analogue) off-screen
    const sunLight = new THREE.DirectionalLight(0xaaccff, 3)
    sunLight.position.set(8, 6, 5)
    this.scene.add(sunLight)

    // Atmospheric glow lights
    const glowBlue = new THREE.PointLight(0x0055ff, 4, 20)
    glowBlue.position.set(-5, 3, 3)
    this.scene.add(glowBlue)

    const glowCyan = new THREE.PointLight(0x00ffcc, 2, 15)
    glowCyan.position.set(4, -2, 4)
    this.scene.add(glowCyan)

    this._createStars()
    this._createDistantPlanet()
    this._createAstronaut()
    this._createSignalRings()
    this._createDebrisField()

    this._resizeBound = this._onResize.bind(this)
    window.addEventListener('resize', this._resizeBound)
  }

  _createStars() {
    // Dense layered star field
    const counts = [1200, 600, 200]
    const sizes = [0.06, 0.1, 0.18]
    const opacities = [0.5, 0.65, 0.8]
    for (let layer = 0; layer < 3; layer++) {
      const count = counts[layer]
      const geo = new THREE.BufferGeometry()
      const pos = new Float32Array(count * 3)
      const cols = new Float32Array(count * 3)
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 120
        pos[i * 3 + 1] = (Math.random() - 0.5) * 80
        pos[i * 3 + 2] = -30 + (Math.random() - 0.5) * 20
        // Slight blue/white tint
        cols[i * 3] = 0.7 + Math.random() * 0.3
        cols[i * 3 + 1] = 0.8 + Math.random() * 0.2
        cols[i * 3 + 2] = 1.0
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('color', new THREE.BufferAttribute(cols, 3))
      const mat = new THREE.PointsMaterial({
        size: sizes[layer],
        vertexColors: true,
        transparent: true,
        opacity: opacities[layer],
        sizeAttenuation: true
      })
      const stars = new THREE.Points(geo, mat)
      this.scene.add(stars)
      if (layer === 0) this.starField = stars
      else this.shapes.push(stars)
    }
  }

  _createDistantPlanet() {
    // Main unknown planet — dark with cyan atmosphere
    const pGeo = new THREE.SphereGeometry(2.8, 32, 32)
    const pMat = new THREE.MeshStandardMaterial({
      color: 0x0a0e18,
      emissive: 0x000811,
      emissiveIntensity: 0.5,
      roughness: 0.9,
      metalness: 0.1
    })
    this._planet = new THREE.Mesh(pGeo, pMat)
    this._planet.position.set(5.5, -2.5, -8)
    this.scene.add(this._planet)

    // Atmosphere glow halo
    const haloGeo = new THREE.SphereGeometry(3.2, 32, 32)
    const haloMat = new THREE.MeshStandardMaterial({
      color: 0x0033aa,
      emissive: 0x001166,
      emissiveIntensity: 1.5,
      transparent: true,
      opacity: 0.12,
      roughness: 1.0,
      side: THREE.BackSide
    })
    const halo = new THREE.Mesh(haloGeo, haloMat)
    halo.position.copy(this._planet.position)
    this.scene.add(halo)

    // Planet point light
    const pLight = new THREE.PointLight(0x0033aa, 1.2, 18)
    pLight.position.copy(this._planet.position)
    this.scene.add(pLight)

    // Second distant planet (moon-ish)
    const p2Geo = new THREE.SphereGeometry(0.8, 24, 24)
    const p2Mat = new THREE.MeshStandardMaterial({
      color: 0x2a2e38,
      emissive: 0x050810,
      emissiveIntensity: 0.3,
      roughness: 0.95
    })
    this._planet2 = new THREE.Mesh(p2Geo, p2Mat)
    this._planet2.position.set(-7, 3.5, -10)
    this.scene.add(this._planet2)
  }

  _createAstronaut() {
    // Central astronaut figure as focal point
    const group = new THREE.Group()
    group.position.set(-2, -0.5, 0)
    this.scene.add(group)
    this._astronaut = group

    // Space suit body
    const bodyGeo = new THREE.CapsuleGeometry(0.65, 0.55, 8, 16)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xe0e8f0,
      emissive: 0x002244,
      emissiveIntensity: 0.3,
      roughness: 0.3,
      metalness: 0.4
    })
    const body = new THREE.Mesh(bodyGeo, bodyMat)
    body.rotation.x = Math.PI / 2
    group.add(body)

    // Helmet dome
    const helmetGeo = new THREE.SphereGeometry(0.52, 20, 16)
    const helmetMat = new THREE.MeshStandardMaterial({
      color: 0xd0dce8,
      emissive: 0x001122,
      emissiveIntensity: 0.2,
      roughness: 0.15,
      metalness: 0.6,
      transparent: true,
      opacity: 0.85
    })
    const helmet = new THREE.Mesh(helmetGeo, helmetMat)
    helmet.position.set(0, 0.5, 0)
    group.add(helmet)

    // Visor — dark reflective
    const visorGeo = new THREE.SphereGeometry(0.44, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55)
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x000820,
      emissive: 0x0066ff,
      emissiveIntensity: 3.0,
      roughness: 0.0,
      metalness: 1.0,
      transparent: true,
      opacity: 0.9,
      side: THREE.FrontSide
    })
    const visor = new THREE.Mesh(visorGeo, visorMat)
    visor.position.set(0, 0.5, 0.1)
    visor.rotation.x = Math.PI * 0.15
    group.add(visor)
    this._visor = visor

    // Life support backpack
    const packGeo = new THREE.BoxGeometry(0.55, 0.65, 0.22)
    const packMat = new THREE.MeshStandardMaterial({
      color: 0x9aabbc,
      emissive: 0x001122,
      emissiveIntensity: 0.2,
      roughness: 0.6,
      metalness: 0.5
    })
    const pack = new THREE.Mesh(packGeo, packMat)
    pack.position.set(0, 0, -0.72)
    group.add(pack)

    // Thruster nozzles on sides
    const thrGeo = new THREE.CylinderGeometry(0.1, 0.14, 0.28, 6)
    const thrMat = new THREE.MeshStandardMaterial({
      color: 0x334455,
      emissive: 0x0044aa,
      emissiveIntensity: 2.0,
      roughness: 0.3,
      metalness: 0.8
    })
    const thrL = new THREE.Mesh(thrGeo, thrMat)
    thrL.position.set(-0.65, -0.3, 0)
    thrL.rotation.z = Math.PI / 2
    group.add(thrL)
    this._thrL = thrL

    const thrR = new THREE.Mesh(thrGeo.clone(), thrMat.clone())
    thrR.position.set(0.65, -0.3, 0)
    thrR.rotation.z = -Math.PI / 2
    group.add(thrR)
    this._thrR = thrR

    // Exhaust glow discs
    const exGeo = new THREE.CircleGeometry(0.1, 8)
    const exMat = new THREE.MeshStandardMaterial({
      color: 0x00ccff,
      emissive: 0x00aaff,
      emissiveIntensity: 5.0,
      transparent: true, opacity: 0.8
    })
    const exL = new THREE.Mesh(exGeo, exMat)
    exL.position.set(-0.82, -0.3, 0)
    exL.rotation.y = Math.PI / 2
    group.add(exL)
    this._exL = exL

    const exR = new THREE.Mesh(exGeo.clone(), exMat.clone())
    exR.position.set(0.82, -0.3, 0)
    exR.rotation.y = -Math.PI / 2
    group.add(exR)
    this._exR = exR

    // Astronaut glow light
    const aLight = new THREE.PointLight(0x0044ff, 3.0, 8)
    aLight.position.set(-2, 0, 0)
    this.scene.add(aLight)
    this._astronautLight = aLight

    // Helmet glow light  
    const hLight = new THREE.PointLight(0x4488ff, 2.0, 5)
    group.add(hLight)
  }

  _createSignalRings() {
    // Signal beacon rings emanating outward — story hook
    const colors = [0x00ffcc, 0x0088ff, 0x4400ff]
    for (let i = 0; i < 3; i++) {
      const rGeo = new THREE.TorusGeometry(1.5 + i * 0.8, 0.025, 8, 40)
      const rMat = new THREE.MeshStandardMaterial({
        color: colors[i],
        emissive: colors[i],
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.4 - i * 0.1,
        roughness: 0.1
      })
      const ring = new THREE.Mesh(rGeo, rMat)
      ring.position.set(2.5, 1.5, -2)
      ring.rotation.x = Math.PI / 3 + i * 0.3
      ring.rotation.y = i * 0.5
      ring.userData.index = i
      ring.userData.baseScale = 1 + i * 0.1
      this.scene.add(ring)
      this._signalRings.push(ring)
    }

    // Signal source point — bright beacon
    const beaconGeo = new THREE.OctahedronGeometry(0.22, 0)
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00ffcc,
      emissiveIntensity: 5.0,
      roughness: 0.0,
      metalness: 1.0
    })
    this._beacon = new THREE.Mesh(beaconGeo, beaconMat)
    this._beacon.position.set(2.5, 1.5, -2)
    this.scene.add(this._beacon)

    const bLight = new THREE.PointLight(0x00ffcc, 3.0, 10)
    bLight.position.set(2.5, 1.5, -2)
    this.scene.add(bLight)
    this._beaconLight = bLight
  }

  _createDebrisField() {
    // Small floating asteroid/debris pieces in background
    const geo = new THREE.IcosahedronGeometry(0.12, 0)
    for (let i = 0; i < 18; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0x222233,
        emissive: 0x111122,
        emissiveIntensity: 0.2,
        roughness: 0.9,
        metalness: 0.2
      })
      const rock = new THREE.Mesh(geo, mat)
      rock.position.set(
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 12,
        -8 + (Math.random() - 0.5) * 4
      )
      rock.userData.rotSpeed = new THREE.Vector3(
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4
      )
      rock.userData.floatOffset = Math.random() * Math.PI * 2
      rock.userData.baseY = rock.position.y
      this.scene.add(rock)
      this.shapes.push(rock)
    }
  }

  update(delta) {
    this.time += delta

    // Slow starfield drift
    if (this.starField) {
      this.starField.rotation.y = this.time * 0.004
      this.starField.rotation.x = this.time * 0.002
    }

    // Astronaut float and gentle rotation
    if (this._astronaut) {
      this._astronaut.position.y = -0.5 + Math.sin(this.time * 0.6) * 0.22
      this._astronaut.rotation.y = Math.sin(this.time * 0.3) * 0.18
      this._astronaut.rotation.z = Math.sin(this.time * 0.4) * 0.08
    }

    // Visor glow pulse
    if (this._visor) {
      this._visor.material.emissiveIntensity = 2.8 + Math.sin(this.time * 2.8) * 0.8
    }

    // Thruster exhaust flicker
    if (this._exL && this._exR) {
      const flicker = 4.5 + Math.sin(this.time * 11) * 1.8
      this._exL.material.emissiveIntensity = flicker
      this._exR.material.emissiveIntensity = flicker
      this._exL.material.opacity = 0.65 + Math.sin(this.time * 14) * 0.2
      this._exR.material.opacity = 0.65 + Math.sin(this.time * 13) * 0.2
    }

    // Signal rings pulse and expand
    for (const ring of this._signalRings) {
      const t = this.time + ring.userData.index * 0.8
      const pulse = 1.0 + Math.sin(t * 1.2) * 0.06
      ring.scale.set(pulse, pulse, pulse)
      ring.rotation.z += delta * (0.25 - ring.userData.index * 0.08)
      ring.material.opacity = 0.35 + Math.sin(t * 1.4) * 0.12
    }

    // Beacon rotation and glow
    if (this._beacon) {
      this._beacon.rotation.y += delta * 1.5
      this._beacon.rotation.x += delta * 0.8
      this._beaconLight.intensity = 2.5 + Math.sin(this.time * 3.5) * 0.8
    }

    // Planet slow rotation
    if (this._planet) {
      this._planet.rotation.y = this.time * 0.04
    }
    if (this._planet2) {
      this._planet2.rotation.y = this.time * 0.06
      // Moon orbiting slowly
      const orbitR = 5.5
      this._planet2.position.x = -9 + Math.cos(this.time * 0.15) * 2.5
      this._planet2.position.y = 4 + Math.sin(this.time * 0.15) * 1.2
    }

    // Debris field float
    for (const shape of this.shapes) {
      if (shape.userData.rotSpeed) {
        shape.rotation.x += shape.userData.rotSpeed.x * delta
        shape.rotation.y += shape.userData.rotSpeed.y * delta
        shape.rotation.z += shape.userData.rotSpeed.z * delta
        if (shape.userData.floatOffset !== undefined) {
          shape.position.y = shape.userData.baseY + Math.sin(this.time * 0.4 + shape.userData.floatOffset) * 0.3
        }
      } else {
        // Star layers
        shape.rotation.y = this.time * 0.003
      }
    }
  }

  render() {
    if (this.renderer) {
      this.renderer.render(this.scene, this.camera)
    }
  }

  _onResize() {
    const w = window.innerWidth
    const h = window.innerHeight
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
  }

  show() {
    if (this.renderer) this.renderer.domElement.style.display = 'block'
  }

  hide() {
    if (this.renderer) this.renderer.domElement.style.display = 'none'
  }

  dispose() {
    if (this._resizeBound) window.removeEventListener('resize', this._resizeBound)
    for (const s of this.shapes) {
      if (s.geometry) s.geometry.dispose()
      if (s.material) s.material.dispose()
    }
    this.shapes = []
    if (this.renderer) {
      this.renderer.dispose()
    }
  }
}
