export const TILE_EMPTY = 0
export const TILE_BLOCKER = 1
export const TILE_CRATER = 2
export const TILE_SAND = 3
export const TILE_ICE = 4
export const TILE_TELEPORT = 5

export class MovementSystem {
  /**
   * Compute where the player glides to given a direction.
   *
   * Core rules:
   *  - Player slides through EMPTY and ICE tiles without stopping.
   *  - Player stops BEFORE a BLOCKER (cannot enter it).
   *  - Player stops AT the GOAL tile.
   *  - Player stops ON a SAND tile (friction), UNLESS the tile just
   *    entered was ICE (ice streak overrides sand friction).
   *  - Player falls into a CRATER (fail state).
   *  - TELEPORT sends player to the paired tile and continues sliding.
   *  - Boundary walls stop the player at the last valid tile.
   *
   * @param {number[][]} grid       - [row][col] tile types
   * @param {{x,y}} playerPos       - current column / row
   * @param {string} direction      - 'up'|'down'|'left'|'right'
   * @param {{from:{x,y},to:{x,y}}[]} teleports
   * @param {Set<string>} collected - already-collected "x,y" keys
   * @param {{x,y}|null} goal       - goal position (stops the player)
   * @returns {{newPos, path, fellInCrater, teleported, teleportDest, newlyCollected}}
   */
  computeGlide(grid, playerPos, direction, teleports = [], collected = new Set(), goal = null) {
    const rows = grid.length
    const cols = grid[0].length

    const dx = direction === 'right' ? 1 : direction === 'left' ? -1 : 0
    const dy = direction === 'down'  ? 1 : direction === 'up'   ? -1 : 0

    let cx = playerPos.x
    let cy = playerPos.y
    const path = []
    let fellInCrater = false
    let teleported    = false
    let teleportDest  = null
    const newlyCollected = []
    let onIce = false

    // Build teleport look-up (bidirectional)
    const tpMap = new Map()
    for (const tp of teleports) {
      tpMap.set(`${tp.from.x},${tp.from.y}`, tp.to)
      tpMap.set(`${tp.to.x},${tp.to.y}`,     tp.from)
    }

    while (true) {
      const nx = cx + dx
      const ny = cy + dy

      // ── Wall (boundary) ─────────────────────────────────────────────
      if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) {
        break // stop at current position
      }

      const nextTile = grid[ny][nx]

      // ── Blocker ──────────────────────────────────────────────────────
      if (nextTile === TILE_BLOCKER) {
        break // stop before entering
      }

      // ── Move into the next cell ──────────────────────────────────────
      cx = nx
      cy = ny
      path.push({ x: cx, y: cy })

      // Every position in the path is a candidate collectible
      newlyCollected.push({ x: cx, y: cy })

      // ── Crater ───────────────────────────────────────────────────────
      if (nextTile === TILE_CRATER) {
        fellInCrater = true
        break
      }

      // ── Goal tile (stops the player) ─────────────────────────────────
      if (goal && cx === goal.x && cy === goal.y) {
        break
      }

      // ── Teleport ─────────────────────────────────────────────────────
      if (nextTile === TILE_TELEPORT) {
        const tpKey = `${cx},${cy}`
        if (tpMap.has(tpKey)) {
          const dest = tpMap.get(tpKey)
          cx = dest.x
          cy = dest.y
          path.push({ x: cx, y: cy })
          newlyCollected.push({ x: cx, y: cy })
          teleported    = true
          teleportDest  = { x: cx, y: cy }
          onIce = false
        }
        continue // continue sliding after teleport
      }

      // ── Ice ──────────────────────────────────────────────────────────
      if (nextTile === TILE_ICE) {
        onIce = true
        continue // cannot stop on ice
      }

      // ── Sand ─────────────────────────────────────────────────────────
      if (nextTile === TILE_SAND) {
        if (!onIce) {
          break // sand stops the player (friction)
        }
        // ice streak overrides sand — keep sliding, reset ice flag
        onIce = false
        continue
      }

      // ── Empty tile ───────────────────────────────────────────────────
      // The core GLIDE mechanic: empty tiles are traversed without stopping.
      onIce = false
      // Do NOT break — continue sliding until wall/blocker/goal/sand.
    }

    return {
      newPos: { x: cx, y: cy },
      path,
      fellInCrater,
      teleported,
      teleportDest,
      newlyCollected
    }
  }

  /**
   * Returns true if at least one direction produces actual movement.
   */
  hasValidMove(grid, playerPos, teleports = [], collected = new Set(), goal = null) {
    for (const dir of ['up', 'down', 'left', 'right']) {
      const result = this.computeGlide(grid, playerPos, dir, teleports, collected, goal)
      if (result.newPos.x !== playerPos.x || result.newPos.y !== playerPos.y) {
        return true
      }
    }
    return false
  }
}
