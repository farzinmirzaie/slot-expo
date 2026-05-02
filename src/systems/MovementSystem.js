export const TILE_EMPTY = 0
export const TILE_BLOCKER = 1
export const TILE_CRATER = 2
export const TILE_SAND = 3
export const TILE_ICE = 4
export const TILE_TELEPORT = 5

export class MovementSystem {
  /**
   * Compute where the player glides to given a direction.
   * @param {number[][]} grid - 2D array of tile types [row][col]
   * @param {{x:number, y:number}} playerPos - current grid position (x=col, y=row)
   * @param {string} direction - 'up'|'down'|'left'|'right'
   * @param {{x:number,y:number}[][]} teleports - array of {from,to} pairs
   * @param {Set<string>} collected - set of "x,y" strings already collected
   * @returns {{newPos, path, fellInCrater, teleported, teleportDest, newlyCollected}}
   */
  computeGlide(grid, playerPos, direction, teleports = [], collected = new Set()) {
    const rows = grid.length
    const cols = grid[0].length

    const dx = direction === 'right' ? 1 : direction === 'left' ? -1 : 0
    const dy = direction === 'down' ? 1 : direction === 'up' ? -1 : 0

    let cx = playerPos.x
    let cy = playerPos.y
    const path = []
    let fellInCrater = false
    let teleported = false
    let teleportDest = null
    const newlyCollected = []

    // Build teleport lookup maps
    const tpMap = new Map()
    for (const tp of teleports) {
      tpMap.set(`${tp.from.x},${tp.from.y}`, tp.to)
      tpMap.set(`${tp.to.x},${tp.to.y}`, tp.from)
    }

    let sliding = true
    let prevOnIce = false

    while (sliding) {
      const nx = cx + dx
      const ny = cy + dy

      // Check bounds
      if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) {
        // Hit wall — stop at current position
        sliding = false
        break
      }

      const nextTile = grid[ny][nx]

      if (nextTile === TILE_BLOCKER) {
        // Stop before blocker
        sliding = false
        break
      }

      if (nextTile === TILE_CRATER) {
        // Fall into crater
        cx = nx
        cy = ny
        path.push({ x: cx, y: cy })
        fellInCrater = true
        sliding = false
        break
      }

      // Move to next cell
      cx = nx
      cy = ny
      path.push({ x: cx, y: cy })

      // Check for collectible
      const colKey = `${cx},${cy}`
      if (!collected.has(colKey)) {
        // The caller checks if this is actually a collectible location
        newlyCollected.push({ x: cx, y: cy })
      }

      // Check for teleport
      const tpKey = `${cx},${cy}`
      if (nextTile === TILE_TELEPORT && tpMap.has(tpKey)) {
        const dest = tpMap.get(tpKey)
        cx = dest.x
        cy = dest.y
        path.push({ x: cx, y: cy })
        teleported = true
        teleportDest = { x: cx, y: cy }
        // After teleport, continue sliding in same direction
        prevOnIce = false
        continue
      }

      // Check sand — stop ON sand tile
      if (nextTile === TILE_SAND) {
        sliding = false
        break
      }

      // Check ice — continue sliding
      if (nextTile === TILE_ICE) {
        prevOnIce = true
        continue
      }

      // Empty tile — if we were on ice, check if next tile would stop us
      if (prevOnIce && nextTile === TILE_EMPTY) {
        // On empty after ice — we stop here
        prevOnIce = false
        sliding = false
        break
      }

      // Normal empty tile: stop if NOT on ice streak
      if (nextTile === TILE_EMPTY) {
        prevOnIce = false
        sliding = false
        break
      }

      prevOnIce = false
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
   * Check if any move is possible from current position.
   */
  hasValidMove(grid, playerPos, teleports = [], collected = new Set()) {
    const directions = ['up', 'down', 'left', 'right']
    for (const dir of directions) {
      const result = this.computeGlide(grid, playerPos, dir, teleports, collected)
      if (result.newPos.x !== playerPos.x || result.newPos.y !== playerPos.y) {
        return true
      }
    }
    return false
  }
}
