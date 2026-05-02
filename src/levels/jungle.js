// ─────────────────────────────────────────────────────────────────────────────
// Jungle Planet — Chapter 4
// Tile types: 0=empty, 1=blocker, 2=crater
//
// Theme: Living systems, adaptation. Dense bioluminescent vegetation.
// The environment reacts and grows. Blockers represent thick root clusters
// and vine walls. Craters are overgrown sinkholes.
// ─────────────────────────────────────────────────────────────────────────────

export const jungleLevels = [
  // ── Level 1 ────────────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'First Growth',
    chapter: 'jungle',
    narrative: '"Environment reacting…" "Movement affecting surroundings."',
    grid: [
      [0,0,0,0,0,0,0],
      [0,1,0,0,0,0,0],
      [0,0,0,0,0,1,0],
      [0,0,0,0,0,0,0],
      [0,1,0,0,0,0,0],
      [0,0,0,0,0,1,0],
      [0,0,0,0,0,0,0],
    ],
    playerStart: { x: 0, y: 3 },
    goal:        { x: 6, y: 0 },
    collectibles: [],
    teleports:    [],
  },

  // ── Level 2 ────────────────────────────────────────────────────────────────
  {
    id: 2,
    name: 'Root Network',
    chapter: 'jungle',
    narrative: '"Patterns emerging…" "Growth triggered by activity."',
    grid: [
      [0,0,0,0,0,0,0],
      [0,0,0,1,0,0,0],
      [0,0,0,0,0,0,0],
      [1,0,0,0,0,0,1],
      [0,0,0,0,0,0,0],
      [0,0,0,1,0,0,0],
      [0,0,0,0,0,0,0],
    ],
    playerStart: { x: 3, y: 6 },
    goal:        { x: 0, y: 0 },
    collectibles: [],
    teleports:    [],
  },

  // ── Level 3 ────────────────────────────────────────────────────────────────
  {
    id: 3,
    name: 'Canopy Path',
    chapter: 'jungle',
    narrative: '"Signal interacting with environment…" "Not natural."',
    grid: [
      [0,0,0,0,0,0,0,0],
      [0,0,1,0,0,1,0,0],
      [0,0,0,0,0,0,0,0],
      [0,1,0,0,0,0,1,0],
      [0,0,0,0,0,0,0,0],
      [0,0,1,0,0,1,0,0],
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
    name: 'Sinkhole',
    chapter: 'jungle',
    narrative: '"Dense undergrowth. Watch the pit — it swallows everything."',
    grid: [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,1,0,0,0,0,0],
      [0,0,0,2,0,0,0,0],
      [0,0,0,0,0,0,1,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
    ],
    // Crater at (3,3). Blocker at (2,2) and (6,4).
    // Solution: → (7,3), ↑ (7,0) = GOAL. Avoid crater by staying in col 7.
    // But player must collect first. No collectible here — puzzle is navigation.
    // Solution (4 moves): ↓(0,7), →(7,7), ↑(7,0)=GOAL. 3 moves.
    playerStart: { x: 0, y: 3 },
    goal:        { x: 7, y: 0 },
    collectibles: [],
    teleports:    [],
  },

  // ── Level 5 ────────────────────────────────────────────────────────────────
  {
    id: 5,
    name: 'Signal Fragment',
    chapter: 'jungle',
    narrative: '"A beacon fragment pulses deep in the growth. Collect it."',
    grid: [
      [0,0,0,0,0,0,0,0],
      [0,0,0,1,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,1,0,0,0,0,1,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,1,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
    ],
    playerStart: { x: 0, y: 7 },
    goal:        { x: 7, y: 0 },
    collectibles: [{ x: 3, y: 0 }],
    teleports:    [],
  },

  // ── Level 6 ────────────────────────────────────────────────────────────────
  {
    id: 6,
    name: 'Overgrowth',
    chapter: 'jungle',
    narrative: '"Signal behaving unpredictably." "Source remains unknown."',
    grid: [
      [0,0,0,0,0,0,0,0],
      [0,1,0,0,0,1,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,1,0,0,0,0],
      [0,0,0,0,0,2,0,0],
      [0,1,0,0,0,0,0,0],
      [0,0,0,0,0,0,1,0],
      [0,0,0,0,0,0,0,0],
    ],
    playerStart: { x: 0, y: 7 },
    goal:        { x: 7, y: 0 },
    collectibles: [{ x: 0, y: 0 }, { x: 7, y: 7 }],
    teleports:    [],
  },
]
