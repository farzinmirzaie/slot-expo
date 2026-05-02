import * as THREE from 'three'

export const TILE_EMPTY = 0
export const TILE_BLOCKER = 1
export const TILE_CRATER = 2
export const TILE_SAND = 3
export const TILE_ICE = 4
export const TILE_TELEPORT = 5

const TILE_SIZE = 1
const TILE_GAP = 0.05

export class GridSystem {
  constructor() {
    this.scene = null
    this.levelData = null
    this.tileMeshes = []
    this.goalMesh = null
    this.collectibleMeshes = []
    this.gridGroup = null
    this.time = 0
  }

  init(scene, levelData) {
    this.scene = scene
    this.levelData = levelData
    this.tileMeshes = []
    this.collectibleMeshes = []

    if (this.gridGroup) {
      this.scene.remove(this.gridGroup)
      this.dispose()
    }

    this.gridGroup = new THREE.Group()
    this.scene.add(this.gridGroup)

    const grid = levelData.grid
    const rows = grid.length
    const cols = grid[0].length

    // Center the grid
    const offsetX = -cols / 2 + 0.5
    const offsetZ = -rows / 2 + 0.5

    // Create base floor plane
    const floorGeo = new THREE.PlaneGeometry(cols + 0.5, rows + 0.5)
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x050510,
      roughness: 0.9,
      metalness: 0.1
    })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.set(0, -0.1, 0)
    floor.receiveShadow = true
    this.gridGroup.add(floor)

    // Grid lines
    const lineMat = new THREE.LineBasicMaterial({ color: 0x112233, transparent: true, opacity: 0.4 })
    for (let r = 0; r <= rows; r++) {
      const pts = [
        new THREE.Vector3(offsetX - 0.5, 0.01, offsetZ + r - 0.5),
        new THREE.Vector3(offsetX + cols - 0.5, 0.01, offsetZ + r - 0.5)
      ]
      const geo = new THREE.BufferGeometry().setFromPoints(pts)
      this.gridGroup.add(new THREE.Line(geo, lineMat))
    }
    for (let c = 0; c <= cols; c++) {
      const pts = [
        new THREE.Vector3(offsetX + c - 0.5, 0.01, offsetZ - 0.5),
        new THREE.Vector3(offsetX + c - 0.5, 0.01, offsetZ + rows - 0.5)
      ]
      const geo = new THREE.BufferGeometry().setFromPoints(pts)
      this.gridGroup.add(new THREE.Line(geo, lineMat))
    }

    // Create tile meshes
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tile = grid[r][c]
        const x = offsetX + c
        const z = offsetZ + r
        this._createTile(tile, x, z, c, r)
      }
    }

    // Goal tile
    this._createGoalTile(levelData.goal, offsetX, offsetZ)

    // Collectibles
    if (levelData.collectibles) {
      for (const col of levelData.collectibles) {
        this._createCollectible(col, offsetX, offsetZ)
      }
    }
  }

  _createTile(tileType, x, z, col, row) {
    let geo, mat, mesh
    const s = TILE_SIZE - TILE_GAP

    switch (tileType) {
      case TILE_EMPTY: {
        // Raised platform tile with subtle top face
        geo = new THREE.BoxGeometry(s, 0.12, s)
        mat = new THREE.MeshStandardMaterial({
          color: 0x0d1628,
          emissive: 0x0a1020,
          emissiveIntensity: 0.5,
          roughness: 0.7,
          metalness: 0.4
        })
        mesh = new THREE.Mesh(geo, mat)
        mesh.position.set(x, 0, z)
        // Top edge glow strip
        const edgeGeo = new THREE.BoxGeometry(s, 0.01, s)
        const edgeMat = new THREE.MeshStandardMaterial({
          color: 0x1a3a5c,
          emissive: 0x112244,
          emissiveIntensity: 1.0,
          roughness: 0.3,
          metalness: 0.8
        })
        const edge = new THREE.Mesh(edgeGeo, edgeMat)
        edge.position.set(x, 0.065, z)
        this.gridGroup.add(edge)
        break
      }

      case TILE_BLOCKER: {
        // Hexagonal crystal pillar
        const baseGeo = new THREE.CylinderGeometry(s * 0.48, s * 0.5, 0.12, 6)
        const baseMat = new THREE.MeshStandardMaterial({
          color: 0x334455,
          roughness: 0.6,
          metalness: 0.5
        })
        const baseMesh = new THREE.Mesh(baseGeo, baseMat)
        baseMesh.position.set(x, 0.06, z)
        this.gridGroup.add(baseMesh)

        // Pillar body
        geo = new THREE.CylinderGeometry(s * 0.35, s * 0.42, 0.7, 6)
        mat = new THREE.MeshStandardMaterial({
          color: 0x445566,
          emissive: 0x112233,
          emissiveIntensity: 0.4,
          roughness: 0.5,
          metalness: 0.6
        })
        mesh = new THREE.Mesh(geo, mat)
        mesh.position.set(x, 0.47, z)

        // Crystal cap
        const capGeo = new THREE.ConeGeometry(s * 0.3, 0.35, 6)
        const capMat = new THREE.MeshStandardMaterial({
          color: 0x6688aa,
          emissive: 0x224466,
          emissiveIntensity: 0.8,
          roughness: 0.2,
          metalness: 0.9,
          transparent: true,
          opacity: 0.9
        })
        const cap = new THREE.Mesh(capGeo, capMat)
        cap.position.set(x, 0.995, z)
        this.gridGroup.add(cap)
        break
      }

      case TILE_CRATER: {
        // Base floor
        geo = new THREE.CylinderGeometry(s * 0.46, s * 0.42, 0.08, 12)
        mat = new THREE.MeshStandardMaterial({
          color: 0x020308,
          roughness: 1.0,
          metalness: 0.0
        })
        mesh = new THREE.Mesh(geo, mat)
        mesh.position.set(x, -0.1, z)

        // Inner void
        const voidGeo = new THREE.CylinderGeometry(s * 0.28, s * 0.2, 0.15, 12)
        const voidMat = new THREE.MeshStandardMaterial({
          color: 0x110022,
          emissive: 0x440022,
          emissiveIntensity: 1.5,
          roughness: 1.0
        })
        const voidMesh = new THREE.Mesh(voidGeo, voidMat)
        voidMesh.position.set(x, -0.12, z)
        this.gridGroup.add(voidMesh)

        // Crater rim — glowing orange/red
        const rimGeo = new THREE.TorusGeometry(s * 0.44, 0.055, 8, 20)
        const rimMat = new THREE.MeshStandardMaterial({
          color: 0xff3300,
          emissive: 0xcc1100,
          emissiveIntensity: 2.0,
          roughness: 0.5,
          metalness: 0.3
        })
        const rim = new THREE.Mesh(rimGeo, rimMat)
        rim.rotation.x = Math.PI / 2
        rim.position.set(x, -0.02, z)
        this.gridGroup.add(rim)
        break
      }

      case TILE_SAND: {
        // Sandy tile with warmth
        geo = new THREE.BoxGeometry(s, 0.1, s)
        mat = new THREE.MeshStandardMaterial({
          color: 0xd4824a,
          emissive: 0x5a2a10,
          emissiveIntensity: 0.3,
          roughness: 1.0,
          metalness: 0.0
        })
        mesh = new THREE.Mesh(geo, mat)
        mesh.position.set(x, 0.01, z)

        // Dune ridges
        for (let d = 0; d < 3; d++) {
          const duneGeo = new THREE.BoxGeometry(s * 0.75, 0.025, s * 0.08)
          const duneMat = new THREE.MeshStandardMaterial({
            color: 0xe8a060,
            roughness: 1.0
          })
          const dune = new THREE.Mesh(duneGeo, duneMat)
          dune.position.set(x, 0.063, z - 0.2 + d * 0.2)
          this.gridGroup.add(dune)
        }
        break
      }

      case TILE_ICE: {
        // Ice crystal tile
        geo = new THREE.BoxGeometry(s, 0.1, s)
        mat = new THREE.MeshStandardMaterial({
          color: 0xaaddff,
          emissive: 0x2266aa,
          emissiveIntensity: 0.5,
          roughness: 0.05,
          metalness: 0.7,
          transparent: true,
          opacity: 0.88
        })
        mesh = new THREE.Mesh(geo, mat)
        mesh.position.set(x, 0, z)

        // Ice shards on top
        for (let sh = 0; sh < 3; sh++) {
          const shardGeo = new THREE.ConeGeometry(0.04 + Math.random() * 0.04, 0.12 + Math.random() * 0.1, 4)
          const shardMat = new THREE.MeshStandardMaterial({
            color: 0xddeeff,
            emissive: 0x88ccff,
            emissiveIntensity: 1.2,
            roughness: 0.0,
            metalness: 0.8,
            transparent: true,
            opacity: 0.75
          })
          const shard = new THREE.Mesh(shardGeo, shardMat)
          shard.position.set(
            x + (Math.random() - 0.5) * 0.5,
            0.1 + Math.random() * 0.05,
            z + (Math.random() - 0.5) * 0.5
          )
          shard.rotation.z = (Math.random() - 0.5) * 0.3
          this.gridGroup.add(shard)
        }
        break
      }

      case TILE_TELEPORT: {
        // Teleport pad base
        geo = new THREE.CylinderGeometry(s * 0.44, s * 0.44, 0.08, 16)
        mat = new THREE.MeshStandardMaterial({
          color: 0x7722cc,
          emissive: 0x440088,
          emissiveIntensity: 1.0,
          roughness: 0.2,
          metalness: 0.8
        })
        mesh = new THREE.Mesh(geo, mat)
        mesh.position.set(x, 0.04, z)

        // Inner glow disc
        const discGeo = new THREE.CylinderGeometry(s * 0.3, s * 0.3, 0.02, 16)
        const discMat = new THREE.MeshStandardMaterial({
          color: 0xcc88ff,
          emissive: 0xaa44ff,
          emissiveIntensity: 3.0,
          roughness: 0.1
        })
        const disc = new THREE.Mesh(discGeo, discMat)
        disc.position.set(x, 0.09, z)
        this.gridGroup.add(disc)

        // Outer ring
        const tRingGeo = new THREE.TorusGeometry(s * 0.44, 0.04, 8, 24)
        const tRingMat = new THREE.MeshStandardMaterial({
          color: 0xdd99ff,
          emissive: 0x8833cc,
          emissiveIntensity: 2.5,
          roughness: 0.1,
          metalness: 0.9
        })
        const tRing = new THREE.Mesh(tRingGeo, tRingMat)
        tRing.rotation.x = Math.PI / 2
        tRing.position.set(x, 0.1, z)
        tRing.userData.isTeleportRing = true
        tRing.userData.baseY = 0.1
        this.gridGroup.add(tRing)
        this.tileMeshes.push(tRing)

        // Inner spinning ring
        const tRing2Geo = new THREE.TorusGeometry(s * 0.28, 0.025, 8, 20)
        const tRing2Mat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: 0xcc88ff,
          emissiveIntensity: 3.0,
          roughness: 0.0
        })
        const tRing2 = new THREE.Mesh(tRing2Geo, tRing2Mat)
        tRing2.rotation.x = Math.PI / 3
        tRing2.position.set(x, 0.15, z)
        tRing2.userData.isTeleportRing = true
        tRing2.userData.baseY = 0.15
        tRing2.userData.innerRing = true
        this.gridGroup.add(tRing2)
        this.tileMeshes.push(tRing2)
        break
      }

      default: {
        geo = new THREE.BoxGeometry(s, 0.1, s)
        mat = new THREE.MeshStandardMaterial({ color: 0x111122 })
        mesh = new THREE.Mesh(geo, mat)
        mesh.position.set(x, 0, z)
      }
    }

    if (mesh) {
      mesh.receiveShadow = true
      mesh.castShadow = tileType === TILE_BLOCKER
      mesh.userData.tileType = tileType
      mesh.userData.gridX = col
      mesh.userData.gridY = row
      this.gridGroup.add(mesh)
      this.tileMeshes.push(mesh)
    }
  }

  _createGoalTile(goal, offsetX, offsetZ) {
    const x = offsetX + goal.x
    const z = offsetZ + goal.y
    const s = TILE_SIZE - TILE_GAP

    // Base landing pad
    const padGeo = new THREE.CylinderGeometry(s * 0.47, s * 0.47, 0.08, 16)
    const padMat = new THREE.MeshStandardMaterial({
      color: 0x00aa55,
      emissive: 0x005522,
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.6
    })
    const padMesh = new THREE.Mesh(padGeo, padMat)
    padMesh.position.set(x, 0.04, z)
    this.gridGroup.add(padMesh)

    // Inner glowing disc
    const geo = new THREE.CylinderGeometry(s * 0.28, s * 0.28, 0.06, 16)
    const mat = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      emissive: 0x00cc55,
      emissiveIntensity: 3.0,
      roughness: 0.1,
      metalness: 0.4
    })
    this.goalMesh = new THREE.Mesh(geo, mat)
    this.goalMesh.position.set(x, 0.08, z)
    this.goalMesh.userData.isGoal = true
    this.goalMesh.userData.baseY = 0.08
    this.gridGroup.add(this.goalMesh)

    // Outer pulsing ring
    const ringGeo = new THREE.TorusGeometry(s * 0.46, 0.055, 8, 28)
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x00ffaa,
      emissive: 0x00ff88,
      emissiveIntensity: 2.5,
      roughness: 0.1,
      metalness: 0.7
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2
    ring.position.set(x, 0.1, z)
    ring.userData.isGoalRing = true
    ring.userData.baseY = 0.1
    ring.userData.spinSpeed = 1.5
    this.goalMesh.userData.ring = ring
    this.gridGroup.add(ring)

    // Second inner spinning ring
    const ring2Geo = new THREE.TorusGeometry(s * 0.32, 0.03, 8, 20)
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x88ffcc,
      emissiveIntensity: 3.0,
      roughness: 0.0
    })
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat)
    ring2.rotation.x = Math.PI / 3
    ring2.position.set(x, 0.14, z)
    ring2.userData.isGoalRing = true
    ring2.userData.baseY = 0.14
    ring2.userData.spinSpeed = -2.5
    ring2.userData.innerRing = true
    this.goalMesh.userData.ring2 = ring2
    this.gridGroup.add(ring2)

    // Goal point light
    const goalLight = new THREE.PointLight(0x00ff88, 1.5, 3.5)
    goalLight.position.set(x, 0.5, z)
    this.gridGroup.add(goalLight)
    this.goalMesh.userData.light = goalLight
  }

  _createCollectible(col, offsetX, offsetZ) {
    const x = offsetX + col.x
    const z = offsetZ + col.y

    // Diamond gem shape
    const geo = new THREE.OctahedronGeometry(0.2, 0)
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00ccff,
      emissiveIntensity: 2.5,
      roughness: 0.0,
      metalness: 1.0,
      transparent: true,
      opacity: 0.92
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(x, 0.45, z)
    mesh.userData.isCollectible = true
    mesh.userData.gridX = col.x
    mesh.userData.gridY = col.y
    mesh.userData.baseY = 0.45
    mesh.userData.collected = false
    this.gridGroup.add(mesh)

    // Gem ring halo
    const haloGeo = new THREE.TorusGeometry(0.26, 0.018, 6, 24)
    const haloMat = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00aaff,
      emissiveIntensity: 2.0,
      roughness: 0.1
    })
    const halo = new THREE.Mesh(haloGeo, haloMat)
    halo.rotation.x = Math.PI / 2
    mesh.add(halo)
    mesh.userData.halo = halo

    // Small point light
    const light = new THREE.PointLight(0x00ccff, 0.8, 2.5)
    light.position.set(0, 0, 0)
    mesh.add(light)

    this.collectibleMeshes.push(mesh)
  }

  collectItem(gx, gy) {
    const mesh = this.collectibleMeshes.find(
      m => m.userData.gridX === gx && m.userData.gridY === gy && !m.userData.collected
    )
    if (mesh) {
      mesh.userData.collected = true
      this.gridGroup.remove(mesh)
    }
  }

  restoreCollectible(gx, gy) {
    const mesh = this.collectibleMeshes.find(
      m => m.userData.gridX === gx && m.userData.gridY === gy && m.userData.collected
    )
    if (mesh) {
      mesh.userData.collected = false
      this.gridGroup.add(mesh)
    }
  }

  getGridOffset() {
    const grid = this.levelData.grid
    const cols = grid[0].length
    const rows = grid.length
    return {
      x: -cols / 2 + 0.5,
      z: -rows / 2 + 0.5
    }
  }

  worldPos(gx, gy) {
    const off = this.getGridOffset()
    return new THREE.Vector3(off.x + gx, 0, off.z + gy)
  }

  update(delta) {
    this.time += delta

    // Animate goal
    if (this.goalMesh) {
      const pulse = Math.sin(this.time * 3) * 0.5 + 0.5
      this.goalMesh.material.emissiveIntensity = 2.0 + pulse * 2.0
      this.goalMesh.position.y = this.goalMesh.userData.baseY + Math.sin(this.time * 2) * 0.04
      if (this.goalMesh.userData.ring) {
        const ring = this.goalMesh.userData.ring
        ring.rotation.z = this.time * ring.userData.spinSpeed
        ring.position.y = ring.userData.baseY + Math.sin(this.time * 2) * 0.04
      }
      if (this.goalMesh.userData.ring2) {
        const ring2 = this.goalMesh.userData.ring2
        ring2.rotation.z = this.time * ring2.userData.spinSpeed
        ring2.rotation.x = Math.PI / 3 + Math.sin(this.time * 1.2) * 0.15
        ring2.position.y = ring2.userData.baseY + Math.sin(this.time * 2) * 0.04
      }
      if (this.goalMesh.userData.light) {
        this.goalMesh.userData.light.intensity = 1.2 + pulse * 0.8
      }
    }

    // Animate collectibles
    for (const cm of this.collectibleMeshes) {
      if (!cm.userData.collected) {
        cm.position.y = cm.userData.baseY + Math.sin(this.time * 2.5 + cm.userData.gridX) * 0.08
        cm.rotation.y = this.time * 2.5
        cm.rotation.x = Math.sin(this.time * 1.5 + cm.userData.gridY) * 0.3
        if (cm.userData.halo) {
          cm.userData.halo.rotation.z = -this.time * 3
        }
      }
    }

    // Animate teleport rings
    for (const m of this.tileMeshes) {
      if (m.userData.isTeleportRing) {
        if (m.userData.innerRing) {
          m.rotation.z = -this.time * 3.0
          m.rotation.x = Math.PI / 3 + Math.sin(this.time * 1.5) * 0.2
        } else {
          m.rotation.z = this.time * 2.0
          m.position.y = m.userData.baseY + Math.sin(this.time * 2) * 0.03
        }
      }
    }
  }

  highlightTile(x, y) {
    // Flash a tile briefly
    const off = this.getGridOffset()
    const wx = off.x + x
    const wz = off.z + y
    const mesh = this.tileMeshes.find(
      m => Math.abs(m.position.x - wx) < 0.1 && Math.abs(m.position.z - wz) < 0.1 && m.userData.tileType === 0
    )
    if (mesh && mesh.material) {
      const orig = mesh.material.emissiveIntensity || 0
      mesh.material.emissive = new THREE.Color(0x00ffff)
      mesh.material.emissiveIntensity = 1.5
      setTimeout(() => {
        mesh.material.emissiveIntensity = orig
        mesh.material.emissive = new THREE.Color(0x000000)
      }, 200)
    }
  }

  dispose() {
    if (this.gridGroup) {
      this.gridGroup.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) obj.material.dispose()
      })
      if (this.scene) this.scene.remove(this.gridGroup)
      this.gridGroup = null
    }
    this.tileMeshes = []
    this.collectibleMeshes = []
    this.goalMesh = null
  }
}
