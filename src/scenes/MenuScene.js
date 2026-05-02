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
  }

  init(container) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor(0x000010, 1)
    container.appendChild(this.renderer.domElement)

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
    this.camera.position.set(0, 0, 15)

    const ambient = new THREE.AmbientLight(0x112244, 3)
    this.scene.add(ambient)

    const point = new THREE.PointLight(0x00aaff, 5, 30)
    point.position.set(0, 5, 5)
    this.scene.add(point)

    this._createStars()
    this._createFloatingShapes()

    this._resizeBound = this._onResize.bind(this)
    window.addEventListener('resize', this._resizeBound)
  }

  _createStars() {
    const count = 800
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100
      pos[i * 3 + 2] = -20 + (Math.random() - 0.5) * 40
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.7 })
    this.starField = new THREE.Points(geo, mat)
    this.scene.add(this.starField)
  }

  _createFloatingShapes() {
    const geos = [
      new THREE.IcosahedronGeometry(0.8, 0),
      new THREE.OctahedronGeometry(0.7),
      new THREE.TetrahedronGeometry(0.9),
      new THREE.BoxGeometry(0.8, 0.8, 0.8),
      new THREE.IcosahedronGeometry(0.5, 1),
    ]
    const colors = [0x00aaff, 0x00ff88, 0xaa44ff, 0xff4488, 0xffaa00]

    for (let i = 0; i < 12; i++) {
      const geo = geos[i % geos.length]
      const color = colors[i % colors.length]
      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.5,
        wireframe: Math.random() > 0.5,
        transparent: true,
        opacity: 0.4 + Math.random() * 0.4
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 10,
        -5 + (Math.random() - 0.5) * 5
      )
      mesh.userData.rotSpeed = new THREE.Vector3(
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 0.8
      )
      mesh.userData.floatOffset = Math.random() * Math.PI * 2
      mesh.userData.baseY = mesh.position.y
      this.scene.add(mesh)
      this.shapes.push(mesh)
    }
  }

  update(delta) {
    this.time += delta

    for (const shape of this.shapes) {
      shape.rotation.x += shape.userData.rotSpeed.x * delta
      shape.rotation.y += shape.userData.rotSpeed.y * delta
      shape.rotation.z += shape.userData.rotSpeed.z * delta
      shape.position.y = shape.userData.baseY + Math.sin(this.time * 0.5 + shape.userData.floatOffset) * 0.5
    }

    if (this.starField) {
      this.starField.rotation.y = this.time * 0.01
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
      s.geometry.dispose()
      s.material.dispose()
    }
    this.shapes = []
    if (this.renderer) {
      this.renderer.dispose()
    }
  }
}
