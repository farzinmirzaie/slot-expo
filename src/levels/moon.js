// ─────────────────────────────────────────────────────────────────────────────
// Moon Chapter — 10 Levels
// Tile types: 0=empty, 1=blocker, 2=crater
//
// Core mechanic: player GLIDES until hitting a wall, blocker, or the goal tile.
// Craters kill the player (automatic restart).
// Each level's solution path is annotated inline.
// ─────────────────────────────────────────────────────────────────────────────

export const moonLevels = [
  // ── Level 1 ────────────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'First Steps',
    chapter: 'moon',
    narrative: '"..." System rebooting.',
    grid: [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
    ],
    // Solution: → (right) → goal stops at (6,3). 1 move.
    playerStart: { x: 0, y: 3 },
    goal:        { x: 6, y: 3 },
    collectibles: [],
    teleports:    [],
  },

  // ── Level 2 ────────────────────────────────────────────────────────────────
  {
    id: 2,
    name: 'Corner Shot',
    chapter: 'moon',
    narrative: '"System rebooting…" Where am I?',
    grid: [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
    ],
    // Solution: → (6,6) wall, ↑ (6,0) = goal. 2 moves.
    playerStart: { x: 0, y: 6 },
    goal:        { x: 6, y: 0 },
    collectibles: [],
    teleports:    [],
  },

  // ── Level 3 ────────────────────────────────────────────────────────────────
  {
    id: 3,
    name: 'Detour',
    chapter: 'moon',
    narrative: '"Where am I?" Navigation offline.',
    grid: [
      [0,0,0,0,1,0,0],  // blocker at (4,0)
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
    ],
    // Solution A (2 moves): ↑ → (0,0), → stops at goal (3,0) before blocker.
    // Solution B (3 moves): → (6,3), ↑ (6,0), ← goal stops at (3,0).
    playerStart: { x: 0, y: 3 },
    goal:        { x: 3, y: 0 },
    collectibles: [],
    teleports:    [],
  },

  // ── Level 4 ────────────────────────────────────────────────────────────────
  {
    id: 4,
    name: 'Crater Lesson',
    chapter: 'moon',
    narrative: '"Mobility restored." Navigation offline.',
    grid: [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,2,0,0,0],  // crater at (3,3)
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
    ],
    // Wrong: → CRATER at (3,3). Dead.
    // Solution: ↓(0,6), →(6,6) right wall, ↑ goal stops at (6,3). 3 moves.
    playerStart: { x: 0, y: 3 },
    goal:        { x: 6, y: 3 },
    collectibles: [],
    teleports:    [],
  },

  // ── Level 5 ────────────────────────────────────────────────────────────────
  {
    id: 5,
    name: 'Signal Cache',
    chapter: 'moon',
    narrative: '"Navigation offline." Signal detected.',
    grid: [
      [0,0,0,0,1,0,0],  // blocker at (4,0)
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
    ],
    // collectible at (3,0) — player must stop there (blocker at (4,0) stops rightward slide).
    // Solution (5 moves):
    //  ↑ (0,0)
    //  → stops at (3,0) before blocker → COLLECT
    //  ↓ (3,6) bottom wall
    //  → (6,6) right wall
    //  ↑ goal stops at (6,0). WIN.
    playerStart: { x: 0, y: 3 },
    goal:        { x: 6, y: 0 },
    collectibles: [{ x: 3, y: 0 }],
    teleports:    [],
  },

  // ── Level 6 ────────────────────────────────────────────────────────────────
  {
    id: 6,
    name: 'Double Drop',
    chapter: 'moon',
    narrative: '"Signal detected… weak." Source unknown.',
    grid: [
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0],
    ],
    // collectibles at (0,3) and (6,6). Goal (6,0).
    // Solution A (4 moves): ← (0,3) COLLECT, ↓ (0,6), → (6,6) COLLECT, ↑ (6,0) GOAL.
    // Solution B (4 moves): → (6,3), ↓ (6,6) COLLECT, ← (0,6), ↑ (0,3)? player passes
    //   through (0,3) and collects mid-slide, stops at (0,0). → goal at (6,0)? Slides right
    //   to (6,0) = GOAL.  That's also 4 moves. Both A and B work.
    playerStart: { x: 3, y: 3 },
    goal:        { x: 6, y: 0 },
    collectibles: [{ x: 0, y: 3 }, { x: 6, y: 6 }],
    teleports:    [],
  },

  // ── Level 7 ────────────────────────────────────────────────────────────────
  {
    id: 7,
    name: 'Twin Peaks',
    chapter: 'moon',
    narrative: '"Signal detected…" Collecting components.',
    grid: [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,1],  // blocker at (7,2)
      [0,0,0,0,0,0,0,0],
      [0,0,2,0,0,2,0,0],  // craters at (2,4) and (5,4)
      [1,0,0,0,0,0,0,0],  // blocker at (0,5)
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
    ],
    // Solution (5 moves):
    //  → (7,7) right wall
    //  ↑ (7,3) stopped before blocker at (7,2)
    //  ← (0,3) left wall
    //  ↑ (0,0) top wall  [col 0: (0,4) is empty, (0,5)=blocker? going up from (0,3): (0,2),(0,1),(0,0)=top wall. Blocker at (0,5) is below row 3 so doesn't block.]
    //  → goal stops at (7,0) = GOAL. WIN.
    playerStart: { x: 0, y: 7 },
    goal:        { x: 7, y: 0 },
    collectibles: [],
    teleports:    [],
  },

  // ── Level 8 ────────────────────────────────────────────────────────────────
  {
    id: 8,
    name: 'Crater Cross',
    chapter: 'moon',
    narrative: '"Collecting components…" Partial recovery.',
    grid: [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [2,0,0,1,0,0,0,0],  // crater at (0,2), blocker at (3,2)
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,1,0,0,0],  // blocker at (4,7)
    ],
    // Shortcut blocked: ↑ from (0,7) → hits crater at (0,2). Dead.
    // Solution (4 moves):
    //  → stops at (3,7) before blocker (4,7)
    //  ↑ stops at (3,3) before blocker (3,2)
    //  → (7,3) right wall
    //  ↑ goal stops at (7,0). WIN.
    playerStart: { x: 0, y: 7 },
    goal:        { x: 7, y: 0 },
    collectibles: [],
    teleports:    [],
  },

  // ── Level 9 ────────────────────────────────────────────────────────────────
  {
    id: 9,
    name: 'Four Corners',
    chapter: 'moon',
    narrative: '"Partial system recovery." Signal locked.',
    grid: [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
    ],
    // collectibles: (7,0) and (0,7). Goal (7,7).
    // Solution A: → (7,0) COLLECT, ↓ (7,7) [passes goal? Goal stops! Player stops at (7,7)=GOAL,
    //   but (0,7) not collected yet!]. Correct: → (7,0) A, ↓ (7,7), ← (0,7) B, → (7,7) GOAL. 4 moves.
    // Solution B: ↓ (0,7) B, → (7,7), ↑ (7,0) A, ↓ (7,7) GOAL. 4 moves.
    playerStart: { x: 0, y: 0 },
    goal:        { x: 7, y: 7 },
    collectibles: [{ x: 7, y: 0 }, { x: 0, y: 7 }],
    teleports:    [],
  },

  // ── Level 10 ───────────────────────────────────────────────────────────────
  {
    id: 10,
    name: "Moon's Final Trial",
    chapter: 'moon',
    narrative: '"Navigation partially restored." Signal locked.',
    grid: [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,2,0,0,0,0],  // crater at (3,3)
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
    ],
    // collectibles at (0,0) and (7,7). Goal (7,0).
    // Solution (4 moves):
    //  ↑ (0,0) COLLECT A (top-left wall)
    //  → passes crater row? No: (0,0) going right → row 0, no crater. (7,0)=GOAL? But B not collected!
    //  ↑ (0,0) A, ↓ (0,7) bottom, → (7,7) COLLECT B right wall, ↑ (7,0) GOAL. 4 moves. ✓
    playerStart: { x: 0, y: 7 },
    goal:        { x: 7, y: 0 },
    collectibles: [{ x: 0, y: 0 }, { x: 7, y: 7 }],
    teleports:    [],
  },
]
