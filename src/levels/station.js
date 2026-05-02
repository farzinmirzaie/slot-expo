// ─────────────────────────────────────────────────────────────────────────────
// Space Station — Chapter 7
// Tile types: 0=empty, 1=blocker, 2=crater (airlocks / voids), 5=teleport
//
// Theme: Truth, control. Clean high-tech orbital structure.
// Teleports represent transit tubes. Blockers are bulkheads.
// The astronaut must navigate the station to take control of the signal.
// ─────────────────────────────────────────────────────────────────────────────

export const stationLevels = [
  // ── Level 1 ────────────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'Docking Bay',
    chapter: 'station',
    narrative: '"Station operational…" "System still active."',
    grid: [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,1,0,1,0,0],
      [0,0,0,5,0,0,0],
      [0,0,1,0,1,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
    ],
    // Teleport at (3,3).
    playerStart: { x: 0, y: 3 },
    goal:        { x: 6, y: 0 },
    collectibles: [],
    teleports:    [{ from: { x: 3, y: 3 }, to: { x: 5, y: 1 } }],
  },

  // ── Level 2 ────────────────────────────────────────────────────────────────
  {
    id: 2,
    name: 'Transit Tube',
    chapter: 'station',
    narrative: '"Signal network detected…" "Multiple paths calculated."',
    grid: [
      [0,0,0,0,0,0,0],
      [0,1,0,0,0,1,0],
      [0,0,0,0,0,0,0],
      [0,0,5,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,1,0,0,0,1,0],
      [0,0,0,0,5,0,0],
    ],
    playerStart: { x: 0, y: 6 },
    goal:        { x: 6, y: 0 },
    collectibles: [],
    teleports:    [{ from: { x: 2, y: 3 }, to: { x: 4, y: 6 } }],
  },

  // ── Level 3 ────────────────────────────────────────────────────────────────
  {
    id: 3,
    name: 'Pressurized',
    chapter: 'station',
    narrative: '"Manual override possible…" "Regaining control."',
    grid: [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,1,0,0,1,0,0],
      [0,5,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,1,0,0,1,0,0],
      [0,0,0,0,0,5,0,0],
      [0,0,0,0,0,0,0,0],
    ],
    playerStart: { x: 0, y: 7 },
    goal:        { x: 7, y: 0 },
    collectibles: [],
    teleports:    [{ from: { x: 1, y: 3 }, to: { x: 5, y: 6 } }],
  },

  // ── Level 4 ────────────────────────────────────────────────────────────────
  {
    id: 4,
    name: 'Airlock',
    chapter: 'station',
    narrative: '"The signal rerouted. Earth coordinates recalculated."',
    grid: [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,2,0,0,2,0,0],
      [0,0,0,5,0,0,0,0],
      [0,0,0,0,5,0,0,0],
      [0,0,2,0,0,2,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
    ],
    // Airlock voids at corners of center zone. Teleport pair in middle.
    playerStart: { x: 0, y: 7 },
    goal:        { x: 7, y: 0 },
    collectibles: [{ x: 7, y: 7 }],
    teleports:    [{ from: { x: 3, y: 3 }, to: { x: 4, y: 4 } }],
  },

  // ── Level 5 ────────────────────────────────────────────────────────────────
  {
    id: 5,
    name: 'Command Core',
    chapter: 'station',
    narrative: '"Signal rerouted." "Earth located."',
    grid: [
      [0,0,0,0,0,0,0,0],
      [0,1,0,5,0,0,1,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,1,0,0,0,5,1,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
    ],
    playerStart: { x: 0, y: 7 },
    goal:        { x: 7, y: 0 },
    collectibles: [{ x: 3, y: 7 }],
    teleports:    [{ from: { x: 3, y: 1 }, to: { x: 5, y: 5 } }],
  },

  // ── Level 6 ────────────────────────────────────────────────────────────────
  {
    id: 6,
    name: 'Override',
    chapter: 'station',
    narrative: '"Course corrected." "Preparing final approach."',
    grid: [
      [0,0,0,0,0,0,0,0],
      [0,1,0,0,0,0,1,0],
      [0,0,0,5,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,5,0,0,0],
      [0,1,0,0,0,0,1,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
    ],
    playerStart: { x: 0, y: 7 },
    goal:        { x: 7, y: 0 },
    collectibles: [{ x: 0, y: 0 }, { x: 7, y: 7 }],
    teleports:    [{ from: { x: 3, y: 2 }, to: { x: 4, y: 4 } }],
  },
]
