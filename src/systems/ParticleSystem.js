import * as THREE from 'three'

class Particle {
  constructor(position, velocity, color, life, size = 0.08) {
    this.position = position.clone()
    this.velocity = velocity.clone()
    this.color = color
    this.life = life
    this.maxLife = life
    this.size = size
    this.alive = true
  }
}

export class ParticleSystem {
  constructor() {
    this.scene = null
    this.particles = []
    this.pointsMeshes = []
    this._pendingBursts = []
  }

  init(scene) {
    this.scene = scene
  }

  _addBurst(particles) {
    if (!particles.length) return

    const positions = new Float32Array(particles.length * 3)
    const colors = new Float32Array(particles.length * 3)
    const sizes = new Float32Array(particles.length)

    particles.forEach((p, i) => {
      positions[i * 3] = p.position.x
      positions[i * 3 + 1] = p.position.y
      positions[i * 3 + 2] = p.position.z
      const c = new THREE.Color(p.color)
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
      sizes[i] = p.size
    })

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const mat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      sizeAttenuation: true,
      depthWrite: false
    })

    const points = new THREE.Points(geo, mat)
    points.userData.particles = particles
    this.scene.add(points)
    this.pointsMeshes.push(points)
  }

  collectBurst(position) {
    const particles = []
    const count = 18
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const speed = 1.5 + Math.random() * 2.5
      const vel = new THREE.Vector3(
        Math.cos(angle) * speed,
        (1.5 + Math.random() * 2),
        Math.sin(angle) * speed
      )
      particles.push(new Particle(position, vel, 0x00ffff, 0.6 + Math.random() * 0.3, 0.1))
    }
    this.particles.push(...particles)
    this._addBurst(particles)
  }

  goalExplosion(position) {
    const particles = []
    const colors = [0x00ff88, 0x00ffff, 0xffff00, 0xff88ff, 0xffffff, 0x88ff00]
    const count = 50
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const pitch = (Math.random() - 0.5) * Math.PI
      const speed = 2 + Math.random() * 4
      const vel = new THREE.Vector3(
        Math.cos(angle) * Math.cos(pitch) * speed,
        Math.sin(pitch) * speed + 2,
        Math.sin(angle) * Math.cos(pitch) * speed
      )
      const color = colors[Math.floor(Math.random() * colors.length)]
      particles.push(new Particle(position, vel, color, 1.0 + Math.random() * 0.5, 0.12))
    }
    this.particles.push(...particles)
    this._addBurst(particles)
  }

  movementTrail(positions) {
    if (!positions || positions.length < 2) return
    const particles = []
    for (const pos of positions) {
      const p3 = new THREE.Vector3(pos.wx, 0.2, pos.wz)
      for (let i = 0; i < 3; i++) {
        const vel = new THREE.Vector3(
          (Math.random() - 0.5) * 0.5,
          0.3 + Math.random() * 0.5,
          (Math.random() - 0.5) * 0.5
        )
        particles.push(new Particle(p3, vel, 0x0088ff, 0.3 + Math.random() * 0.2, 0.07))
      }
    }
    this.particles.push(...particles)
    this._addBurst(particles)
  }

  craterDeath(position) {
    const particles = []
    const count = 30
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 1 + Math.random() * 2
      const vel = new THREE.Vector3(
        Math.cos(angle) * speed,
        -1 + Math.random() * 0.5,
        Math.sin(angle) * speed
      )
      const darkColors = [0x220011, 0x440022, 0x110033, 0x330044]
      const color = darkColors[Math.floor(Math.random() * darkColors.length)]
      particles.push(new Particle(position, vel, color, 0.5 + Math.random() * 0.3, 0.1))
    }
    // Some lighter sparks flying up
    for (let i = 0; i < 10; i++) {
      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 1,
        2 + Math.random() * 2,
        (Math.random() - 0.5) * 1
      )
      particles.push(new Particle(position, vel, 0xff2200, 0.6, 0.08))
    }
    this.particles.push(...particles)
    this._addBurst(particles)
  }

  update(delta) {
    // Update all particle systems
    const toRemove = []

    for (const pm of this.pointsMeshes) {
      const particles = pm.userData.particles
      if (!particles) continue

      let allDead = true
      const positions = pm.geometry.attributes.position.array
      const colors = pm.geometry.attributes.color.array

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        if (!p.alive) {
          positions[i * 3 + 1] = -1000
          continue
        }

        p.life -= delta
        if (p.life <= 0) {
          p.alive = false
          positions[i * 3 + 1] = -1000
          continue
        }

        allDead = false
        const t = p.life / p.maxLife

        // Gravity
        p.velocity.y -= delta * 4

        p.position.x += p.velocity.x * delta
        p.position.y += p.velocity.y * delta
        p.position.z += p.velocity.z * delta

        positions[i * 3] = p.position.x
        positions[i * 3 + 1] = p.position.y
        positions[i * 3 + 2] = p.position.z

        // Fade out
        const c = new THREE.Color(p.color)
        colors[i * 3] = c.r * t
        colors[i * 3 + 1] = c.g * t
        colors[i * 3 + 2] = c.b * t
      }

      pm.geometry.attributes.position.needsUpdate = true
      pm.geometry.attributes.color.needsUpdate = true
      pm.material.opacity = Math.max(0, (particles.reduce((s, p) => s + p.life / p.maxLife, 0) / particles.length))

      if (allDead) {
        toRemove.push(pm)
      }
    }

    // Clean up dead particle systems
    for (const pm of toRemove) {
      this.scene.remove(pm)
      pm.geometry.dispose()
      pm.material.dispose()
      const idx = this.pointsMeshes.indexOf(pm)
      if (idx >= 0) this.pointsMeshes.splice(idx, 1)
    }
  }

  dispose() {
    for (const pm of this.pointsMeshes) {
      this.scene.remove(pm)
      pm.geometry.dispose()
      pm.material.dispose()
    }
    this.pointsMeshes = []
    this.particles = []
  }
}
