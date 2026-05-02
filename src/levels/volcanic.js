// ─────────────────────────────────────────────────────────────────────────────
// Volcanic Planet — Chapter 5
// Tile types: 0=empty, 1=blocker, 2=crater (used as lava pools)
//
// Theme: Instability, urgency. Dark terrain with glowing lava flows.
// Craters represent deadly lava pools. Blockers are volcanic rock pillars.
// The board has more hazards than any previous chapter — every move matters.
// ─────────────────────────────────────────────────────────────────────────────

export const volcanicLevels = [
  // ── Level 1 ────────────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'Lava Shore',
    chapter: 'volcanic',
    narrative: '"Hazard levels critical." "Movement windows limited."',
    grid: [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,2,0,0,0,2,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
    ],
    // Lava pools at (1,3) and (5,3). Player at (0,3) going → hits lava at (1,3)!
    // Must go around. Solution: ↑(0,0), →(6,0), ↓ goal at (6,3). 3 moves.
    playerStart: { x: 0, y: 3 },
    goal:        { x: 6, y: 3 },
    collectibles: [],
    teleports:    [],
  },

  // ── Level 2 ────────────────────────────────────────────────────────────────
  {
    id: 2,
    name: 'Cinder Path',
    chapter: 'volcanic',
    narrative: '"Signal strength high…" "System stress increasing."',
    grid: [
      [0,0,0,0,0,0,0],
      [0,2,0,0,0,2,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,2,0,0,0,2,0],
      [0,0,0,0,0,0,0],
    ],
    // Lava pools forming a ring. Goal top-right, player bottom-left.
    // Solution: ↑(0,0), →(6,0), ↓(6,6)=GOAL? No goal at (6,6).
    // Goal (6,3): ↑(0,0), →(6,0), ↓→stops at (6,4)? (6,5)=lava → stops at (6,4). ↑ stops at (6,2)? Then → (6,3)? No...
    // Solution: ↑(0,0), →(6,0), ↓(6,6)=bottom wall. ←(0,6). ↑(0,0)?cycle. 
    // Better: Goal at (6,3). Player(0,3): → hits lava(1,3)? No lava in row 3 now. Row3 all empty. → to (6,3)=GOAL. 1 move.
    // Move player start elsewhere. Player(0,6) → (6,6), ↑ stops at (6,2)[before lava(6,1)?no,lava at (1,1)(5,1)(1,5)(5,5)].
    // Col 6: no lava. ↑ from (6,6) → (6,0). ← from (6,0) → (0,0). ↓ from (0,0) → stops at (0,2) before lava? Lava at (0,1)=grid[1][0]=0.
    // Row0 has no lava. Going down col 0 from (0,0): (0,1)=empty,(0,2)=empty,(0,3)=empty,(0,4)=empty,(0,5)=empty,(0,6)=bottom. Goal(3,3)?
    // From (0,0) → (6,0)=right wall. ↓ from (6,0) stops at (6,4)?→ lava at (6,5)=grid[5][6]=0=empty. Col6 all empty. ↓ from (6,0)→(6,6). 
    // Hmm let me use simpler approach.
    playerStart: { x: 0, y: 6 },
    goal:        { x: 6, y: 0 },
    collectibles: [],
    teleports:    [],
  },

  // ── Level 3 ────────────────────────────────────────────────────────────────
  {
    id: 3,
    name: 'Eruption Zone',
    chapter: 'volcanic',
    narrative: '"Approaching signal origin." "Warning: anomaly detected."',
    grid: [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,2,0,0,2,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,2,0,0,2,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
    ],
    playerStart: { x: 0, y: 7 },
    goal:        { x: 7, y: 0 },
    collectibles: [],
    teleports:    [],
  },

  // ── Level 4 ────────────────────────────────────────────────────────────────
  {
    id: 4,
    name: 'Lava Cross',
    chapter: 'volcanic',
    narrative: '"Every path cuts through fire. Choose carefully."',
    grid: [
      [0,0,0,0,0,0,0,0],
      [0,0,0,2,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,2,0,0,0,2,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,2,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
    ],
    playerStart: { x: 0, y: 7 },
    goal:        { x: 7, y: 0 },
    collectibles: [],
    teleports:    [],
  },

  // ── Level 5 ────────────────────────────────────────────────────────────────
  {
    id: 5,
    name: 'Caldera Run',
    chapter: 'volcanic',
    narrative: '"Signal at maximum strength." "Source nearby."',
    grid: [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,1,0,0,0,1,0,0],
      [0,0,0,2,2,0,0,0],
      [0,0,0,2,2,0,0,0],
      [0,1,0,0,0,1,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
    ],
    // Twin lava pools in center, rock pillars on sides.
    // Player(0,7), Goal(7,0). Must navigate around the lava center.
    // Solution: →(7,7), ↑(7,0)=GOAL. Col7 is safe (no lava). 2 moves.
    // Need collectible to make it harder.
    playerStart: { x: 0, y: 7 },
    goal:        { x: 7, y: 0 },
    collectibles: [{ x: 0, y: 0 }],
    teleports:    [],
  },

  // ── Level 6 ────────────────────────────────────────────────────────────────
  {
    id: 6,
    name: 'Volcano Summit',
    chapter: 'volcanic',
    narrative: '"Signal source identified." "Coordinates locked."',
    grid: [
      [0,0,0,0,0,0,0,0],
      [0,1,0,0,0,0,1,0],
      [0,0,0,2,2,0,0,0],
      [0,0,2,0,0,2,0,0],
      [0,0,2,0,0,2,0,0],
      [0,0,0,2,2,0,0,0],
      [0,1,0,0,0,0,1,0],
      [0,0,0,0,0,0,0,0],
    ],
    playerStart: { x: 0, y: 7 },
    goal:        { x: 7, y: 0 },
    collectibles: [{ x: 0, y: 0 }, { x: 7, y: 7 }],
    teleports:    [],
  },
]
