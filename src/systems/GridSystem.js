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
      case TILE_EMPTY:
        // Subtle floor tile
        geo = new THREE.BoxGeometry(s, 0.1, s)
        mat = new THREE.MeshStandardMaterial({ color: 0x111122, roughness: 0.8, metalness: 0.2 })
        mesh = new THREE.Mesh(geo, mat)
        mesh.position.set(x, 0, z)
        break

      case TILE_BLOCKER:
        geo = new THREE.BoxGeometry(s * 0.85, 0.55, s * 0.85)
        mat = new THREE.MeshStandardMaterial({ color: 0x445566, roughness: 0.7, metalness: 0.3 })
        mesh = new THREE.Mesh(geo, mat)
        mesh.position.set(x, 0.28, z)
        // Add secondary detail
        const detGeo = new THREE.BoxGeometry(s * 0.6, 0.7, s * 0.6)
        const detMat = new THREE.MeshStandardMaterial({ color: 0x334455, roughness: 0.8 })
        const detail = new THREE.Mesh(detGeo, detMat)
        detail.position.set(x, 0.35, z)
        this.gridGroup.add(detail)
        break

      case TILE_CRATER:
        geo = new THREE.CylinderGeometry(s * 0.45, s * 0.3, 0.15, 8)
        mat = new THREE.MeshStandardMaterial({ color: 0x050510, roughness: 1.0, metalness: 0.0 })
        mesh = new THREE.Mesh(geo, mat)
        mesh.position.set(x, -0.05, z)
        // Crater rim
        const rimGeo = new THREE.TorusGeometry(s * 0.45, 0.05, 8, 16)
        const rimMat = new THREE.MeshStandardMaterial({ color: 0x223344, roughness: 0.9 })
        const rim = new THREE.Mesh(rimGeo, rimMat)
        rim.rotation.x = Math.PI / 2
        rim.position.set(x, 0.02, z)
        this.gridGroup.add(rim)
        break

      case TILE_SAND:
        geo = new THREE.BoxGeometry(s, 0.12, s)
        mat = new THREE.MeshStandardMaterial({ color: 0xcc8844, roughness: 1.0, metalness: 0.0 })
        mesh = new THREE.Mesh(geo, mat)
        mesh.position.set(x, 0.01, z)
        // Sand ripple lines
        const ripGeo = new THREE.PlaneGeometry(s * 0.8, s * 0.8, 3, 3)
        const ripMat = new THREE.MeshStandardMaterial({ color: 0xddaa66, roughness: 1.0, transparent: true, opacity: 0.5 })
        const rip = new THREE.Mesh(ripGeo, ripMat)
        rip.rotation.x = -Math.PI / 2
        rip.position.set(x, 0.07, z)
        this.gridGroup.add(rip)
        break

      case TILE_ICE:
        geo = new THREE.BoxGeometry(s, 0.1, s)
        mat = new THREE.MeshStandardMaterial({
          color: 0x88ccff,
          emissive: 0x224466,
          emissiveIntensity: 0.3,
          roughness: 0.1,
          metalness: 0.6,
          transparent: true,
          opacity: 0.85
        })
        mesh = new THREE.Mesh(geo, mat)
        mesh.position.set(x, 0, z)
        break

      case TILE_TELEPORT:
        geo = new THREE.CylinderGeometry(s * 0.42, s * 0.42, 0.1, 12)
        mat = new THREE.MeshStandardMaterial({
          color: 0xaa44ff,
          emissive: 0x441166,
          emissiveIntensity: 0.8,
          roughness: 0.3,
          metalness: 0.7
        })
        mesh = new THREE.Mesh(geo, mat)
        mesh.position.set(x, 0.05, z)
        // Teleport ring
        const tRingGeo = new THREE.TorusGeometry(s * 0.42, 0.04, 8, 20)
        const tRingMat = new THREE.MeshStandardMaterial({
          color: 0xcc88ff,
          emissive: 0x6622aa,
          emissiveIntensity: 1.0
        })
        const tRing = new THREE.Mesh(tRingGeo, tRingMat)
        tRing.rotation.x = Math.PI / 2
        tRing.position.set(x, 0.12, z)
        tRing.userData.isTeleportRing = true
        tRing.userData.baseY = 0.12
        this.gridGroup.add(tRing)
        this.tileMeshes.push(tRing)
        break

      default:
        geo = new THREE.BoxGeometry(s, 0.1, s)
        mat = new THREE.MeshStandardMaterial({ color: 0x111122 })
        mesh = new THREE.Mesh(geo, mat)
        mesh.position.set(x, 0, z)
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

    const geo = new THREE.CylinderGeometry(s * 0.45, s * 0.45, 0.1, 12)
    const mat = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      emissive: 0x00aa44,
      emissiveIntensity: 1.5,
      roughness: 0.2,
      metalness: 0.5
    })
    this.goalMesh = new THREE.Mesh(geo, mat)
    this.goalMesh.position.set(x, 0.06, z)
    this.goalMesh.userData.isGoal = true
    this.goalMesh.userData.baseY = 0.06
    this.gridGroup.add(this.goalMesh)

    // Goal ring
    const ringGeo = new THREE.TorusGeometry(s * 0.45, 0.05, 8, 24)
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x00ffaa,
      emissive: 0x00ff88,
      emissiveIntensity: 2.0
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2
    ring.position.set(x, 0.14, z)
    ring.userData.isGoalRing = true
    ring.userData.baseY = 0.14
    this.goalMesh.userData.ring = ring
    this.gridGroup.add(ring)
  }

  _createCollectible(col, offsetX, offsetZ) {
    const x = offsetX + col.x
    const z = offsetZ + col.y

    const geo = new THREE.SphereGeometry(0.22, 10, 10)
    const mat = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x006688,
      emissiveIntensity: 1.5,
      roughness: 0.1,
      metalness: 0.8
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(x, 0.4, z)
    mesh.userData.isCollectible = true
    mesh.userData.gridX = col.x
    mesh.userData.gridY = col.y
    mesh.userData.baseY = 0.4
    mesh.userData.collected = false
    this.gridGroup.add(mesh)
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
      this.goalMesh.material.emissiveIntensity = 1.0 + pulse * 1.5
      this.goalMesh.position.y = this.goalMesh.userData.baseY + Math.sin(this.time * 2) * 0.03
      if (this.goalMesh.userData.ring) {
        const ring = this.goalMesh.userData.ring
        ring.rotation.z = this.time * 1.5
        ring.position.y = ring.userData.baseY + Math.sin(this.time * 2) * 0.03
      }
    }

    // Animate collectibles
    for (const cm of this.collectibleMeshes) {
      if (!cm.userData.collected) {
        cm.position.y = cm.userData.baseY + Math.sin(this.time * 2.5 + cm.userData.gridX) * 0.07
        cm.rotation.y = this.time * 2
      }
    }

    // Animate teleport rings
    for (const m of this.tileMeshes) {
      if (m.userData.isTeleportRing) {
        m.rotation.z = this.time * 2.0
        m.position.y = m.userData.baseY + Math.sin(this.time * 2) * 0.03
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
